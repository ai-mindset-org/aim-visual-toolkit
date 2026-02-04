import type { Metaphor } from '../../data/metaphors';
import { MetaphorCard } from '../metaphors';

export type GridSize = 'small' | 'medium' | 'large';
export type ViewMode = 'compact' | 'detailed';

interface GalleryGridProps {
  metaphors: Metaphor[];
  gridSize?: GridSize;
  viewMode?: ViewMode;
  showTitle?: boolean;
  showIndex?: boolean;
}

const GRID_CLASSES: Record<GridSize, string> = {
  small: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8',
  medium: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  large: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

export default function GalleryGrid({
  metaphors,
  gridSize = 'medium',
  viewMode = 'compact',
  showTitle = true,
  showIndex = true,
}: GalleryGridProps) {
  if (metaphors.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#a3a3a3] font-mono text-sm">No metaphors found</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${GRID_CLASSES[gridSize]}`}>
      {metaphors.map((metaphor) => (
        <MetaphorCard
          key={metaphor.id}
          metaphor={metaphor}
          viewMode={viewMode}
          showTitle={showTitle}
          showIndex={showIndex}
        />
      ))}
    </div>
  );
}
