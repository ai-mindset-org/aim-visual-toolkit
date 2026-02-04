/**
 * Download Utilities
 */

export const MIME_TYPES = {
  MARKDOWN: 'text/markdown;charset=utf-8',
  SVG: 'image/svg+xml',
  TEXT: 'text/plain;charset=utf-8',
  JSON: 'application/json',
  PNG: 'image/png',
} as const;

/**
 * Download content as a file
 */
export function downloadBlob(
  content: string,
  filename: string,
  mimeType: string = MIME_TYPES.TEXT
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download a file from a URL path
 */
export function downloadFromUrl(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download a pre-created Blob
 */
export function downloadBinaryBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download SVG content
 */
export function downloadSVG(content: string, filename: string): void {
  downloadBlob(content, filename, MIME_TYPES.SVG);
}
