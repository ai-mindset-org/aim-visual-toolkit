import { useState, useEffect, useRef } from 'react';
import { X, Copy, Download, Check, FileText } from 'lucide-react';
import DOMPurify from 'dompurify';
import { toPng } from 'html-to-image';
import type { Metaphor } from '../../data/metaphors';
import { formatIndex, TOTAL_COUNT } from '../../data/metaphors';
import { downloadBlob, downloadBinaryBlob, MIME_TYPES } from '../../utils/download';
import StaticMetaphor from './StaticMetaphor';

const sanitizeSvg = (svg: string): string => {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feBlend', 'animate'],
    ADD_ATTR: ['xlink:href', 'href', 'clip-path', 'fill-opacity', 'stroke-opacity'],
  });
};

interface MetaphorModalProps {
  metaphor: Metaphor | null;
  onClose: () => void;
}

export default function MetaphorModal({ metaphor, onClose }: MetaphorModalProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && metaphor) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [metaphor, onClose]);

  useEffect(() => {
    if (metaphor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [metaphor]);

  if (!metaphor) return null;

  const handleCopySvg = async () => {
    try {
      let svg: string;
      if (metaphor.format === 'svg-inline' && metaphor.svg) {
        svg = metaphor.svg;
      } else if (metaphor.filename) {
        const response = await fetch(`/metaphors/${metaphor.filename}`);
        svg = await response.text();
      } else {
        return;
      }
      await navigator.clipboard.writeText(sanitizeSvg(svg));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      let svg: string;
      if (metaphor.format === 'svg-inline' && metaphor.svg) {
        svg = metaphor.svg;
      } else if (metaphor.filename) {
        const response = await fetch(`/metaphors/${metaphor.filename}`);
        svg = await response.text();
      } else {
        return;
      }
      downloadBlob(svg, `${metaphor.id}.svg`, MIME_TYPES.SVG);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleDownloadPng = async () => {
    if (!previewRef.current) return;

    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 4,
        backgroundColor: '#FFFFFF',
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      downloadBinaryBlob(blob, `${metaphor.id}.png`);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-w-3xl w-full bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white border border-[#e5e7eb] text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
        >
          <X size={16} />
        </button>

        {/* SVG Preview */}
        <div className="p-8 bg-[#fafafa]">
          <div
            ref={previewRef}
            className="aspect-square max-w-md mx-auto bg-white p-6"
          >
            {metaphor.format === 'svg-inline' && metaphor.svg ? (
              <div
                className="w-full h-full metaphor-container"
                dangerouslySetInnerHTML={{ __html: sanitizeSvg(metaphor.svg) }}
              />
            ) : metaphor.filename ? (
              <StaticMetaphor name={metaphor.filename} variant="cover" />
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 border-t border-[#e5e7eb]">
          {/* Title + Index */}
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-mono text-lg font-bold uppercase tracking-tight">
              {metaphor.titleEn}
            </h2>
            {metaphor.index && (
              <span className="font-mono text-sm text-[#a3a3a3]">
                {formatIndex(metaphor.index, TOTAL_COUNT)}
              </span>
            )}
          </div>

          {/* Description / Insight */}
          {metaphor.insight ? (
            <p className="text-sm text-[#525252] mb-4">{metaphor.insight}</p>
          ) : metaphor.description ? (
            <p className="text-sm text-[#525252] mb-4">{metaphor.description}</p>
          ) : null}

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-4">
            {metaphor.categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 font-mono text-[10px] uppercase bg-[#f5f5f5] text-[#525252]"
              >
                {cat}
              </span>
            ))}
            {metaphor.source === 'community' && metaphor.author && (
              <span className="px-2 py-0.5 font-mono text-[10px] uppercase bg-[#fef2f2] text-[#DC2626]">
                by {metaphor.author}
              </span>
            )}
          </div>

          {/* Prompt (if available) */}
          {metaphor.prompt && (
            <div className="mb-4">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-[#a3a3a3] hover:text-[#DC2626] transition-colors"
              >
                <FileText size={12} />
                {showPrompt ? 'Hide prompt' : 'Show prompt'}
              </button>
              {showPrompt && (
                <div className="mt-2 p-3 bg-[#fafafa] border border-[#e5e7eb]">
                  <p className="font-mono text-xs text-[#525252]">{metaphor.prompt}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopySvg}
              className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border transition-all ${
                copied
                  ? 'bg-[#22c55e] text-white border-[#22c55e]'
                  : 'bg-white text-[#525252] border-[#e5e7eb] hover:border-[#DC2626] hover:text-[#DC2626]'
              }`}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy SVG'}
            </button>

            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border border-[#e5e7eb] bg-white text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
            >
              <Download size={12} />
              SVG
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase bg-[#171717] text-white hover:bg-[#DC2626] transition-colors disabled:opacity-50"
            >
              <Download size={12} />
              {exporting ? 'Exporting...' : 'PNG 4x'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
