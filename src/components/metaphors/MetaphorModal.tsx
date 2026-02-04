import { useState, useEffect, useRef } from 'react';
import { X, Copy, Download, Check, Image } from 'lucide-react';
import DOMPurify from 'dompurify';
import { toPng } from 'html-to-image';
import type { Metaphor } from '../../data/metaphors';
import { downloadBlob, downloadBinaryBlob, MIME_TYPES } from '../../utils/download';
import StaticMetaphor from './StaticMetaphor';

// Configure DOMPurify for SVG
const sanitizeSvg = (svg: string): string => {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feBlend'],
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
  const previewRef = useRef<HTMLDivElement>(null);
  const isOpen = metaphor !== null;

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && metaphor) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [metaphor, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!metaphor) return null;

  const handleCopySvg = async () => {
    try {
      const response = await fetch(`/metaphors/${metaphor.filename}`);
      const svg = await response.text();
      await navigator.clipboard.writeText(sanitizeSvg(svg));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      const response = await fetch(`/metaphors/${metaphor.filename}`);
      const svg = await response.text();
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
        pixelRatio: 4, // 4x resolution
        backgroundColor: '#FFFFFF',
      });

      // Convert data URL to blob
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
        aria-labelledby="metaphor-modal-title"
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
        >
          <X size={20} />
        </button>

        {/* SVG Preview */}
        <div className="p-8 bg-aim-gray-50">
          <div
            ref={previewRef}
            className="aspect-square max-w-lg mx-auto bg-white rounded-lg p-4"
          >
            <StaticMetaphor name={metaphor.filename || metaphor.id} variant="cover" />
          </div>
        </div>

        {/* Info */}
        <div className="px-8 pb-8 pt-6 text-center">
          <h2 id="metaphor-modal-title" className="text-2xl font-bold mb-1">
            {metaphor.title}
          </h2>
          <p className="text-sm text-aim-gray-500 font-mono mb-4">{metaphor.titleEn}</p>
          {metaphor.insight && (
            <p className="text-aim-gray-600 max-w-xl mx-auto">{metaphor.insight}</p>
          )}
          {metaphor.description && !metaphor.insight && (
            <p className="text-aim-gray-600 max-w-xl mx-auto">{metaphor.description}</p>
          )}

          {/* Category badges */}
          <div className="flex justify-center gap-2 mt-4">
            {metaphor.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-xs font-mono bg-aim-gray-100 text-aim-gray-600 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
            {/* Copy SVG button */}
            <button
              onClick={handleCopySvg}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-aim-gray-100 text-aim-gray-700 hover:bg-aim-gray-200'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy SVG'}
            </button>

            {/* Download SVG button */}
            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-aim-gray-100 text-aim-gray-700 hover:bg-aim-gray-200 transition-all"
            >
              <Download size={16} />
              Download SVG
            </button>

            {/* Download PNG button */}
            <button
              onClick={handleDownloadPng}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-aim-black text-white hover:bg-aim-gray-800 transition-all disabled:opacity-50"
            >
              <Image size={16} />
              {exporting ? 'Exporting...' : 'Download PNG (4x)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
