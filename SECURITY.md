# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of MD Preview PDF seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:
- **Email**: anuragkr29@outlook.com
- **Subject**: [SECURITY] MD Preview PDF - Brief Description

### What to Include

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

After you submit a report, you can expect:

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: We'll provide an initial assessment within 5 business days
- **Updates**: We'll keep you informed of our progress
- **Fix & Disclosure**: Once the issue is fixed, we'll work with you on disclosure timing

### Preferred Languages

We prefer all communications to be in English.

## Security Best Practices

When using MD Preview PDF:

1. **Input Validation**: Always validate and sanitize markdown input, especially when processing user-generated content
2. **File Paths**: Use absolute paths and validate file locations to prevent directory traversal attacks
3. **Resource Limits**: Set appropriate timeouts and resource limits when processing large documents
4. **Updates**: Keep the package and its dependencies up to date
5. **Sandbox**: Consider running the converter in a sandboxed environment if processing untrusted input

## Known Security Considerations

### Puppeteer and Chromium

This package uses Puppeteer, which downloads and runs a full Chromium browser. Key security considerations:

- Chromium is regularly updated for security patches
- The browser runs in headless mode with limited privileges
- Network access is controlled but not completely disabled
- Consider running in a containerized environment for untrusted input

### Markdown Processing

- HTML tags in markdown are processed by default
- Consider using sanitization libraries for user-generated content
- Be cautious with custom CSS that may contain malicious code
- Validate external resources (images, links) before processing

### File System Access

- The tool requires read access to input files
- It requires write access to output directories
- Ensure proper file permissions in your environment
- Validate all file paths to prevent unauthorized access

## Disclosure Policy

- We follow responsible disclosure practices
- We aim to patch confirmed vulnerabilities within 30 days
- We'll publicly acknowledge security researchers who report valid issues (unless they prefer to remain anonymous)
- We'll coordinate disclosure timing with the reporter

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.

## Updates

This security policy may be updated periodically. Significant changes will be announced in release notes.

---

Last Updated: January 3, 2026
