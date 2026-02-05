import { useState, useMemo, useEffect } from 'react';
import { Search, BookmarkCheck, Users, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getMetaphorsByCategory,
  searchMetaphors,
  getTotalCount,
  loadCommunityMetaphors,
  getCommunityMetaphors,
  isCommunityLoaded,
  type Metaphor,
} from '../data/metaphors';
import { GalleryFilters } from '../components/gallery';
import { MetaphorCard, MetaphorModal } from '../components/metaphors';
import type { GridSize } from '../components/gallery/GalleryGrid';
import { useSavedMetaphors } from '../hooks/useSavedMetaphors';

const GRID_CLASSES: Record<GridSize, string> = {
  tiny: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8',
  small: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  medium: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  large: 'grid-cols-1 sm:grid-cols-2',
};

// Generate Your Own Card - same style as MetaphorCard
function GenerateCard({ showLabel, onClick }: { showLabel: boolean; onClick: () => void }) {
  return (
    <div
      className="group relative rounded-xl border-2 border-dashed bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border-[#DC2626]/40 hover:border-[#DC2626] cursor-pointer"
      onClick={onClick}
    >
      {/* Preview area - matches MetaphorCard aspect-square */}
      <div className="aspect-square p-4 flex items-center justify-center bg-white relative">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-[#DC2626]/10 flex items-center justify-center group-hover:bg-[#DC2626]/20 transition-colors">
            <Plus size={32} className="text-[#DC2626]" />
          </div>
        </div>
      </div>

      {/* Info - matches MetaphorCard */}
      {showLabel && (
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-medium text-sm text-neutral-900 group-hover:text-[#DC2626] transition-colors">
                Generate Your Own
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono uppercase">CREATE NEW</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
            Create a custom metaphor with AI based on your insight
          </p>
        </div>
      )}
    </div>
  );
}

// Community Grid with Generator card at the end
interface CommunityGridProps {
  metaphors: Metaphor[];
  gridSize: GridSize;
  showLabels: boolean;
  onSelect: (metaphor: Metaphor) => void;
  savedIds: Set<string>;
  onSave: (id: string) => void;
  onRemove: (id: string) => void;
  onGenerate: () => void;
}

function CommunityGridWithGenerator({
  metaphors,
  gridSize,
  showLabels,
  onSelect,
  savedIds,
  onSave,
  onRemove,
  onGenerate,
}: CommunityGridProps) {
  return (
    <div className={`grid gap-4 ${GRID_CLASSES[gridSize]}`}>
      {metaphors.map((metaphor) => (
        <MetaphorCard
          key={metaphor.id}
          metaphor={metaphor}
          showLabel={showLabels}
          onClick={() => onSelect(metaphor)}
          isSaved={savedIds.has(metaphor.id)}
          onSave={() => onSave(metaphor.id)}
          onRemove={() => onRemove(metaphor.id)}
        />
      ))}
      {/* Generate Your Own card at the end */}
      <GenerateCard showLabel={showLabels} onClick={onGenerate} />
    </div>
  );
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>('small');
  const [showLabels, setShowLabels] = useState(true);
  const [selectedMetaphor, setSelectedMetaphor] = useState<Metaphor | null>(null);
  const [communityLoaded, setCommunityLoaded] = useState(isCommunityLoaded());

  const { savedIds, totalCount, addMetaphor, removeMetaphor, isSaved } = useSavedMetaphors();

  // Load community metaphors on mount
  useEffect(() => {
    if (!communityLoaded) {
      loadCommunityMetaphors().then(() => {
        setCommunityLoaded(true);
      });
    }
  }, [communityLoaded]);

  const filteredMetaphors = useMemo(() => {
    let results = searchQuery
      ? searchMetaphors(searchQuery)
      : getMetaphorsByCategory(activeCategory);

    if (searchQuery && activeCategory !== 'all') {
      results = results.filter((m) => m.categories.includes(activeCategory));
    }

    return results;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, communityLoaded]);

  // Get community metaphors for the special section (only when showing 'all')
  const communityMetaphors = useMemo(() => {
    if (activeCategory !== 'all' || searchQuery) return [];
    return getCommunityMetaphors();
  }, [activeCategory, searchQuery, communityLoaded]);

  // Core metaphors (excluding community when showing 'all')
  const coreMetaphors = useMemo(() => {
    if (activeCategory === 'community') return [];
    if (activeCategory !== 'all' || searchQuery) return filteredMetaphors;
    return filteredMetaphors.filter((m) => m.source !== 'community');
  }, [filteredMetaphors, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            visual toolkit · swiss design
          </p>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Metaphors
          </h1>
          <p className="text-sm text-neutral-500 max-w-2xl">
            {getTotalCount()} visual metaphors for AI concepts. Each metaphor captures an insight.
            Save to collection and use in your projects.
          </p>
        </div>

        {/* Saved counter */}
        {totalCount > 0 && (
          <Link
            to="/saved"
            className="shrink-0 flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <BookmarkCheck size={16} className="text-[#DC2626]" />
            <span className="text-sm font-mono font-medium">{totalCount}</span>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      {/* Filters */}
      <GalleryFilters
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        showIndex={false}
        onShowIndexChange={() => {}}
        showLabels={showLabels}
        onShowLabelsChange={setShowLabels}
      />

      {/* Core Metaphors Grid */}
      {coreMetaphors.length > 0 ? (
        <div className={`grid gap-4 ${GRID_CLASSES[gridSize]}`}>
          {coreMetaphors.map((metaphor) => (
            <MetaphorCard
              key={metaphor.id}
              metaphor={metaphor}
              showLabel={showLabels}
              onClick={() => setSelectedMetaphor(metaphor)}
              isSaved={savedIds.has(metaphor.id)}
              onSave={() => addMetaphor(metaphor.id)}
              onRemove={() => removeMetaphor(metaphor.id)}
            />
          ))}
        </div>
      ) : activeCategory === 'community' ? null : (
        <div className="py-16 text-center">
          <p className="text-neutral-400 text-sm mb-2">No metaphors found</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Community Section - shown at bottom when viewing 'all' or 'community' */}
      {(communityMetaphors.length > 0 || activeCategory === 'community') && (
        <div className="mt-12">
          {/* Community Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#DC2626] text-white rounded-lg">
              <Users size={14} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Community
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#DC2626]/30 to-transparent" />
            <span className="text-xs text-neutral-400 font-mono">
              {activeCategory === 'community' ? filteredMetaphors.length : communityMetaphors.length} metaphors
            </span>
          </div>

          {/* Community Grid with red accent border */}
          <div className="p-4 rounded-xl border-2 border-[#DC2626]/20 bg-gradient-to-br from-red-50/50 to-transparent">
            {(activeCategory === 'community' ? filteredMetaphors : communityMetaphors).length > 0 ? (
              <CommunityGridWithGenerator
                metaphors={activeCategory === 'community' ? filteredMetaphors : communityMetaphors}
                gridSize={gridSize}
                showLabels={showLabels}
                onSelect={setSelectedMetaphor}
                savedIds={savedIds}
                onSave={addMetaphor}
                onRemove={removeMetaphor}
                onGenerate={() => navigate('/generator')}
              />
            ) : (
              <div className="py-8 text-center">
                <p className="text-neutral-400 text-sm">
                  No community metaphors yet. Be the first to contribute!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <MetaphorModal
        metaphor={selectedMetaphor}
        onClose={() => setSelectedMetaphor(null)}
        isSaved={selectedMetaphor ? isSaved(selectedMetaphor.id) : false}
        onSave={() => selectedMetaphor && addMetaphor(selectedMetaphor.id)}
        onRemove={() => selectedMetaphor && removeMetaphor(selectedMetaphor.id)}
      />

      {/* Footer info */}
      <div className="mt-12 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">
          About metaphors
        </h3>
        <p className="text-sm text-neutral-600 mb-3">
          Visual metaphors help grasp complex concepts through images.
          Each metaphor is based on insights from AI Mindset workshops.
        </p>
        <p className="text-xs text-neutral-400">
          Format: SVG · Style: Swiss Design · Colors: #DC2626 (red), #171717 (black)
        </p>
      </div>
    </div>
  );
}
