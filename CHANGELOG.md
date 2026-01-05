# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-04

### Added
- Initial release of MD Preview PDF
- Full GitHub Flavored Markdown (GFM) support
- Mermaid diagram rendering (flowcharts, sequence diagrams, class diagrams, etc.)
- Syntax highlighting for 150+ programming languages using highlight.js
- Math equation rendering with KaTeX
- Multiple themes: GitHub (light/dark), VS Code (light/dark)
- Auto-generated Table of Contents with customizable depth
- Task lists with checkbox support
- Footnotes support
- Custom containers (tips, warnings, info boxes)
- Emoji shortcode conversion
- Command-line interface with extensive options
- Programmatic API for integration
- YAML front matter support for document-specific configuration
- Custom CSS support
- Page number support
- Landscape and portrait orientation options
- Multiple page formats (A4, A3, A5, Letter, Legal, Tabloid)
- Customizable margins
- Debug mode for troubleshooting

### Fixed
- Missing headings in PDF output (critical bug fix)
- Excessive white space around Mermaid diagrams
- Excessive white space between sections
- Mermaid diagrams breaking across pages
- Headings appearing separately from their content
- Improved page break control for tables, images, and code blocks

### Technical
- TypeScript-based codebase for type safety
- Puppeteer for high-fidelity PDF generation
- Comprehensive test suite with Jest
- ESLint configuration for code quality
- Modular architecture with clear separation of concerns
- Async/await throughout for better performance
- Error handling and logging utilities

## [Unreleased]

### Planned
- Watch mode for automatic regeneration
- Batch conversion support
- Additional themes
- SVG optimization
- Custom font support
- Header/footer templates
- Watermark support
- PDF encryption and permissions
- Table of figures/tables
- Cross-references

---

[1.0.0]: https://github.com/anuragkr29/md-preview-pdf/releases/tag/v1.0.0
