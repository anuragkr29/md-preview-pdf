/**
 * Mermaid Renderer
 * Handles rendering of Mermaid diagrams to SVG
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { MermaidOptions, ErrorCode } from '../types';
import { logger, createError } from '../utils';

let browserInstance: Browser | null = null;

/**
 * Get or create browser instance (singleton)
 */
async function getBrowser(headless = true): Promise<Browser> {
  if (!browserInstance) {
    logger.debug('Launching browser for Mermaid rendering');
    browserInstance = await puppeteer.launch({
      headless: headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });
  }
  return browserInstance;
}

/**
 * Close browser instance
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    logger.debug('Browser closed');
  }
}

/**
 * Render a single Mermaid diagram to SVG
 */
export async function renderMermaidToSvg(
  diagram: string,
  options: MermaidOptions = {}
): Promise<string> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set up Mermaid HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body { margin: 0; padding: 0; background: ${options.backgroundColor || 'transparent'}; }
    .mermaid { font-family: ${options.fontFamily || '"Segoe UI", Arial, sans-serif'}; }
  </style>
</head>
<body>
  <div id="container" class="mermaid">
    ${diagram}
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: '${options.theme || 'default'}',
      securityLevel: 'loose',
      fontFamily: '${options.fontFamily || '"Segoe UI", Arial, sans-serif'}',
    });
  </script>
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for Mermaid to render
    await page.waitForSelector('#container svg', { timeout: 10000 });

    // Get the SVG content
    const svg = await page.evaluate(() => {
      const container = document.getElementById('container');
      const svgElement = container?.querySelector('svg');
      if (svgElement) {
        // Add viewBox if missing for proper scaling
        if (!svgElement.getAttribute('viewBox')) {
          const bbox = svgElement.getBBox();
          svgElement.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
        }
        
        // Set responsive width
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('style', 'max-width: 100%; height: auto;');
        svgElement.removeAttribute('height');
        
        return svgElement.outerHTML;
      }
      return null;
    });

    if (!svg) {
      throw createError(
        ErrorCode.MERMAID_ERROR,
        { diagram },
        'Failed to extract SVG from Mermaid diagram'
      );
    }

    logger.debug('Mermaid diagram rendered successfully');
    return svg;
  } catch (error) {
    logger.warn(`Mermaid rendering failed: ${error}`);
    // Return fallback with error message
    return `<div class="mermaid-error">
      <p><strong>Mermaid Diagram Error</strong></p>
      <pre><code>${diagram}</code></pre>
      <p class="error-message">${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>`;
  } finally {
    await page.close();
  }
}

/**
 * Process HTML content and render all Mermaid diagrams
 */
export async function processMermaidInHtml(
  html: string,
  options: MermaidOptions = {}
): Promise<string> {
  // Find all mermaid divs with data-mermaid attribute
  const mermaidRegex = /<div class="mermaid" data-mermaid="([^"]+)">[\s\S]*?<\/div>/g;
  const matches = [...html.matchAll(mermaidRegex)];

  if (matches.length === 0) {
    logger.debug('No Mermaid diagrams found in HTML');
    return html;
  }

  logger.info(`Found ${matches.length} Mermaid diagram(s) to render`);

  let processedHtml = html;

  for (const match of matches) {
    const [fullMatch, encodedContent] = match;
    
    try {
      // Decode the base64 content
      const diagramContent = Buffer.from(encodedContent, 'base64').toString('utf-8');
      
      // Render to SVG
      const svg = await renderMermaidToSvg(diagramContent, options);
      
      // Replace the placeholder with rendered SVG
      processedHtml = processedHtml.replace(
        fullMatch,
        `<div class="mermaid-container">${svg}</div>`
      );
    } catch (error) {
      logger.error(`Failed to render Mermaid diagram: ${error}`);
    }
  }

  return processedHtml;
}

/**
 * Render Mermaid diagrams inline using browser
 * This is an alternative approach that renders all diagrams at once
 */
export async function renderMermaidInBrowser(
  page: Page,
  options: MermaidOptions = {}
): Promise<void> {
  // Check if there are any mermaid elements
  const hasMermaid = await page.evaluate(() => {
    return document.querySelectorAll('.mermaid').length > 0;
  });

  if (!hasMermaid) {
    logger.debug('No Mermaid elements found on page');
    return;
  }

  // Inject Mermaid library
  await page.addScriptTag({
    url: 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js',
  });

  // Initialize and render Mermaid
  await page.evaluate((opts) => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Mermaid rendering timed out'));
      }, 30000);

      try {
        // @ts-expect-error - Mermaid is loaded via script tag
        if (typeof mermaid !== 'undefined') {
          // @ts-expect-error mermaid is loaded via script tag
          mermaid.initialize({
            startOnLoad: false,
            theme: opts.theme || 'default',
            securityLevel: 'loose',
            fontFamily: opts.fontFamily || '"Segoe UI", Arial, sans-serif',
            gantt: {
              useWidth: 1000, // Use full width available
              rightPadding: 0,
              leftPadding: 75,
              topPadding: 75,
              gridLineStartPadding: 10,
            },
          });

          // Decode and process all mermaid divs
          const mermaidDivs = document.querySelectorAll('.mermaid[data-mermaid]');
          mermaidDivs.forEach((div) => {
            const encoded = div.getAttribute('data-mermaid');
            if (encoded) {
              div.textContent = atob(encoded);
              div.removeAttribute('data-mermaid');
            }
          });

          // @ts-expect-error mermaid is loaded via script tag
          mermaid.run().then(() => {
            clearTimeout(timeout);
            resolve();
          }).catch((err: Error) => {
            clearTimeout(timeout);
            console.warn('Mermaid rendering error:', err);
            resolve(); // Continue even on error
          });
        } else {
          clearTimeout(timeout);
          reject(new Error('Mermaid library not loaded'));
        }
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }, options);

  logger.debug('Mermaid diagrams rendered in browser');
}

export default {
  renderMermaidToSvg,
  processMermaidInHtml,
  renderMermaidInBrowser,
  closeBrowser,
};
