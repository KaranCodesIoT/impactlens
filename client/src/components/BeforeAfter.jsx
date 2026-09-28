import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { ArrowLeftRight, Loader, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';
import { getComparisonUrl } from '../utils/cloudinary';
import { compareMedia } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function BeforeAfter({ media, projectId }) {
  const [beforeId, setBeforeId] = useState('');
  const [afterId, setAfterId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzedMedia = media.filter(m => m.analysis?.status === 'ready' && m.resourceType === 'image');

  const handleCompare = async () => {
    if (!beforeId || !afterId) {
      toast.error('Select both images to compare');
      return;
    }
    if (beforeId === afterId) {
      toast.error('Select two different images');
      return;
    }

    setLoading(true);
    try {
      const data = await compareMedia(projectId, beforeId, afterId);
      setResult(data);
      toast.success('Comparison complete');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const beforeMedia = analyzedMedia.find(m => m._id === beforeId);
  const afterMedia = analyzedMedia.find(m => m._id === afterId);

  if (analyzedMedia.length < 2) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-10 text-center max-w-md mx-auto my-8">
        <ArrowLeftRight size={22} className="text-stone-400 mx-auto mb-3" />
        <h4 className="text-[14px] font-semibold text-stone-900 mb-1">Need more images</h4>
        <p className="text-[12px] text-stone-500 leading-relaxed">
          At least two analyzed images are required for comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Selector */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-[14px] font-semibold text-stone-900 tracking-tight">
            Compare Images
          </h3>
          <p className="text-[12px] text-stone-500 mt-0.5">
            Select two captures to analyze changes between them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-[12px]">Before</label>
            <select
              className="input text-[13px]"
              value={beforeId}
              onChange={(e) => setBeforeId(e.target.value)}
            >
              <option value="">Select earlier image...</option>
              {analyzedMedia.map(m => (
                <option key={m._id} value={m._id} disabled={m._id === afterId}>
                  {m.originalFilename?.replace(/\.[^/.]+$/, '') || m.cloudinaryId.split('/').pop()}
                  {m.createdAt ? ` (${format(new Date(m.createdAt), 'MMM yyyy')})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-[12px]">After</label>
            <select
              className="input text-[13px]"
              value={afterId}
              onChange={(e) => setAfterId(e.target.value)}
            >
              <option value="">Select later image...</option>
              {analyzedMedia.map(m => (
                <option key={m._id} value={m._id} disabled={m._id === beforeId}>
                  {m.originalFilename?.replace(/\.[^/.]+$/, '') || m.cloudinaryId.split('/').pop()}
                  {m.createdAt ? ` (${format(new Date(m.createdAt), 'MMM yyyy')})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!beforeId || !afterId || loading}
          className="btn btn-primary w-full justify-center text-[13px] py-2.5 disabled:opacity-40"
        >
          {loading ? <Loader size={14} className="animate-spin" /> : <ArrowLeftRight size={14} />}
          <span>{loading ? 'Comparing...' : 'Compare'}</span>
        </button>
      </div>

      {/* Comparison Viewer */}
      {beforeMedia && afterMedia && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 px-4 py-2.5 bg-stone-50 border-b border-stone-200 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-800">Before</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500 truncate">{beforeMedia.originalFilename}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-right">
              <span className="text-stone-500 truncate">{afterMedia.originalFilename}</span>
              <span className="text-stone-400">·</span>
              <span className="font-semibold text-stone-800">After</span>
            </div>
          </div>

          <div className="bg-stone-900 relative">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={getComparisonUrl(beforeMedia.cloudinaryId)}
                  alt="Before"
                  className="object-contain"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={getComparisonUrl(afterMedia.cloudinaryId)}
                  alt="After"
                  className="object-contain"
                />
              }
              style={{ height: '440px', width: '100%' }}
            />
          </div>

          <div className="flex justify-between items-center px-4 py-2 bg-stone-50 text-[11px] text-stone-500">
            <span>Drag the slider to compare</span>
            <div className="flex items-center gap-3">
              <a
                href={beforeMedia.cloudinaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-900 flex items-center gap-1"
              >
                <ExternalLink size={10} /> Before
              </a>
              <a
                href={afterMedia.cloudinaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-900 flex items-center gap-1"
              >
                <ExternalLink size={10} /> After
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
              <h4 className="text-[13px] font-semibold text-stone-900">
                Change Analysis
              </h4>
              {result.overallAssessment?.evidenceConfidence && (
                <span className="badge badge-success text-[10px]">
                  {result.overallAssessment.evidenceConfidence}
                </span>
              )}
            </div>
            <p className="text-[13px] text-stone-600 leading-relaxed pt-1">
              {result.overallAssessment?.summary}
            </p>
          </div>

          {/* Detailed Changes */}
          {result.changes?.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
              <h4 className="text-[13px] font-semibold text-stone-900 pb-2.5 border-b border-stone-100">
                Changes ({result.changes.length})
              </h4>
              <div className="space-y-3">
                {result.changes.map((change, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/60 text-[12px] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">{change.aspect}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="badge badge-neutral text-[10px] capitalize">
                          {change.changeType || 'modification'}
                        </span>
                        {change.significance && (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            change.significance === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-stone-100 text-stone-500'
                          }`}>
                            {change.significance}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-white border border-stone-200/80">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">Before</span>
                        <p className="text-stone-600 leading-relaxed">{change.before}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-stone-200/80">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">After</span>
                        <p className="text-stone-600 leading-relaxed">{change.after}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
