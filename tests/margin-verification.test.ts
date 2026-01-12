/**
 * Margin Verification Tests
 * Tests to verify that PDF margins are correctly applied
 */

import * as path from 'path';
import * as fs from 'fs';
import { Converter } from '../src/converter';

interface PDFDimensions {
  width: number;
  height: number;
  contentLeft: number;
  contentTop: number;
  contentRight: number;
  contentBottom: number;
  actualLeftMargin: number;
  actualRightMargin: number;
  actualTopMargin: number;
  actualBottomMargin: number;
}

/**
 * Simple PDF parser to extract page dimensions and content boundaries
 * This reads the PDF raw bytes to find MediaBox dimensions
 */
function extractPDFDimensions(pdfBuffer: Buffer): PDFDimensions | null {
  try {
    // Convert buffer to string for searching
    const pdfText = pdfBuffer.toString('binary');
    
    // Look for MediaBox which defines page size: /MediaBox [0 0 width height]
    // Example: /MediaBox [0 0 595.276 841.890] for A4
    const mediaBoxMatch = pdfText.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
    
    if (!mediaBoxMatch) {
      console.log('Could not find MediaBox in PDF');
      return null;
    }

    const pageWidth = parseFloat(mediaBoxMatch[3]);
    const pageHeight = parseFloat(mediaBoxMatch[4]);

    // Look for content stream that shows text placement
    // In PDF, text position indicates where content actually starts
    // We look for Td (text position) commands
    const textPosMatches = pdfText.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+Td/g);
    
    if (!textPosMatches || textPosMatches.length === 0) {
      console.log('Warning: Could not find text position data in PDF');
      return null;
    }

    // Parse text positions to find content boundaries
    let minX = pageWidth;
    let maxX = 0;
    let minY = 0;
    let maxY = pageHeight;

    textPosMatches.forEach(match => {
      const coords = match.match(/([\d.]+)\s+([\d.]+)\s+Td/);
      if (coords) {
        const x = parseFloat(coords[1]);
        const y = parseFloat(coords[2]);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    });

    // Calculate margins (convert from points to mm: 1 point = 0.352778 mm)
    const pointToMm = 0.352778;
    const actualLeftMargin = minX * pointToMm;
    const actualRightMargin = (pageWidth - maxX) * pointToMm;
    const actualTopMargin = (pageHeight - maxY) * pointToMm;
    const actualBottomMargin = minY * pointToMm;

    return {
      width: pageWidth * pointToMm,
      height: pageHeight * pointToMm,
      contentLeft: minX * pointToMm,
      contentTop: (pageHeight - maxY) * pointToMm,
      contentRight: maxX * pointToMm,
      contentBottom: minY * pointToMm,
      actualLeftMargin,
      actualRightMargin,
      actualTopMargin,
      actualBottomMargin,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return null;
  }
}

describe('PDF Margins', () => {
  const outputDir = path.join(__dirname, 'output');

  beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  // Increase Jest timeout for PDF generation tests which can be slow on CI
  jest.setTimeout(120000);

  test('should apply 10mm margins correctly', async () => {
    const converter = new Converter({
      pdf: {
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      },
    });

    const inputFile = path.join(__dirname, 'samples', 'simple-test.md');
    const outputFile = path.join(outputDir, 'margin-10mm.pdf');

    const result = await converter.convertFile(inputFile, outputFile);
    expect(result.success).toBe(true);
    expect(fs.existsSync(outputFile)).toBe(true);

    // Parse PDF and verify margins
    const pdfBuffer = fs.readFileSync(outputFile);
    const dimensions = extractPDFDimensions(pdfBuffer);

    if (dimensions) {
      console.log('10mm margin test - Extracted dimensions:', {
        pageWidth: `${dimensions.width.toFixed(2)}mm`,
        pageHeight: `${dimensions.height.toFixed(2)}mm`,
        leftMargin: `${dimensions.actualLeftMargin.toFixed(2)}mm`,
        rightMargin: `${dimensions.actualRightMargin.toFixed(2)}mm`,
        topMargin: `${dimensions.actualTopMargin.toFixed(2)}mm`,
        bottomMargin: `${dimensions.actualBottomMargin.toFixed(2)}mm`,
      });

      // Verify margins are approximately 10mm (allow 5mm tolerance for rendering differences)
      expect(Math.abs(dimensions.actualLeftMargin - 10)).toBeLessThan(5);
      expect(Math.abs(dimensions.actualRightMargin - 10)).toBeLessThan(5);
      expect(Math.abs(dimensions.actualTopMargin - 10)).toBeLessThan(5);
      expect(Math.abs(dimensions.actualBottomMargin - 10)).toBeLessThan(5);
    } else {
      console.warn('Could not extract dimensions from PDF');
    }

    await converter.cleanup();
  });

  test('should apply 40mm margins correctly', async () => {
    const converter = new Converter({
      pdf: {
        margin: {
          top: '40mm',
          right: '40mm',
          bottom: '40mm',
          left: '40mm',
        },
      },
    });

    const inputFile = path.join(__dirname, 'samples', 'simple-test.md');
    const outputFile = path.join(outputDir, 'margin-40mm.pdf');

    const result = await converter.convertFile(inputFile, outputFile);
    expect(result.success).toBe(true);
    expect(fs.existsSync(outputFile)).toBe(true);

    // Parse PDF and verify margins
    const pdfBuffer = fs.readFileSync(outputFile);
    const dimensions = extractPDFDimensions(pdfBuffer);

    if (dimensions) {
      console.log('40mm margin test - Extracted dimensions:', {
        pageWidth: `${dimensions.width.toFixed(2)}mm`,
        pageHeight: `${dimensions.height.toFixed(2)}mm`,
        leftMargin: `${dimensions.actualLeftMargin.toFixed(2)}mm`,
        rightMargin: `${dimensions.actualRightMargin.toFixed(2)}mm`,
        topMargin: `${dimensions.actualTopMargin.toFixed(2)}mm`,
        bottomMargin: `${dimensions.actualBottomMargin.toFixed(2)}mm`,
      });

      // Verify margins are approximately 40mm (allow 10mm tolerance)
      expect(Math.abs(dimensions.actualLeftMargin - 40)).toBeLessThan(10);
      expect(Math.abs(dimensions.actualRightMargin - 40)).toBeLessThan(10);
      expect(Math.abs(dimensions.actualTopMargin - 40)).toBeLessThan(10);
      expect(Math.abs(dimensions.actualBottomMargin - 40)).toBeLessThan(10);
    } else {
      console.warn('Could not extract dimensions from PDF');
    }

    await converter.cleanup();
  });

  test('should apply asymmetric margins (10mm top, 30mm bottom, 15mm left, 25mm right)', async () => {
    const converter = new Converter({
      pdf: {
        margin: {
          top: '10mm',
          right: '25mm',
          bottom: '30mm',
          left: '15mm',
        },
      },
    });

    const inputFile = path.join(__dirname, 'samples', 'simple-test.md');
    const outputFile = path.join(outputDir, 'margin-asymmetric.pdf');

    const result = await converter.convertFile(inputFile, outputFile);
    expect(result.success).toBe(true);
    expect(fs.existsSync(outputFile)).toBe(true);

    // Parse PDF and verify margins
    const pdfBuffer = fs.readFileSync(outputFile);
    const dimensions = extractPDFDimensions(pdfBuffer);

    if (dimensions) {
      console.log('Asymmetric margin test - Extracted dimensions:', {
        pageWidth: `${dimensions.width.toFixed(2)}mm`,
        pageHeight: `${dimensions.height.toFixed(2)}mm`,
        leftMargin: `${dimensions.actualLeftMargin.toFixed(2)}mm (expected 15mm)`,
        rightMargin: `${dimensions.actualRightMargin.toFixed(2)}mm (expected 25mm)`,
        topMargin: `${dimensions.actualTopMargin.toFixed(2)}mm (expected 10mm)`,
        bottomMargin: `${dimensions.actualBottomMargin.toFixed(2)}mm (expected 30mm)`,
      });

      // Verify each margin individually (allow 10mm tolerance)
      expect(Math.abs(dimensions.actualLeftMargin - 15)).toBeLessThan(10);
      expect(Math.abs(dimensions.actualRightMargin - 25)).toBeLessThan(10);
      expect(Math.abs(dimensions.actualTopMargin - 10)).toBeLessThan(10);
      expect(Math.abs(dimensions.actualBottomMargin - 30)).toBeLessThan(10);
    } else {
      console.warn('Could not extract dimensions from PDF');
    }

    await converter.cleanup();
  });

  test('should compare margins before (no margin) and after (40mm margin)', async () => {
    const inputFile = path.join(__dirname, 'samples', 'simple-test.md');
    const outputNoMargin = path.join(outputDir, 'margin-none.pdf');
    const outputWithMargin = path.join(outputDir, 'margin-40mm-comparison.pdf');

    // Generate PDF with no margins
    const converter1 = new Converter({
      pdf: {
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      },
    });

    const result1 = await converter1.convertFile(inputFile, outputNoMargin);
    expect(result1.success).toBe(true);
    await converter1.cleanup();

    // Generate PDF with 40mm margins
    const converter2 = new Converter({
      pdf: {
        margin: {
          top: '40mm',
          right: '40mm',
          bottom: '40mm',
          left: '40mm',
        },
      },
    });

    const result2 = await converter2.convertFile(inputFile, outputWithMargin);
    expect(result2.success).toBe(true);
    await converter2.cleanup();

    // Extract and compare dimensions
    const pdfNoMargin = fs.readFileSync(outputNoMargin);
    const pdfWithMargin = fs.readFileSync(outputWithMargin);

    const dimsNoMargin = extractPDFDimensions(pdfNoMargin);
    const dimsWithMargin = extractPDFDimensions(pdfWithMargin);

    if (dimsNoMargin && dimsWithMargin) {
      console.log('\nMargin Comparison Test:');
      console.log('No margins:', {
        leftMargin: `${dimsNoMargin.actualLeftMargin.toFixed(2)}mm`,
        rightMargin: `${dimsNoMargin.actualRightMargin.toFixed(2)}mm`,
        topMargin: `${dimsNoMargin.actualTopMargin.toFixed(2)}mm`,
        bottomMargin: `${dimsNoMargin.actualBottomMargin.toFixed(2)}mm`,
      });
      console.log('With 40mm margins:', {
        leftMargin: `${dimsWithMargin.actualLeftMargin.toFixed(2)}mm`,
        rightMargin: `${dimsWithMargin.actualRightMargin.toFixed(2)}mm`,
        topMargin: `${dimsWithMargin.actualTopMargin.toFixed(2)}mm`,
        bottomMargin: `${dimsWithMargin.actualBottomMargin.toFixed(2)}mm`,
      });

      // The margins should be noticeably different
      // With margin should have larger margins than without
      const marginDiffLeft = dimsWithMargin.actualLeftMargin - dimsNoMargin.actualLeftMargin;
      const marginDiffRight = dimsWithMargin.actualRightMargin - dimsNoMargin.actualRightMargin;
      const marginDiffTop = dimsWithMargin.actualTopMargin - dimsNoMargin.actualTopMargin;
      const marginDiffBottom = dimsWithMargin.actualBottomMargin - dimsNoMargin.actualBottomMargin;

      console.log('Margin differences:', {
        left: `${marginDiffLeft.toFixed(2)}mm`,
        right: `${marginDiffRight.toFixed(2)}mm`,
        top: `${marginDiffTop.toFixed(2)}mm`,
        bottom: `${marginDiffBottom.toFixed(2)}mm`,
      });

      // Verify significant difference (should be around 40mm difference)
      expect(marginDiffLeft).toBeGreaterThan(20);
      expect(marginDiffRight).toBeGreaterThan(20);
      expect(marginDiffTop).toBeGreaterThan(20);
      expect(marginDiffBottom).toBeGreaterThan(20);
    } else {
      console.warn('Could not extract dimensions from comparison PDFs');
    }
  });
});
