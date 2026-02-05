import DOMPurify from 'dompurify';

/**
 * DOMPurify config for SVG sanitization
 */
export const SVG_SANITIZE_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  ADD_TAGS: ['use', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feBlend', 'animate'],
  ADD_ATTR: ['xlink:href', 'href', 'clip-path', 'fill-opacity', 'stroke-opacity'],
};

/**
 * Sanitize SVG string for safe rendering
 */
export function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, SVG_SANITIZE_CONFIG);
}
