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
      {/* Header - LMS style */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo - AIM style */}
            <Link to="/" className="flex items-center gap-3">
              {/* AIM Logo icon */}
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" stroke="#171717" strokeWidth="4"/>
                <path d="M50 20 L50 80" stroke="#171717" strokeWidth="4" strokeLinecap="round"/>
                <path d="M50 20 L30 50" stroke="#171717" strokeWidth="4" strokeLinecap="round"/>
                <path d="M50 20 L70 50" stroke="#171717" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="50" cy="65" r="8" fill="#DC2626"/>
              </svg>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold tracking-tight">
                  AI Mindset
                </span>
                <span className="font-mono text-[10px] text-[#a3a3a3] uppercase tracking-wider">
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
                    className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#171717] text-white'
                        : 'text-[#525252] hover:text-[#DC2626]'
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
      <footer className="border-t border-[#e5e7eb] py-6 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a
                href="https://aimindset.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3] hover:text-[#DC2626] transition-colors"
              >
                aimindset.org
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
