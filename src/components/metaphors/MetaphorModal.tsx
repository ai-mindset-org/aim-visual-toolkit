import { useState, useEffect } from 'react';
import { X, Copy, Download, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Metaphor } from '../../data/metaphors';
import { downloadBlob, MIME_TYPES } from '../../utils/download';
import { sanitizeSvg } from '../../utils/svg-utils';
import { exportSvgToPng } from '../../utils/png-export';
import StaticMetaphor from './StaticMetaphor';

interface MetaphorModalProps {
  metaphor: Metaphor | null;
  onClose: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
}

export default function MetaphorModal({
  metaphor,
  onClose,
  isSaved = false,
  onSave,
  onRemove,
}: MetaphorModalProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    setExporting(true);
    try {
      // Get SVG content
      let svg: string;
      if (metaphor.format === 'svg-inline' && metaphor.svg) {
        svg = metaphor.svg;
      } else if (metaphor.filename) {
        const response = await fetch(`/metaphors/${metaphor.filename}`);
        svg = await response.text();
      } else {
        return;
      }

      await exportSvgToPng(sanitizeSvg(svg), {
        filename: metaphor.id,
        backgroundColor: '#FFFFFF',
      });
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
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
        >
          <X size={20} />
        </button>

        {/* SVG Preview with frame */}
        <div className="p-8 bg-neutral-100">
          <div className="aspect-square max-w-md mx-auto bg-white border border-neutral-200 rounded-lg p-6">
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
        <div className="px-8 pb-8 text-center">
          <h2 className="text-2xl font-bold mb-1">{metaphor.title}</h2>
          <p className="text-sm text-neutral-500 font-mono uppercase mb-4">{metaphor.titleEn}</p>

          {metaphor.description && (
            <p className="text-neutral-600 max-w-xl mx-auto mb-2">{metaphor.description}</p>
          )}

          {metaphor.insight && (
            <p className="text-neutral-500 text-sm max-w-xl mx-auto mb-4">{metaphor.insight}</p>
          )}

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-1 mb-6">
            {metaphor.categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 font-mono text-[10px] uppercase bg-neutral-100 text-neutral-500 rounded-lg"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {/* Save/Remove button */}
            {(onSave || onRemove) && (
              <button
                onClick={isSaved ? onRemove : onSave}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSaved
                    ? 'bg-[#DC2626] text-white hover:bg-[#DC2626]/90'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                {isSaved ? 'Remove' : 'Save'}
              </button>
            )}

            <button
              onClick={handleCopySvg}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy SVG'}
            </button>

            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all"
            >
              <Download size={16} />
              SVG
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-[#DC2626] transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {exporting ? 'Exporting...' : 'Download PNG'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
