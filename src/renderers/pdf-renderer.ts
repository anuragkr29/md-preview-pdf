/**
 * PDF Renderer
 * Uses Puppeteer to generate high-fidelity PDFs from HTML
 */

import puppeteer, { Browser, Page, PDFOptions as PuppeteerPDFOptions } from 'puppeteer';
import { PDFOptions, MermaidOptions, ErrorCode } from '../types';
import { logger, createError, withRetry } from '../utils';
import { renderMermaidInBrowser, closeBrowser as closeMermaidBrowser } from './mermaid-renderer';

/**
 * Launch a new browser instance
 */
async function launchBrowser(headless = true): Promise<Browser> {
  logger.debug('Launching browser for PDF rendering');
  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
    protocolTimeout: 120000,
  });
  
  return browser;
}

/**
 * Close browser instance
 */
export async function closeBrowser(): Promise<void> {
  // No-op for now since we create fresh browsers
  await closeMermaidBrowser();
}

/**
 * Convert options to Puppeteer PDF options
 */
function convertPDFOptions(options: PDFOptions = {}): PuppeteerPDFOptions {
  const pdfOptions: PuppeteerPDFOptions = {
    format: options.format || 'A4',
    printBackground: options.printBackground !== false,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm',
    },
    displayHeaderFooter: options.displayHeaderFooter || false,
    landscape: options.landscape || false,
    scale: options.scale || 1,
    preferCSSPageSize: true,
  };

  if (options.headerTemplate) {
    pdfOptions.headerTemplate = options.headerTemplate;
    pdfOptions.displayHeaderFooter = true;
  }

  if (options.footerTemplate) {
    pdfOptions.footerTemplate = options.footerTemplate;
    pdfOptions.displayHeaderFooter = true;
  }

  // Default header/footer templates if enabled but not provided
  if (pdfOptions.displayHeaderFooter) {
    if (!pdfOptions.headerTemplate) {
      pdfOptions.headerTemplate = '<div></div>';
    }
    if (!pdfOptions.footerTemplate) {
      pdfOptions.footerTemplate = `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; padding: 5px 0;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `;
    }
  }

  if (options.width) {
    pdfOptions.width = options.width;
  }

  if (options.height) {
    pdfOptions.height = options.height;
  }

  if (options.pageRanges) {
    pdfOptions.pageRanges = options.pageRanges;
  }

  return pdfOptions;
}

/**
 * Wait for all fonts to be loaded
 */
async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => {
    return document.fonts.ready;
  });
  logger.debug('Fonts loaded');
}

/**
 * Wait for all images to be loaded
 */
async function waitForImages(page: Page): Promise<void> {
  await page.evaluate(() => {
    const images = Array.from(document.images);
    return Promise.all(
      images
        .filter(img => !img.complete)
        .map(img =>
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Resolve even on error to not block
          })
        )
    );
  });
  logger.debug('Images loaded');
}

/**
 * Render HTML to PDF
 */
export async function renderPDF(
  html: string,
  options: {
    pdf?: PDFOptions;
    mermaid?: MermaidOptions;
    debug?: boolean;
  } = {}
): Promise<Buffer> {
  let browser: Browser | null = null;
  let page: Page | null = null;
  
  try {
    browser = await launchBrowser(!options.debug);
    page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2, // Higher quality
    });

    logger.debug('Setting page content...');
    
    // Set content with timeout
    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 60000,
    });

    logger.debug('Page content set');

    // Wait for resources
    await Promise.all([
      waitForFonts(page),
      waitForImages(page),
    ]);

    // Render Mermaid diagrams in browser
    try {
      await renderMermaidInBrowser(page, options.mermaid);
    } catch (error) {
      logger.warn(`Mermaid rendering in browser failed: ${error}`);
    }

    // Additional wait for any animations/transitions
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 500);
        });
      });
    });

    // Generate PDF
    const pdfOptions = convertPDFOptions(options.pdf);
    
    logger.debug('Generating PDF with options:', pdfOptions);
    
    const pdfBuffer = await withRetry(
      async () => {
        const buffer = await page!.pdf(pdfOptions);
        return Buffer.from(buffer);
      },
      3,
      1000
    );

    logger.info('PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    logger.error('PDF generation error details:', error);
    throw createError(
      ErrorCode.PDF_ERROR,
      error,
      `PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    if (page) {
      try {
        await page.close();
      } catch {
        // Ignore close errors
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch {
        // Ignore close errors
      }
    }
  }
}

/**
 * Get page count from PDF buffer
 */
export function getPageCount(pdfBuffer: Buffer): number {
  // Simple heuristic to count pages - look for /Type /Page entries
  const content = pdfBuffer.toString('binary');
  const matches = content.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 1;
}

/**
 * Render HTML to PDF file
 */
export async function renderPDFToFile(
  html: string,
  outputPath: string,
  options: {
    pdf?: PDFOptions;
    mermaid?: MermaidOptions;
    debug?: boolean;
  } = {}
): Promise<{ pageCount: number; fileSize: number }> {
  const fs = await import('fs').then(m => m.promises);
  
  const pdfBuffer = await renderPDF(html, options);
  await fs.writeFile(outputPath, pdfBuffer);
  
  const pageCount = getPageCount(pdfBuffer);
  const fileSize = pdfBuffer.length;
  
  return { pageCount, fileSize };
}

export default {
  renderPDF,
  renderPDFToFile,
  getPageCount,
  closeBrowser,
};
