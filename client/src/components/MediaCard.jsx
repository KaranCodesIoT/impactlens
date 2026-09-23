import { Trash2, Eye, Video, Image as ImageIcon } from 'lucide-react';
import AnalysisBadge from './AnalysisBadge';
import { getThumbnailUrl } from '../utils/cloudinary';

export default function MediaCard({ media, onView, onDelete }) {
  const thumbUrl = getThumbnailUrl(media.cloudinaryId, media.resourceType);
  const isVideo = media.resourceType === 'video';

  return (
    <div className="glass-card overflow-hidden group animate-fade-in">
      {/* Thumbnail */}
      <div
        className="relative h-44 cursor-pointer overflow-hidden"
        onClick={() => onView?.(media)}
      >
        <img
          src={thumbUrl}
          alt={media.originalFilename || 'Media'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye size={24} className="text-white" />
        </div>

        {/* Type icon */}
        {isVideo && (
          <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/60 flex items-center justify-center">
            <Video size={14} className="text-white" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <AnalysisBadge status={media.analysis?.status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-medium text-surface-200 truncate mb-1">
          {media.originalFilename || media.cloudinaryId.split('/').pop()}
        </p>

        {media.analysis?.status === 'ready' && media.analysis?.result?.categories?.[0] && (
          <p className="text-[0.7rem] text-primary-400 truncate mb-2">
            {media.analysis.result.categories[0].name}
            {media.analysis.result.categories[0].sdgGoals?.length > 0 &&
              ` · SDG ${media.analysis.result.categories[0].sdgGoals.join(', ')}`
            }
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] text-surface-700">
            {media.format?.toUpperCase()} · {(media.bytes / 1024).toFixed(0)}KB
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(media._id); }}
            className="btn btn-icon text-surface-700 hover:text-danger-500 transition-colors p-1"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
