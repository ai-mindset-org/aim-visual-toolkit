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
 * Export SVG content to PNG file using Canvas
 * Removes animations for clean static export
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

  // Remove CSS animations and set elements to final state
  let cleanSvg = svgContent
    // Remove @keyframes blocks
    .replace(/@keyframes[^}]+\{[^}]+\}[^}]*\}/g, '')
    // Remove animation properties
    .replace(/animation:[^;}"]+[;"]?/g, '')
    .replace(/animation-[a-z-]+:[^;}"]+[;"]?/g, '')
    // Remove transform that might offset elements
    .replace(/transform:\s*translateY\([^)]+\)/g, '')
    // Ensure full opacity
    .replace(/opacity:\s*0[^0-9]/g, 'opacity: 1;');

  // Ensure SVG has correct dimensions
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanSvg, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (svg) {
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    // Ensure viewBox exists
    if (!svg.getAttribute('viewBox')) {
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    }
  }

  const serializer = new XMLSerializer();
  cleanSvg = serializer.serializeToString(doc);

  // Create canvas
  const canvas = document.createElement('canvas');
  const outputSize = size * pixelRatio;
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, outputSize, outputSize);

  // Create image from SVG
  const img = new Image();
  const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw SVG scaled to canvas
      ctx.drawImage(img, 0, 0, outputSize, outputSize);
      URL.revokeObjectURL(url);

      // Export as PNG
      canvas.toBlob(
        (pngBlob) => {
          if (pngBlob) {
            downloadBinaryBlob(pngBlob, `${filename}.png`);
            resolve();
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG as image'));
    };

    img.src = url;
  });
}
