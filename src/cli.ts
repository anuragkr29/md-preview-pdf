#!/usr/bin/env node

/**
 * MD Preview PDF CLI
 * Command-line interface for converting Markdown to PDF
 */

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { Converter } from './converter';
import { ConverterOptions, PDFOptions, ThemeOptions, MermaidOptions } from './types';
import { setLogLevel, formatFileSize } from './utils';
import { getAvailableThemes } from './themes';

const packageJson = require('../package.json');

// Create CLI program
const program = new Command();

program
  .name('md-preview-pdf')
  .description('Convert Markdown files to PDF with Mermaid diagrams, syntax highlighting, and more')
  .version(packageJson.version);

// Main convert command
program
  .argument('<input>', 'Input markdown file or glob pattern')
  .argument('[output]', 'Output PDF file path (optional)')
  .option('-t, --theme <theme>', `Theme to use (${getAvailableThemes().join(', ')})`, 'github')
  .option('-f, --format <format>', 'Page format (A4, A3, A5, Letter, Legal, Tabloid)', 'A4')
  .option('--landscape', 'Use landscape orientation')
  .option('--no-background', 'Disable background printing')
  .option('-m, --margin <margin>', 'Page margins (e.g., "20mm" or "10mm,15mm,20mm,15mm")')
  .option('--toc', 'Generate table of contents')
  .option('--toc-depth <depth>', 'TOC depth (1-6)', '3')
  .option('--html', 'Also output HTML file')
  .option('--no-math', 'Disable math (KaTeX) rendering')
  .option('--no-emoji', 'Disable emoji conversion')
  .option('--no-highlight', 'Disable syntax highlighting')
  .option('--mermaid-theme <theme>', 'Mermaid theme (default, forest, dark, neutral)', 'default')
  .option('--header <template>', 'Custom header HTML template')
  .option('--footer <template>', 'Custom footer HTML template')
  .option('--page-numbers', 'Add page numbers to footer')
  .option('--css <path>', 'Custom CSS file path')
  .option('--debug', 'Run in debug mode (show browser)')
  .option('-v, --verbose', 'Verbose output')
  .option('-q, --quiet', 'Quiet mode (minimal output)')
  .action(async (input: string, output: string | undefined, opts: Record<string, unknown>) => {
    // Set log level
    if (opts.quiet) {
      setLogLevel('error');
    } else if (opts.verbose) {
      setLogLevel('debug');
    } else {
      setLogLevel('info');
    }

    // Parse options
    const options = parseOptions(opts);
    
    // Check if input is a glob pattern or multiple files
    const inputFiles = resolveInputFiles(input);
    
    if (inputFiles.length === 0) {
      console.error(chalk.red(`Error: No files found matching "${input}"`));
      process.exit(1);
    }

    // Create converter
    const converter = new Converter(options);
    const spinner = ora();

    let successCount = 0;
    let failCount = 0;

    try {
      for (const inputFile of inputFiles) {
        const outputFile = inputFiles.length === 1 && output
          ? output
          : undefined;

        spinner.start(chalk.blue(`Converting ${path.basename(inputFile)}...`));

        const result = await converter.convertFile(inputFile, outputFile);

        if (result.success) {
          successCount++;
          spinner.succeed(
            chalk.green(`${path.basename(inputFile)} → ${path.basename(result.outputPath!)}`) +
            chalk.gray(` (${formatFileSize(result.stats?.fileSize || 0)}, ${result.stats?.duration}ms)`)
          );
        } else {
          failCount++;
          spinner.fail(chalk.red(`Failed: ${inputFile} - ${result.error}`));
        }
      }

      // Summary
      if (inputFiles.length > 1) {
        console.log();
        console.log(chalk.bold('Summary:'));
        console.log(chalk.green(`  ✓ ${successCount} succeeded`));
        if (failCount > 0) {
          console.log(chalk.red(`  ✗ ${failCount} failed`));
        }
      }

      process.exit(failCount > 0 ? 1 : 0);
    } catch (error) {
      spinner.fail(chalk.red('Conversion failed'));
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    } finally {
      await converter.cleanup();
    }
  });

// List themes command
program
  .command('themes')
  .description('List available themes')
  .action(() => {
    console.log(chalk.bold('\nAvailable Themes:\n'));
    const themes = getAvailableThemes();
    themes.forEach((theme) => {
      console.log(`  • ${chalk.cyan(theme)}`);
    });
    console.log();
  });

// Parse margin string to object
function parseMargin(margin: string): PDFOptions['margin'] {
  const parts = margin.split(',').map(s => s.trim());
  
  if (parts.length === 1) {
    return {
      top: parts[0],
      right: parts[0],
      bottom: parts[0],
      left: parts[0],
    };
  }
  
  if (parts.length === 2) {
    return {
      top: parts[0],
      right: parts[1],
      bottom: parts[0],
      left: parts[1],
    };
  }
  
  if (parts.length === 4) {
    return {
      top: parts[0],
      right: parts[1],
      bottom: parts[2],
      left: parts[3],
    };
  }
  
  return undefined;
}

// Parse CLI options to ConverterOptions
function parseOptions(opts: Record<string, unknown>): ConverterOptions {
  const options: ConverterOptions = {
    theme: {
      name: opts.theme as ThemeOptions['name'],
    },
    pdf: {
      format: opts.format as PDFOptions['format'],
      landscape: (opts.landscape as boolean) || false,
      printBackground: opts.background !== false,
    },
    mermaid: {
      theme: opts.mermaidTheme as MermaidOptions['theme'],
    },
    toc: (opts.toc as boolean) || false,
    tocDepth: parseInt(opts.tocDepth as string, 10),
    outputHtml: (opts.html as boolean) || false,
    math: opts.math !== false,
    emoji: opts.emoji !== false,
    highlight: opts.highlight !== false,
    debug: (opts.debug as boolean) || false,
  };

  // Parse margins
  if (opts.margin) {
    options.pdf!.margin = parseMargin(opts.margin as string);
  }

  // Custom CSS
  if (opts.css) {
    options.theme!.customCSSPath = opts.css as string;
  }

  // Headers and footers
  if (opts.header) {
    options.pdf!.headerTemplate = opts.header as string;
    options.pdf!.displayHeaderFooter = true;
  }

  if (opts.footer) {
    options.pdf!.footerTemplate = opts.footer as string;
    options.pdf!.displayHeaderFooter = true;
  }

  // Page numbers
  if (opts.pageNumbers) {
    options.pdf!.displayHeaderFooter = true;
    if (!opts.footer) {
      options.pdf!.footerTemplate = `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; padding: 10px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `;
    }
    if (!opts.header) {
      options.pdf!.headerTemplate = '<div></div>';
    }
  }

  return options;
}

// Resolve input files from path or glob
function resolveInputFiles(input: string): string[] {
  const absolutePath = path.resolve(input);
  
  // Check if it's a directory
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    // Get all .md files in directory
    return fs.readdirSync(absolutePath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(absolutePath, file));
  }
  
  // Check if file exists
  if (fs.existsSync(absolutePath)) {
    return [absolutePath];
  }

  // Try as glob pattern (basic implementation)
  const dir = path.dirname(absolutePath);
  const pattern = path.basename(absolutePath);
  
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    
    return files
      .filter(file => regex.test(file) && file.endsWith('.md'))
      .map(file => path.join(dir, file));
  }
  
  return [];
}

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (process.argv.length === 2) {
  program.help();
}
