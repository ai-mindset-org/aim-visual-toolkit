#!/usr/bin/env node
/**
 * Convert og-cover.svg to og-cover.png for social media compatibility
 * Usage: node scripts/convert-og-image.js
 *
 * This script reads the SVG, creates an HTML wrapper, and uses Puppeteer
 * to render it as a PNG at the correct dimensions (1200x630).
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');
const svgPath = join(publicDir, 'og-cover.svg');
const pngPath = join(publicDir, 'og-cover.png');

async function convertSvgToPng() {
  console.log('Converting og-cover.svg to og-cover.png...');

  // Read the SVG content
  const svgContent = readFileSync(svgPath, 'utf-8');

  // Create HTML wrapper with embedded SVG
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: 1200px;
          height: 630px;
          overflow: hidden;
        }
        svg {
          width: 1200px;
          height: 630px;
        }
      </style>
    </head>
    <body>
      ${svgContent}
    </body>
    </html>
  `;

  try {
    // Try to use Puppeteer
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 }
    });

    writeFileSync(pngPath, screenshot);
    await browser.close();

    console.log(`Successfully created: ${pngPath}`);
  } catch (puppeteerError) {
    console.log('Puppeteer not available, trying alternative method...');

    try {
      // Try sharp as fallback
      const sharp = await import('sharp');

      // Convert SVG buffer directly
      const svgBuffer = Buffer.from(svgContent);
      await sharp.default(svgBuffer)
        .resize(1200, 630)
        .png()
        .toFile(pngPath);

      console.log(`Successfully created: ${pngPath}`);
    } catch (sharpError) {
      console.error('Neither Puppeteer nor Sharp available.');
      console.error('Please install one of them:');
      console.error('  npm install puppeteer');
      console.error('  or');
      console.error('  npm install sharp');
      process.exit(1);
    }
  }
}

convertSvgToPng().catch(console.error);
