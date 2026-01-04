# Contributing to MD Preview PDF

First off, thank you for considering contributing to MD Preview PDF! It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (markdown files, configurations)
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (OS, Node.js version, package version)
- **Add screenshots** if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other tools** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project (ESLint configuration provided)
3. **Write clear commit messages** following conventional commits format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for test additions/changes
   - `refactor:` for code refactoring
   - `chore:` for maintenance tasks
4. **Update documentation** if you're changing functionality
5. **Add tests** if you're adding features
6. **Ensure all tests pass** by running `npm test`
7. **Update CHANGELOG.md** with your changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/md-preview-pdf.git
cd md-preview-pdf

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them:
   ```bash
   npm run build
   npm test
   npm run dev -- tests/samples/comprehensive-test.md
   ```

3. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request on GitHub

## Coding Guidelines

### TypeScript Style

- Use **TypeScript** for all new code
- Follow the existing **ESLint** configuration
- Use **explicit types** for function parameters and return values
- Prefer **interfaces** over type aliases for object shapes
- Use **const** for variables that don't change
- Use **async/await** over promises chains

### Code Organization

- Keep functions **small and focused** (single responsibility)
- **Extract reusable logic** into utility functions
- Add **JSDoc comments** for public APIs
- Use **descriptive variable names**
- Organize imports: Node.js built-ins → third-party → local

### Testing

- Write **unit tests** for utility functions
- Write **integration tests** for the converter
- Test with **various markdown features**
- Test **error cases** and edge conditions
- Aim for **>80% code coverage**

### Documentation

- Update **README.md** for user-facing changes
- Update **ARCHITECTURE.md** for architectural changes
- Add **JSDoc comments** for public APIs
- Include **examples** in documentation
- Keep documentation **clear and concise**

## Project Structure

```
md-preview-pdf/
├── src/
│   ├── index.ts           # Main entry point and exports
│   ├── cli.ts             # Command-line interface
│   ├── converter.ts       # Main converter class
│   ├── parser/            # Markdown parsing logic
│   ├── renderers/         # HTML, PDF, and Mermaid rendering
│   ├── themes/            # CSS themes
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── tests/
│   ├── samples/           # Test markdown files
│   └── *.test.ts          # Test files
├── .github/
│   └── workflows/         # CI/CD workflows
└── docs/                  # Additional documentation
```

## Testing Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code builds successfully (`npm run build`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] No console.log() statements left in code
- [ ] New features have tests
- [ ] All commits follow conventional commits format

## Questions?

Feel free to:
- Open an issue for discussion
- Join our community discussions
- Reach out to the maintainers

Thank you for contributing! 🎉
