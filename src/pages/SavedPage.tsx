import { useState, useMemo } from 'react';
import { Bookmark, Trash2, Download, Copy, Check, Sparkles, BookmarkX } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { useSavedMetaphors, type GeneratedMetaphor } from '../hooks/useSavedMetaphors';
import { getMetaphorById, type Metaphor } from '../data/metaphors';
import { MetaphorModal } from '../components/metaphors';
import { MetaphorCard } from '../components/metaphors';
import { downloadBlob, MIME_TYPES } from '../utils/download';

const sanitizeSvg = (svg: string): string => {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feBlend', 'animate'],
    ADD_ATTR: ['xlink:href', 'href', 'clip-path', 'fill-opacity', 'stroke-opacity'],
  });
};

type TabType = 'all' | 'catalog' | 'generated';

export default function SavedPage() {
  const {
    savedIds,
    generatedMetaphors,
    totalCount,
    removeMetaphor,
    removeGeneratedMetaphor,
  } = useSavedMetaphors();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedMetaphor, setSelectedMetaphor] = useState<Metaphor | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get catalog metaphors from IDs
  const catalogMetaphors = useMemo(() => {
    return [...savedIds]
      .map((id) => getMetaphorById(id))
      .filter((m): m is Metaphor => m !== undefined);
  }, [savedIds]);

  const handleCopySvg = async (svg: string, id: string) => {
    try {
      await navigator.clipboard.writeText(svg);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSvg = (svg: string, title?: string) => {
    const filename = title
      ? `${title.toLowerCase().replace(/\s+/g, '-')}.svg`
      : 'metaphor.svg';
    downloadBlob(svg, filename, MIME_TYPES.SVG);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'catalog', label: 'Catalog', count: catalogMetaphors.length },
    { id: 'generated', label: 'Generated', count: generatedMetaphors.length },
  ];

  const showCatalog = activeTab === 'all' || activeTab === 'catalog';
  const showGenerated = activeTab === 'all' || activeTab === 'generated';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark size={24} className="text-[#DC2626]" />
          <h1 className="text-2xl font-bold text-neutral-900">Saved Metaphors</h1>
        </div>
        <p className="text-sm text-neutral-500">
          Your collection of saved catalog and generated metaphors
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="text-center py-16">
          <BookmarkX size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-600 mb-2">No saved metaphors yet</h3>
          <p className="text-sm text-neutral-400 mb-6">
            Save metaphors from the catalog or generate your own
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-[#DC2626] transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/generator"
              className="px-4 py-2 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Sparkles size={14} />
              Generator
            </Link>
          </div>
        </div>
      )}

      {/* Catalog Metaphors Section */}
      {showCatalog && catalogMetaphors.length > 0 && (
        <section className="mb-8">
          {activeTab === 'all' && (
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4">
              From Catalog ({catalogMetaphors.length})
            </h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {catalogMetaphors.map((metaphor) => (
              <MetaphorCard
                key={metaphor.id}
                metaphor={metaphor}
                showLabel={true}
                onClick={() => setSelectedMetaphor(metaphor)}
                isSaved={true}
                onRemove={() => removeMetaphor(metaphor.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Generated Metaphors Section */}
      {showGenerated && generatedMetaphors.length > 0 && (
        <section>
          {activeTab === 'all' && (
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-500 mb-4">
              Generated ({generatedMetaphors.length})
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedMetaphors.map((metaphor) => (
              <GeneratedMetaphorCard
                key={metaphor.id}
                metaphor={metaphor}
                onRemove={() => removeGeneratedMetaphor(metaphor.id)}
                onCopy={() => handleCopySvg(metaphor.svg, metaphor.id)}
                onDownload={() => handleDownloadSvg(metaphor.svg, metaphor.titleEn)}
                isCopied={copiedId === metaphor.id}
                formatDate={formatDate}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal for catalog metaphors */}
      <MetaphorModal
        metaphor={selectedMetaphor}
        onClose={() => setSelectedMetaphor(null)}
        isSaved={true}
        onSave={() => {}}
        onRemove={() => {
          if (selectedMetaphor) {
            removeMetaphor(selectedMetaphor.id);
            setSelectedMetaphor(null);
          }
        }}
      />
    </div>
  );
}

// Separate component for generated metaphor card
interface GeneratedMetaphorCardProps {
  metaphor: GeneratedMetaphor;
  onRemove: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
  formatDate: (timestamp: number) => string;
}

function GeneratedMetaphorCard({
  metaphor,
  onRemove,
  onCopy,
  onDownload,
  isCopied,
  formatDate,
}: GeneratedMetaphorCardProps) {
  return (
    <div className="group border border-neutral-200 rounded-xl overflow-hidden bg-white hover:border-neutral-300 transition-all">
      {/* Preview */}
      <div
        className={`aspect-square p-6 ${
          metaphor.style === 'dark' ? 'bg-neutral-900' : 'bg-white'
        }`}
      >
        <div
          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: sanitizeSvg(metaphor.svg) }}
        />
      </div>

      {/* Info */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        {/* Title & Date */}
        <div className="flex items-start justify-between mb-2">
          <div>
            {metaphor.titleEn && (
              <h3 className="font-mono text-sm font-bold uppercase">
                {metaphor.titleEn}
              </h3>
            )}
            <span className="text-[10px] text-neutral-400">
              {formatDate(metaphor.createdAt)}
            </span>
          </div>
          <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-mono text-neutral-500">
            generated
          </span>
        </div>

        {/* Prompt */}
        <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
          {metaphor.prompt}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded transition-all ${
              isCopied
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            {isCopied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-1 px-2 py-1.5 text-xs bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded transition-all"
          >
            <Download size={12} />
            SVG
          </button>

          <button
            onClick={onRemove}
            className="ml-auto flex items-center gap-1 px-2 py-1.5 text-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
