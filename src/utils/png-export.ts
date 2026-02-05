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
 * Creates a clean render without borders/padding
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

  // Create temporary container for clean render
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${size}px;
    height: ${size}px;
    background: ${backgroundColor};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    box-sizing: border-box;
  `;

  // Inner SVG container
  const inner = document.createElement('div');
  inner.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  inner.innerHTML = svgContent;

  // Style the SVG to fit
  const svg = inner.querySelector('svg');
  if (svg) {
    svg.style.maxWidth = '100%';
    svg.style.maxHeight = '100%';
    svg.style.width = 'auto';
    svg.style.height = 'auto';
  }

  container.appendChild(inner);
  document.body.appendChild(container);

  try {
    const dataUrl = await toPng(container, {
      pixelRatio,
      backgroundColor,
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    downloadBinaryBlob(blob, `${filename}.png`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Export element to PNG (for preview containers)
 * Note: Will include element's borders/padding
 */
export async function exportElementToPng(
  element: HTMLElement,
  filename: string,
  backgroundColor = '#FFFFFF',
  pixelRatio = 4
): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio,
    backgroundColor,
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  downloadBinaryBlob(blob, `${filename}.png`);
}
