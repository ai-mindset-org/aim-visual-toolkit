import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sparkles, LayoutGrid, Info } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Catalog', icon: LayoutGrid },
  { path: '/generator', label: 'Generator', icon: Sparkles },
  { path: '/about', label: 'About', icon: Info },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-aim-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-aim-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-mono font-bold text-lg tracking-tight">
                AIM Visual Toolkit
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-aim-black text-white'
                        : 'text-aim-gray-600 hover:bg-aim-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-aim-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-aim-gray-500">
            <p>
              <span className="font-mono">AIM Visual Toolkit</span> — Swiss Design Metaphors
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-aim-black transition-colors"
              >
                AI Mindset
              </a>
              <a
                href="https://github.com/ai-mindset-org/aim-visual-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-aim-black transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
