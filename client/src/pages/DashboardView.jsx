import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe2,
  TrendingUp,
  MapPin,
  Camera,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight,
  Activity,
  CheckCircle2,
  Calendar,
  Compass,
  DownloadCloud,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PROJECTS_DATA = [
  {
    id: 'coral-reef-survey',
    name: 'Coral Reef Survey',
    region: 'Great Barrier Reef, Sector 4-B',
    biome: 'Marine Sanctuary',
    status: 'Active',
    recovery: '+68.4%',
    captures: '1,420',
    coverImage: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    tags: ['Acropora', 'Photogrammetry', 'Zero Bleaching']
  },
  {
    id: 'belize-mangroves',
    name: 'Coastal Mangrove Canopy',
    region: 'Belize Barrier Reef Complex',
    biome: 'Coastal Wetland',
    status: 'Monitoring',
    recovery: '+34.2%',
    captures: '3,840',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tags: ['Rhizophora', 'Drone LiDAR', 'Carbon Blue']
  },
  {
    id: 'kelp-restoration',
    name: 'Giant Kelp Forest Regeneration',
    region: 'Monterey Bay Marine Sanctuary',
    biome: 'Temperate Reef',
    status: 'Surveying',
    recovery: '+51.8%',
    captures: '2,910',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    tags: ['Macrocystis', 'ROV Transects', 'Otter Biomass']
  },
  {
    id: 'red-sea-nursery',
    name: 'Thermal Resilient Coral Micro-frag',
    region: 'Gulf of Aqaba Marine Reserve',
    biome: 'Arid Coral Fringe',
    status: 'Active',
    recovery: '+42.0%',
    captures: '6,650',
    coverImage: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80',
    tags: ['Porites', 'Heat Tolerance', '32°C Resilient']
  }
];

