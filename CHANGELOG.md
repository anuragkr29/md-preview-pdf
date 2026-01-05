# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [1.0.1] - 2026-01-04

### Fixed
- **Resolved all npm deprecation warnings from direct dependencies**
  - Previously warned about @humanwhocodes/config-array and @humanwhocodes/object-schema (ESLint v8 dependencies)
  - Previously warned about inflight, rimraf@3, glob@7, and eslint@8.57.1
- Upgraded ESLint from v8.57.0 → v9.0.0 (latest stable, fully supported)
- Upgraded @typescript-eslint/parser from v6.17.0 → v8.0.0 (latest compatible)
- Upgraded @typescript-eslint/eslint-plugin from v6.17.0 → v8.0.0 (latest compatible)
- Upgraded TypeScript from v5.3.3 → v5.4.5 (latest stable)
- Upgraded all other dev dependencies to latest stable versions
- Fixed ESLint configuration for v9 compatibility

### Changed
- **ESLint Configuration**: Migrated from old config format (.eslintrc.js) to new flat config format (eslint.config.js)
- ESLint config properly handles:
  - JavaScript config files (eslint.config.js, jest.config.js) with CommonJS require statements
  - TypeScript source files (src/**/*.ts) with full type checking
  - Test files (tests/**/*.ts) without type project validation
- Updated ECMAScript version target to 2024
- Added typescript-eslint package for proper ESLint v9 support
- Removed unused `convert` import from tests

### Improvements
- All direct npm dependencies now use latest stable versions with no known vulnerabilities
- ESLint security patches (v9 has critical security improvements over v8)
- Cleaner dependency management with no deprecated warnings from direct dependencies
- Better type safety and linting rules with @typescript-eslint v8

### Technical Details
**Transitive Dependencies Note:** Remaining npm warnings from `inflight@1.0.6` and `glob@7.2.3` are from transitive dependencies used by Jest. These are indirect and cannot be controlled directly (Jest still uses these older tools). No direct dependencies produce warnings.

**Verification:**
- ✅ All 26 tests passing
- ✅ Build successful with TypeScript 5.4.5
- ✅ ESLint: 0 errors (2 warnings are intentional: any type usage in CLI)
- ✅ npm audit: 0 vulnerabilities
- ✅ npm ci: Clean install with only transitive deprecation warnings

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
