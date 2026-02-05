import { toPng } from 'html-to-image';
import { downloadBinaryBlob } from './download';

export interface PngExportOptions {
  /** Output filename (without extension) */
  filename: string;
  /** Background color (default: white) */
  backgroundColor?: string;
  /** Pixel ratio for high-res output (default: 4 = 4x resolution) */
  pixelRatio?: number;
  /** Export size in pixels (default: 800) */
  size?: number;
}

/**
 * Export SVG content to PNG file
 * Creates a clean render at native SVG size
 */
export async function exportSvgToPng(
  svgContent: string,
  options: PngExportOptions
): Promise<void> {
  const {
    filename,
    backgroundColor = '#FFFFFF',
    pixelRatio = 4,
    size = 800,
  } = options;

  // Create temporary container
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${size}px;
    height: ${size}px;
    background: ${backgroundColor};
    overflow: hidden;
  `;

  // Insert SVG
  container.innerHTML = svgContent;

  // Force SVG to fill container exactly
  const svg = container.querySelector('svg');
  if (svg) {
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.style.display = 'block';
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
  }

  document.body.appendChild(container);

  // Wait for fonts and animations to settle
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const dataUrl = await toPng(container, {
      pixelRatio,
      backgroundColor,
      width: size,
      height: size,
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    downloadBinaryBlob(blob, `${filename}.png`);
  } finally {
    document.body.removeChild(container);
  }
}
