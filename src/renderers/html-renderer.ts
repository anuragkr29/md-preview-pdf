/**
 * HTML Renderer
 * Generates complete HTML documents from parsed markdown
 */

import * as path from 'path';
import { ParsedMarkdown, ConverterOptions, ThemeOptions } from '../types';
import { logger, readFile, fileExists, readFileAsBase64, getMimeType } from '../utils';
import { getThemeCSS, getHighlightThemeCSS } from '../themes';
import { getBaseCSS } from './base-styles';
import { getKatexCSS } from './katex-styles';

/**
 * Process local images and convert to base64 data URIs
 */
async function processImages(html: string, basePath: string): Promise<string> {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let processedHtml = html;
  const matches = [...html.matchAll(imgRegex)];

  for (const match of matches) {
    const [fullMatch, src] = match;

    // Skip data URIs and remote URLs
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      continue;
    }

    try {
      const imagePath = path.resolve(basePath, src);
      
      if (await fileExists(imagePath)) {
        const base64 = await readFileAsBase64(imagePath);
        const mimeType = getMimeType(imagePath);
        const dataUri = `data:${mimeType};base64,${base64}`;
        
        const newImgTag = fullMatch.replace(src, dataUri);
        processedHtml = processedHtml.replace(fullMatch, newImgTag);
        
        logger.debug(`Embedded image: ${src}`);
      } else {
        logger.warn(`Image not found: ${imagePath}`);
      }
    } catch (error) {
      logger.warn(`Failed to embed image ${src}: ${error}`);
    }
  }

  return processedHtml;
}

/**
 * Generate complete HTML document
 */
export async function generateHtml(
  parsed: ParsedMarkdown,
  options: ConverterOptions = {}
): Promise<string> {
  const themeOptions: ThemeOptions = options.theme || { name: 'github' };
  
  // Get theme CSS
  const themeCSS = await getThemeCSS(themeOptions.name);
  const highlightCSS = getHighlightThemeCSS(themeOptions.highlightTheme || 'github');
  
  // Custom CSS
  let customCSS = themeOptions.customCSS || '';
  if (themeOptions.customCSSPath) {
    try {
      customCSS += await readFile(themeOptions.customCSSPath);
    } catch (error) {
      logger.warn(`Failed to load custom CSS: ${error}`);
    }
  }

  // Process images if basePath is provided
  let processedHtml = parsed.html || '';
  if (options.basePath) {
    processedHtml = await processImages(processedHtml, options.basePath);
  }

  // Document title
  const title = parsed.frontMatter.title || 'Document';

  // Build the complete HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
${getBaseCSS(options.pdf?.margin)}
${themeCSS}
${highlightCSS}
${getKatexCSS()}
${customCSS}
  </style>
</head>
<body>
  <article class="markdown-body">
${processedHtml}
  </article>
</body>
</html>`;

  logger.debug('HTML document generated');
  return html;
}

/**
 * Generate HTML with inline styles only (no external CSS links)
 */
export async function generateStandaloneHtml(
  parsed: ParsedMarkdown,
  options: ConverterOptions = {}
): Promise<string> {
  return generateHtml(parsed, options);
}

export default {
  generateHtml,
  generateStandaloneHtml,
};
