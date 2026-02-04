import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Catalog' },
  { path: '/generator', label: 'Generator' },
  { path: '/about', label: 'About' },
];

export default function Layout() {
  const location = useLocation();

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
              {NAV_ITEMS.map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-4 py-2 text-sm transition-all rounded-lg ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
                    }`}
                  >
                    {label}
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
