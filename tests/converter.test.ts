/**
 * Converter Tests
 * Tests for the main converter functionality
 */

import * as path from 'path';
import * as fs from 'fs';
import { Converter, createConverter } from '../src/converter';
import { parseMarkdown, parseFrontMatter } from '../src/parser';

const SAMPLES_DIR = path.join(__dirname, 'samples');
const OUTPUT_DIR = path.join(__dirname, 'output');

// Ensure output directory exists
beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

// Clean up after tests
afterAll(async () => {
  // Clean up output files (optional)
  // fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
});

describe('Converter', () => {
  describe('constructor', () => {
    it('should create a converter with default options', () => {
      const converter = new Converter();
      const options = converter.getOptions();
      
      expect(options.theme?.name).toBe('github');
      expect(options.pdf?.format).toBe('A4');
      expect(options.math).toBe(true);
      expect(options.emoji).toBe(true);
      expect(options.highlight).toBe(true);
    });

    it('should create a converter with custom options', () => {
      const converter = new Converter({
        theme: { name: 'github-dark' },
        pdf: { format: 'Letter' },
        toc: true,
      });
      const options = converter.getOptions();
      
      expect(options.theme?.name).toBe('github-dark');
      expect(options.pdf?.format).toBe('Letter');
      expect(options.toc).toBe(true);
    });
  });

  describe('parseMarkdown', () => {
    it('should parse simple markdown', () => {
      const converter = new Converter();
      const result = converter.parseMarkdown('# Hello\n\nWorld');
      
      expect(result.html).toContain('<h1');
      expect(result.html).toContain('Hello');
      expect(result.html).toContain('<p>World</p>');
    });

    it('should parse markdown with code blocks', () => {
      const markdown = '```javascript\nconsole.log("test");\n```';
      const converter = new Converter();
      const result = converter.parseMarkdown(markdown);
      
      expect(result.html).toContain('hljs');
      expect(result.html).toContain('console');
    });
  });

  describe('generateHtml', () => {
    it('should generate complete HTML document', async () => {
      const converter = new Converter();
      const html = await converter.generateHtml('# Test\n\nHello World');
      
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
      expect(html).toContain('Test');
      expect(html).toContain('Hello World');
    });

    it('should include theme CSS', async () => {
      const converter = new Converter({ theme: { name: 'github' } });
      const html = await converter.generateHtml('# Test');
      
      expect(html).toContain('markdown-body');
    });
  });
});

