import { useState, useMemo } from 'react';
import { getMetaphorsByCategory, searchMetaphors, TOTAL_COUNT, type Metaphor } from '../data/metaphors';
import { GalleryFilters, GalleryGrid } from '../components/gallery';
import { MetaphorModal } from '../components/metaphors';
import type { GridSize } from '../components/gallery/GalleryGrid';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const [showIndex, setShowIndex] = useState(true);
  const [selectedMetaphor, setSelectedMetaphor] = useState<Metaphor | null>(null);

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
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="font-mono text-2xl font-bold text-[#171717] uppercase tracking-tight">
            Visual Metaphors
          </h1>
          <span className="font-mono text-sm text-[#a3a3a3]">{TOTAL_COUNT}</span>
        </div>
        <p className="text-[#525252] text-sm">
          Swiss Design visual metaphors for AI concepts. Click to enlarge, hover for actions.
        </p>
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
        showIndex={showIndex}
        onShowIndexChange={setShowIndex}
      />

      {/* Grid */}
      <GalleryGrid
        metaphors={filteredMetaphors}
        gridSize={gridSize}
        showIndex={showIndex}
        onSelect={setSelectedMetaphor}
      />

      {/* Modal */}
      <MetaphorModal
        metaphor={selectedMetaphor}
        onClose={() => setSelectedMetaphor(null)}
      />

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-[#e5e7eb]">
        <p className="font-mono text-xs text-[#a3a3a3] uppercase tracking-wider">
          Format: SVG · Style: Swiss Design · Colors: #DC2626 (red), #171717 (black)
        </p>
      </div>
    </div>
  );
}
