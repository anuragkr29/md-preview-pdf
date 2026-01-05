/**
 * PDF Renderer
 * Uses Puppeteer to generate high-fidelity PDFs from HTML
 */

import puppeteer, { Browser, Page, PDFOptions as PuppeteerPDFOptions } from 'puppeteer';
import { PDFOptions, MermaidOptions, ErrorCode } from '../types';
import { logger, createError, withRetry } from '../utils';
import { renderMermaidInBrowser, closeBrowser as closeMermaidBrowser } from './mermaid-renderer';
import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * Find system Chrome installation
 */
function findSystemChrome(): string | null {
  const possiblePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
    '/Applications/Chromium.app/Contents/MacOS/Chromium', // macOS Chromium
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Windows 32-bit
    '/usr/bin/google-chrome', // Linux
    '/usr/bin/chromium-browser', // Linux Chromium
    '/usr/bin/chromium', // Linux Chromium alt
    '/snap/bin/chromium', // Linux Snap
  ];

  // Check environment variable first
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    if (fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
      return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
  }

  // Check common paths
  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  // Try to find Chrome using which/where command
  try {
    if (process.platform === 'darwin' || process.platform === 'linux') {
      const result = execSync('which google-chrome || which chromium || which chromium-browser', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      if (result && fs.existsSync(result)) {
        return result;
      }
    } else if (process.platform === 'win32') {
      const result = execSync('where chrome', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim().split('\n')[0];
      if (result && fs.existsSync(result)) {
        return result;
      }
    }
  } catch {
    // Ignore errors from which/where commands
  }

  return null;
}

/**
 * Launch a new browser instance with fallback to system Chrome
 */
async function launchBrowser(headless = true): Promise<Browser> {
  logger.debug('Launching browser for PDF rendering');
  
  const launchOptions = {
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
  };

  try {
    // Try to launch with bundled Chromium first
    const browser = await puppeteer.launch(launchOptions);
    logger.debug('Launched bundled Chromium successfully');
    return browser;
  } catch (error) {
    // If bundled Chrome fails, try system Chrome
    logger.warn('Failed to launch bundled Chromium, trying system Chrome...');
    logger.debug(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    const systemChrome = findSystemChrome();
    
    if (systemChrome) {
      logger.info(`Found system Chrome at: ${systemChrome}`);
      try {
        const browser = await puppeteer.launch({
          ...launchOptions,
          executablePath: systemChrome,
        });
        logger.info('Launched system Chrome successfully');
        return browser;
      } catch (systemError) {
        logger.error(`Failed to launch system Chrome: ${systemError instanceof Error ? systemError.message : 'Unknown error'}`);
        throw systemError;
      }
    } else {
      logger.error('No system Chrome installation found');
      throw new Error(
        'Failed to launch browser. Please install Google Chrome or set PUPPETEER_EXECUTABLE_PATH environment variable. ' +
        'See troubleshooting: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md'
      );
    }
  }
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
  // Use BOTH Puppeteer margins AND CSS @page margins for maximum compatibility
  // CSS margins are injected into HTML, Puppeteer margins ensure they're applied
  
  const pdfOptions: PuppeteerPDFOptions = {
    format: options.format || 'A4',
    printBackground: options.printBackground !== false,
    preferCSSPageSize: false,
    displayHeaderFooter: options.displayHeaderFooter || false,
    landscape: options.landscape || false,
    scale: options.scale || 1,
  };

  // Don't use Puppeteer margins - they create white borders
  // Margins are handled via CSS padding on .markdown-body instead
  // This allows background colors to extend to page edges
  pdfOptions.margin = {
    top: '0mm',
    right: '0mm',
    bottom: '0mm',
    left: '0mm',
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
      pdfOptions.footerTemplate = '<div></div>';
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
