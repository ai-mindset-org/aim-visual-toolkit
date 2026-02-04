import { ExternalLink } from 'lucide-react';
import { StaticMetaphor } from '../components/metaphors';
import { TOTAL_COUNT } from '../data/metaphors';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="flex items-start gap-8 mb-12">
        <div className="w-24 h-24 shrink-0">
          <StaticMetaphor name="exoskeleton" variant="cover" />
        </div>
        <div>
          <h1 className="font-mono text-2xl font-bold text-[#171717] uppercase tracking-tight mb-2">
            AIM Visual Toolkit
          </h1>
          <p className="text-[#525252]">
            {TOTAL_COUNT} Swiss Design visual metaphors for AI education
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-12">
        <section>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#171717] mb-4">
            About
          </h2>
          <div className="space-y-4 text-sm text-[#525252]">
            <p>
              AIM Visual Toolkit is a collection of minimalist visual metaphors designed for the{' '}
              <a
                href="https://aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#DC2626] hover:underline"
              >
                AI Mindset
              </a>{' '}
              educational platform.
            </p>
            <p>
              Each metaphor follows Swiss Design principles — clean lines, geometric shapes,
              and purposeful use of color. The toolkit includes hand-crafted SVG metaphors
              representing key AI concepts, plus an AI-powered generator for creating custom visuals.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#171717] mb-4">
            Design Principles
          </h2>
          <ul className="space-y-3 text-sm text-[#525252]">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#DC2626] mt-2 shrink-0" />
              <span>
                <strong>Minimalism</strong> — Every element serves a purpose. No decorative noise.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#DC2626] mt-2 shrink-0" />
              <span>
                <strong>Geometric</strong> — Built from circles, lines, and simple polygons.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#DC2626] mt-2 shrink-0" />
              <span>
                <strong>Red accent</strong> — Swiss Red (#DC2626) as the primary accent color.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#DC2626] mt-2 shrink-0" />
              <span>
                <strong>Scalable</strong> — Vector-based, crisp at any size.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#171717] mb-4">
            Usage
          </h2>
          <ul className="space-y-2 text-sm text-[#525252]">
            <li>• Copy SVG code directly to clipboard</li>
            <li>• Download as SVG for vector editing</li>
            <li>• Export as PNG (4x resolution) for presentations</li>
            <li>• Generate custom metaphors with AI</li>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#171717] mb-4">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://aimindset.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border border-[#e5e7eb] text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
            >
              AI Mindset <ExternalLink size={10} />
            </a>
            <a
              href="https://learn.aimindset.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border border-[#e5e7eb] text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
            >
              AIM LMS <ExternalLink size={10} />
            </a>
            <a
              href="https://manifest.aimindset.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border border-[#e5e7eb] text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
            >
              Manifest <ExternalLink size={10} />
            </a>
            <a
              href="https://github.com/ai-mindset-org/aim-visual-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase bg-[#171717] text-white hover:bg-[#DC2626] transition-colors"
            >
              GitHub <ExternalLink size={10} />
            </a>
          </div>
        </section>

        <section className="pt-8 border-t border-[#e5e7eb]">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3]">
            Format: SVG · Typography: IBM Plex Mono · Colors: #DC2626, #171717
          </p>
        </section>
      </div>
    </div>
  );
}
