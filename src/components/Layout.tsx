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
      <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#DC2626] flex items-center justify-center">
                <span className="text-white font-mono font-bold text-xs">A</span>
              </div>
              <span className="font-mono text-xs font-bold tracking-tight uppercase">
                AIM Visual Toolkit
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all border ${
                      isActive
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'text-[#525252] border-transparent hover:text-[#DC2626]'
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
      <footer className="border-t border-[#e5e7eb] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3] hover:text-[#DC2626] transition-colors"
              >
                AI Mindset
              </a>
              <a
                href="https://learn.aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3] hover:text-[#DC2626] transition-colors"
              >
                LMS
              </a>
              <a
                href="https://manifest.aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3] hover:text-[#DC2626] transition-colors"
              >
                Manifest
              </a>
              <a
                href="https://github.com/ai-mindset-org/aim-visual-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3] hover:text-[#DC2626] transition-colors"
              >
                GitHub
              </a>
            </div>
            <span className="font-mono text-[10px] text-[#a3a3a3]">
              Swiss Design · 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
