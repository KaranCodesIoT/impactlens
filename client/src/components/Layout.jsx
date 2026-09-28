import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Database,
  FileText,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile sidebar when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isProjectsActive = location.pathname === '/' || location.pathname.startsWith('/project');

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#070b14] text-slate-100 font-sans antialiased selection:bg-purple-500/30 selection:text-white">
      {/* ─── Mobile Header Bar (Only visible on small screens) ───────────── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#080d18] border-b border-[#141b2a] z-30 shrink-0">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full blur-[6px] opacity-75" />
            <svg
              className="w-5 h-5 relative z-10 text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="3" fill="#67e8f9" stroke="none" />
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            ImpactLens
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="w-9 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ─── Exact Sidebar Matching Screenshot (Responsive Drawer on Mobile) ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] md:static md:w-[230px] bg-[#080d18] flex flex-col h-full shrink-0 border-r border-[#141b2a] select-none transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Subtle purple ambient light glow on sidebar right edge */}
        <div className="absolute top-24 -right-12 w-24 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            {/* Glowing Bioluminescent Neural / Coral Branching Logo */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full blur-[7px] opacity-75 group-hover:opacity-100 transition-opacity" />
              <svg
                className="w-6 h-6 relative z-10 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="3" fill="#67e8f9" stroke="none" />
              </svg>
            </div>
            <span className="text-white font-bold text-[17px] tracking-tight group-hover:text-slate-100 transition-colors">
              ImpactLens
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-3 overflow-y-auto">
          <nav className="space-y-1.5">
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2c2250] to-[#1c1d3b] text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.25)] border border-purple-500/25'
                    : 'text-[#718299] hover:text-slate-200 hover:bg-[#101726]'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            {/* Projects (Active matching exact screenshot glowing pill) */}
            <NavLink
              to="/"
              end={false}
              className={({ isActive }) => {
                const active = isActive || location.pathname.startsWith('/project');
                return `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                  active
                    ? 'bg-gradient-to-r from-[#2c2250] to-[#1c1d3b] text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.25)] border border-purple-500/25'
                    : 'text-[#718299] hover:text-slate-200 hover:bg-[#101726]'
                }`;
              }}
            >
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </NavLink>

            {/* Datasets */}
            <NavLink
              to="/datasets"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2c2250] to-[#1c1d3b] text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.25)] border border-purple-500/25'
                    : 'text-[#718299] hover:text-slate-200 hover:bg-[#101726]'
                }`
              }
            >
              <Database className="w-4 h-4" />
              <span>Datasets</span>
            </NavLink>

            {/* Reports */}
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2c2250] to-[#1c1d3b] text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.25)] border border-purple-500/25'
                    : 'text-[#718299] hover:text-slate-200 hover:bg-[#101726]'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </NavLink>
          </nav>
        </div>

        {/* User Card at Bottom: Karan Chaubey */}
        <div className="p-3 border-t border-[#141b2a] mt-auto">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#101726] transition-colors cursor-pointer group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-sm border border-purple-400/30">
                KC
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate leading-tight group-hover:text-indigo-200 transition-colors">
                  Karan Chaubey
                </p>
                <p className="text-[11px] text-[#5e6f85] truncate leading-tight mt-0.5">
                  karan@impactlens.in
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5e6f85] group-hover:text-slate-300 transition-colors shrink-0" />
          </div>
        </div>
      </aside>

      {/* ─── Main Content Surface ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full relative bg-[#070b14] overflow-y-auto overflow-x-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
