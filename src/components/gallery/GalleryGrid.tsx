import type { Metaphor } from '../../data/metaphors';
import { MetaphorCard } from '../metaphors';

export type GridSize = 'tiny' | 'small' | 'medium' | 'large';

interface GalleryGridProps {
  metaphors: Metaphor[];
  gridSize?: GridSize;
  showLabels?: boolean;
  onSelect?: (metaphor: Metaphor) => void;
  savedIds?: Set<string>;
  onSave?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const GRID_CLASSES: Record<GridSize, string> = {
  tiny: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8',
  small: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  medium: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  large: 'grid-cols-1 sm:grid-cols-2',
};

export default function GalleryGrid({
  metaphors,
  gridSize = 'medium',
  showLabels = true,
  onSelect,
  savedIds = new Set(),
  onSave,
  onRemove,
}: GalleryGridProps) {
  if (metaphors.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-400 font-mono text-sm">Метафоры не найдены</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${GRID_CLASSES[gridSize]}`}>
      {metaphors.map((metaphor) => (
        <MetaphorCard
          key={metaphor.id}
          metaphor={metaphor}
          showLabel={showLabels}
          onClick={() => onSelect?.(metaphor)}
          isSaved={savedIds.has(metaphor.id)}
          onSave={() => onSave?.(metaphor.id)}
          onRemove={() => onRemove?.(metaphor.id)}
        />
      ))}
    </div>
  );
}
