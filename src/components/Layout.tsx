import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useSavedMetaphors } from '../hooks/useSavedMetaphors';

const NAV_ITEMS = [
  { path: '/', label: 'Catalog' },
  { path: '/generator', label: 'Generator' },
  { path: '/saved', label: 'Saved', showCount: true },
  { path: '/about', label: 'About' },
];

export default function Layout() {
  const location = useLocation();
  const { totalCount } = useSavedMetaphors();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo_light.png"
                alt="AI Mindset"
                className="h-7"
              />
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold tracking-tight">
                  AI Mindset
                </span>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  visual toolkit
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ path, label, showCount }) => {
                const isActive = location.pathname === path;
                const isSaved = path === '/saved';
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-4 py-2 text-sm transition-all rounded-lg flex items-center gap-2 ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
                    }`}
                  >
                    {isSaved && <Bookmark size={14} />}
                    {label}
                    {showCount && totalCount > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          isActive
                            ? 'bg-[#DC2626] text-white'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {totalCount}
                      </span>
                    )}
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
      <footer className="border-t border-neutral-200 py-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a
                href="https://aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-[#DC2626] transition-colors"
              >
                aimindset.org
              </a>
              <a
                href="https://learn.aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-[#DC2626] transition-colors"
              >
                LMS
              </a>
              <a
                href="https://manifest.aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-[#DC2626] transition-colors"
              >
                Manifest
              </a>
              <a
                href="https://github.com/ai-mindset-org/aim-visual-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-[#DC2626] transition-colors"
              >
                GitHub
              </a>
            </div>
            <span className="text-xs text-neutral-400">
              Swiss Design · 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
