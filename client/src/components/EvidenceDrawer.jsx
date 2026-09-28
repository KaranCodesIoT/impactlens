import { X, Loader } from 'lucide-react';
import FindingCard from './FindingCard';
import { getDetailUrl } from '../utils/cloudinary';

export default function EvidenceDrawer({
  selectedMedia,
  onClose,
  onReanalyze,
  onSetCover,
  isCover
}) {
  if (!selectedMedia) return null;

  const isAnalyzing = selectedMedia.analysis?.status === 'analyzing' || selectedMedia.analysis?.status === 'pending';

  return (
    <aside className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 space-y-4 animate-slide-in-right sticky top-6 shadow-sm">
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
        <div>
          <h3 className="text-[13px] font-semibold text-stone-900">
            Details
          </h3>
          <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
            {selectedMedia.originalFilename}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-icon btn-ghost text-stone-400 hover:text-stone-700 p-1"
          title="Close"
        >
          <X size={15} />
        </button>
      </div>

      {/* Media Preview */}
      <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-[16/10] flex items-center justify-center border border-stone-200">
        {selectedMedia.resourceType === 'video' ? (
          <video
            src={selectedMedia.cloudinaryUrl}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={getDetailUrl(selectedMedia.cloudinaryId)}
            alt={selectedMedia.originalFilename}
            className={`w-full h-full object-contain ${isAnalyzing ? 'brightness-[0.85]' : ''}`}
          />
        )}

        {/* Simple analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-stone-200 shadow-sm">
              <Loader size={13} className="text-stone-600 animate-spin" />
              <span className="text-[11px] font-medium text-stone-700">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Details */}
      <FindingCard
        analysis={selectedMedia.analysis}
        cloudinaryUrl={selectedMedia.cloudinaryUrl}
        cloudinaryId={selectedMedia.cloudinaryId}
        onReanalyze={onReanalyze}
        onSetCover={onSetCover}
        isCover={isCover}
      />
    </aside>
  );
}
