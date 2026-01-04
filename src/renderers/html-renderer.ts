/**
 * HTML Renderer
 * Generates complete HTML documents from parsed markdown
 */

import * as path from 'path';
import { ParsedMarkdown, ConverterOptions, ThemeOptions } from '../types';
import { logger, readFile, fileExists, readFileAsBase64, getMimeType } from '../utils';
import { getThemeCSS, getHighlightThemeCSS } from '../themes';

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
 * Get KaTeX CSS for math rendering
 */
function getKatexCSS(): string {
  return `
/* KaTeX CSS - Essential styles for math rendering */
.katex {
  font: normal 1.21em KaTeX_Main, "Times New Roman", serif;
  line-height: 1.2;
  text-indent: 0;
  text-rendering: auto;
}

.katex * {
  -ms-high-contrast-adjust: none !important;
  border-color: currentColor;
}

.katex .katex-html {
  display: inline-block;
}

.katex .base {
  position: relative;
  display: inline-block;
}

.katex .strut {
  display: inline-block;
}

.math-block {
  display: block;
  text-align: center;
  margin: 1em 0;
  overflow-x: auto;
}

.math-error {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 0.5em;
  border-radius: 4px;
}
`;
}

/**
 * Get base CSS for document structure
 */
function getBaseCSS(): string {
  return `
/* Base Document Styles */
* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  margin: 0;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 1rem;
  line-height: 1.6;
  word-wrap: break-word;
}

/* Mermaid container styles */
.mermaid-container {
  display: flex;
  justify-content: center;
  margin: 1em 0;
  overflow-x: auto;
  page-break-inside: avoid;
  break-inside: avoid;
}

.mermaid {
  display: flex;
  justify-content: center;
  margin: 1em 0;
  overflow-x: auto;
}

.mermaid-container svg,
.mermaid svg {
  max-width: 100%;
  height: auto;
  display: block;
}

.mermaid-error {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 1em;
  margin: 1em 0;
}

.mermaid-error .error-message {
  color: #856404;
  font-size: 0.9em;
}

/* Custom containers */
.custom-container {
  padding: 1em 1.5em;
  margin: 1em 0;
  border-left: 4px solid;
  border-radius: 4px;
}

.custom-container-title {
  font-weight: 600;
  margin-bottom: 0.5em;
}

.custom-container.tip {
  background: #e8f5e9;
  border-color: #4caf50;
}

.custom-container.warning {
  background: #fff3e0;
  border-color: #ff9800;
}

.custom-container.danger {
  background: #ffebee;
  border-color: #f44336;
}

.custom-container.info {
  background: #e3f2fd;
  border-color: #2196f3;
}

.custom-container.note {
  background: #f3e5f5;
  border-color: #9c27b0;
}

.custom-container.important {
  background: #fff8e1;
  border-color: #ffc107;
}

.custom-container.caution {
  background: #fce4ec;
  border-color: #e91e63;
}

/* Task lists */
.task-list-item {
  list-style-type: none;
}

.task-list-item input {
  margin-right: 0.5em;
}

/* Footnotes */
.footnotes {
  border-top: 1px solid #e1e4e8;
  margin-top: 2em;
  padding-top: 1em;
  font-size: 0.9em;
}

.footnote-ref {
  font-size: 0.75em;
  vertical-align: super;
}

/* Table of contents */
.table-of-contents {
  background: #f6f8fa;
  padding: 1em 1.5em;
  border-radius: 6px;
  margin: 1em 0;
}

.table-of-contents ul {
  margin: 0;
  padding-left: 1.5em;
}

.table-of-contents li {
  margin: 0.5em 0;
}

/* Details/Summary */
details {
  margin: 1em 0;
  padding: 0.5em 1em;
  background: #f6f8fa;
  border-radius: 4px;
}

details summary {
  cursor: pointer;
  font-weight: 600;
}

details[open] summary {
  margin-bottom: 0.5em;
}

/* Print styles */
@media print {
  body {
    padding: 0;
  }
  
  pre, code {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  /* Prevent mermaid diagrams and images from breaking across pages */
  .mermaid-container svg,
  .mermaid svg {
    page-break-inside: avoid;
    break-inside: avoid;
    max-height: 700px;
    width: 100%;
  }
  
  img {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  /* Keep headings with their content */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    break-after: avoid;
  }
  
  /* Reduce excessive spacing */
  .markdown-body h1 {
    margin-top: 0.8em;
    margin-bottom: 0.3em;
  }
  
  .markdown-body h2 {
    margin-top: 0.6em;
    margin-bottom: 0.25em;
  }
  
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    margin-top: 0.4em;
    margin-bottom: 0.15em;
  }
  
  /* Keep sections together */
  section {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  /* Tables shouldn't break */
  table {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
`;
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
${getBaseCSS()}
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
