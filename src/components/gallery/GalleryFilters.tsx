import { Grid2X2, Grid3X3, LayoutGrid, LayoutList, Type } from 'lucide-react';
import { CATEGORIES } from '../../data/metaphors';
import type { GridSize } from './GalleryGrid';

interface GalleryFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  gridSize: GridSize;
  onGridSizeChange: (size: GridSize) => void;
  showIndex: boolean;
  onShowIndexChange: (show: boolean) => void;
  showLabels?: boolean;
  onShowLabelsChange?: (show: boolean) => void;
}

export default function GalleryFilters({
  activeCategory,
  onCategoryChange,
  gridSize,
  onGridSizeChange,
  showLabels = true,
  onShowLabelsChange,
}: GalleryFiltersProps) {
  return (
    <div className="mb-6">
      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 text-xs transition-all rounded-lg ${
                activeCategory === cat.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Grid Size */}
          <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
            <button
              onClick={() => onGridSizeChange('tiny')}
              className={`p-2 transition-all ${
                gridSize === 'tiny' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Tiny grid"
            >
              <LayoutList size={14} />
            </button>
            <button
              onClick={() => onGridSizeChange('small')}
              className={`p-2 border-l border-neutral-200 transition-all ${
                gridSize === 'small' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Small grid"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => onGridSizeChange('medium')}
              className={`p-2 border-x border-neutral-200 transition-all ${
                gridSize === 'medium' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Medium grid"
            >
              <Grid2X2 size={14} />
            </button>
            <button
              onClick={() => onGridSizeChange('large')}
              className={`p-2 transition-all ${
                gridSize === 'large' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Large grid"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Labels Toggle */}
          {onShowLabelsChange && (
            <button
              onClick={() => onShowLabelsChange(!showLabels)}
              className={`p-2 rounded-lg border transition-all ${
                showLabels
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'text-neutral-500 border-neutral-200 hover:bg-neutral-100'
              }`}
              title={showLabels ? 'Hide labels' : 'Show labels'}
            >
              <Type size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
