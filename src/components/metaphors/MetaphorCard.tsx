import { useState } from 'react';
import { Copy, Download, Check, Maximize2 } from 'lucide-react';
import type { Metaphor } from '../../data/metaphors';
import { formatIndex, TOTAL_COUNT } from '../../data/metaphors';
import { downloadBlob, downloadFromUrl, MIME_TYPES } from '../../utils/download';
import StaticMetaphor from './StaticMetaphor';

interface MetaphorCardProps {
  metaphor: Metaphor;
  showIndex?: boolean;
  onClick?: () => void;
}

export default function MetaphorCard({
  metaphor,
  showIndex = true,
  onClick,
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

  return (
    <div
      className="group relative bg-white border border-[#e5e7eb] hover:border-[#DC2626] transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* SVG Preview - clean, no title */}
      <div className="aspect-square p-6 flex items-center justify-center bg-white relative">
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

        {/* Hover overlay with actions */}
        <div
          className={`absolute inset-0 bg-black/5 flex items-center justify-center gap-2 transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Enlarge hint */}
          <div className="absolute top-3 left-3">
            <Maximize2 size={14} className="text-[#a3a3a3]" />
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-1">
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
      </div>

      {/* Footer: Index only (title removed from preview) */}
      {showIndex && metaphor.index && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#e5e7eb]">
          <span className="font-mono text-[10px] text-[#a3a3a3]">
            {formatIndex(metaphor.index, TOTAL_COUNT)}
          </span>
        </div>
      )}
    </div>
  );
}
