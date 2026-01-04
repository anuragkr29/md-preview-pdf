/**
 * MD Preview PDF Type Definitions
 */

export interface PDFOptions {
  /** Page format */
  format?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid';
  /** Page margins */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /** Custom header template (HTML) */
  headerTemplate?: string;
  /** Custom footer template (HTML) */
  footerTemplate?: string;
  /** Whether to display header and footer */
  displayHeaderFooter?: boolean;
  /** Print background graphics */
  printBackground?: boolean;
  /** Landscape orientation */
  landscape?: boolean;
  /** Page ranges to print (e.g., '1-5, 8, 11-13') */
  pageRanges?: string;
  /** Scale of the webpage rendering (0.1 - 2) */
  scale?: number;
  /** Paper width in CSS units */
  width?: string;
  /** Paper height in CSS units */
  height?: string;
  /** Prefer CSS page size */
  preferCSSPageSize?: boolean;
}

export interface ThemeOptions {
  /** Theme name */
  name: 'github' | 'github-dark' | 'vscode-light' | 'vscode-dark' | 'custom';
  /** Custom CSS to inject */
  customCSS?: string;
  /** Path to custom CSS file */
  customCSSPath?: string;
  /** Code highlight theme */
  highlightTheme?: string;
}

export interface MermaidOptions {
  /** Mermaid theme */
  theme?: 'default' | 'forest' | 'dark' | 'neutral' | 'base';
  /** Background color */
  backgroundColor?: string;
  /** Font family */
  fontFamily?: string;
}

export interface ConverterOptions {
  /** PDF generation options */
  pdf?: PDFOptions;
  /** Theme options */
  theme?: ThemeOptions;
  /** Mermaid diagram options */
  mermaid?: MermaidOptions;
  /** Generate table of contents */
  toc?: boolean;
  /** TOC depth (1-6) */
  tocDepth?: number;
  /** Output HTML file along with PDF */
  outputHtml?: boolean;
  /** Watch mode for live preview */
  watch?: boolean;
  /** Enable math rendering (KaTeX) */
  math?: boolean;
  /** Enable emoji conversion */
  emoji?: boolean;
  /** Enable syntax highlighting */
  highlight?: boolean;
  /** Base path for relative image paths */
  basePath?: string;
  /** Launch browser in headful mode (for debugging) */
  debug?: boolean;
}

export interface ConversionResult {
  /** Whether conversion was successful */
  success: boolean;
  /** Output PDF file path */
  outputPath?: string;
  /** Output HTML file path (if outputHtml is true) */
  htmlPath?: string;
  /** Error message if failed */
  error?: string;
  /** Conversion statistics */
  stats?: {
    /** Time taken in milliseconds */
    duration: number;
    /** Number of pages generated */
    pageCount?: number;
    /** File size in bytes */
    fileSize?: number;
  };
}

export interface FrontMatter {
  /** Document title */
  title?: string;
  /** Document author */
  author?: string;
  /** Document date */
  date?: string;
  /** PDF options from front matter */
  pdf?: PDFOptions;
  /** Theme from front matter */
  theme?: string;
  /** Any additional metadata */
  [key: string]: unknown;
}

export interface ParsedMarkdown {
  /** Parsed front matter */
  frontMatter: FrontMatter;
  /** Markdown content without front matter */
  content: string;
  /** Generated HTML */
  html?: string;
}

export interface LogLevel {
  debug: 0;
  info: 1;
  warn: 2;
  error: 3;
  silent: 4;
}

export type LogLevelName = keyof LogLevel;

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface MarkdownItPluginOptions {
  /** markdown-it-anchor options */
  anchor?: {
    level?: number[];
    permalink?: boolean;
    permalinkBefore?: boolean;
    permalinkSymbol?: string;
  };
  /** markdown-it-toc-done-right options */
  toc?: {
    level?: number[];
    listType?: 'ul' | 'ol';
  };
  /** markdown-it-container names */
  containers?: string[];
}

export class ConversionError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'ConversionError';
    this.code = code;
    this.details = details;
  }
}

export enum ErrorCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  INVALID_MARKDOWN = 'INVALID_MARKDOWN',
  PARSE_ERROR = 'PARSE_ERROR',
  MERMAID_ERROR = 'MERMAID_ERROR',
  RENDER_ERROR = 'RENDER_ERROR',
  PDF_ERROR = 'PDF_ERROR',
  BROWSER_ERROR = 'BROWSER_ERROR',
  THEME_ERROR = 'THEME_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
