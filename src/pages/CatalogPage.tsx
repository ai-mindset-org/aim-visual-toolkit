import { useState, useMemo } from 'react';
import { Search, BookmarkCheck } from 'lucide-react';
import { getMetaphorsByCategory, searchMetaphors, TOTAL_COUNT, type Metaphor } from '../data/metaphors';
import { GalleryFilters, GalleryGrid } from '../components/gallery';
import { MetaphorModal } from '../components/metaphors';
import type { GridSize } from '../components/gallery/GalleryGrid';
import { useSavedMetaphors } from '../hooks/useSavedMetaphors';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>('small');
  const [showLabels, setShowLabels] = useState(true);
  const [selectedMetaphor, setSelectedMetaphor] = useState<Metaphor | null>(null);

  const { savedIds, count, addMetaphor, removeMetaphor, isSaved } = useSavedMetaphors();

  const filteredMetaphors = useMemo(() => {
    let results = searchQuery
      ? searchMetaphors(searchQuery)
      : getMetaphorsByCategory(activeCategory);

    if (searchQuery && activeCategory !== 'all') {
      results = results.filter((m) => m.categories.includes(activeCategory));
    }

    return results;
  }, [activeCategory, searchQuery]);

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
            {TOTAL_COUNT} visual metaphors for AI concepts. Each metaphor captures an insight.
            Save to collection and use in your projects.
          </p>
        </div>

        {/* Saved counter */}
        {count > 0 && (
          <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
            <BookmarkCheck size={16} className="text-[#DC2626]" />
            <span className="text-sm font-mono font-medium">{count}</span>
          </div>
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

      {/* Grid */}
      {filteredMetaphors.length > 0 ? (
        <GalleryGrid
          metaphors={filteredMetaphors}
          gridSize={gridSize}
          showLabels={showLabels}
          onSelect={setSelectedMetaphor}
          savedIds={savedIds}
          onSave={addMetaphor}
          onRemove={removeMetaphor}
        />
      ) : (
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
