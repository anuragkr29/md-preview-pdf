/**
 * MD Preview PDF Converter
 * Main converter class that orchestrates the conversion process
 */

import * as path from 'path';
import { 
  ConverterOptions, 
  ConversionResult, 
  ParsedMarkdown 
} from './types';
import { parseMarkdown } from './parser';
import { generateHtml, renderPDF, closeBrowser } from './renderers';
import { 
  logger, 
  readFile, 
  writeFile,
  changeExtension, 
  getFileSize,
  formatFileSize,
  handleError 
} from './utils';
import { getMatchingHighlightTheme } from './themes';

/**
 * Default converter options
 */
const defaultOptions: ConverterOptions = {
  pdf: {
    format: 'A4',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm',
    },
    printBackground: true,
  },
  theme: {
    name: 'github',
  },
  mermaid: {
    theme: 'default',
  },
  toc: false,
  tocDepth: 3,
  outputHtml: false,
  math: true,
  emoji: true,
  highlight: true,
  debug: false,
};

/**
 * Merge user options with defaults
 */
function mergeOptions(userOptions: ConverterOptions): ConverterOptions {
  return {
    ...defaultOptions,
    ...userOptions,
    pdf: {
      ...defaultOptions.pdf,
      ...userOptions.pdf,
      margin: {
        ...defaultOptions.pdf?.margin,
        ...userOptions.pdf?.margin,
      },
    },
    theme: {
      name: userOptions.theme?.name || defaultOptions.theme?.name || 'github',
      ...defaultOptions.theme,
      ...userOptions.theme,
    },
    mermaid: {
      ...defaultOptions.mermaid,
      ...userOptions.mermaid,
    },
  };
}

/**
 * MD Preview PDF Converter class
 */
export class Converter {
  private options: ConverterOptions;

  constructor(options: ConverterOptions = {}) {
    this.options = mergeOptions(options);
    
    // Set highlight theme based on document theme
    if (!this.options.theme?.highlightTheme) {
      const themeName = this.options.theme?.name || 'github';
      this.options.theme = {
        name: this.options.theme?.name || 'github',
        ...this.options.theme,
        highlightTheme: getMatchingHighlightTheme(themeName),
      };
    }
  }

  /**
   * Convert markdown string to PDF buffer
   */
  async convertString(markdown: string, basePath?: string): Promise<Buffer> {
    const options = {
      ...this.options,
      basePath: basePath || process.cwd(),
    };

    // Parse markdown
    logger.info('Parsing markdown content...');
    const parsed = parseMarkdown(markdown, options);

    // Generate HTML
    logger.info('Generating HTML...');
    const html = await generateHtml(parsed, options);

    // Generate PDF
    logger.info('Generating PDF...');
    const pdfBuffer = await renderPDF(html, {
      pdf: options.pdf,
      mermaid: options.mermaid,
      debug: options.debug,
    });

    return pdfBuffer;
  }

  /**
   * Convert markdown file to PDF file
   */
  async convertFile(
    inputPath: string,
    outputPath?: string
  ): Promise<ConversionResult> {
    const startTime = Date.now();
    
    try {
      const absoluteInputPath = path.resolve(inputPath);
      const absoluteOutputPath = outputPath 
        ? path.resolve(outputPath)
        : changeExtension(absoluteInputPath, 'pdf');

      const basePath = path.dirname(absoluteInputPath);

      logger.info(`Converting: ${absoluteInputPath}`);
      logger.debug(`Output: ${absoluteOutputPath}`);

      // Read markdown file
      const markdown = await readFile(absoluteInputPath);

      // Set base path for relative resources
      const options = {
        ...this.options,
        basePath,
      };

      // Parse markdown
      logger.info('Parsing markdown...');
      const parsed = parseMarkdown(markdown, options);

      // Merge front matter options
      if (parsed.frontMatter.pdf) {
        options.pdf = { ...options.pdf, ...parsed.frontMatter.pdf };
      }

      // Generate HTML
      logger.info('Generating HTML...');
      const html = await generateHtml(parsed, options);

      // Save HTML if requested
      let htmlPath: string | undefined;
      if (options.outputHtml) {
        htmlPath = changeExtension(absoluteOutputPath, 'html');
        await writeFile(htmlPath, html);
        logger.info(`HTML saved: ${htmlPath}`);
      }

      // Generate PDF
      logger.info('Generating PDF...');
      const pdfBuffer = await renderPDF(html, {
        pdf: options.pdf,
        mermaid: options.mermaid,
        debug: options.debug,
      });

      // Save PDF
      await writeFile(absoluteOutputPath, pdfBuffer);

      const duration = Date.now() - startTime;
      const fileSize = await getFileSize(absoluteOutputPath);

      logger.info(`✓ PDF generated: ${absoluteOutputPath}`);
      logger.info(`  Size: ${formatFileSize(fileSize)}, Time: ${duration}ms`);

      return {
        success: true,
        outputPath: absoluteOutputPath,
        htmlPath,
        stats: {
          duration,
          fileSize,
        },
      };
    } catch (error) {
      const conversionError = handleError(error);
      logger.error(`Conversion failed: ${conversionError.message}`);

      return {
        success: false,
        error: conversionError.message,
        stats: {
          duration: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Convert multiple files
   */
  async convertFiles(
    inputPaths: string[],
    outputDir?: string
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];

    for (const inputPath of inputPaths) {
      let outputPath: string | undefined;
      
      if (outputDir) {
        const basename = path.basename(inputPath);
        outputPath = path.join(outputDir, changeExtension(basename, 'pdf'));
      }

      const result = await this.convertFile(inputPath, outputPath);
      results.push(result);
    }

    return results;
  }

  /**
   * Parse markdown and return structured result (useful for previewing)
   */
  parseMarkdown(markdown: string): ParsedMarkdown {
    return parseMarkdown(markdown, this.options);
  }

  /**
   * Generate HTML from markdown (useful for previewing)
   */
  async generateHtml(markdown: string, basePath?: string): Promise<string> {
    const options = {
      ...this.options,
      basePath: basePath || process.cwd(),
    };

    const parsed = parseMarkdown(markdown, options);
    return generateHtml(parsed, options);
  }

  /**
   * Update converter options
   */
  setOptions(options: Partial<ConverterOptions>): void {
    this.options = mergeOptions({ ...this.options, ...options });
  }

  /**
   * Get current options
   */
  getOptions(): ConverterOptions {
    return { ...this.options };
  }

  /**
   * Clean up resources (close browser)
   */
  async cleanup(): Promise<void> {
    await closeBrowser();
    logger.debug('Converter cleanup complete');
  }
}

/**
 * Create a converter instance with options
 */
export function createConverter(options: ConverterOptions = {}): Converter {
  return new Converter(options);
}

/**
 * Quick convert function for simple use cases
 */
export async function convert(
  input: string,
  output?: string,
  options?: ConverterOptions
): Promise<ConversionResult> {
  const converter = createConverter(options);
  
  try {
    const result = await converter.convertFile(input, output);
    return result;
  } finally {
    await converter.cleanup();
  }
}

/**
 * Convert markdown string to PDF buffer
 */
export async function convertString(
  markdown: string,
  options?: ConverterOptions
): Promise<Buffer> {
  const converter = createConverter(options);
  
  try {
    return await converter.convertString(markdown);
  } finally {
    await converter.cleanup();
  }
}

export default Converter;
