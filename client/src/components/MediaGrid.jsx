import { useState } from 'react';
import MediaCard from './MediaCard';
import EmptyState from './EmptyState';
import { Search, Image, Film, AlertCircle, RotateCw } from 'lucide-react';

export default function MediaGrid({
  media,
  loading,
  onView,
  onDelete,
  onSetCover,
  currentCover,
  onTriggerUpload,
  onRetry,
  onRetryAll
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [retryingAll, setRetryingAll] = useState(false);

  const failedCount = media.filter(m => m.analysis?.status === 'failed').length;

  const handleRetryAll = async () => {
    if (!onRetryAll || retryingAll) return;
    setRetryingAll(true);
    try {
      await onRetryAll();
    } finally {
      setRetryingAll(false);
    }
  };

  const filtered = media.filter(m => {
    if (typeFilter === 'images' && m.resourceType !== 'image') return false;
    if (typeFilter === 'videos' && m.resourceType !== 'video') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const filename = (m.originalFilename || '').toLowerCase();
      const setting = (m.analysis?.result?.scene?.setting || '').toLowerCase();
      const desc = (m.analysis?.result?.description || '').toLowerCase();
      const tags = (m.analysis?.result?.tags || []).join(' ').toLowerCase();
      const objects = (m.analysis?.result?.visibleObjects || []).map(o => o.name).join(' ').toLowerCase();

      return filename.includes(q) || setting.includes(q) || desc.includes(q) || tags.includes(q) || objects.includes(q);
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#111622] border border-[#1e2634] rounded-xl overflow-hidden p-3 space-y-3">
            <div className="aspect-[16/10] bg-[#090d16] rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-[#182232] rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-[#182232] rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <EmptyState
        title="Ready when you are"
        description="Upload photos or videos to start analyzing. We'll extract insights automatically."
        onUpload={onTriggerUpload}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Failed Banner */}
      {failedCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[12px] text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
            <span>
              <strong>{failedCount} {failedCount === 1 ? 'item needs' : 'items need'} analysis.</strong> Run to extract findings and entities.
            </span>
          </div>
          {onRetryAll && (
            <button
              type="button"
              onClick={handleRetryAll}
              disabled={retryingAll}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-[12px] py-1.5 px-3 rounded-lg self-start sm:self-center gap-1.5 flex items-center flex-shrink-0 transition-all cursor-pointer"
            >
              <RotateCw size={11} className={retryingAll ? 'animate-spin' : ''} />
              <span>{retryingAll ? 'Analyzing...' : 'Analyze All'}</span>
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111622] p-2.5 rounded-xl border border-[#1e2634]">
        {/* Type Filter */}
        <div className="inline-flex items-center bg-[#090d16] p-1 rounded-lg text-[12px]">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#16202e] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({media.length})
          </button>
          <button
            onClick={() => setTypeFilter('images')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              typeFilter === 'images'
                ? 'bg-[#16202e] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Image size={11} />
            Images ({media.filter(m => m.resourceType === 'image').length})
          </button>
          <button
            onClick={() => setTypeFilter('videos')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              typeFilter === 'videos'
                ? 'bg-[#16202e] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film size={11} />
            Videos ({media.filter(m => m.resourceType === 'video').length})
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md justify-end">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[#090d16] border border-[#1e2634] rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[12px] py-1.5 px-2 bg-[#090d16] border border-[#1e2634] rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 min-w-[95px] cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map(m => (
          <MediaCard
            key={m._id}
            media={m}
            onView={onView}
            onDelete={onDelete}
            onSetCover={onSetCover}
            isCover={currentCover === m.cloudinaryUrl}
            onRetry={onRetry}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-10 bg-[#111622] rounded-xl border border-[#1e2634] text-[13px] text-slate-400">
          No results for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
