/**
 * Mermaid Theme Tests
 * Tests for proper Mermaid theme mapping and application
 */

import * as path from 'path';
import * as fs from 'fs';
import { Converter, createConverter } from '../src/converter';

const OUTPUT_DIR = path.join(__dirname, 'output');

// Ensure output directory exists
beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

describe('Mermaid Theme Mapping', () => {
  describe('theme configuration', () => {
    it('should map github theme to default Mermaid theme', () => {
      const converter = new Converter({
        theme: { name: 'github' },
      });
      const options = converter.getOptions();
      
      console.log('GitHub theme options:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('default');
    });

    it('should map github-dark theme to dark Mermaid theme', () => {
      const converter = new Converter({
        theme: { name: 'github-dark' },
      });
      const options = converter.getOptions();
      
      console.log('GitHub Dark theme options:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('dark');
    });

    it('should map vscode-light theme to default Mermaid theme', () => {
      const converter = new Converter({
        theme: { name: 'vscode-light' },
      });
      const options = converter.getOptions();
      
      console.log('VSCode Light theme options:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('default');
    });

    it('should map vscode-dark theme to dark Mermaid theme', () => {
      const converter = new Converter({
        theme: { name: 'vscode-dark' },
      });
      const options = converter.getOptions();
      
      console.log('VSCode Dark theme options:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('dark');
    });

    it('should use custom Mermaid theme if provided in options', () => {
      const converter = new Converter({
        theme: { name: 'github' },
        mermaid: { theme: 'forest' },
      });
      const options = converter.getOptions();
      
      console.log('Custom Mermaid theme options:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('forest');
    });

    it('should preserve other Mermaid options when setting theme', () => {
      const converter = new Converter({
        theme: { name: 'github-dark' },
        mermaid: { 
          fontFamily: 'monospace',
          theme: 'dark', // explicitly set
        },
      });
      const options = converter.getOptions();
      
      console.log('Mermaid options with fontFamily:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('dark');
      expect(options.mermaid?.fontFamily).toBe('monospace');
    });

    it('should set default Mermaid theme when no theme is specified', () => {
      const converter = new Converter();
      const options = converter.getOptions();
      
      console.log('Default Mermaid theme options:', JSON.stringify(options, null, 2));
      expect(options.mermaid?.theme).toBe('default');
    });
  });

  describe('conversion with Mermaid diagrams', () => {
    it('should convert markdown with flowchart using dark theme', async () => {
      const markdown = `
# Test Document

\`\`\`mermaid
flowchart TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`
`;
      
      const converter = new Converter({
        theme: { name: 'github-dark' },
      });

      const options = converter.getOptions();
      console.log('Dark theme mermaid options:', JSON.stringify(options.mermaid, null, 2));
      
      const buffer = await converter.convertString(markdown);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
      
      // Save output for manual inspection
      const outputPath = path.join(OUTPUT_DIR, 'mermaid-dark-flowchart.pdf');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ Dark theme PDF saved to ${outputPath}`);
    });

    it('should convert markdown with flowchart using light theme', async () => {
      const markdown = `
# Test Document

\`\`\`mermaid
flowchart TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`
`;
      
      const converter = new Converter({
        theme: { name: 'github' },
      });

      const options = converter.getOptions();
      console.log('Light theme mermaid options:', JSON.stringify(options.mermaid, null, 2));
      
      const buffer = await converter.convertString(markdown);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
      
      // Save output for manual inspection
      const outputPath = path.join(OUTPUT_DIR, 'mermaid-light-flowchart.pdf');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ Light theme PDF saved to ${outputPath}`);
    });

    it('should convert markdown with ER diagram using dark theme', async () => {
      const markdown = `
# ER Diagram Test

\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }o--|| DELIVERY-ADDRESS : uses
\`\`\`
`;
      
      const converter = new Converter({
        theme: { name: 'github-dark' },
      });

      const options = converter.getOptions();
      console.log('Dark theme for ER diagram:', JSON.stringify(options.mermaid, null, 2));
      
      const buffer = await converter.convertString(markdown);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
      
      // Save output for manual inspection
      const outputPath = path.join(OUTPUT_DIR, 'mermaid-dark-er.pdf');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ Dark theme ER PDF saved to ${outputPath}`);
    });

    it('should convert markdown with Gantt chart using light theme', async () => {
      const markdown = `
# Gantt Chart Test

\`\`\`mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Research :a1, 2024-01-01, 10d
    Design :a2, after a1, 15d
    section Development
    Backend :b1, after a2, 20d
    Frontend :b2, after a2, 20d
\`\`\`
`;
      
      const converter = new Converter({
        theme: { name: 'github' },
      });

      const options = converter.getOptions();
      console.log('Light theme for Gantt:', JSON.stringify(options.mermaid, null, 2));
      
      const buffer = await converter.convertString(markdown);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
      
      // Save output for manual inspection
      const outputPath = path.join(OUTPUT_DIR, 'mermaid-light-gantt.pdf');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ Light theme Gantt PDF saved to ${outputPath}`);
    });

    it('should convert markdown with state diagram using dark theme', async () => {
      const markdown = `
# State Diagram Test

\`\`\`mermaid
stateDiagram-v2
    [*] --> StandBy
    StandBy --> Active: Ready
    Active --> StandBy: Stop
    Active --> Finished: Done
    Finished --> [*]
\`\`\`
`;
      
      const converter = new Converter({
        theme: { name: 'github-dark' },
      });

      const options = converter.getOptions();
      console.log('Dark theme for State diagram:', JSON.stringify(options.mermaid, null, 2));
      
      const buffer = await converter.convertString(markdown);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
      
      // Save output for manual inspection
      const outputPath = path.join(OUTPUT_DIR, 'mermaid-dark-state.pdf');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ Dark theme State diagram PDF saved to ${outputPath}`);
    });
  });
});
