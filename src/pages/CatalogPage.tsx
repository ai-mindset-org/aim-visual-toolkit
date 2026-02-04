import { useState, useMemo } from 'react';
import { METAPHORS, getMetaphorsByCategory, searchMetaphors, type Metaphor } from '../data/metaphors';
import { GalleryFilters, GalleryGrid } from '../components/gallery';
import { MetaphorModal } from '../components/metaphors';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetaphor, setSelectedMetaphor] = useState<Metaphor | null>(null);

  const filteredMetaphors = useMemo(() => {
    let results = searchQuery ? searchMetaphors(searchQuery) : getMetaphorsByCategory(activeCategory);

    // If searching, also filter by category (unless 'all')
    if (searchQuery && activeCategory !== 'all') {
      results = results.filter((m) => m.categories.includes(activeCategory));
    }

    return results;
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-aim-black mb-2">Visual Metaphors</h1>
        <p className="text-aim-gray-600">
          {METAPHORS.length} Swiss Design metaphors for AI concepts
        </p>
      </div>

      {/* Filters */}
      <GalleryFilters
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setSearchQuery(''); // Clear search when changing category
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Grid */}
      <GalleryGrid metaphors={filteredMetaphors} onSelect={setSelectedMetaphor} />

      {/* Modal */}
      <MetaphorModal metaphor={selectedMetaphor} onClose={() => setSelectedMetaphor(null)} />
    </div>
  );
}
