import { useState } from 'react';
import { Copy, Download, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Metaphor } from '../../data/metaphors';
import { downloadBlob, downloadFromUrl, MIME_TYPES } from '../../utils/download';
import StaticMetaphor from './StaticMetaphor';

interface MetaphorCardProps {
  metaphor: Metaphor;
  showLabel?: boolean;
  onClick?: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
}

export default function MetaphorCard({
  metaphor,
  showLabel = true,
  onClick,
  isSaved = false,
  onSave,
  onRemove,
}: MetaphorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (metaphor.format === 'svg-inline' && metaphor.svg) {
      downloadBlob(metaphor.svg, `${metaphor.id}.svg`, MIME_TYPES.SVG);
    } else if (metaphor.filename) {
      downloadFromUrl(`/metaphors/${metaphor.filename}`, metaphor.filename.split('/').pop() || `${metaphor.id}.svg`);
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      onRemove?.();
    } else {
      onSave?.();
    }
  };

  return (
    <div
      className="group relative rounded-xl border bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border-neutral-200 hover:border-neutral-300 cursor-pointer"
      onClick={onClick}
    >
      {/* SVG Preview */}
      <div className="aspect-square p-4 flex items-center justify-center bg-white relative">
        {metaphor.format === 'svg-inline' && metaphor.svg ? (
          <div
            className="metaphor-container w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
            dangerouslySetInnerHTML={{ __html: metaphor.svg }}
          />
        ) : metaphor.filename ? (
          <StaticMetaphor name={metaphor.filename} variant="cover" className="opacity-90 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
            <span className="text-xs font-mono text-center">Coming soon</span>
          </div>
        )}
      </div>

      {/* Info */}
      {showLabel && (
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-medium text-sm text-neutral-900">{metaphor.title}</h3>
              <p className="text-[10px] text-neutral-400 font-mono uppercase">{metaphor.titleEn}</p>
            </div>

            {/* Save button */}
            {(onSave || onRemove) && (
              <button
                onClick={handleSaveToggle}
                className={`shrink-0 p-1.5 rounded-lg transition-all ${
                  isSaved
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
                title={isSaved ? 'Remove from collection' : 'Save to collection'}
              >
                {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{metaphor.description}</p>

          {/* Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleCopySvg}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded-lg border transition-all ${
                copied
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600'
              }`}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600 transition-all"
            >
              <Download size={10} />
              SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
