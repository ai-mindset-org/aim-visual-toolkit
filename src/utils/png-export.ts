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
 * Export SVG content to PNG using Canvas API
 * This approach bypasses html-to-image DOM quirks
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

  // Parse SVG to ensure correct dimensions
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) {
    throw new Error('Invalid SVG content');
  }

  // Ensure viewBox exists for proper scaling
  if (!svg.getAttribute('viewBox')) {
    const w = svg.getAttribute('width') || String(size);
    const h = svg.getAttribute('height') || String(size);
    svg.setAttribute('viewBox', `0 0 ${parseInt(w)} ${parseInt(h)}`);
  }

  // Set explicit dimensions
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));

  // Remove animations for static export
  svg.querySelectorAll('animate, animateTransform, animateMotion, set').forEach(el => el.remove());

  // Pause CSS animations
  const styleEl = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = '* { animation: none !important; transition: none !important; }';
  svg.insertBefore(styleEl, svg.firstChild);

  // Serialize back to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  // Create data URL
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  // Create canvas with high resolution
  const canvas = document.createElement('canvas');
  const outputSize = size * pixelRatio;
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(svgUrl);
    throw new Error('Failed to get canvas context');
  }

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, outputSize, outputSize);

  // Load SVG as image
  const img = new Image();
  img.width = size;
  img.height = size;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw SVG scaled to full canvas
      ctx.drawImage(img, 0, 0, outputSize, outputSize);
      URL.revokeObjectURL(svgUrl);

      // Export as PNG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadBinaryBlob(blob, `${filename}.png`);
            resolve();
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(svgUrl);
      console.error('Image load error:', e);
      reject(new Error('Failed to load SVG as image'));
    };

    img.src = svgUrl;
  });
}
