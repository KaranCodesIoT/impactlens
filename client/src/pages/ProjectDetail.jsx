import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Image as ImageIcon, MessageCircle, ArrowLeftRight, FileText,
  MapPin, Tag, Brain, Sparkles, X, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProject } from '../services/api';
import { analyzeMedia as triggerAnalysis, getMedia as fetchMediaDetail } from '../services/api';
import { useMedia } from '../hooks/useMedia';
import MediaUploader from '../components/MediaUploader';
import MediaGrid from '../components/MediaGrid';
import FindingCard from '../components/FindingCard';
import ChatPanel from '../components/ChatPanel';
import BeforeAfter from '../components/BeforeAfter';
import ReportPreview from '../components/ReportPreview';
import { getDetailUrl } from '../utils/cloudinary';

const TABS = [
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'chat', label: 'Q&A', icon: MessageCircle },
  { id: 'compare', label: 'Compare', icon: ArrowLeftRight },
  { id: 'report', label: 'Report', icon: FileText },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);

  const { media, loading: mediaLoading, fetchMedia, addMedia, removeMedia, updateMediaItem } = useMedia(id);

  // Load project details
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (err) {
        toast.error('Failed to load project');
      } finally {
        setProjectLoading(false);
      }
    };
    load();
  }, [id]);

  // Poll for analysis updates every 10s
  useEffect(() => {
    const pendingCount = media.filter(m =>
      m.analysis?.status === 'pending' || m.analysis?.status === 'analyzing'
    ).length;

    if (pendingCount === 0) return;

    const interval = setInterval(() => {
      fetchMedia();
    }, 10000);

    return () => clearInterval(interval);
  }, [media, fetchMedia]);

  const handleMediaAdded = (newMedia) => {
    addMedia(newMedia);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Delete this media?')) return;
    try {
      await removeMedia(mediaId);
      if (selectedMedia?._id === mediaId) setSelectedMedia(null);
      toast.success('Media deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleViewMedia = async (mediaItem) => {
    try {
      const detail = await fetchMediaDetail(mediaItem._id);
      setSelectedMedia(detail);
    } catch {
      setSelectedMedia(mediaItem);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedMedia) return;
    try {
      toast.loading('Re-analyzing...', { id: 'reanalyze' });
      const updated = await triggerAnalysis(selectedMedia._id);
      setSelectedMedia(updated);
      updateMediaItem(updated._id, updated);
      toast.success('Analysis complete!', { id: 'reanalyze' });
    } catch (err) {
      toast.error('Analysis failed', { id: 'reanalyze' });
    }
  };

  if (projectLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-8 skeleton w-1/3" />
        <div className="h-4 skeleton w-1/2" />
        <div className="h-48 skeleton rounded-2xl" />
      </div>
    );
  }

  if (!project) {
    return <div className="text-center py-20 text-surface-700">Project not found</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Project Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">{project.name}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-surface-700">
          {project.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {project.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Tag size={13} /> {project.category}
          </span>
          <span className="flex items-center gap-1.5">
            <ImageIcon size={13} /> {project.stats?.totalMedia || media.length} media
          </span>
          <span className="flex items-center gap-1.5">
            <Brain size={13} className="text-accent-400" /> {project.stats?.analyzedMedia || 0} analyzed
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-warning-500" /> {project.stats?.findings || 0} findings
          </span>
        </div>
        {project.description && (
          <p className="text-sm text-surface-700 mt-2">{project.description}</p>
        )}
      </div>

      {/* Upload */}
      <MediaUploader
        projectId={id}
        projectSlug={project.slug}
        onMediaAdded={handleMediaAdded}
      />

      {/* Tabs */}
      <div className="flex gap-1 mt-8 mb-6 p-1 glass rounded-xl inline-flex">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-500/10'
                  : 'text-surface-700 hover:text-surface-200 hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className={selectedMedia && activeTab === 'gallery' ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {activeTab === 'gallery' && (
            <MediaGrid
              media={media}
              loading={mediaLoading}
              onView={handleViewMedia}
              onDelete={handleDeleteMedia}
            />
          )}

          {activeTab === 'chat' && (
            <ChatPanel projectId={id} />
          )}

          {activeTab === 'compare' && (
            <BeforeAfter media={media} projectId={id} />
          )}

          {activeTab === 'report' && (
            <ReportPreview projectId={id} media={media} />
          )}
        </div>

        {/* Detail Panel (only in gallery tab) */}
        {selectedMedia && activeTab === 'gallery' && (
          <div className="lg:col-span-1 animate-slide-up">
            <div className="sticky top-24">
              {/* Close button */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-200">Media Details</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="btn btn-icon text-surface-700 hover:text-surface-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Detail Image */}
              <div className="glass-card overflow-hidden rounded-xl mb-4">
                {selectedMedia.resourceType === 'video' ? (
                  <video
                    src={selectedMedia.cloudinaryUrl}
                    controls
                    className="w-full max-h-64 object-contain bg-black"
                  />
                ) : (
                  <img
                    src={getDetailUrl(selectedMedia.cloudinaryId)}
                    alt={selectedMedia.originalFilename}
                    className="w-full max-h-64 object-contain bg-black/50"
                  />
                )}
              </div>

              {/* Analysis */}
              <FindingCard
                analysis={selectedMedia.analysis}
                cloudinaryUrl={selectedMedia.cloudinaryUrl}
                cloudinaryId={selectedMedia.cloudinaryId}
                onReanalyze={handleReanalyze}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
