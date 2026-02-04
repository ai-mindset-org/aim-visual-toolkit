import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import type { Metaphor } from '../../data/metaphors';
import { formatIndex, TOTAL_COUNT } from '../../data/metaphors';
import { downloadBlob, downloadFromUrl, MIME_TYPES } from '../../utils/download';
import StaticMetaphor from './StaticMetaphor';

type ViewMode = 'compact' | 'detailed';

interface MetaphorCardProps {
  metaphor: Metaphor;
  viewMode?: ViewMode;
  showTitle?: boolean;
  showIndex?: boolean;
}

export default function MetaphorCard({
  metaphor,
  viewMode = 'compact',
  showTitle = true,
  showIndex = true,
}: MetaphorCardProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const isCompact = viewMode === 'compact';

  return (
    <div
      className="group relative bg-white border border-[#e5e7eb] hover:border-[#DC2626] transition-all duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SVG Preview */}
      <div className={`${isCompact ? 'aspect-square' : 'aspect-[4/3]'} p-4 flex items-center justify-center bg-white relative`}>
        {metaphor.format === 'svg-inline' && metaphor.svg ? (
          <div
            className="w-full h-full metaphor-container"
            dangerouslySetInnerHTML={{ __html: metaphor.svg }}
          />
        ) : metaphor.filename ? (
          <StaticMetaphor name={metaphor.filename} variant="cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#a3a3a3]">
            <span className="font-mono text-xs">Coming soon</span>
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleCopySvg}
            className={`p-1.5 border transition-all ${
              copied
                ? 'bg-[#22c55e] border-[#22c55e] text-white'
                : 'bg-white border-[#e5e7eb] text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626]'
            }`}
            title="Copy SVG"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 bg-white border border-[#e5e7eb] text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
            title="Download SVG"
          >
            <Download size={12} />
          </button>
        </div>
      </div>

      {/* Footer: Title + Index */}
      {(showTitle || showIndex) && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb]">
          {showTitle && (
            <span className="font-mono text-xs font-bold tracking-wide text-[#171717] uppercase">
              {metaphor.titleEn}
            </span>
          )}
          {showIndex && metaphor.index && (
            <span className="font-mono text-xs text-[#a3a3a3]">
              {formatIndex(metaphor.index, TOTAL_COUNT)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
