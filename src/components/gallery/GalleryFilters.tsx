import { CATEGORIES } from '../../data/metaphors';

interface GalleryFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function GalleryFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: GalleryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeCategory === cat.id
                ? 'bg-aim-black text-white'
                : 'bg-aim-gray-100 text-aim-gray-600 hover:bg-aim-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 pr-10 border border-aim-gray-200 rounded-lg bg-white text-aim-black placeholder:text-aim-gray-400 focus:outline-none focus:ring-2 focus:ring-aim-red focus:border-transparent"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aim-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
