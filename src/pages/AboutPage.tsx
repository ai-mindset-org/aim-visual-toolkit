import { ExternalLink } from 'lucide-react';
import { StaticMetaphor } from '../components/metaphors';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6">
          <StaticMetaphor name="exoskeleton" variant="cover" />
        </div>
        <h1 className="text-4xl font-bold text-aim-black mb-4">AIM Visual Toolkit</h1>
        <p className="text-xl text-aim-gray-600">
          Swiss Design visual metaphors for AI education
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-aim max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-aim-gray-600 mb-4">
            AIM Visual Toolkit is a collection of minimalist visual metaphors designed for the
            <a
              href="https://aimindset.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aim-red hover:underline ml-1"
            >
              AI Mindset
            </a>{' '}
            educational platform. Each metaphor follows Swiss Design principles — clean lines,
            geometric shapes, and purposeful use of color.
          </p>
          <p className="text-aim-gray-600">
            The toolkit includes 24+ hand-crafted SVG metaphors representing key AI concepts,
            plus an AI-powered generator for creating custom visuals.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Design Principles</h2>
          <ul className="space-y-3 text-aim-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-aim-red rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Minimalism:</strong> Every element serves a purpose. No decorative noise.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-aim-red rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Geometric:</strong> Built from circles, lines, and simple polygons.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-aim-red rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Red accent:</strong> Swiss Red (#DC2626) as the primary accent color.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-aim-red rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Scalable:</strong> Vector-based, crisp at any size.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage</h2>
          <p className="text-aim-gray-600 mb-4">
            All metaphors are available as SVG files. You can:
          </p>
          <ul className="space-y-2 text-aim-gray-600">
            <li>Copy SVG code directly to clipboard</li>
            <li>Download as SVG for vector editing</li>
            <li>Export as PNG (4x resolution) for presentations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://aimindset.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-aim-gray-100 rounded-lg text-aim-gray-700 hover:bg-aim-gray-200 transition-all"
            >
              AI Mindset <ExternalLink size={14} />
            </a>
            <a
              href="https://learn.aimindset.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-aim-gray-100 rounded-lg text-aim-gray-700 hover:bg-aim-gray-200 transition-all"
            >
              AIM LMS <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/ai-mindset-org/aim-visual-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-aim-black rounded-lg text-white hover:bg-aim-gray-800 transition-all"
            >
              GitHub <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
