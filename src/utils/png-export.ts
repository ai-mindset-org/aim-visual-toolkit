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
 * Replicates website rendering: container + CSS rules
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

  // Create container matching website layout
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

  // Inner div matching .metaphor-container behavior
  const inner = document.createElement('div');
  inner.style.cssText = `
    width: 100%;
    height: 100%;
  `;
  inner.innerHTML = svgContent;

  // Apply CSS rules that website uses: .metaphor-container svg { width: 100%; height: 100%; }
  const svg = inner.querySelector('svg');
  if (svg) {
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';

    // Pause animations
    svg.style.setProperty('animation-play-state', 'paused', 'important');

    // Add pause style for all descendants
    const style = document.createElement('style');
    style.textContent = `
      * { animation-play-state: paused !important; }
      animate, animateTransform, animateMotion { display: none !important; }
    `;
    svg.prepend(style);
  }

  container.appendChild(inner);
  document.body.appendChild(container);

  // Wait for fonts and layout
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const dataUrl = await toPng(container, {
      pixelRatio,
      backgroundColor,
      width: size,
      height: size,
      cacheBust: true,
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    downloadBinaryBlob(blob, `${filename}.png`);
  } finally {
    document.body.removeChild(container);
  }
}
