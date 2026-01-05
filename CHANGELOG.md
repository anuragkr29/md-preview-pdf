# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-01-04

### Fixed
- **Module type declarations**: Properly typed external modules without types
  - Added `index.d.ts` with declarations for `markdown-it-task-lists`, `markdown-it-attrs`, and `markdown-it-toc-done-right`
  - Improves IDE autocomplete and type checking for these dependencies

### Changed
- **CLI package import**: Updated to use ES6 import syntax instead of CommonJS require
- **PDF margin handling**: Improved margin specification in PDF options
  - Now supports both CSS @page margins and Puppeteer margins
  - CLI accepts margin values in multiple formats: `"20mm"`, `"10mm,15mm"`, `"10mm 15mm 20mm 15mm"`
  - Default margins updated to 10mm (top/bottom/left/right)
- **HTML renderer CSS**: Refactored base CSS generation to accept margin parameters
  - CSS @page rule now dynamically includes margins from options
  - Removed hardcoded padding from markdown-body
  - Page break rules improved for better PDF layout

### Improved
- **Type safety**: Enhanced tsconfig.json with typeRoots configuration for custom types
- **PDF rendering**: Better support for custom page margins and margins through CSS

### Verification
- ✅ All 26 tests passing
- ✅ No linting errors
- ✅ Build successful
- ✅ CI/CD pipeline configured and functional

## [1.0.3] - 2026-01-04

### Fixed
- **Eliminated all npm deprecation warnings using npm overrides**
  - Previously: `npm warn deprecated inflight@1.0.6` and `npm warn deprecated glob@7.2.3`
  - Root cause: `test-exclude@6.0.0` (used by babel-plugin-istanbul) depended on glob@7.2.3 and inflight@1.0.6
  - Solution: Added npm overrides to force `test-exclude@7.0.1` which uses `glob@10.5.0` (no inflight dependency)
  - Result: 0 npm deprecation warnings

### Changed
- **package.json**: Added `overrides` field with `test-exclude@^7.0.1`
  - This forces the latest test-exclude version across the entire dependency tree
  - Ensures no transitive deprecated dependencies are installed
  - npm overrides field is the official npm solution for this type of issue

### Improvements
- Complete elimination of npm deprecation warnings from direct and transitive dependencies
- Cleaner dependency tree with no memory-leaking modules (inflight is deprecated)
- Faster glob operations using modern glob@10 implementation
- All dependencies verified with `npm audit` (0 vulnerabilities)

### Verification
- ✅ Build: 0 errors
- ✅ Linting: 0 errors, 0 warnings
- ✅ Tests: 26/26 passing
- ✅ npm audit: 0 vulnerabilities
- ✅ npm ci: Clean install with 0 deprecation warnings
- ✅ npm ls: Correct dependency tree (test-exclude@7.0.1, glob@10.5.0, no inflight)
- ✅ CLI: All commands working correctly
- ✅ Programmatic API: All Converter methods functional

## [1.0.2] - 2026-01-04

### Fixed
- **Eliminated all ESLint warnings with proper type safety**
  - Previously: 15 ESLint warnings about "Unexpected any" types
  - Now: 0 ESLint warnings with full type safety
- Fixed CLI `mermaidTheme` option: Changed from `any` to proper `MermaidOptions['theme']` type
- Fixed markdown-it integration: Properly imported and used `Token`, `StateInline`, `StateBlock` types from markdown-it/lib
- Fixed all render rule callbacks: Now use proper `Renderer.RenderRule` type with correct function signatures
- Fixed unused function parameters: All unused parameters now properly prefixed with `_` prefix

### Changed
- **CLI Type Safety** (`src/cli.ts`):
  - Line 180: `mermaidTheme` now typed as `MermaidOptions['theme']` instead of `any`
  - Added import of `MermaidOptions` type for proper type checking
- **Markdown Parser Proper Typing** (`src/parser/markdown-parser.ts`):
  - Imported actual markdown-it types: `Token`, `StateInline`, `StateBlock`, `Renderer`
  - All render function callbacks now use `Renderer.RenderRule` type
  - Math render rules: `tokens: Token[]` with proper typing
  - Mermaid fence handler: Full type safety with `_options`, `_env`, `_self` parameters
  - Container render rules: Both standard containers and details/summary use proper types
  - All unused parameters properly marked with `_` prefix per ESLint conventions

### Improvements
- Complete elimination of ESLint warnings without using `eslint-disable` comments
- Improved code maintainability with proper TypeScript types throughout
- Better IDE support with full type inference for markdown-it integration
- All type imports come directly from markdown-it's official type definitions

### Verification
- ✅ Build: 0 errors
- ✅ Linting: 0 errors, 0 warnings (previously 15 warnings)
- ✅ Tests: 26/26 passing
- ✅ npm audit: 0 vulnerabilities

## [1.0.2] - 2026-01-04

### Fixed
- **Eliminated all ESLint warnings with proper type safety**
  - Previously: 15 ESLint warnings about "Unexpected any" types
  - Now: 0 ESLint warnings with full type safety
- Fixed CLI `mermaidTheme` option: Changed from `any` to proper `MermaidOptions['theme']` type
- Fixed markdown-it integration: Properly imported and used `Token`, `StateInline`, `StateBlock` types from markdown-it/lib
- Fixed all render rule callbacks: Now use proper `Renderer.RenderRule` type with correct function signatures
- Fixed unused function parameters: All unused parameters now properly prefixed with `_` prefix

### Changed
- **CLI Type Safety** (`src/cli.ts`):
  - Line 180: `mermaidTheme` now typed as `MermaidOptions['theme']` instead of `any`
  - Added import of `MermaidOptions` type for proper type checking
- **Markdown Parser Proper Typing** (`src/parser/markdown-parser.ts`):
  - Imported actual markdown-it types: `Token`, `StateInline`, `StateBlock`, `Renderer`
  - All render function callbacks now use `Renderer.RenderRule` type
  - Math render rules: `tokens: Token[]` with proper typing
  - Mermaid fence handler: Full type safety with `_options`, `_env`, `_self` parameters
  - Container render rules: Both standard containers and details/summary use proper types
  - All unused parameters properly marked with `_` prefix per ESLint conventions

### Improvements
- Complete elimination of ESLint warnings without using `eslint-disable` comments
- Improved code maintainability with proper TypeScript types throughout
- Better IDE support with full type inference for markdown-it integration
- All type imports come directly from markdown-it's official type definitions

### Verification
- ✅ Build: 0 errors
- ✅ Linting: 0 errors, 0 warnings (previously 15 warnings)
- ✅ Tests: 26/26 passing
- ✅ npm audit: 0 vulnerabilities

## [1.0.0] - 2026-01-03

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
