import { Grid2X2, Grid3X3, LayoutGrid } from 'lucide-react';
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
}

export default function GalleryFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  gridSize,
  onGridSizeChange,
  showIndex,
  onShowIndexChange,
}: GalleryFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search metaphors..."
          className="w-full px-4 py-3 font-mono text-sm border border-[#e5e7eb] bg-white text-[#171717] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all border ${
                activeCategory === cat.id
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#525252] border-[#e5e7eb] hover:border-[#DC2626] hover:text-[#DC2626]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Grid Size */}
          <div className="flex border border-[#e5e7eb]">
            <button
              onClick={() => onGridSizeChange('small')}
              className={`p-2 transition-all ${
                gridSize === 'small' ? 'bg-[#171717] text-white' : 'text-[#525252] hover:text-[#DC2626]'
              }`}
              title="Small grid"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => onGridSizeChange('medium')}
              className={`p-2 border-x border-[#e5e7eb] transition-all ${
                gridSize === 'medium' ? 'bg-[#171717] text-white' : 'text-[#525252] hover:text-[#DC2626]'
              }`}
              title="Medium grid"
            >
              <Grid2X2 size={14} />
            </button>
            <button
              onClick={() => onGridSizeChange('large')}
              className={`p-2 transition-all ${
                gridSize === 'large' ? 'bg-[#171717] text-white' : 'text-[#525252] hover:text-[#DC2626]'
              }`}
              title="Large grid"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Toggle Index */}
          <button
            onClick={() => onShowIndexChange(!showIndex)}
            className={`p-2 border transition-all ${
              showIndex ? 'bg-[#171717] text-white border-[#171717]' : 'text-[#525252] border-[#e5e7eb] hover:text-[#DC2626]'
            }`}
            title={showIndex ? 'Hide numbers' : 'Show numbers'}
          >
            <span className="font-mono text-[10px]">01</span>
          </button>
        </div>
      </div>
    </div>
  );
}