describe('Parser', () => {
  describe('parseFrontMatter', () => {
    it('should parse YAML front matter', () => {
      const content = `---
title: Test Document
author: John Doe
---
# Content`;
      
      const { data, content: md } = parseFrontMatter(content);
      
      expect(data.title).toBe('Test Document');
      expect(data.author).toBe('John Doe');
      expect(md.trim()).toBe('# Content');
    });

    it('should handle content without front matter', () => {
      const content = '# Just Content';
      
      const { data, content: md } = parseFrontMatter(content);
      
      expect(data).toEqual({});
      expect(md).toBe('# Just Content');
    });
  });

  describe('parseMarkdown', () => {
    it('should parse headers', () => {
      const result = parseMarkdown('# H1\n## H2\n### H3');
      
      expect(result.html).toContain('<h1');
      expect(result.html).toContain('<h2');
      expect(result.html).toContain('<h3');
    });

    it('should parse emphasis', () => {
      const result = parseMarkdown('**bold** and *italic*');
      
      expect(result.html).toContain('<strong>bold</strong>');
      expect(result.html).toContain('<em>italic</em>');
    });

    it('should parse links', () => {
      const result = parseMarkdown('[Link](https://example.com)');
      
      expect(result.html).toContain('<a href="https://example.com"');
      expect(result.html).toContain('Link</a>');
    });

    it('should parse inline code', () => {
      const result = parseMarkdown('Use `code` here');
      
      expect(result.html).toContain('<code>code</code>');
    });

    it('should parse code blocks with syntax highlighting', () => {
      const result = parseMarkdown('```js\nconst x = 1;\n```');
      
      expect(result.html).toContain('hljs');
      expect(result.html).toContain('const');
    });

    it('should parse tables', () => {
      const table = `
| A | B |
|---|---|
| 1 | 2 |
`;
      const result = parseMarkdown(table);
      
      expect(result.html).toContain('<table>');
      expect(result.html).toContain('<th>');
      expect(result.html).toContain('<td>');
    });

    it('should parse task lists', () => {
      const tasks = `
- [x] Done
- [ ] Not done
`;
      const result = parseMarkdown(tasks);
      
      expect(result.html).toContain('type="checkbox"');
      expect(result.html).toContain('checked');
    });

    it('should handle mermaid code blocks', () => {
      const mermaid = '```mermaid\ngraph LR\nA-->B\n```';
      const result = parseMarkdown(mermaid);
      
      expect(result.html).toContain('class="mermaid"');
      expect(result.html).toContain('data-mermaid');
    });

    it('should parse emoji', () => {
      const result = parseMarkdown(':smile: :rocket:');
      
      // Emoji plugin converts shortcodes to unicode
      expect(result.html).toMatch(/[\u{1F600}-\u{1F64F}]/u);
    });

    it('should parse blockquotes', () => {
      const result = parseMarkdown('> This is a quote');
      
      expect(result.html).toContain('<blockquote>');
    });

    it('should parse lists', () => {
      const result = parseMarkdown('- Item 1\n- Item 2\n- Item 3');
      
      expect(result.html).toContain('<ul>');
      expect(result.html).toContain('<li>');
    });

    it('should parse ordered lists', () => {
      const result = parseMarkdown('1. First\n2. Second\n3. Third');
      
      expect(result.html).toContain('<ol>');
      expect(result.html).toContain('<li>');
    });

    it('should parse horizontal rules', () => {
      // Need text before --- to prevent it being parsed as YAML front matter
      const result = parseMarkdown('Some text\n\n---\n\nMore text');
      
      expect(result.html).toContain('<hr');
    });
  });
});

describe('createConverter', () => {
  it('should create converter instance', () => {
    const converter = createConverter();
    expect(converter).toBeInstanceOf(Converter);
  });

  it('should accept options', () => {
    const converter = createConverter({ toc: true });
    expect(converter.getOptions().toc).toBe(true);
  });
});

describe('Integration Tests', () => {
  let converter: Converter;

  beforeAll(() => {
    converter = new Converter({
      theme: { name: 'github' },
      math: true,
      emoji: true,
    });
  });

  afterAll(async () => {
    await converter.cleanup();
  });

  it('should convert simple test file', async () => {
    const inputPath = path.join(SAMPLES_DIR, 'simple-test.md');
    const outputPath = path.join(OUTPUT_DIR, 'simple-test.pdf');
    
    const result = await converter.convertFile(inputPath, outputPath);
    
    expect(result.success).toBe(true);
    expect(result.outputPath).toBe(outputPath);
    expect(fs.existsSync(outputPath)).toBe(true);
    
    const stats = fs.statSync(outputPath);
    expect(stats.size).toBeGreaterThan(0);
  }, 60000); // 60 second timeout for PDF generation

  it('should convert comprehensive test file', async () => {
    const inputPath = path.join(SAMPLES_DIR, 'comprehensive-test.md');
    const outputPath = path.join(OUTPUT_DIR, 'comprehensive-test.pdf');
    
    const result = await converter.convertFile(inputPath, outputPath);
    
    expect(result.success).toBe(true);
    expect(result.outputPath).toBe(outputPath);
    expect(fs.existsSync(outputPath)).toBe(true);
  }, 120000); // 2 minute timeout for complex file

  it('should handle missing file gracefully', async () => {
    const inputPath = path.join(SAMPLES_DIR, 'nonexistent.md');
    
    const result = await converter.convertFile(inputPath);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
