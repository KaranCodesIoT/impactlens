import { useState } from 'react';
import {
  Database,
  Camera,
  Filter,
  DownloadCloud,
  Layers,
  MapPin,
  Tag,
  CheckCircle2,
  HardDrive,
  Cpu,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const DATASETS_ITEMS = [
  {
    id: 'ds-01',
    title: 'Acropora Branching High-Res Transect',
    species: 'Acropora Cervicornis',
    camera: 'Sony A7R IV Underwater Nauticam',
    res: '9504 × 6336 (RAW)',
    depth: '8.4m',
    gps: '16.824° S, 145.892° E',
    date: 'March 14, 2026',
    verified: true,
    img: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds-02',
    title: 'Lagoon Orthomosaic Sector 4 Tile Grid',
    species: 'Multi-Species Habitat',
    camera: 'DJI Mavic 3 Multispectral',
    res: '4K Multispectral',
    depth: 'Aerial 60m AGL',
    gps: '16.828° S, 145.899° E',
    date: 'March 12, 2026',
    verified: true,
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds-03',
    title: 'Plate Coral Calcification Macro Survey',
    species: 'Porites Lutea',
    camera: 'GoPro Hero 12 Black (Polarized)',
    res: '5.3K 60fps MOV',
    depth: '12.2m',
    gps: '16.819° S, 145.885° E',
    date: 'March 08, 2026',
    verified: true,
    img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds-04',
    title: 'Bleaching Vulnerability Depth Transect',
    species: 'Thermal Anomaly Baseline',
    camera: 'SeaViewer Underwater ROV',
    res: '1080p 120fps Subsea',
    depth: '18.6m',
    gps: '16.815° S, 145.878° E',
    date: 'Feb 24, 2026',
    verified: true,
    img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds-05',
    title: 'Outer Barrier Restoration Colony Outplant',
    species: 'Acropora Palmata',
    camera: 'Sony A7R V 50mm Macro',
    res: '61 MP TIFF',
    depth: '6.2m',
    gps: '16.832° S, 145.912° E',
    date: 'Feb 18, 2026',
    verified: true,
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds-06',
    title: 'Coral Polyp Fluorescence Spectrum',
    species: 'Zooxanthellae Symbiosis',
    camera: 'Fluorescence Emission Rig',
    res: '8256 × 5504',
    depth: '9.0m Night',
    gps: '16.820° S, 145.890° E',
    date: 'Jan 29, 2026',
    verified: true,
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  }
];

export default function DatasetsView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DATASETS_ITEMS.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.species.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.camera.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col relative w-full min-h-full bg-[#070b14] text-slate-100 select-none overflow-x-hidden">
      {/* ─── Ambient Glow ─────────────────────────────────────────────────── */}
      <div className="absolute top-10 right-20 w-[450px] h-[350px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pt-5 sm:pt-7 pb-5 relative z-10 shrink-0 border-b border-[#141b2a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-[12px] text-[#6d7d93] mb-1 font-medium">
              <span className="hover:text-slate-300 cursor-pointer">Data Hub</span>
              <span className="mx-2 text-[#465366]">&gt;</span>
              <span className="text-[#8e9fb4]">Datasets & Taxonomy</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[27px] font-bold text-white tracking-tight leading-tight">
                Visual Datasets & Taxonomy Catalog
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0a261d] border border-[#134e3a] text-[#10b981]">
                <span>COCO & YOLO Ready</span>
              </span>
            </div>

            <p className="text-[13px] text-[#718299] mt-0.5 leading-relaxed">
              Structured raw imagery archives, multispectral drone surveys, ROV transects, and taxonomy labeling
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              className="px-3.5 py-2 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-[#cbd5e1] hover:text-white hover:border-[#2a3c58] hover:bg-[#131f33] flex items-center gap-1.5 text-[13px] font-medium transition-all cursor-pointer shadow-sm"
            >
              <HardDrive size={14} className="text-[#7f91a7]" />
              <span>Connect S3 / Cloudinary</span>
            </button>

            <button
              type="button"
              className="px-4 py-2 h-9 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#3b82f6] hover:opacity-95 text-white flex items-center gap-2 text-[13px] font-semibold transition-all shadow-[0_2px_14px_rgba(147,51,234,0.35)] cursor-pointer active:scale-95"
            >
              <DownloadCloud size={15} />
              <span>Export COCO JSON</span>
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
              <Database size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">42.6 GB</p>
              <p className="text-[12px] font-semibold text-white mt-1">Catalog Volume</p>
              <p className="text-[11px] text-[#5e7087]">14,820 media assets</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0d2a22] flex items-center justify-center text-[#10b981]">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">84 Taxa</p>
              <p className="text-[12px] font-semibold text-white mt-1">Species Classes</p>
              <p className="text-[11px] text-[#5e7087]">NOAA & CoralNet ontology</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#23173d] flex items-center justify-center text-[#a855f7]">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">3 Buckets</p>
              <p className="text-[12px] font-semibold text-white mt-1">Cloud Storage</p>
              <p className="text-[11px] text-[#5e7087]">Cloudinary + AWS S3 live</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#2e2113] flex items-center justify-center text-[#f59e0b]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">100% Geotagged</p>
              <p className="text-[12px] font-semibold text-white mt-1">EXIF Spatial Data</p>
              <p className="text-[11px] text-[#5e7087]">Coordinates & depth verified</p>
            </div>
          </div>

        </div>

        {/* ─── Search & Taxonomy Filters ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {['All', 'Acropora', 'Porites', 'Bleaching', 'Habitat'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                    : 'bg-[#0b101c] border border-[#182336] text-[#6e8098] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-auto sm:min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6d85]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search captures, cameras, species..."
              className="w-full bg-[#0b101c] border border-[#182336] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#5a6d85] focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* ─── Visual Datasets Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-[#0b101c] border border-[#182336] hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-black/60 relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300">
                    {item.res}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-[14px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-[#6d7e95] flex items-center gap-1.5 font-mono">
                    <Camera size={13} className="text-[#4e647f]" />
                    <span>{item.camera}</span>
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#5e7087] pt-2 border-t border-[#141d2d]">
                    <span>Depth: {item.depth}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#080d18] border-t border-[#141d2d] flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-mono text-[11px]">{item.gps}</span>
                <button
                  type="button"
                  className="text-white hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect EXIF</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
