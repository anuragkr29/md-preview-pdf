/**
 * Parser Module
 * Exports parser functionality and front matter handling
 */

import matter from 'gray-matter';
import { createMarkdownParser } from './markdown-parser';
import { ParsedMarkdown, FrontMatter, ConverterOptions } from '../types';
import { logger } from '../utils';

export { createMarkdownParser };

/**
 * Parse front matter from markdown content
 */
export function parseFrontMatter(content: string): { data: FrontMatter; content: string } {
  try {
    const parsed = matter(content);
    return {
      data: parsed.data as FrontMatter,
      content: parsed.content,
    };
  } catch (error) {
    logger.warn(`Failed to parse front matter: ${error}`);
    return {
      data: {},
      content,
    };
  }
}

/**
 * Convert front matter object to nested HTML table with colspan/rowspan
 */
function frontMatterToTable(obj: Record<string, unknown>): string {
  // Calculate column span for each key
  function getColumnCount(value: unknown): number {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      return entries.reduce((sum, [_, v]) => sum + getColumnCount(v), 0);
    }
    return 1;
  }

  // Calculate max depth
  function getDepth(value: unknown): number {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      return 1 + Math.max(...entries.map(([_, v]) => getDepth(v)));
    }
    return 1;
  }

  const maxDepth = Math.max(...Object.values(obj).map(v => getDepth(v)));
  const entries = Object.entries(obj);
  
  // Total rows = maxDepth (for headers at each level) + 1 (for deepest values)
  const totalRows = maxDepth + 1;

  // Build HTML table with minimal margins
  let html = '<table class="frontmatter-table" style="margin: 0 0 12px 0; border-collapse: collapse; width: 100%;">\n';

  // Track which cells have been filled by rowspan
  const occupiedCells: Set<string> = new Set();

  // Build each row
  for (let row = 0; row < totalRows; row++) {
    html += '  <tr>\n';
    
    function renderRow(entries: [string, unknown][], currentDepth: number, colOffset: number) {
      let col = colOffset;
      
      entries.forEach(([key, value]) => {
        const cellKey = `${row},${col}`;
        const isLeaf = typeof value !== 'object' || value === null || Array.isArray(value);
        const colspan = getColumnCount(value);
        
        // Check if this position is already occupied by a rowspan from above
        if (occupiedCells.has(cellKey) && isLeaf) {
          col += colspan;
          return;
        }
        
        if (row === currentDepth) {
          // This row shows headers for this depth
          html += `    <th colspan="${colspan}">${key}</th>\n`;
          col += colspan;
        } else if (row === currentDepth + 1 && isLeaf) {
          // This row shows values for simple values at this depth
          const displayValue = value === null ? '' : String(value);
          const rowspan = totalRows - row;
          
          // Mark cells as occupied by this rowspan
          for (let r = row; r < row + rowspan; r++) {
            occupiedCells.add(`${r},${col}`);
          }
          
          html += `    <td rowspan="${rowspan}">${displayValue}</td>\n`;
          col += 1;
        } else if (row > currentDepth && !isLeaf) {
          // Recurse into nested object
          renderRow(Object.entries(value as Record<string, unknown>), currentDepth + 1, col);
          col += colspan;
        } else {
          col += colspan;
        }
      });
    }
    
    renderRow(entries, 0, 0);
    html += '  </tr>\n';
  }

  html += '</table>\n';

  return html;
}

/**
 * Parse markdown content and return structured result
 */
export function parseMarkdown(
  markdownContent: string,
  options: ConverterOptions = {}
): ParsedMarkdown {
  // Extract front matter
  const { data: frontMatter, content } = parseFrontMatter(markdownContent);

  // Merge options from front matter
  const themeName = (frontMatter.theme as string | undefined) || options.theme?.name || 'github';
  const validThemeNames = ['github', 'github-dark', 'vscode-light', 'vscode-dark', 'custom'];
  const finalThemeName = validThemeNames.includes(themeName) ? (themeName as 'github' | 'github-dark' | 'vscode-light' | 'vscode-dark' | 'custom') : 'github';

  const mergedOptions = {
    ...options,
    theme: {
      ...options.theme,
      name: finalThemeName,
    },
    pdf: {
      ...options.pdf,
      ...frontMatter.pdf,
    },
  };

  // Create parser with merged options
  const parser = createMarkdownParser(mergedOptions);

  // If there's front matter, convert it to HTML table and prepend
  let contentToRender = content;
  if (Object.keys(frontMatter).length > 0 && markdownContent.startsWith('---')) {
    const frontMatterTable = '<div class="frontmatter-wrapper">' + frontMatterToTable(frontMatter) + '</div>\n';
    contentToRender = frontMatterTable + content;
  }

  // Parse markdown to HTML
  const html = parser.render(contentToRender);

  logger.debug('Markdown parsed successfully');

  return {
    frontMatter,
    content,
    html,
  };
}

/**
 * Generate table of contents placeholder
 */
export function getTocPlaceholder(): string {
  return '${toc}';
}

/**
 * Check if content has table of contents placeholder
 */
export function hasTocPlaceholder(content: string): boolean {
  return content.includes('${toc}') || content.includes('[[toc]]') || content.includes('[TOC]');
}

/**
 * Replace TOC placeholder with actual TOC
 */
export function replaceTocPlaceholder(html: string, toc: string): string {
  return html
    .replace(/\$\{toc\}/g, toc)
    .replace(/\[\[toc\]\]/gi, toc)
    .replace(/\[TOC\]/g, toc);
}

export default {
  createMarkdownParser,
  parseFrontMatter,
  parseMarkdown,
  getTocPlaceholder,
  hasTocPlaceholder,
  replaceTocPlaceholder,
};
