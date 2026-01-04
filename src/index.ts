/**
 * MD Preview PDF
 * Main entry point for the library
 */

// Export main converter
export { Converter, createConverter, convert, convertString } from './converter';

// Export types
export {
  ConverterOptions,
  ConversionResult,
  PDFOptions,
  ThemeOptions,
  MermaidOptions,
  FrontMatter,
  ParsedMarkdown,
  ConversionError,
  ErrorCode,
} from './types';

// Export parser utilities
export { parseMarkdown, parseFrontMatter, createMarkdownParser } from './parser';

// Export renderers
export { 
  generateHtml, 
  generateStandaloneHtml,
  renderPDF,
  renderMermaidToSvg,
  processMermaidInHtml,
  closeBrowser 
} from './renderers';

// Export themes
export { 
  getThemeCSS, 
  getAvailableThemes, 
  themeExists,
  getHighlightThemeCSS,
  githubTheme,
  githubDarkTheme,
  vscodeLightTheme,
  vscodeDarkTheme,
} from './themes';

// Export utilities
export {
  logger,
  setLogLevel,
  getLogLevel,
  readFile,
  writeFile,
  fileExists,
  formatFileSize,
} from './utils';

// Default export
import { Converter } from './converter';
export default Converter;
