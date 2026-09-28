import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers, Image, MessageSquare, ArrowLeftRight,
  FileText, Sparkles, UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProject, updateProject, analyzeMedia as triggerAnalysis, getMedia as fetchMediaDetail } from '../services/api';
import { useMedia } from '../hooks/useMedia';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import EvidenceDrawer from '../components/EvidenceDrawer';
import MediaUploader from '../components/MediaUploader';
import AIProcessingPipeline from '../components/AIProcessingPipeline';
import MediaGrid from '../components/MediaGrid';
import ChatPanel from '../components/ChatPanel';
import BeforeAfter from '../components/BeforeAfter';
import ReportPreview from '../components/ReportPreview';
import InsightsView from '../components/InsightsView';

const WORKSPACE_TABS = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'evidence', label: 'Evidence', icon: Image },
  { id: 'ask', label: 'Ask', icon: MessageSquare },
  { id: 'compare', label: 'Compare', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'report', label: 'Report', icon: FileText }
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('evidence');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);

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

  // Check if any media is actively analyzing
  const analyzingMedia = media.filter(m =>
    m.analysis?.status === 'pending' || m.analysis?.status === 'analyzing'
  );
  const isAnalyzing = analyzingMedia.length > 0;

  // Poll for analysis updates when pending
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      fetchMedia();
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnalyzing, fetchMedia]);

  const handleMediaAdded = (newMedia) => {
    addMedia(newMedia);
    if (!project?.coverImage && newMedia.cloudinaryUrl && newMedia.resourceType === 'image') {
      setProject(prev => prev ? { ...prev, coverImage: newMedia.cloudinaryUrl } : prev);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Delete this media asset?')) return;
    try {
      await removeMedia(mediaId);
      if (selectedMedia?._id === mediaId) setSelectedMedia(null);
      toast.success('Media removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleViewMedia = async (mediaItem) => {
    try {
      const detail = await fetchMediaDetail(mediaItem._id);
      setSelectedMedia(detail);
      setActiveTab('evidence');
    } catch {
      setSelectedMedia(mediaItem);
      setActiveTab('evidence');
    }
  };

  const handleSetCover = async (imageUrl) => {
    try {
      const updated = await updateProject(id, { coverImage: imageUrl });
      setProject(prev => ({ ...prev, coverImage: updated.coverImage }));
      toast.success('Cover updated');
    } catch {
      toast.error('Failed to update cover');
    }
  };

  const handleReanalyze = async (targetId) => {
    const idToAnalyze = targetId || selectedMedia?._id;
    if (!idToAnalyze) return;

    updateMediaItem(idToAnalyze, {
      analysis: { status: 'analyzing' }
    });
    if (selectedMedia?._id === idToAnalyze) {
      setSelectedMedia(prev => prev ? {
        ...prev,
        analysis: { status: 'analyzing' }
      } : prev);
    }

    try {
      toast.loading('Analyzing...', { id: `reanalyze-${idToAnalyze}` });
      const updated = await triggerAnalysis(idToAnalyze);
      if (selectedMedia?._id === idToAnalyze) setSelectedMedia(updated);
      updateMediaItem(updated._id, updated);
      toast.success('Analysis complete', { id: `reanalyze-${idToAnalyze}` });
      fetchMedia();
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Analysis failed';
      updateMediaItem(idToAnalyze, {
        analysis: { status: 'failed', error: errMsg }
      });
      if (selectedMedia?._id === idToAnalyze) {
        setSelectedMedia(prev => prev ? {
          ...prev,
          analysis: { status: 'failed', error: errMsg }
        } : prev);
      }
      toast.error(errMsg, { id: `reanalyze-${idToAnalyze}` });
    }
  };

  const handleRetryAllFailed = async () => {
    const failedList = media.filter(m => m.analysis?.status === 'failed');
    if (failedList.length === 0) return;

    failedList.forEach(m => {
      updateMediaItem(m._id, { analysis: { status: 'analyzing' } });
    });
    if (selectedMedia && failedList.some(m => m._id === selectedMedia._id)) {
      setSelectedMedia(prev => prev ? { ...prev, analysis: { status: 'analyzing' } } : prev);
    }

    toast.loading(`Analyzing ${failedList.length} items...`, { id: 'retry-batch' });
    let successCount = 0;
    let lastErrorMsg = '';

    for (const m of failedList) {
      try {
        const updated = await triggerAnalysis(m._id);
        updateMediaItem(updated._id, updated);
        if (selectedMedia?._id === m._id) setSelectedMedia(updated);
        successCount++;
      } catch (err) {
        lastErrorMsg = err.response?.data?.error || err.message || 'Analysis failed';
        console.error(`Analysis failed for ${m._id}:`, err);
        updateMediaItem(m._id, { analysis: { status: 'failed', error: lastErrorMsg } });
        if (selectedMedia?._id === m._id) {
          setSelectedMedia(prev => prev ? { ...prev, analysis: { status: 'failed', error: lastErrorMsg } } : prev);
        }
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} item(s) analyzed`, { id: 'retry-batch' });
    } else {
      toast.error(lastErrorMsg || 'Analysis failed', { id: 'retry-batch', duration: 5000 });
    }
    fetchMedia();
  };

  const uniqueLocations = new Set(
    media
      .map(m => m.analysis?.result?.locationClues?.estimatedRegion || m.analysis?.result?.scene?.setting)
      .filter(Boolean)
  ).size;

  const analyzedCount = media.filter(m => m.analysis?.status === 'ready').length;

  if (projectLoading) {
    return (
      <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        <div className="h-4 skeleton w-48" />
        <div className="h-8 skeleton w-80" />
        <div className="h-20 skeleton w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="px-4 sm:px-8 py-16 sm:py-20 text-center text-slate-100">
        <h3 className="text-[16px] font-semibold text-white mb-2">Project not found</h3>
        <p className="text-[13px] text-slate-400 mb-4">This project may have been removed.</p>
        <Link to="/" className="btn btn-secondary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const tabsWithCounts = WORKSPACE_TABS.map(t =>
    t.id === 'evidence' ? { ...t, count: media.length } : t
  );

  return (
    <div className="flex-1 flex flex-col relative z-10 animate-fade-in bg-[#0c1017] text-slate-100 min-h-full">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Projects', to: '/' },
          { label: project.name ? project.name.toLowerCase() : 'project' }
        ]}
        title={project.name ? project.name.charAt(0).toUpperCase() + project.name.slice(1) : 'Project'}
        description={project.description}
        metrics={[
          { count: media.length, label: 'media' },
          { count: uniqueLocations || (project.location ? 1 : 0), label: 'locations' },
          { count: analyzedCount, label: 'analyzed' }
        ]}
        actions={
          <button
            onClick={() => setShowUploadDrawer(prev => !prev)}
            className="bg-[#2563eb] hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg gap-2 cursor-pointer flex items-center shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            {showUploadDrawer ? 'Hide Uploader' : 'Upload'}
          </button>
        }
      />

      {/* Upload Tray */}
      {showUploadDrawer && (
        <div className="px-4 sm:px-8 pb-4 pt-4">
          <div className="bg-[#111622] rounded-xl border border-[#1e2634] p-4 sm:p-5 animate-fade-in">
            <MediaUploader
              projectId={id}
              projectSlug={project.slug}
              onMediaAdded={handleMediaAdded}
              compact={true}
              onCloseCompact={() => setShowUploadDrawer(false)}
            />
          </div>
        </div>
      )}

      {/* Processing Pipeline */}
      {isAnalyzing && (
        <div className="px-4 sm:px-8 pb-4 pt-4">
          <AIProcessingPipeline
            isAnalyzing={isAnalyzing}
            analyzingCount={analyzingMedia.length}
            totalCount={media.length}
            analyzedCount={analyzedCount}
          />
        </div>
      )}

      {/* Tabs */}
      <Tabs
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="px-4 sm:px-8 py-5 sm:py-6 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Main Column */}
          <div className={selectedMedia && (activeTab === 'evidence' || activeTab === 'overview') ? 'lg:col-span-8' : 'lg:col-span-12'}>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <div className="bg-[#111622] border border-[#1e2634] rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1a2332]">
                <div className="px-4 py-2 sm:py-0 first:pl-0">
                  <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">{media.length}</p>
                  <p className="text-[12px] text-slate-400 mt-1.5">Media</p>
                </div>
                <div className="px-4 py-2 sm:py-0">
                  <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">{analyzedCount}</p>
                  <p className="text-[12px] text-slate-400 mt-1.5">Analyzed</p>
                </div>
                <div className="px-4 py-2 sm:py-0">
                  <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">{uniqueLocations}</p>
                  <p className="text-[12px] text-slate-400 mt-1.5">Locations</p>
                </div>
                <div className="px-4 py-2 sm:py-0 last:pr-0">
                  <p className="text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                    {media.reduce((acc, m) => acc + (m.analysis?.result?.evidenceReferences?.length || 0), 0)}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-1.5">Findings</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('ask')}
                  className="bg-[#111622] border border-[#1e2634] rounded-xl p-4 text-left hover:border-[#2b3a52] hover:shadow-lg transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#182232] text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                    <MessageSquare size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Ask Questions
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Query your visual data
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('compare')}
                  className="bg-[#111622] border border-[#1e2634] rounded-xl p-4 text-left hover:border-[#2b3a52] hover:shadow-lg transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#182232] text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <ArrowLeftRight size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-amber-400 transition-colors">
                      Compare
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Track changes between images
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className="bg-[#111622] border border-[#1e2634] rounded-xl p-4 text-left hover:border-[#2b3a52] hover:shadow-lg transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#182232] text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      Report
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Export findings as a document
                    </p>
                  </div>
                </button>
              </div>

              {/* Media Preview or Upload Prompt */}
              {media.length === 0 ? (
                <div className="bg-[#111622] border border-[#1e2634] rounded-xl p-8 text-center space-y-4">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-[14px] font-semibold text-white">No media yet</h3>
                    <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                      Upload photos or videos to get started. Analysis runs automatically.
                    </p>
                  </div>
                  <MediaUploader
                    projectId={id}
                    projectSlug={project.slug}
                    onMediaAdded={handleMediaAdded}
                  />
                </div>
              ) : (
                <div className="space-y-5 pt-1">
                  {/* Recent Media */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold text-white">Recent</h3>
                      <button
                        onClick={() => setActiveTab('evidence')}
                        className="text-[12px] text-slate-400 hover:text-white font-medium cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {media.slice(0, 4).map(m => {
                        const r = m.analysis?.result;
                        const cardTitle = r?.visibleObjects?.[0]?.name
                          ? r.visibleObjects[0].name.charAt(0).toUpperCase() + r.visibleObjects[0].name.slice(1)
                          : m.originalFilename?.replace(/\.[^/.]+$/, '').replace(/^(pexels|unsplash)[-_]?/i, '').replace(/[-_]+/g, ' ') || 'Untitled';

                        return (
                          <div
                            key={m._id}
                            onClick={() => handleViewMedia(m)}
                            className="bg-[#111622] border border-[#1e2634] rounded-xl overflow-hidden cursor-pointer group hover:border-[#2b3a52] hover:shadow-md transition-all flex flex-col"
                          >
                            <div className="aspect-[16/10] bg-[#090d16] relative overflow-hidden">
                              <img
                                src={m.cloudinaryUrl}
                                alt={m.originalFilename}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            </div>
                            <div className="p-2.5">
                              <p className="text-[12px] font-medium text-white truncate">
                                {cardTitle}
                              </p>
                              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                                <span className="capitalize">{m.analysis?.status || 'Uploaded'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Findings */}
                  {media.some(m => m.analysis?.result?.evidenceReferences?.length > 0) && (
                    <div className="bg-[#111622] border border-[#1e2634] rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#1a2332]">
                        <h3 className="text-[13px] font-semibold text-white">Recent Findings</h3>
                        <button
                          onClick={() => setActiveTab('insights')}
                          className="text-[12px] text-slate-400 hover:text-white font-medium cursor-pointer"
                        >
                          View all →
                        </button>
                      </div>

                      <div className="space-y-2">
                        {media
                          .flatMap(m =>
                            (m.analysis?.result?.evidenceReferences || []).map(ref => ({
                              conclusion: ref.conclusion,
                              observation: ref.observation,
                              media: m,
                              confidence: m.analysis?.result?.confidence === 'high' ? '89%' : '74%'
                            }))
                          )
                          .slice(0, 3)
                          .map((f, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-[#090d16] border border-[#1a2332] hover:border-[#243247] flex items-center justify-between gap-3 text-[12px] transition-all"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white truncate">{f.conclusion}</span>
                                  <span className="badge badge-success text-[10px]">{f.confidence}</span>
                                </div>
                                <p className="text-slate-400 text-[11px] truncate mt-0.5">{f.observation}</p>
                              </div>
                              <button
                                onClick={() => handleViewMedia(f.media)}
                                className="btn btn-secondary btn-sm text-[11px] py-1 px-2.5 flex-shrink-0"
                              >
                                View
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Evidence Library */}
          {activeTab === 'evidence' && (
            <MediaGrid
              media={media}
              loading={mediaLoading}
              onView={handleViewMedia}
              onDelete={handleDeleteMedia}
              onSetCover={handleSetCover}
              currentCover={project.coverImage}
              onTriggerUpload={() => setShowUploadDrawer(true)}
              onRetry={handleReanalyze}
              onRetryAll={handleRetryAllFailed}
            />
          )}

          {/* Ask */}
          {activeTab === 'ask' && (
            <ChatPanel
              projectId={id}
              onInspectMedia={handleViewMedia}
            />
          )}

          {/* Compare */}
          {activeTab === 'compare' && (
            <BeforeAfter
              media={media}
              projectId={id}
            />
          )}

          {/* Insights */}
          {activeTab === 'insights' && (
            <InsightsView
              media={media}
              onSelectMedia={handleViewMedia}
              onFilterTag={() => setActiveTab('evidence')}
            />
          )}

          {/* Report */}
          {activeTab === 'report' && (
            <ReportPreview
              project={project}
              media={media}
              onInspectMedia={handleViewMedia}
            />
          )}
          </div>

          {/* Evidence Drawer Sidebar */}
          {selectedMedia && (activeTab === 'evidence' || activeTab === 'overview') && (
            <div className="lg:col-span-4 sticky top-6">
              <EvidenceDrawer
                media={selectedMedia}
                onClose={() => setSelectedMedia(null)}
                onReanalyze={handleReanalyze}
                onSetCover={handleSetCover}
                isCover={project.coverImage === selectedMedia.cloudinaryUrl}
                onDelete={handleDeleteMedia}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