export default function DashboardView() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [projectsList, setProjectsList] = useState(PROJECTS_DATA);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDeleteProject = (proj, e) => {
    e.stopPropagation();
    setProjectToDelete(proj);
  };

  const confirmDeleteProject = () => {
    if (!projectToDelete) return;
    setProjectsList(prev => prev.filter(p => p.id !== projectToDelete.id));
    toast.success(`Project "${projectToDelete.name}" deleted from workspace`, { icon: '🗑️' });
    setProjectToDelete(null);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full min-h-full bg-[#070b14] text-slate-100 select-none overflow-x-hidden">
      {/* ─── Ambient Glow ─────────────────────────────────────────────────── */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pt-5 sm:pt-7 pb-5 relative z-10 shrink-0 border-b border-[#141b2a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-[12px] text-[#6d7d93] mb-1 font-medium">
              <span className="hover:text-slate-300 cursor-pointer">Overview</span>
              <span className="mx-2 text-[#465366]">&gt;</span>
              <span className="text-[#8e9fb4]">Global Portfolio</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[27px] font-bold text-white tracking-tight leading-tight">
                Global Command Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0a261d] border border-[#134e3a] text-[#10b981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                <span>6 Biomes Active</span>
              </span>
            </div>

            <p className="text-[13px] text-[#718299] mt-0.5 leading-relaxed">
              Aggregate visual telemetry, multispectral drone surveys, and verified ecological indicators across field stations
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/datasets')}
              className="px-3.5 py-2 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-[#cbd5e1] hover:text-white hover:border-[#2a3c58] hover:bg-[#131f33] flex items-center gap-1.5 text-[13px] font-medium transition-all cursor-pointer shadow-sm"
            >
              <Camera size={14} className="text-[#7f91a7]" />
              <span>Raw Datasets</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="px-4 py-2 h-9 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#3b82f6] hover:opacity-95 text-white flex items-center gap-2 text-[13px] font-semibold transition-all shadow-[0_2px_14px_rgba(147,51,234,0.35)] cursor-pointer active:scale-95"
            >
              <DownloadCloud size={15} />
              <span>Generate ESG Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Content Body ───────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-8 py-5 sm:py-6 space-y-6 relative z-10">

        {/* ─── 4 Top Metric Cards Matching Reference Dark SaaS Design ──────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Total Captures */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all hover:border-blue-500/30">
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-blue-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#13233e] flex items-center justify-center shrink-0 text-[#2563eb]">
                <Camera size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  14,820
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Visual Assets
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  +1,240 drone & ROV captures
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Active Locations */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all hover:border-emerald-500/30">
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-emerald-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0d2a22] flex items-center justify-center shrink-0 text-[#10b981]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  6 Biomes
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Field Sanctuaries
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  14 spatial sectors active
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Net Recovery Rate */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all hover:border-purple-500/30">
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-purple-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#23173d] flex items-center justify-center shrink-0 text-[#a855f7]">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  +48.6%
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Mean Recovery Rate
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  Exceeding 2026 targets
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Verified Findings */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all hover:border-amber-500/30">
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-amber-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#2e2113] flex items-center justify-center shrink-0 text-[#f59e0b]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  184 Audited
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Verified Findings
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  99.2% mean AI confidence
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Active Workspaces & Field Projects Grid ──────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Active Ecological Workspaces
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                4 Projects Live
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0b101c] p-1 rounded-xl border border-[#182336] text-xs">
              {['All', 'Marine', 'Wetlands', 'Coral'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedFilter === f
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-sm'
                      : 'text-[#6e8098] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projectsList
              .filter(p => selectedFilter === 'All' || p.biome.toLowerCase().includes(selectedFilter.toLowerCase()) || p.status.toLowerCase().includes(selectedFilter.toLowerCase()))
              .map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate('/')}
                className="group p-4 rounded-2xl bg-[#0b101c] border border-[#182336] hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(34,211,238,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      ● {proj.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                        <span>{proj.recovery}</span>
                        <ArrowUpRight size={14} />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteProject(proj, e)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10">
                      <img
                        src={proj.coverImage}
                        alt={proj.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {proj.name}
                      </h4>
                      <p className="text-[12px] text-[#6d7e95] mt-0.5 flex items-center gap-1">
                        <MapPin size={12} className="text-[#4f647d]" />
                        <span>{proj.region}</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#121c2e] border border-[#1e2e4a] text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#152033] flex items-center justify-between text-xs text-[#6e8098]">
                  <span>{proj.captures} visual captures analyzed</span>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Open Workspace</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Real-Time Field Activity & Telemetry Stream ──────────────────── */}
        <div className="p-5 rounded-2xl bg-[#0b101c] border border-[#182336] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#141d2d]">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-cyan-400 animate-pulse" />
              <h4 className="text-[13px] font-bold text-white">Live Ingestion & Telemetry Stream</h4>
            </div>
            <span className="text-[11px] text-[#5e7087] font-mono">Gemini 2.5 Pro Vision Active</span>
          </div>

          <div className="space-y-2">
            {[
              { time: '2m ago', event: 'Great Barrier Reef Sector 4-B', desc: 'DJI Mavic 3 multispectral orthomosaic processed (124 tiles). Zero bleaching detected.', icon: CheckCircle2, color: 'text-emerald-400' },
              { time: '14m ago', event: 'Belize Lagoon Mangrove Transect', desc: 'Rhizophora seedling count calculated: 14,200 individuals (+12.4% density increase).', icon: Sparkles, color: 'text-purple-400' },
              { time: '1h ago', event: 'Monterey Bay Kelp ROV Dive #4', desc: '3D rugosity mesh generated. Sea otter forage foraging patterns verified.', icon: Compass, color: 'text-cyan-400' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-[#080e1a] border border-[#141f32] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={16} className={item.color} />
                    <div className="min-w-0">
                      <span className="font-semibold text-white mr-2">{item.event}:</span>
                      <span className="text-[#6d7e95]">{item.desc}</span>
                    </div>
                  </div>
                  <span className="text-[#4f647d] text-[11px] shrink-0 font-mono">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── Delete Project Confirmation Modal ────────────────────────────── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setProjectToDelete(null)}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-[#0b1322] border border-rose-500/30 shadow-[0_25px_60px_-10px_rgba(244,63,94,0.25)] z-10 overflow-hidden text-white max-h-[90vh] flex flex-col">
            <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 shrink-0" />

            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#162235]">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Delete Project
                  </h3>
                  <p className="text-xs text-slate-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to permanently delete <span className="font-bold text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">"{projectToDelete.name}"</span> from the global portfolio?
                </p>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-300 leading-relaxed">
                  All associated visual captures ({projectToDelete.captures} files), sensor maps, and telemetry data for {projectToDelete.region} will be removed.
                </div>
              </div>

              <div className="pt-4 border-t border-[#162235] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#111c2e] hover:bg-[#17253d] border border-[#1e2e46] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteProject}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all shadow-[0_2px_14px_rgba(244,63,94,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Trash2 size={14} />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
