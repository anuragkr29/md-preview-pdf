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

  // Parse markdown to HTML
  const html = parser.render(content);

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
