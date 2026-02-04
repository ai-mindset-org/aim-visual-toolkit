import type { Metaphor } from '../../data/metaphors';
import StaticMetaphor from './StaticMetaphor';

interface MetaphorCardProps {
  metaphor: Metaphor;
  onClick?: () => void;
}

export default function MetaphorCard({ metaphor, onClick }: MetaphorCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white border border-aim-gray-200 rounded-xl overflow-hidden hover:border-aim-gray-300 hover:shadow-lg transition-all duration-200 text-left w-full"
    >
      {/* SVG Preview */}
      <div className="aspect-square bg-aim-gray-50 p-4 flex items-center justify-center">
        <StaticMetaphor
          name={metaphor.filename}
          variant="cover"
          className="group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Info */}
      <div className="p-4 border-t border-aim-gray-100">
        <h3 className="font-medium text-aim-black text-sm mb-0.5">{metaphor.title}</h3>
        <p className="text-xs text-aim-gray-500 font-mono">{metaphor.titleEn}</p>
      </div>

      {/* Category badges */}
      <div className="px-4 pb-4 flex flex-wrap gap-1">
        {metaphor.categories.slice(0, 2).map((cat) => (
          <span
            key={cat}
            className="px-2 py-0.5 text-[10px] font-mono bg-aim-gray-100 text-aim-gray-600 rounded"
          >
            {cat}
          </span>
        ))}
      </div>
    </button>
  );
}
