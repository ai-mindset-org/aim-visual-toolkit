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

/**
 * Fix SVG for strict XML parsing.
 *
 * Wraps <style> content in CDATA sections so that characters like & in URLs
 * (e.g. Google Fonts @import) don't break XML parsers.
 * Also fixes bare & in attribute values.
 *
 * This ensures SVG files open correctly in all browsers and tools.
 */
export function fixSvgForXml(svg: string): string {
  // Wrap <style> content in CDATA if not already wrapped
  let fixed = svg.replace(
    /<style([^>]*)>([\s\S]*?)<\/style>/gi,
    (_match, attrs: string, content: string) => {
      const trimmed = content.trim();
      if (trimmed.startsWith('<![CDATA[')) return _match;
      return `<style${attrs}><![CDATA[\n${trimmed}\n]]></style>`;
    }
  );

  // Fix bare & in attribute values (& not followed by amp;/lt;/gt;/quot;/apos;/#)
  // Only target attribute values, not CDATA or text nodes
  fixed = fixed.replace(
    /(<[^>]+?)(\w+="[^"]*?")/g,
    (_match, prefix: string, attr: string) => {
      const fixedAttr = attr.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g, '&amp;');
      return prefix + fixedAttr;
    }
  );

  return fixed;
}
