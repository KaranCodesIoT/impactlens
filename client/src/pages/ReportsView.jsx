import { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Lock,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

const REPORTS_LIST = [
  {
    id: 'rep-q1-2026',
    title: 'Great Barrier Reef Ecological Restoration Audit',
    period: 'Q1 2026 (Jan - Mar 2026)',
    biome: 'Coral Reef Sanctuary',
    status: 'Verified & Certified',
    standard: 'Verra / Gold Standard ESG',
    delta: '+68.4% Net Coral Recovery',
    hash: 'sha256:8f4c...b92a',
    signatories: ['Dr. Elena Rostova (Chief Marine Biologist)', 'NOAA Sanctuary Directorate'],
    summary: 'Demonstrated statistically significant accretion of Acropora cervicornis colonies with zero thermal bleaching across Sector 4-B over 22 continuous monitoring months.'
  },
  {
    id: 'rep-q4-2025',
    title: 'Belize Lagoon Mangrove Reforestation Assessment',
    period: 'Q4 2025 (Oct - Dec 2025)',
    biome: 'Coastal Blue Carbon',
    status: 'Certified',
    standard: 'Blue Carbon Initiative',
    delta: '+34.2% Canopy Density',
    hash: 'sha256:3a1e...91cc',
    signatories: ['Belize Ministry of Environment', 'UNESCO World Heritage'],
    summary: 'Automated drone photogrammetry and LiDAR surveys confirmed 14,200 viable Rhizophora seedlings outplanted across 1.4 square kilometers of intertidal zone.'
  },
  {
    id: 'rep-q3-2025',
    title: 'Monterey Bay Giant Kelp Forest Rugosity Verification',
    period: 'Q3 2025 (Jul - Sep 2025)',
    biome: 'Temperate Marine Forest',
    status: 'Certified',
    standard: 'California Ocean Protection Council',
    delta: '+51.8% Canopy Cover',
    hash: 'sha256:7c4d...e19f',
    signatories: ['Monterey Bay Sanctuary Foundation'],
    summary: 'Subsea ROV transect mapping verified recovery of Macrocystis pyrifera beds following thermal marine heatwave mitigation efforts.'
  }
];

export default function ReportsView() {
  const [selectedReport, setSelectedReport] = useState(REPORTS_LIST[0]);

  const handleDownload = (title) => {
    toast.success(`Exporting "${title}" as PDF...`, { icon: '📄' });
  };

  const handleShare = () => {
    toast.success('Public audit link copied to clipboard!');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full min-h-full bg-[#070b14] text-slate-100 select-none overflow-x-hidden">
      {/* ─── Ambient Glow ─────────────────────────────────────────────────── */}
      <div className="absolute top-10 right-20 w-[450px] h-[350px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pt-5 sm:pt-7 pb-5 relative z-10 shrink-0 border-b border-[#141b2a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-[12px] text-[#6d7d93] mb-1 font-medium">
              <span className="hover:text-slate-300 cursor-pointer">Compliance</span>
              <span className="mx-2 text-[#465366]">&gt;</span>
              <span className="text-[#8e9fb4]">Verification Reports</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[27px] font-bold text-white tracking-tight leading-tight">
                Impact & ESG Audit Reports
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0a261d] border border-[#134e3a] text-[#10b981]">
                <ShieldCheck size={13} />
                <span>Audited Proof</span>
              </span>
            </div>

            <p className="text-[13px] text-[#718299] mt-0.5 leading-relaxed">
              Legally verifiable, audit-backed restoration certificates and AI change-detection summaries
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-[#cbd5e1] hover:text-white hover:border-[#2a3c58] hover:bg-[#131f33] flex items-center gap-1.5 text-[13px] font-medium transition-all cursor-pointer shadow-sm"
            >
              <Share2 size={14} className="text-[#7f91a7]" />
              <span>Share Audit Link</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('Q1 2026 Audit Report')}
              className="px-4 py-2 h-9 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#3b82f6] hover:opacity-95 text-white flex items-center gap-2 text-[13px] font-semibold transition-all shadow-[0_2px_14px_rgba(147,51,234,0.35)] cursor-pointer active:scale-95"
            >
              <Download size={15} />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Content Body ───────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-8 py-5 sm:py-6 space-y-6 relative z-10">

        {/* ─── 4 Metric Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#13233e] flex items-center justify-center text-[#2563eb]">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">12 Reports</p>
              <p className="text-[12px] font-semibold text-white mt-1">Generated Audits</p>
              <p className="text-[11px] text-[#5e7087]">Quarterly & annual series</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0d2a22] flex items-center justify-center text-[#10b981]">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">Verra / ESG</p>
              <p className="text-[12px] font-semibold text-white mt-1">Certified Standard</p>
              <p className="text-[11px] text-[#5e7087]">ISO 14064-2 compliant</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#23173d] flex items-center justify-center text-[#a855f7]">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">+68.4% Delta</p>
              <p className="text-[12px] font-semibold text-white mt-1">Verified Growth</p>
              <p className="text-[11px] text-[#5e7087]">Before / After verified</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#2e2113] flex items-center justify-center text-[#f59e0b]">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">Cryptographic</p>
              <p className="text-[12px] font-semibold text-white mt-1">SHA-256 Verified</p>
              <p className="text-[11px] text-[#5e7087]">Immutable visual hash</p>
            </div>
          </div>

        </div>

        {/* ─── Featured Primary Verification Report Card ─────────────────────── */}
        <div className="p-6 rounded-2xl bg-[#0b101c] border border-cyan-500/30 shadow-[0_8px_35px_rgba(34,211,238,0.12)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#162032]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Verified & Sealed</span>
                </span>
                <span className="text-xs text-[#6e8098] font-mono">{selectedReport.period}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedReport.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownload(selectedReport.title)}
                className="px-3.5 py-1.5 rounded-lg bg-[#111824] border border-[#1d2b3f] hover:border-cyan-400 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download size={13} className="text-cyan-400" />
                <span>PDF Document</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-lg bg-[#111824] border border-[#1d2b3f] hover:border-purple-400 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 size={13} className="text-purple-400" />
                <span>Share Proof</span>
              </button>
            </div>
          </div>

          <p className="text-[13px] text-slate-300 leading-relaxed">
            {selectedReport.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-[#080d18] border border-[#141d2d]">
              <span className="text-[11px] text-[#5e7087]">Standard Compliance</span>
              <p className="text-sm font-bold text-white mt-0.5">{selectedReport.standard}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d18] border border-[#141d2d]">
              <span className="text-[11px] text-[#5e7087]">Net Ecosystem Delta</span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{selectedReport.delta}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d18] border border-[#141d2d]">
              <span className="text-[11px] text-[#5e7087]">Proof-of-Restoration Hash</span>
              <p className="text-xs font-mono text-cyan-400 mt-1 truncate">{selectedReport.hash}</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#6e8098] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Authorized Signatories: {selectedReport.signatories.join(' • ')}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>Cryptographically Certified</span>
            </span>
          </div>
        </div>

        {/* ─── Archive of Past Verified Reports ────────────────────────────── */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">Historical Verification Reports</h4>

          <div className="space-y-3">
            {REPORTS_LIST.slice(1).map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className="p-4 rounded-xl bg-[#0b101c] border border-[#182336] hover:border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6e8098] font-mono">{rep.period}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-cyan-400 font-semibold">{rep.biome}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{rep.title}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-emerald-400 tabular-nums">{rep.delta}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(rep.title);
                    }}
                    className="p-2 rounded-lg bg-[#0e1727] border border-[#1c293e] text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
