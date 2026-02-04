import type { Metaphor } from '../../data/metaphors';
import { MetaphorCard } from '../metaphors';

interface GalleryGridProps {
  metaphors: Metaphor[];
  onSelect: (metaphor: Metaphor) => void;
}

export default function GalleryGrid({ metaphors, onSelect }: GalleryGridProps) {
  if (metaphors.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-aim-gray-500">No metaphors found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {metaphors.map((metaphor) => (
        <MetaphorCard key={metaphor.id} metaphor={metaphor} onClick={() => onSelect(metaphor)} />
      ))}
    </div>
  );
}
