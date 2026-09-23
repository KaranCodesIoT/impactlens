import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Leaf, Home, FolderKanban, Upload, Image, Search,
  Lightbulb, FileBarChart, Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/', icon: FolderKanban, label: 'Projects', end: true },
  { to: '#upload', icon: Upload, label: 'Upload' },
  { to: '#media', icon: Image, label: 'Media' },
  { to: '#search', icon: Search, label: 'Search' },
  { to: '#insights', icon: Lightbulb, label: 'Insights' },
  { to: '#reports', icon: FileBarChart, label: 'Reports' },
  { to: '#settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-sm">
              <Leaf size={20} className="text-white" />
            </div>
            <div className="brand-text">
              <h1 className="text-base font-bold text-surface-900 tracking-tight">
                Impact<span className="text-primary-600">Lens</span>
              </h1>
              <p className="text-[0.6rem] text-surface-400 -mt-0.5 tracking-wider uppercase">
                Visual Evidence Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== '#';

            // For hash links (placeholder pages), just show as non-active
            const isHash = item.to.startsWith('#');

            return (
              <NavLink
                key={item.label}
                to={isHash ? '/' : item.to}
                end={item.end}
                className={`sidebar-link ${
                  isActive && !isHash ? 'active' : ''
                }`}
                onClick={(e) => {
                  if (isHash) e.preventDefault();
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-700">CC</span>
            </div>
            <div className="brand-text">
              <p className="text-xs font-medium text-surface-700">Code Cubicle 6.0</p>
              <p className="text-[0.65rem] text-surface-400">Hackathon MVP</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
