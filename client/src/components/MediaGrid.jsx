import MediaCard from './MediaCard';
import { Image as ImageIcon, Filter } from 'lucide-react';
import { useState } from 'react';

export default function MediaGrid({ media, loading, onView, onDelete }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? media
    : media.filter(m => m.analysis?.status === filter);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="h-44 skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-3 skeleton w-3/4" />
              <div className="h-2.5 skeleton w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <ImageIcon size={28} className="text-surface-700" />
        </div>
        <p className="text-surface-700 text-sm">No media uploaded yet</p>
        <p className="text-surface-700 text-xs mt-1">Upload photos or videos to get started</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={14} className="text-surface-700" />
        {['all', 'ready', 'analyzing', 'pending', 'failed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${
              filter === f
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-surface-700 hover:text-surface-200 hover:bg-white/5'
            }`}
          >
            {f} {f !== 'all' && `(${media.filter(m => m.analysis?.status === f).length})`}
            {f === 'all' && `(${media.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(m => (
          <MediaCard
            key={m._id}
            media={m}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-surface-700 text-sm py-8">
          No media matching filter "{filter}"
        </p>
      )}
    </div>
  );
}
