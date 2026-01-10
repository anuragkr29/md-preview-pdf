/**
 * Markdown Parser
 * Configures markdown-it with all necessary plugins for full markdown support
 */

import MarkdownIt, { Token } from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import StateInline from 'markdown-it/lib/rules_inline/state_inline';
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import highlightjs from 'highlight.js';
import anchor from 'markdown-it-anchor';
import footnote from 'markdown-it-footnote';
import container from 'markdown-it-container';
import katex from 'katex';
import emojiPlugin from 'markdown-it-emoji';
import taskListsPlugin from 'markdown-it-task-lists';
import tocDoneRightPlugin from 'markdown-it-toc-done-right';
import attrsPlugin from 'markdown-it-attrs';
import { ConverterOptions } from '../types';
import { logger } from '../utils';

/**
 * Custom plugin to render math equations with KaTeX
 */
function mathPlugin(md: MarkdownIt): void {
  // Inline math: $...$
  const inlineMathRule = (state: StateInline, silent: boolean): boolean => {
    if (state.src[state.pos] !== '$') return false;
    if (state.src[state.pos + 1] === '$') return false; // Skip block math
    if (state.src[state.pos + 1] === '{') return false; // Skip ${...} template literals

    const start = state.pos + 1;
    let end = start;
    
    while (end < state.posMax && state.src[end] !== '$') {
      if (state.src[end] === '\\') end++; // Skip escaped characters
      end++;
    }

    if (end >= state.posMax || state.src[end] !== '$') return false;

    if (!silent) {
      const content = state.src.slice(start, end);
      const token = state.push('math_inline', 'math', 0);
      token.content = content;
      token.markup = '$';
    }

    state.pos = end + 1;
    return true;
  };

  // Block math: $$...$$
  const blockMathRule = (state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean => {
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const maxPos = state.eMarks[startLine];

    if (startPos + 2 > maxPos) return false;
    if (state.src.slice(startPos, startPos + 2) !== '$$') return false;

    let nextLine = startLine;
    let endPos = -1;

    // Find closing $$
    while (nextLine < endLine) {
      nextLine++;
      if (nextLine >= endLine) break;

      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineEnd = state.eMarks[nextLine];
      const lineText = state.src.slice(lineStart, lineEnd).trim();

      if (lineText === '$$') {
        endPos = lineStart;
        break;
      }
    }

    if (endPos === -1) return false;

    if (!silent) {
      const content = state.src.slice(startPos + 2, endPos).trim();
      const token = state.push('math_block', 'math', 0);
      token.content = content;
      token.markup = '$$';
      token.block = true;
      token.map = [startLine, nextLine + 1];
    }

    state.line = nextLine + 1;
    return true;
  };

  md.inline.ruler.before('escape', 'math_inline', inlineMathRule);
  md.block.ruler.before('fence', 'math_block', blockMathRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });

  // Render math tokens
  md.renderer.rules.math_inline = ((tokens: Token[], idx: number, _options: MarkdownIt.Options): string => {
    try {
      return katex.renderToString(tokens[idx].content, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (error) {
      logger.warn(`KaTeX inline error: ${error}`);
      return `<code class="math-error">${tokens[idx].content}</code>`;
    }
  }) as Renderer.RenderRule;

  md.renderer.rules.math_block = ((tokens: Token[], idx: number, _options: MarkdownIt.Options): string => {
    try {
      return `<div class="math-block">${katex.renderToString(tokens[idx].content, {
        throwOnError: false,
        displayMode: true,
      })}</div>`;
    } catch (error) {
      logger.warn(`KaTeX block error: ${error}`);
      return `<pre class="math-error"><code>${tokens[idx].content}</code></pre>`;
    }
  }) as Renderer.RenderRule;
}

/**
 * Custom plugin to handle Mermaid code blocks
 * Converts ```mermaid blocks to special div elements for later processing
 */
function mermaidPlugin(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence || ((tokens: Token[], idx: number, _options: MarkdownIt.Options): string => {
    const token = tokens[idx];
    return `<pre><code class="language-${token.info}">${token.content}</code></pre>`;
  });

  md.renderer.rules.fence = ((tokens: Token[], idx: number, _options: MarkdownIt.Options, _env: Record<string, unknown>, _self: Renderer): string => {
    const token = tokens[idx];
    const info = token.info?.trim().toLowerCase() || '';

    if (info === 'mermaid') {
      const content = token.content.trim();
      // Encode content to avoid HTML issues
      const encodedContent = Buffer.from(content).toString('base64');
      return `<div class="mermaid" data-mermaid="${encodedContent}">${content}</div>\n`;
    }

    return defaultFence(tokens, idx, _options, _env, _self);
  }) as Renderer.RenderRule;
}

/**
 * Configure syntax highlighting
 */
function configureHighlighting(md: MarkdownIt): void {
  md.options.highlight = (str: string, lang: string): string => {
    if (lang && highlightjs.getLanguage(lang)) {
      try {
        const result = highlightjs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        });
        return `<pre class="hljs"><code class="language-${lang}">${result.value}</code></pre>`;
      } catch (error) {
        logger.debug(`Highlight.js error for language ${lang}: ${error}`);
      }
    }

    // Auto-detect language
    try {
      const result = highlightjs.highlightAuto(str);
      return `<pre class="hljs"><code>${result.value}</code></pre>`;
    } catch {
      // Fall back to plain code block
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  };
}

/**
 * Create custom container types (warning, info, tip, danger, etc.)
 */
function addContainers(md: MarkdownIt): void {
  const containerTypes = ['warning', 'info', 'tip', 'danger', 'note', 'important', 'caution'];

  containerTypes.forEach((type) => {
    md.use(container, type, {
      validate: (params: string) => params.trim().split(' ')[0] === type,
      render: ((tokens: Token[], idx: number, _options: MarkdownIt.Options): string => {
        if (tokens[idx].nesting === 1) {
          const info = tokens[idx].info?.trim() || '';
          const title = info.slice(type.length).trim() || type.charAt(0).toUpperCase() + type.slice(1);
          return `<div class="custom-container ${type}">\n<p class="custom-container-title">${title}</p>\n`;
        }
        return '</div>\n';
      }) as Renderer.RenderRule,
    });
  });

  // Details/summary container
  md.use(container, 'details', {
    validate: (params: string) => params.trim().startsWith('details'),
    render: ((tokens: Token[], idx: number, _options: MarkdownIt.Options): string => {
      if (tokens[idx].nesting === 1) {
        const info = tokens[idx].info?.trim() || '';
        const summary = info.slice(7).trim() || 'Details';
        return `<details>\n<summary>${summary}</summary>\n`;
      }
      return '</details>\n';
    }) as Renderer.RenderRule,
  });
}

/**
 * Create and configure the markdown parser
 */
export function createMarkdownParser(options: ConverterOptions = {}): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  // Syntax highlighting
  if (options.highlight !== false) {
    configureHighlighting(md);
  }

  // Anchor plugin for headers
  md.use(anchor, {
    level: [1, 2, 3, 4, 5, 6],
    permalink: false,
    slugify: (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-{2,}/g, '-'),
  });

  // Table of contents
  if (options.toc) {
    md.use(tocDoneRightPlugin, {
      level: [1, 2, 3, 4].slice(0, options.tocDepth || 3),
      listType: 'ul',
      containerClass: 'table-of-contents',
    });
  }

  // Emoji support - use the full version
  if (options.emoji !== false) {
    md.use((emojiPlugin as unknown as { full: typeof emojiPlugin }).full || emojiPlugin);
  }

  // Footnotes
  md.use(footnote);

  // Task lists (checkboxes)
  md.use(taskListsPlugin, {
    enabled: true,
    label: true,
    labelAfter: true,
  });

  // Custom attributes
  md.use(attrsPlugin, {
    allowedAttributes: ['id', 'class', 'style', 'width', 'height'],
    leftDelimiter: '{:',
    rightDelimiter: '}',
  });

  // Math support (KaTeX)
  if (options.math !== false) {
    mathPlugin(md);
  }

  // Mermaid support
  mermaidPlugin(md);

  // Custom containers
  addContainers(md);

  logger.debug('Markdown parser configured with plugins');

  return md;
}

export default createMarkdownParser;
