import { Eye, Video, Star, Trash2, ShieldCheck, MapPin, Calendar, RotateCw, Loader } from 'lucide-react';
import AnalysisBadge from './AnalysisBadge';
import { getThumbnailUrl } from '../utils/cloudinary';
import { format } from 'date-fns';

export default function MediaCard({ media, onView, onDelete, onSetCover, isCover, onRetry }) {
  const thumbUrl = getThumbnailUrl(media.cloudinaryId, media.resourceType);
  const isVideo = media.resourceType === 'video';
  const r = media.analysis?.result;
  const isAnalyzing = media.analysis?.status === 'analyzing' || media.analysis?.status === 'pending';

  // Derive human-readable title from AI visual subject or cleaned filename
  const formatDisplayTitle = () => {
    if (r?.visibleObjects?.[0]?.name) {
      const name = r.visibleObjects[0].name;
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    if (r?.scene?.setting) {
      const s = r.scene.setting;
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    const raw = media.originalFilename;
    if (!raw) return 'Untitled';
    let clean = raw.replace(/\.[^/.]+$/, '');
    clean = clean.replace(/^(pexels|unsplash|image|img|photo)[-_]?/i, '');
    clean = clean.replace(/[-_]\d{4,}/g, '');
    clean = clean.replace(/[-_]+/g, ' ').trim();
    if (!clean) return 'Untitled';
    return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const title = formatDisplayTitle();

  const displayDate = media.createdAt
    ? format(new Date(media.createdAt), 'd MMM yyyy')
    : 'Recent';

  const locationClue = r?.locationClues?.estimatedRegion || r?.scene?.setting;
  const aiDescription = r?.detailedSummary || r?.description || r?.evidenceReferences?.[0]?.observation;
  const evidenceCount = r?.evidenceReferences?.length || 0;
  const tags = r?.tags?.slice(0, 3) || [];

  return (
    <div
      onClick={() => onView?.(media)}
      className={`bg-[#111622] rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer group flex flex-col ${
        isAnalyzing
          ? 'border-[#243247] shadow-sm'
          : 'border-[#1e2634] hover:border-[#2b3a52] hover:shadow-xl hover:shadow-black/30'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-[#090d16] overflow-hidden">
        <img
          src={thumbUrl}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            isAnalyzing ? 'brightness-[0.75]' : ''
          }`}
          loading="lazy"
        />

        {/* Analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111622]/90 border border-[#243247] shadow-lg">
              <Loader size={13} className="text-blue-400 animate-spin" />
              <span className="text-[11px] font-medium text-slate-200 tracking-tight">
                Analyzing...
              </span>
            </div>
          </div>
        )}

        {/* Hover overlay with action buttons */}
        {!isAnalyzing && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer"
              title="View details"
            >
              <Eye size={14} />
            </button>
            {onSetCover && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSetCover(media.cloudinaryUrl); }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer ${
                  isCover ? 'bg-amber-500 text-white' : 'bg-black/40 hover:bg-white/30 text-white'
                }`}
                title={isCover ? 'Current cover' : 'Set as cover'}
              >
                <Star size={13} fill={isCover ? 'currentColor' : 'none'} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(media._id); }}
                className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:bg-red-500 transition-all flex items-center justify-center cursor-pointer"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}

        {/* Cover badge */}
        {isCover && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1">
            <Star size={9} fill="currentColor" /> Cover
          </div>
        )}

        {/* Video badge */}
        {isVideo && !isCover && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded bg-black/60 text-white flex items-center justify-center backdrop-blur-sm">
            <Video size={11} />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          {media.analysis?.status === 'failed' && onRetry ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRetry(media._id); }}
              className="badge badge-warning text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Retry analysis"
            >
              <RotateCw size={10} /> Retry
            </button>
          ) : (
            <AnalysisBadge status={media.analysis?.status} />
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h4 className="text-[13px] font-semibold text-white truncate flex-1 tracking-tight">
              {title}
            </h4>
            {evidenceCount > 0 && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0"
                title={`${evidenceCount} findings`}
              >
                <ShieldCheck size={10} />
                {evidenceCount}
              </span>
            )}
          </div>

          {/* Date & Location */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {displayDate}
            </span>
            {locationClue && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={10} className="flex-shrink-0" />
                <span className="truncate">{locationClue}</span>
              </span>
            )}
          </div>

          {aiDescription && (
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {aiDescription}
            </p>
          )}
        </div>

        {/* Tags Footer */}
        <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-[#1a2332]">
          {isAnalyzing ? (
            <span className="text-[11px] text-slate-400 font-medium">Processing...</span>
          ) : (
            <>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-[#182232] text-slate-300 border border-white/5 text-[10px] font-medium"
                >
                  {tag}
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-[10px] text-slate-500">
                  {media.analysis?.status === 'ready' ? 'Analyzed' : media.analysis?.status === 'failed' ? 'Needs analysis' : '—'}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
