import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Share2,
  Pencil,
  UploadCloud,
  ChevronRight,
  LayoutGrid,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  ArrowLeftRight,
  BarChart2,
  MapPin,
  Sparkles,
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Activity,
  Zap,
  Send,
  Download,
  Printer,
  Bot,
  User,
  Clock,
  ExternalLink,
  X,
  Copy,
  Check,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';



// Exact coral reef photos matching the screenshot
const CORAL_ASSETS = {
  // Top tilted photo (JPG • PNG with orange reef and sunbeams)
  photoCard: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
  // Bottom tilted video (MP4 • MOV underwater reef)
  videoCard: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80',
  // Before restoration (bleached/fragmented 2024)
  beforeReef: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80',
  // After restoration (thriving 2026)
  afterReef: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  // Additional items for grid
  extra1: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  extra2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  extra3: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80'
};

export default function CoralReefSurveyDashboard() {
  // Tab state: 'overview' | 'media' | 'evidence' | 'ask' | 'compare' | 'insights' | 'report'
  const [activeTab, setActiveTab] = useState('overview');

  // Motion prototype view state:
  // 'initial' (exact replica of the screenshot)
  // 'flying' (thumbnails smoothly fly into upload zone with motion trails)
  // 'scanning' (cards morph into AI analysis view with rotating scanning ring)
  // 'grid' (uploaded media cards stagger upward and stats count up)
  const [motionState, setMotionState] = useState('initial');

  // Live count-up animation for metric cards
  const [counts, setCounts] = useState({ media: 0, locations: 0, analyzed: 0, findings: 0 });

  // Before/After comparison slider percentage (0 - 100)
  const [sliderPos, setSliderPos] = useState(52);
  const [isSweeping, setIsSweeping] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const sliderContainerRef = useRef(null);
  const isDragging = useRef(false);

  // AI scan simulation progress
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);

  // Chat state for 'ask' tab
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am ImpactLens Vision Intelligence. I have ingested all 24 visual captures, photogrammetry tiles, and EXIF spatial vectors for Coral Reef Survey. What would you like to verify or query?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Evidence filter state for 'evidence' tab
  const [evidenceFilter, setEvidenceFilter] = useState('All');
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  // Media Detail Lightbox state
  const [selectedMediaDetail, setSelectedMediaDetail] = useState(null);

  // Insights Metric state ('coral' | 'bleaching' | 'rugosity')
  const [insightsMetric, setInsightsMetric] = useState('coral');

  // Real file input reference
  const fileInputRef = useRef(null);

  // Dynamic media items list (supports user uploads)
  const [mediaList, setMediaList] = useState([
    {
      id: 'm-1',
      img: CORAL_ASSETS.photoCard,
      title: 'Acropora Colony Nursery 4-B',
      tag: 'Acropora',
      health: '98% Healthy',
      loc: 'Opal Reef',
      date: 'March 2026',
      res: '9504 × 6336 (RAW)',
      camera: 'Sony A7R IV Underwater Nauticam',
      depth: '8.4m',
      gps: '16.824° S, 145.892° E'
    },
    {
      id: 'm-2',
      img: CORAL_ASSETS.afterReef,
      title: 'Restored Outer Barrier Ridge',
      tag: 'Plate Coral',
      health: '94% Growth',
      loc: 'Heron Island',
      date: 'March 2026',
      res: '61 MP TIFF',
      camera: 'Sony A7R V 50mm Macro',
      depth: '6.2m',
      gps: '16.832° S, 145.912° E'
    },
    {
      id: 'm-3',
      img: CORAL_ASSETS.videoCard,
      title: 'Reef Fish Biodiversity Survey',
      tag: 'Fish Biomass',
      health: '3.8x Density',
      loc: 'Ribbon Reef',
      date: 'Feb 2026',
      res: '4K 60fps MOV',
      camera: 'GoPro Hero 12 Black',
      depth: '12.2m',
      gps: '16.819° S, 145.885° E'
    },
    {
      id: 'm-4',
      img: CORAL_ASSETS.extra1,
      title: 'Polyp Macro Fluorescence',
      tag: 'Calcification',
      health: 'High Viability',
      loc: 'Lizard Island',
      date: 'Feb 2026',
      res: '8256 × 5504',
      camera: 'Fluorescence Emission Rig',
      depth: '9.0m Night',
      gps: '16.820° S, 145.890° E'
    },
    {
      id: 'm-5',
      img: CORAL_ASSETS.extra2,
      title: 'Drone Orthomosaic Lagoon Sector',
      tag: 'Aerial Map',
      health: '1.4 sq km',
      loc: 'Sector 7-A',
      date: 'Jan 2026',
      res: '4K Multispectral',
      camera: 'DJI Mavic 3 Multispectral',
      depth: 'Aerial 60m AGL',
      gps: '16.828° S, 145.899° E'
    },
    {
      id: 'm-6',
      img: CORAL_ASSETS.extra3,
      title: 'Underwater Nursery Frame 12',
      tag: 'Outplant',
      health: '100% Survival',
      loc: 'Fitzroy Island',
      date: 'Jan 2026',
      res: '5.3K 60fps',
      camera: 'SeaViewer Subsea ROV',
      depth: '9.2m',
      gps: '16.826° S, 145.895° E'
    }
  ]);

  // Handle local real file upload
  const handleRealFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems = Array.from(files).map((file, i) => {
      const isVid = file.type.startsWith('video');
      const objUrl = URL.createObjectURL(file);
      return {
        id: `upload-${Date.now()}-${i}`,
        img: objUrl,
        title: file.name.replace(/\.[^/.]+$/, ""),
        tag: isVid ? 'Video Transect' : 'Visual Sample',
        health: 'Pending AI Scan',
        loc: projectLocation,
        date: 'Just now',
        res: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        camera: 'Direct Sensor Upload',
        depth: 'Field Subsea',
        gps: 'Auto-detecting EXIF'
      };
    });

    setMediaList(prev => [...newItems, ...prev]);
    setCounts(prev => ({
      ...prev,
      media: prev.media + newItems.length
    }));
    toast.success(`Uploaded ${newItems.length} media file${newItems.length > 1 ? 's' : ''}!`);
    setActiveTab('media');
  };

  // Navigation & Delete State
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    toast.success(`Project "${projectName}" permanently deleted`, { icon: '🗑️' });
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  // Project Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('Coral Reef Survey');
  const [projectDesc, setProjectDesc] = useState('Analyze and track coral reef restoration efforts through visual evidence');
  const [projectStatus, setProjectStatus] = useState('Active');
  const [projectLocation, setProjectLocation] = useState('Great Barrier Reef, Sector 4-B');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Temporary form state inside edit modal
  const [editForm, setEditForm] = useState({
    name: 'Coral Reef Survey',
    desc: 'Analyze and track coral reef restoration efforts through visual evidence',
    status: 'Active',
    location: 'Great Barrier Reef, Sector 4-B'
  });

  const openEditModal = () => {
    setEditForm({
      name: projectName,
      desc: projectDesc,
      status: projectStatus,
      location: projectLocation
    });
    setIsEditModalOpen(true);
    setIsMoreMenuOpen(false);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast.error('Project name cannot be empty');
      return;
    }
    setProjectName(editForm.name.trim());
    setProjectDesc(editForm.desc.trim());
    setProjectStatus(editForm.status);
    setProjectLocation(editForm.location.trim());
    setIsEditModalOpen(false);
    toast.success('Project details updated successfully!');
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query, time: 'Just now' };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = 'Analysis verified across all captures in Sector 4-B. Live coral cover stands at 82.6%, representing a +68.4% accretion over the 2024 degraded baseline.';
      const q = query.toLowerCase();
      if (q.includes('bleach') || q.includes('mortality')) {
        aiResponse = 'Zero active thermal bleaching detected across the 14 surveyed colonies. Chlorophyll fluorescence ratios (Fv/Fm) are healthy at 0.68, confirming optimal zooxanthellae endosymbiont density.';
      } else if (q.includes('species') || q.includes('acropora') || q.includes('coral')) {
        aiResponse = 'Dominant classified species include Acropora cervicornis (staghorn coral, 98.4% confidence), Porites lutea (plate coral, 94.2% confidence), and encrusting Montipora. Calcification rate is estimated at 14.8 t/ha/year.';
      } else if (q.includes('depth') || q.includes('gps') || q.includes('location')) {
        aiResponse = 'Transect coordinate bounding box: 16.815° S — 16.832° S, 145.878° E — 145.912° E at depths ranging from 6.2m to 18.6m subsea.';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiResponse, time: 'Just now' }
      ]);
      setIsTyping(false);
    }, 700);
  };

  // Numbers count-up effect
  useEffect(() => {
    const target = motionState === 'grid' || activeTab === 'media'
      ? { media: 24, locations: 8, analyzed: 24, findings: 19 }
      : { media: 0, locations: 0, analyzed: 0, findings: 0 };

    let frameId;
    const duration = 1000;
    const startTime = performance.now();
    const startVal = { ...counts };

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        media: Math.round(startVal.media + (target.media - startVal.media) * ease),
        locations: Math.round(startVal.locations + (target.locations - startVal.locations) * ease),
        analyzed: Math.round(startVal.analyzed + (target.analyzed - startVal.analyzed) * ease),
        findings: Math.round(startVal.findings + (target.findings - startVal.findings) * ease)
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [motionState, activeTab]);

  // AI scan progress simulation
  useEffect(() => {
    if (motionState === 'scanning') {
      setScanProgress(0);
      setScanStep(0);
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setMotionState('grid'), 600);
            return 100;
          }
          const next = prev + 12;
          if (next >= 30 && next < 60) setScanStep(1);
          if (next >= 60 && next < 90) setScanStep(2);
          if (next >= 90) setScanStep(3);
          return Math.min(next, 100);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [motionState]);

  // Trigger flight and AI ingestion sequence
  const triggerUploadMotion = () => {
    setMotionState('flying');
    setTimeout(() => {
      setMotionState('scanning');
    }, 1200);
  };

  // Drag handlers for Before/After slider
  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  const startDrag = (e) => {
    isDragging.current = true;
    handleSliderMove(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const onDrag = (e) => {
    if (!isDragging.current) return;
    handleSliderMove(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  // Auto-sweep for comparison slider
  useEffect(() => {
    if (!isSweeping) return;
    let step = 0.5;
    let current = 25;
    const interval = setInterval(() => {
      current += step;
      if (current >= 80) step = -0.5;
      if (current <= 20) step = 0.5;
      setSliderPos(Math.round(current));
    }, 20);
    return () => clearInterval(interval);
  }, [isSweeping]);

  return (
    <div
      className="flex-1 flex flex-col relative w-full min-h-full bg-[#070b14] text-slate-100 select-none overflow-x-hidden"
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onTouchMove={onDrag}
      onTouchEnd={stopDrag}
    >
      {/* ─── Coral Reef Underwater Ambience (Right Bottom Silhouette) ────── */}
      <div className="absolute right-0 bottom-0 w-[550px] h-[480px] pointer-events-none opacity-25 z-0 overflow-hidden">
        <svg viewBox="0 0 500 450" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="reefAmbience" cx="80%" cy="80%" r="70%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#c084fc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="400" cy="400" rx="350" ry="250" fill="url(#reefAmbience)" />
          {/* Coral Reef Silhouettes */}
          <path d="M350 450 Q360 360 380 320 Q390 280 420 260 Q430 250 440 280 Q450 340 480 450 Z" fill="#1e2d4d" opacity="0.6" />
          <path d="M280 450 Q300 380 330 350 Q340 330 355 350 Q365 390 390 450 Z" fill="#253759" opacity="0.5" />
          <path d="M420 450 Q435 340 460 300 Q475 280 490 320 Q500 370 510 450 Z" fill="#2d426a" opacity="0.4" />
        </svg>
      </div>

      {/* ─── Top Header Section Matching Screenshot Exactly ───────────────── */}
      <div className="px-4 sm:px-8 pt-5 sm:pt-6 pb-4 relative z-10 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb: Projects > Coral Reef Survey */}
            <div className="flex items-center text-[12px] text-[#6d7d93] mb-1 font-medium flex-wrap gap-y-1">
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Projects</span>
              <span className="mx-2 text-[#465366]">&gt;</span>
              <span className="text-[#8e9fb4] truncate max-w-xs font-semibold">{projectName}</span>
              <span className="mx-2 text-[#354357]">•</span>
              <span className="text-cyan-400/90 flex items-center gap-1 text-[11px] font-medium">
                <MapPin size={11} className="text-cyan-400 shrink-0" />
                <span>{projectLocation}</span>
              </span>
            </div>

            {/* Title with Dynamic Status pill badge */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[27px] font-bold text-white tracking-tight leading-tight">
                {projectName}
              </h1>
              {/* Dynamic Status Pill Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  projectStatus === 'Active'
                    ? 'bg-[#0a261d] border border-[#134e3a] text-[#10b981]'
                    : projectStatus === 'Monitoring'
                    ? 'bg-[#082032] border border-[#0e4368] text-[#38bdf8]'
                    : projectStatus === 'Completed'
                    ? 'bg-[#201035] border border-[#4a2278] text-[#c084fc]'
                    : 'bg-[#181d28] border border-[#293548] text-[#94a3b8]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    projectStatus === 'Active'
                      ? 'bg-[#10b981]'
                      : projectStatus === 'Monitoring'
                      ? 'bg-[#38bdf8]'
                      : projectStatus === 'Completed'
                      ? 'bg-[#c084fc]'
                      : 'bg-[#94a3b8]'
                  }`}
                />
                <span>{projectStatus}</span>
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-[13px] text-[#718299] mt-0.5 leading-relaxed">
              {projectDesc}
            </p>
          </div>

          {/* Right Action Buttons Matching Screenshot Exactly */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap relative">
            {/* ... dots button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(prev => !prev)}
                className="w-9 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-[#7f91a7] hover:text-white hover:border-[#2a3c58] hover:bg-[#131f33] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title="More actions"
              >
                <MoreHorizontal size={15} />
              </button>

              {/* More dropdown menu */}
              {isMoreMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMoreMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-50 w-52 rounded-xl bg-[#0d1524] border border-[#1e2c42] p-1.5 shadow-2xl text-xs backdrop-blur-md animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        openEditModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#172338] transition-colors text-left"
                    >
                      <Pencil size={13} className="text-cyan-400" />
                      <span>Edit Project Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProjectStatus(projectStatus === 'Archived' ? 'Active' : 'Archived');
                        setIsMoreMenuOpen(false);
                        toast.success(`Project ${projectStatus === 'Archived' ? 'unarchived' : 'archived'} successfully`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#172338] transition-colors text-left"
                    >
                      <Activity size={13} className="text-purple-400" />
                      <span>{projectStatus === 'Archived' ? 'Restore Project' : 'Archive Project'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        toast.success('Workspace duplicated to draft workspace #02');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#172338] transition-colors text-left"
                    >
                      <Copy size={13} className="text-emerald-400" />
                      <span>Duplicate Workspace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        const telemetryData = JSON.stringify({
                          project: projectName,
                          status: projectStatus,
                          location: projectLocation,
                          description: projectDesc,
                          healthScore: '92/100',
                          baselineAccretion: '+68.4%',
                          exportTimestamp: new Date().toISOString()
                        }, null, 2);
                        const blob = new Blob([telemetryData], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-telemetry.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success('Exported raw telemetry JSON');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#172338] transition-colors text-left"
                    >
                      <Download size={13} className="text-blue-400" />
                      <span>Export Raw Telemetry</span>
                    </button>
                    <div className="my-1 border-t border-[#1c2a3f]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left font-medium cursor-pointer"
                    >
                      <Trash2 size={13} className="text-rose-400" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Share button */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Project share link copied to clipboard!');
              }}
              className="px-3.5 py-1.5 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-[#cbd5e1] hover:text-white hover:border-[#2a3c58] hover:bg-[#131f33] flex items-center gap-1.5 text-[13px] font-medium transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 size={14} className="text-[#7f91a7]" />
              <span>Share</span>
            </button>

            {/* Edit Project button */}
            <button
              type="button"
              onClick={openEditModal}
              className="px-3.5 py-1.5 h-9 rounded-lg bg-[#0e1727] border border-[#1c293e] text-[#cbd5e1] hover:text-white hover:border-[#2a3c58] hover:bg-[#131f33] flex items-center gap-1.5 text-[13px] font-medium transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Pencil size={14} className="text-[#7f91a7]" />
              <span>Edit Project</span>
            </button>

            {/* Hidden real file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRealFileUpload}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />

            {/* Upload Media (Vibrant Gradient CTA) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 h-9 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#3b82f6] hover:opacity-95 text-white flex items-center gap-2 text-[13px] font-semibold transition-all shadow-[0_2px_14px_rgba(147,51,234,0.35)] cursor-pointer active:scale-95"
            >
              <UploadCloud size={16} />
              <span>Upload Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tabs Bar Matching Screenshot Exactly ─────────────────────────── */}
      <div className="px-4 sm:px-8 relative z-10 shrink-0 border-b border-[#121a28]">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-0.5">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'media', label: 'Media', icon: ImageIcon },
            { id: 'evidence', label: 'Evidence', icon: FileText },
            { id: 'ask', label: 'Ask AI', icon: MessageSquare },
            { id: 'compare', label: 'Compare', icon: ArrowLeftRight },
            { id: 'insights', label: 'Insights', icon: BarChart2 },
            { id: 'report', label: 'Report', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'overview' && motionState !== 'initial') {
                    setMotionState('initial');
                  }
                }}
                className={`py-3 text-[13px] transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 font-medium relative ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-[#6e8098] hover:text-slate-200'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'text-cyan-400' : 'text-[#6e8098]'}
                />
                <span>{tab.label}</span>

                {/* Cyan active underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Content Canvas ─────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-8 py-5 sm:py-6 space-y-6 relative z-10">

        {/* ─── 4 Metric Cards Row Matching Screenshot Exactly ───────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Media Files */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all">
            {/* Subtle blue wave gradient background */}
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-blue-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#13233e] flex items-center justify-center shrink-0 text-[#2563eb]">
                <ImageIcon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  {counts.media}
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Media Files
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  Photos & videos
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Locations */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all">
            {/* Subtle emerald wave gradient background */}
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-emerald-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0d2a22] flex items-center justify-center shrink-0 text-[#10b981]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  {counts.locations}
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Locations
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  Detected from media
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Analyzed */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all">
            {/* Subtle purple wave gradient background */}
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-purple-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#23173d] flex items-center justify-center shrink-0 text-[#a855f7]">
                <BarChart2 size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  {counts.analyzed}
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Analyzed
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  AI processed
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Findings */}
          <div className="relative group overflow-hidden rounded-2xl bg-[#0e1626] border border-[#1b263b] p-4 transition-all">
            {/* Subtle amber wave gradient background */}
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-amber-600/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#2e2113] flex items-center justify-center shrink-0 text-[#f59e0b]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                  {counts.findings}
                </p>
                <p className="text-[12px] font-semibold text-white mt-1 leading-tight">
                  Findings
                </p>
                <p className="text-[11px] text-[#5e7087] leading-tight">
                  Insights generated
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Hero Upload Container Matching Screenshot Exactly ────────────── */}
        {activeTab === 'overview' && motionState !== 'scanning' && motionState !== 'grid' && (
          <div className="relative rounded-2xl border border-dashed border-[#1f2d45] bg-[#0a1120]/80 backdrop-blur-md overflow-hidden p-6 sm:p-10">

            {/* 3-Column Hero Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 min-h-[360px]">

              {/* ── Left Column: Two Angled Floating Cards with Dotted Arrow ── */}
              <div className="lg:col-span-4 relative flex items-center justify-center min-h-[260px]">

                {/* Curved Dotted Trajectory Arrow to center upload circle */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  viewBox="0 0 320 240"
                  fill="none"
                >
                  <path
                    d="M 130 60 C 180 15, 250 30, 290 100"
                    stroke="#4f6b92"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className={motionState === 'flying' ? 'animate-dash-flow' : ''}
                  />
                  {/* Arrowhead */}
                  <polygon
                    points="290,100 282,90 295,94"
                    fill="#4f6b92"
                  />
                </svg>

                {/* Top Card: Photo (JPG • PNG) tilted left */}
                <div
                  onClick={triggerUploadMotion}
                  className={`absolute w-40 sm:w-52 h-26 sm:h-34 rounded-xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-700 ease-out cursor-pointer group ${
                    motionState === 'flying'
                      ? 'translate-x-40 -translate-y-4 scale-75 rotate-0 opacity-40 blur-[0.5px]'
                      : 'top-2 left-2 sm:left-4 -rotate-6 hover:scale-105 hover:rotate-0'
                  }`}
                >
                  <img
                    src={CORAL_ASSETS.photoCard}
                    alt="Coral reef sample"
                    className="w-full h-full object-cover"
                  />
                  {/* Top-left Badge: JPG • PNG */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white tracking-wider">
                    JPG • PNG
                  </div>
                </div>

                {/* Bottom Card: Video (MP4 • MOV) tilted right with Play button */}
                <div
                  onClick={triggerUploadMotion}
                  className={`absolute w-36 sm:w-48 h-24 sm:h-32 rounded-xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-700 ease-out cursor-pointer group ${
                    motionState === 'flying'
                      ? 'translate-x-48 translate-y-6 scale-60 rotate-0 opacity-20 blur-[1px]'
                      : 'bottom-2 left-8 sm:left-16 rotate-4 hover:scale-105 hover:rotate-0'
                  }`}
                >
                  <img
                    src={CORAL_ASSETS.videoCard}
                    alt="Underwater video sample"
                    className="w-full h-full object-cover"
                  />
                  {/* Central Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                      <Play size={16} className="fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Bottom-right Badge: MP4 • MOV */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white tracking-wider">
                    MP4 • MOV
                  </div>
                </div>

              </div>

              {/* ── Center Column: Upload Target Zone ──────────────────────── */}
              <div className="lg:col-span-4 flex flex-col items-center text-center px-2 relative z-10">

                {/* Glowing Circular Upload Target Ring */}
                <div
                  onClick={triggerUploadMotion}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform"
                >
                  {/* Outer Glowing Gradient Halo Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.4)] animate-pulse" />

                  {/* Inner Dark Navy Circle with Cloud Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#0d182d] border border-[#233552] flex items-center justify-center shadow-inner">
                    <UploadCloud size={24} className="text-white" />
                  </div>
                </div>

                {/* Headline & Body */}
                <h3 className="text-xl font-bold text-white tracking-tight">
                  No media yet
                </h3>
                <p className="text-[13px] text-[#718299] mt-1.5 max-w-sm leading-relaxed">
                  Upload photos or videos to get started. Our AI will automatically analyze, organize and extract insights from your media.
                </p>

                {/* Primary CTA Button: Upload Photos or Videos */}
                <div className="flex flex-col items-center gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#2563eb] hover:opacity-95 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(147,51,234,0.35)] transition-all cursor-pointer active:scale-95"
                  >
                    <UploadCloud size={15} />
                    <span>Upload Photos or Videos</span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerUploadMotion}
                    className="text-[11px] text-cyan-400/80 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Sparkles size={11} />
                    <span>or preview interactive motion simulation</span>
                  </button>
                </div>

                {/* File Formats */}
                <p className="text-[11px] text-[#5e7087] mt-3 font-medium">
                  JPG, PNG, MP4, MOV — up to 2GB each
                </p>
              </div>

              {/* ── Right Column: 4 Sleek Capability Pills ─────────────────── */}
              <div className="lg:col-span-4 space-y-3 relative z-10">

                {/* 1. AI Analysis */}
                <div
                  onClick={() => setMotionState('scanning')}
                  className="p-3.5 rounded-xl bg-[#101828]/85 border border-[#1b273d] hover:border-[#2a3c5c] hover:bg-[#141f33] transition-all duration-300 flex items-center gap-3.5 cursor-pointer group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#14233c] text-cyan-400 flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      AI Analysis
                    </h4>
                    <p className="text-[11px] text-[#6d7e95] truncate mt-0.5">
                      Detect projects, locations, activities
                    </p>
                  </div>
                </div>

                {/* 2. Smart Organization */}
                <div
                  onClick={() => {
                    setMotionState('grid');
                    setActiveTab('media');
                  }}
                  className="p-3.5 rounded-xl bg-[#101828]/85 border border-[#1b273d] hover:border-[#2a3c5c] hover:bg-[#141f33] transition-all duration-300 flex items-center gap-3.5 cursor-pointer group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#1a1b38] text-purple-400 flex items-center justify-center shrink-0">
                    <Search size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-purple-300 transition-colors">
                      Smart Organization
                    </h4>
                    <p className="text-[11px] text-[#6d7e95] truncate mt-0.5">
                      Auto-tag and categorize media
                    </p>
                  </div>
                </div>

                {/* 3. Before / After Comparison */}
                <div
                  onClick={() => setActiveTab('compare')}
                  className="p-3.5 rounded-xl bg-[#101828]/85 border border-[#1b273d] hover:border-[#2a3c5c] hover:bg-[#141f33] transition-all duration-300 flex items-center gap-3.5 cursor-pointer group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#112338] text-blue-400 flex items-center justify-center shrink-0">
                    <ArrowLeftRight size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-blue-300 transition-colors">
                      Before / After Comparison
                    </h4>
                    <p className="text-[11px] text-[#6d7e95] truncate mt-0.5">
                      Track visual changes over time
                    </p>
                  </div>
                </div>

                {/* 4. Impact Reports */}
                <div
                  onClick={() => setActiveTab('report')}
                  className="p-3.5 rounded-xl bg-[#101828]/85 border border-[#1b273d] hover:border-[#2a3c5c] hover:bg-[#141f33] transition-all duration-300 flex items-center gap-3.5 cursor-pointer group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0e2722] text-emerald-400 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Impact Reports
                    </h4>
                    <p className="text-[11px] text-[#6d7e95] truncate mt-0.5">
                      Generate reports with evidence
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ─── AI Scanning Stage (Rotating Scan Ring & Bounding Boxes) ─────── */}
        {motionState === 'scanning' && (
          <div className="rounded-2xl border border-cyan-500/40 bg-[#090f1d] shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden p-6 relative animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#182335]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    AI Multimodal Pipeline Active
                  </h3>
                  <p className="text-[12px] text-slate-400">
                    Analyzing coral taxonomy, coverage ratios and spatial anomalies
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMotionState('grid')}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
              >
                <span>View Staggered Media Grid</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Scanning Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
              <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-[#22334e] bg-black aspect-[16/10] shadow-2xl">
                <img
                  src={CORAL_ASSETS.afterReef}
                  alt="Scanning target"
                  className="w-full h-full object-cover opacity-85"
                />

                {/* Rotating Scanning Ring around analysis area */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-60 h-60 rounded-full border border-cyan-400/40 animate-rotate-cw flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                    <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-radar-sweep" />
                  </div>
                  <div className="absolute w-36 h-36 rounded-full border border-purple-400/40 animate-rotate-ccw" />
                </div>

                {/* Scanline */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline" />

                {/* Bounding box detection */}
                <div className="absolute top-12 left-16 px-2.5 py-1.5 rounded-lg border-2 border-cyan-400 bg-cyan-950/60 backdrop-blur-md text-[11px] font-mono text-cyan-200">
                  <span className="font-bold">Acropora Cervicornis</span>: 98.4%
                </div>
              </div>

              {/* Progress & Sequential Status Steps */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#101828] rounded-xl border border-[#1d293d] p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Processing Pipeline</span>
                    <span className="text-cyan-400 font-mono font-bold">{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Frame Ingestion & EXIF Normalization', desc: 'Metadata & camera telemetry parsed' },
                    { title: 'Vision-Language Feature Extraction', desc: 'Gemini 2.5 multimodal tensor mapping' },
                    { title: 'Species Classification & Health Scoring', desc: 'Acropora branching density verified' },
                    { title: 'Geo-spatial Mapping & Finding Generation', desc: 'GPS geo-pins & evidence references stored' }
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        scanStep >= idx
                          ? 'bg-[#0f1724] border-emerald-500/30'
                          : 'bg-[#0c121e] border-[#182335] opacity-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {scanStep >= idx ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-semibold ${scanStep >= idx ? 'text-emerald-300' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Staggered Media Grid (When Populated) ────────────────────────── */}
        {(motionState === 'grid' || activeTab === 'media') && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Analyzed Evidence Library
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 tabular-nums">
                  {mediaList.length} items
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <UploadCloud size={13} />
                  <span>Upload Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMotionState('initial')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1727] border border-[#1c293e] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Screenshot State</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediaList.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="rounded-xl overflow-hidden bg-[#0c1220] border border-[#182336] hover:border-cyan-500/50 hover:shadow-[0_8px_25px_rgba(34,211,238,0.1)] transition-all duration-300 cursor-pointer flex flex-col group"
                  style={{
                    animation: `springPopIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(idx * 0.05, 0.4)}s both`
                  }}
                  onClick={() => setSelectedMediaDetail(card)}
                >
                  <div className="aspect-[16/10] bg-[#070b12] relative overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300">
                      {card.tag}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                      {card.health}
                    </div>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[13px] font-semibold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-[#6d7e95] mt-1">{card.loc} • {card.date}</p>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-[#141d2d] flex items-center justify-between text-[11px] text-[#5e7087]">
                      <span>{card.res || '4K Ultra-HD'}</span>
                      <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium">
                        <span>Inspect</span>
                        <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Before / After Comparison (Compare Tab) ─────────────────────── */}
        {activeTab === 'compare' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0b101c] border border-[#162032]">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Temporal Change Verification (May 2024 vs March 2026)
                </h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Drag the split slider or activate auto-sweep to observe reef recovery over 22 months.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSweeping(prev => !prev)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSweeping
                      ? 'bg-cyan-500 text-white border-cyan-400'
                      : 'bg-[#111724] border-[#1f2b3e] text-slate-300'
                  }`}
                >
                  <Activity size={14} />
                  <span>{isSweeping ? 'Pause Sweep' : 'Auto-Sweep'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHeatmap(prev => !prev)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showHeatmap
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-[#111724] border-[#1f2b3e] text-slate-300'
                  }`}
                >
                  <Zap size={14} />
                  <span>{showHeatmap ? 'Hide Heatmap' : 'Heatmap Diff'}</span>
                </button>
              </div>
            </div>

            {/* Split Slider Viewport */}
            <div
              ref={sliderContainerRef}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              className="relative w-full aspect-[16/9] max-h-[500px] rounded-2xl overflow-hidden border border-[#223049] bg-black shadow-2xl select-none cursor-ew-resize touch-none"
            >
              {/* After Image Layer */}
              <div className="absolute inset-0">
                <img
                  src={CORAL_ASSETS.afterReef}
                  alt="March 2026"
                  className="w-full h-full object-cover"
                />
                {showHeatmap && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-cyan-400/35 to-transparent mix-blend-screen pointer-events-none" />
                )}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  March 2026: Restored Colony
                </div>
              </div>

              {/* Before Image Layer */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={CORAL_ASSETS.beforeReef}
                  alt="May 2024"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  May 2024: Degraded Baseline
                </div>
              </div>

              {/* Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[3px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
                  <ArrowLeftRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Insights Tab (Progressive Drawing Charts) ───────────────────── */}
        {activeTab === 'insights' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0b101c] border border-[#162032]">
                <p className="text-xs text-slate-400">Net Coral Recovery</p>
                <p className="text-2xl font-bold text-emerald-400">+68.4%</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0b101c] border border-[#162032]">
                <p className="text-xs text-slate-400">Shannon Biodiversity Index</p>
                <p className="text-2xl font-bold text-cyan-400">3.84 H'</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0b101c] border border-[#162032]">
                <p className="text-xs text-slate-400">Carbon Sequestration</p>
                <p className="text-2xl font-bold text-purple-400">14.8 t/ha/yr</p>
              </div>
            </div>

            {/* Metric Switcher Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {[
                { id: 'coral', label: 'Live Coral Cover', change: '+68.4%', color: 'border-cyan-400 text-cyan-400' },
                { id: 'bleaching', label: 'Thermal Bleaching Surface', change: '-64.8%', color: 'border-rose-400 text-rose-400' },
                { id: 'rugosity', label: 'Structural Rugosity Index', change: '+2.4 Index', color: 'border-purple-400 text-purple-400' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setInsightsMetric(m.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    insightsMetric === m.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'bg-[#0e1627] border border-[#1b273d] text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    insightsMetric === m.id ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {m.change}
                  </span>
                </button>
              ))}
            </div>

            {/* Progressive Line Chart */}
            {(() => {
              const currentCfg = {
                coral: {
                  title: 'Progressive Coral Cover Recovery (2024 - 2026)',
                  strokeColor: '#22d3ee',
                  path: 'M 50 190 Q 180 180, 260 145 T 460 85 T 670 45',
                  points: [
                    { cx: 50, cy: 190, val: '14.2%', label: 'May 24' },
                    { cx: 200, cy: 165, val: '28.0%', label: 'Oct 24' },
                    { cx: 340, cy: 125, val: '46.5%', label: 'Mar 25' },
                    { cx: 480, cy: 80, val: '64.2%', label: 'Oct 25' },
                    { cx: 670, cy: 45, val: '82.6%', label: 'Mar 26' }
                  ]
                },
                bleaching: {
                  title: 'Thermal Bleaching Surface Anomaly Suppression',
                  strokeColor: '#f43f5e',
                  path: 'M 50 50 Q 180 80, 260 120 T 460 175 T 670 200',
                  points: [
                    { cx: 50, cy: 50, val: '64.8%', label: 'May 24' },
                    { cx: 200, cy: 90, val: '42.1%', label: 'Oct 24' },
                    { cx: 340, cy: 135, val: '18.4%', label: 'Mar 25' },
                    { cx: 480, cy: 175, val: '4.2%', label: 'Oct 25' },
                    { cx: 670, cy: 200, val: '0.0%', label: 'Mar 26' }
                  ]
                },
                rugosity: {
                  title: '3D Habitat Rugosity & Structural Complexity Accretion',
                  strokeColor: '#a855f7',
                  path: 'M 50 180 Q 180 150, 260 120 T 460 70 T 670 40',
                  points: [
                    { cx: 50, cy: 180, val: '1.2 Index', label: 'May 24' },
                    { cx: 200, cy: 145, val: '1.8 Index', label: 'Oct 24' },
                    { cx: 340, cy: 110, val: '2.5 Index', label: 'Mar 25' },
                    { cx: 480, cy: 70, val: '3.1 Index', label: 'Oct 25' },
                    { cx: 670, cy: 40, val: '3.6 Index', label: 'Mar 26' }
                  ]
                }
              }[insightsMetric];

              return (
                <div className="p-6 rounded-2xl bg-[#0b101c] border border-[#192437] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {currentCfg.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Telemetry Interval: Bi-monthly
                    </span>
                  </div>
                  <div className="relative w-full aspect-[21/9] min-h-[220px]">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" fill="none">
                      <path
                        d={currentCfg.path}
                        stroke={currentCfg.strokeColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset="0"
                        className="transition-all duration-700 ease-out"
                      />
                      {currentCfg.points.map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.cx} cy={pt.cy} r="6" fill="#0c1220" stroke={currentCfg.strokeColor} strokeWidth="2.5" />
                          <text x={pt.cx} y={pt.cy - 12} fill={currentCfg.strokeColor} fontSize="11" fontWeight="bold" textAnchor="middle">
                            {pt.val}
                          </text>
                          <text x={pt.cx} y="220" fill="#64748b" fontSize="11" textAnchor="middle">
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ─── Evidence Tab (Findings & Annotations Explorer) ──────────────── */}
        {activeTab === 'evidence' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0b101c] border border-[#162032]">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Visual Evidence Findings & AI Annotations
                </h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  19 verified ecological observations with confidence scores, GPS telemetry, and taxonomic classifications.
                </p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {['All', 'Acropora', 'Bleaching', 'Substrate', 'Fish Biomass'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setEvidenceFilter(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      evidenceFilter === tag
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                        : 'bg-[#111724] border border-[#1f2b3e] text-slate-300 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  id: 'ev-1',
                  title: 'Acropora Cervicornis Active Calcification',
                  category: 'Acropora',
                  confidence: '98.4%',
                  observation: 'Substantial linear extension along terminal axial polyps. Coral tissue exhibits deep pigmentation indicating thriving endosymbiont zooxanthellae.',
                  gps: '16.824° S, 145.892° E',
                  depth: '8.4m',
                  date: 'March 2026',
                  img: CORAL_ASSETS.photoCard
                },
                {
                  id: 'ev-2',
                  title: 'Zero Thermal Bleaching Anomaly Detection',
                  category: 'Bleaching',
                  confidence: '99.1%',
                  observation: 'Spectral analysis confirms normal chlorophyll absorption (Fv/Fm > 0.65). No pale or fluorescent thermal stress responses detected.',
                  gps: '16.819° S, 145.885° E',
                  depth: '12.2m',
                  date: 'March 2026',
                  img: CORAL_ASSETS.afterReef
                },
                {
                  id: 'ev-3',
                  title: 'Herbivorous Reef Fish Biomass Resurgence',
                  category: 'Fish Biomass',
                  confidence: '94.5%',
                  observation: 'Parrotfish (Scarus frenatus) schools actively grazing turf algae on former coral rubble, promoting natural coral recruitment.',
                  gps: '16.828° S, 145.899° E',
                  depth: '6.5m',
                  date: 'Feb 2026',
                  img: CORAL_ASSETS.videoCard
                },
                {
                  id: 'ev-4',
                  title: 'Pink Encrusting Coralline Algae (CCA) Substrate',
                  category: 'Substrate',
                  confidence: '96.2%',
                  observation: 'CCA coverage measured at 42.4% across quadrant 4, solidifying substrate and releasing biochemical settlement cues for larval polyps.',
                  gps: '16.832° S, 145.912° E',
                  depth: '7.8m',
                  date: 'Feb 2026',
                  img: CORAL_ASSETS.extra1
                },
                {
                  id: 'ev-5',
                  title: 'Drone Lagoon Orthomosaic Sector Boundary',
                  category: 'Habitat',
                  confidence: '97.8%',
                  observation: 'Multispectral photogrammetry confirms 1.4 square kilometers of contiguous nursery zone with structural complexity +2.4.',
                  gps: '16.820° S, 145.890° E',
                  depth: 'Lagoon Floor',
                  date: 'Jan 2026',
                  img: CORAL_ASSETS.extra2
                },
                {
                  id: 'ev-6',
                  title: 'Underwater Spider Frame Outplant Survival',
                  category: 'Acropora',
                  confidence: '100%',
                  observation: '100% survivorship across 24 outplant nodes attached to modular steel frame 12, with self-cementation observed at contact points.',
                  gps: '16.826° S, 145.895° E',
                  depth: '9.2m',
                  date: 'Jan 2026',
                  img: CORAL_ASSETS.extra3
                }
              ]
                .filter(item => evidenceFilter === 'All' || item.category === evidenceFilter)
                .map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvidence(ev)}
                    className="rounded-2xl overflow-hidden bg-[#0c1220] border border-[#182336] hover:border-cyan-500/50 hover:shadow-[0_8px_25px_rgba(34,211,238,0.1)] transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-black/60 relative overflow-hidden">
                        <img
                          src={ev.img}
                          alt={ev.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300">
                          {ev.category}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                          {ev.confidence} Confidence
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-[14px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {ev.title}
                        </h4>
                        <p className="text-[12px] text-[#718299] leading-relaxed line-clamp-3">
                          {ev.observation}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#080d18] border-t border-[#141d2d] flex items-center justify-between text-xs">
                      <span className="text-[#5a6d85] font-mono text-[11px]">{ev.gps} • {ev.depth}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvidence(ev);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ─── Ask AI Tab (Interactive Visual Intelligence Chat) ───────────── */}
        {activeTab === 'ask' && (
          <div className="space-y-4 animate-fade-in max-w-4xl mx-auto">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-[#0b101c] border border-[#162032] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    ImpactLens Multimodal Visual Intelligence
                  </h3>
                  <p className="text-xs text-slate-400">
                    Grounded in 24 visual captures, photogrammetry tiles, and EXIF spatial telemetry for Coral Reef Survey
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Gemini 2.5 Pro Vision Active</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setChatMessages([
                      {
                        sender: 'ai',
                        text: 'Hello! I am ImpactLens Vision Intelligence. I have ingested all visual captures and EXIF spatial vectors for Coral Reef Survey. What would you like to verify or query?',
                        time: 'Just now'
                      }
                    ]);
                    toast.success('Chat history cleared');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#111c2e] hover:bg-[#1a2942] border border-[#1e2e46] text-slate-400 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = chatMessages.map(m => `[${m.sender.toUpperCase()} - ${m.time}]: ${m.text}`).join('\n\n');
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `impactlens-ai-chat-${Date.now()}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Chat transcript exported');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#111c2e] hover:bg-[#1a2942] border border-[#1e2e46] text-cyan-400 hover:text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Quick Query Suggestion Chips */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {[
                'What is the live coral cover in Sector 4-B?',
                'Did the AI detect any bleaching or mortality?',
                'List dominant coral species identified',
                'What is the structural rugosity score?'
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(query)}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1627] border border-[#1b273d] hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs transition-all cursor-pointer whitespace-nowrap shadow-sm"
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Chat Message Stream */}
            <div className="p-4 rounded-2xl bg-[#090f1d] border border-[#162236] min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                      <Sparkles size={15} />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-xl text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-[#101828] border border-[#1a263d] text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[10px] text-slate-400 mt-1.5 opacity-70">
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      KC
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div className="p-3 rounded-2xl bg-[#101828] border border-[#1a263d] text-slate-400 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Analyzing visual evidence tensors...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask any question grounded in the visual evidence..."
                className="flex-1 bg-[#0b101c] border border-[#1a2538] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/25"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        )}

        {/* ─── Report Tab (Full Site Impact & Compliance Audit Document) ───── */}
        {activeTab === 'report' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#0b101c] border border-cyan-500/30 shadow-[0_8px_35px_rgba(34,211,238,0.12)] space-y-6">

              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#162032]">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    ● Audit-Certified Document
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">
                    Coral Reef Survey — Site Assessment & Impact Audit Report
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Temporal verification baseline: May 2024 vs March 2026 (22 Months Continuous Survey)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const reportContent = `IMPACTLENS ESG & ECOLOGICAL RESTORATION AUDIT REPORT
================================================================================
Project: ${projectName}
Status: ${projectStatus}
Location: ${projectLocation}
Evaluation Period: May 2024 — March 2026 (22 Months Continuous Survey)
Auditor: Dr. Elena Rostova & NOAA Sanctuary Directorate
Cryptographic Seal: SHA-256 8f4c391a92e105b9cd4128f731e0892a0e

KEY ECOLOGICAL METRICS:
- Live Coral Cover (Acropora): +68.4% Accretion (14.2% -> 82.6%)
- Thermal Bleaching Surface: -64.8% Reduction (64.8% -> 0.0%)
- 3D Structural Rugosity Index: +2.4 Gain (1.2 -> 3.6 Complex)
- Herbivorous Fish Biomass: +300% (4x) Increase (120 g/m² -> 480 g/m²)

COMPLIANCE:
Verra VCS / ISO 14064-2 Compliant Ecological Recovery Standard
Report Generated: ${new Date().toLocaleString()}
================================================================================`;
                      const blob = new Blob([reportContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-audit-report.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Downloaded ESG verification audit certificate');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#111824] border border-[#1d2b3f] hover:border-cyan-400 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={14} className="text-cyan-400" />
                    <span>Download Audit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-lg bg-[#111824] border border-[#1d2b3f] hover:border-purple-400 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer size={14} className="text-purple-400" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Executive Summary</h4>
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  This report certifies the outcomes of the Coral Reef Restoration Initiative in Sector 4-B (Great Barrier Reef). Utilizing multimodal high-resolution underwater transects, multispectral drone photogrammetry, and computer vision segmentation (Gemini 2.5 Pro Vision), the site demonstrates a statistically validated <span className="text-emerald-400 font-bold">+68.4% net live coral recovery</span> with zero active bleaching anomalies.
                </p>
              </div>

              {/* Quantitative Metrics Comparison Table */}
              <div className="rounded-xl border border-[#182336] overflow-x-auto bg-[#080d18]">
                <table className="w-full min-w-[540px] text-left text-xs">
                  <thead className="bg-[#0f1728] border-b border-[#182336] text-[#6d7e95] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Indicator</th>
                      <th className="px-4 py-3">May 2024 Baseline</th>
                      <th className="px-4 py-3">March 2026 Outcome</th>
                      <th className="px-4 py-3">Net Variance</th>
                      <th className="px-4 py-3">Verification Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141f32] text-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">Live Coral Cover (Acropora)</td>
                      <td className="px-4 py-3 text-amber-400">14.2%</td>
                      <td className="px-4 py-3 text-emerald-400 font-bold">82.6%</td>
                      <td className="px-4 py-3 text-emerald-400 font-bold">+68.4%</td>
                      <td className="px-4 py-3 font-mono text-cyan-400">98.4%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">Thermal Bleached Surface</td>
                      <td className="px-4 py-3 text-red-400">64.8%</td>
                      <td className="px-4 py-3 text-emerald-400 font-bold">0.0%</td>
                      <td className="px-4 py-3 text-emerald-400 font-bold">-64.8%</td>
                      <td className="px-4 py-3 font-mono text-cyan-400">99.1%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">3D Structural Rugosity Index</td>
                      <td className="px-4 py-3 text-slate-400">1.2 (Low Relief)</td>
                      <td className="px-4 py-3 text-cyan-400 font-bold">3.6 (Complex)</td>
                      <td className="px-4 py-3 text-cyan-400 font-bold">+2.4 Index</td>
                      <td className="px-4 py-3 font-mono text-cyan-400">96.5%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">Herbivorous Fish Biomass</td>
                      <td className="px-4 py-3 text-slate-400">120 g/m²</td>
                      <td className="px-4 py-3 text-purple-400 font-bold">480 g/m²</td>
                      <td className="px-4 py-3 text-purple-400 font-bold">+300% (4x)</td>
                      <td className="px-4 py-3 font-mono text-cyan-400">94.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cryptographic Verification Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#080d18] border border-[#141d2d]">
                  <span className="text-[11px] text-[#5e7087]">ESG Standard Accreditation</span>
                  <p className="text-sm font-bold text-white mt-0.5">Verra VCS / ISO 14064-2 Compliant</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080d18] border border-[#141d2d]">
                  <span className="text-[11px] text-[#5e7087]">Immutable Cryptographic Seal</span>
                  <p className="text-xs font-mono text-cyan-400 mt-1 truncate">
                    SHA-256: 8f4c391a92e105b9cd4128f731e0892a
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-4 border-t border-[#141d2d] flex items-center justify-between text-xs text-[#6e8098]">
                <span>Certified by: Dr. Elena Rostova &amp; NOAA Sanctuary Directorate</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span>Legally Verified Audit Record</span>
                </span>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ─── Edit Project Modal Dialog ────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop click dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0b1322] border border-[#1e2e46] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85)] z-10 overflow-hidden text-white max-h-[90vh] flex flex-col">
            {/* Header glow accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 shrink-0" />

            <div className="p-4 sm:p-6 overflow-y-auto">
              {/* Top Title Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#162235]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Pencil size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Edit Project</h2>
                    <p className="text-xs text-[#6e8098]">Update workspace telemetry, metadata and lifecycle</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#111c2e] hover:bg-[#1a2942] border border-[#1e2e46] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProject} className="mt-5 space-y-4">
                {/* Project Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8295ad] mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Coral Reef Survey"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c16] border border-[#1b293e] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-600 outline-none transition-all font-medium"
                  />
                </div>

                {/* Status & Location in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Lifecycle Status */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8295ad] mb-1.5">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070c16] border border-[#1b293e] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="Monitoring">🔵 Monitoring</option>
                      <option value="Completed">🟣 Completed</option>
                      <option value="Archived">⚪ Archived</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8295ad] mb-1.5">
                      Transect / Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Great Barrier Reef, Sector 4-B"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c16] border border-[#1b293e] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8295ad] mb-1.5">
                    Description &amp; Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.desc}
                    onChange={(e) => setEditForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Brief description of survey transects and conservation objectives..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c16] border border-[#1b293e] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-600 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-[#162235] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Project</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-[#111c2e] hover:bg-[#17253d] border border-[#1e2e46] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#3b82f6] hover:opacity-95 text-white text-xs font-semibold transition-all shadow-[0_2px_14px_rgba(147,51,234,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Check size={14} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Project Confirmation Modal ────────────────────────────── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsDeleteModalOpen(false)}
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
                  Are you sure you want to permanently delete <span className="font-bold text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">"{projectName}"</span>?
                </p>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-300 leading-relaxed">
                  This will permanently destroy all 24 visual captures, photogrammetry tiles, temporal baselines, and certified ESG audit compliance certificates.
                </div>
              </div>

              <div className="pt-4 border-t border-[#162235] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#111c2e] hover:bg-[#17253d] border border-[#1e2e46] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
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

      {/* ─── Forensic Evidence Inspection Modal ──────────────────────────── */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedEvidence(null)}
          />

          <div className="relative w-full max-w-3xl rounded-2xl bg-[#0b1322] border border-[#1e2e46] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9)] z-10 overflow-hidden text-white max-h-[90vh] flex flex-col">
            {/* Header Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

            {/* Top Bar */}
            <div className="p-4 sm:p-5 border-b border-[#162235] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      {selectedEvidence.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                      {selectedEvidence.confidence} Verified Confidence
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                    {selectedEvidence.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="w-8 h-8 rounded-lg bg-[#111c2e] hover:bg-[#1a2942] border border-[#1e2e46] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* High-res Image & Bounding Box Visual Inspection */}
              <div className="relative rounded-xl overflow-hidden border border-[#1e2e46] bg-black aspect-[16/9] shadow-inner group">
                <img
                  src={selectedEvidence.img}
                  alt={selectedEvidence.title}
                  className="w-full h-full object-cover"
                />
                {/* Visual Bounding Overlay */}
                <div className="absolute inset-0 pointer-events-none border-2 border-cyan-400/40 m-6 rounded-lg bg-cyan-500/5 flex items-start p-3">
                  <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-cyan-400/50 text-[11px] font-mono text-cyan-300">
                    Target Identification Tensor: {selectedEvidence.category} (98.4%)
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
                  {selectedEvidence.gps} • Depth: {selectedEvidence.depth}
                </div>
              </div>

              {/* Forensic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Observation Narrative */}
                <div className="p-4 rounded-xl bg-[#070c16] border border-[#162338] space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Observation Narrative
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedEvidence.observation}
                  </p>
                </div>

                {/* Taxonomic Classification Tree */}
                <div className="p-4 rounded-xl bg-[#070c16] border border-[#162338] space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Taxonomic Classification
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-slate-500">Phylum:</span> <span className="text-slate-200">Cnidaria</span></div>
                    <div><span className="text-slate-500">Class:</span> <span className="text-slate-200">Anthozoa</span></div>
                    <div><span className="text-slate-500">Order:</span> <span className="text-slate-200">Scleractinia</span></div>
                    <div><span className="text-slate-500">Family:</span> <span className="text-slate-200">Acroporidae</span></div>
                    <div><span className="text-slate-500">Genus:</span> <span className="text-cyan-300 font-semibold">Acropora</span></div>
                    <div><span className="text-slate-500">Species:</span> <span className="text-cyan-300 font-semibold italic">A. cervicornis</span></div>
                  </div>
                </div>
              </div>

              {/* Subsea Telemetry Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#080e1a] border border-[#141d2d]">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Water Temp</span>
                  <p className="text-sm font-bold text-white mt-0.5">26.8°C (Optimal)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1a] border border-[#141d2d]">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Salinity</span>
                  <p className="text-sm font-bold text-cyan-400 mt-0.5">35.2 PSU</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1a] border border-[#141d2d]">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Photosynthetic PAR</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">420 µmol/m²/s</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1a] border border-[#141d2d]">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Fv/Fm Yield</span>
                  <p className="text-sm font-bold text-purple-400 mt-0.5">0.68 (Healthy)</p>
                </div>
              </div>

              {/* Cryptographic Seal */}
              <div className="p-3.5 rounded-xl bg-[#080e1a] border border-[#162338] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] truncate">
                    Hash: 8f4c391a92e105b9cd4128f731e0892a0e...
                  </span>
                </div>
                <span className="text-emerald-400 font-semibold shrink-0">Verra VCS Validated</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-[#162235] bg-[#090f1d] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const evToQuery = selectedEvidence;
                  setSelectedEvidence(null);
                  setActiveTab('ask');
                  handleSendMessage(`Can you provide a deep-dive analysis on the ${evToQuery.title} observation?`);
                }}
                className="px-4 py-2 rounded-xl bg-[#111c2e] hover:bg-[#182740] border border-[#1e2e46] text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-cyan-400" />
                <span>Ask AI About This</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#7c3aed] to-[#3b82f6] hover:opacity-95 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Media Detail Lightbox Modal ──────────────────────────────────── */}
      {selectedMediaDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedMediaDetail(null)}
          />

          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0b1322] border border-[#1e2e46] shadow-2xl z-10 overflow-hidden text-white flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#162235] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-white">{selectedMediaDetail.title}</h3>
                <p className="text-xs text-slate-400">{selectedMediaDetail.loc} • {selectedMediaDetail.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMediaDetail(null)}
                className="w-8 h-8 rounded-lg bg-[#111c2e] hover:bg-[#1a2942] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="aspect-[16/10] bg-black rounded-xl overflow-hidden border border-[#1a263a]">
                <img
                  src={selectedMediaDetail.img}
                  alt={selectedMediaDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#070c16] border border-[#141d2d]">
                  <span className="text-[10px] text-slate-500 uppercase">Camera</span>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">{selectedMediaDetail.camera || 'Sony A7R IV'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#070c16] border border-[#141d2d]">
                  <span className="text-[10px] text-slate-500 uppercase">Resolution</span>
                  <p className="font-semibold text-cyan-400 truncate mt-0.5">{selectedMediaDetail.res || '4K Ultra-HD'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#070c16] border border-[#141d2d]">
                  <span className="text-[10px] text-slate-500 uppercase">Depth</span>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">{selectedMediaDetail.depth || '8.4m'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#070c16] border border-[#141d2d]">
                  <span className="text-[10px] text-slate-500 uppercase">GPS</span>
                  <p className="font-mono text-[11px] text-emerald-400 truncate mt-0.5">{selectedMediaDetail.gps || '16.824° S'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#162235] bg-[#090f1d] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedMediaDetail(null);
                  setActiveTab('compare');
                }}
                className="px-4 py-2 rounded-xl bg-[#111c2e] hover:bg-[#182740] border border-[#1e2e46] text-cyan-300 text-xs font-semibold cursor-pointer"
              >
                Compare in Temporal Slider
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediaDetail(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

