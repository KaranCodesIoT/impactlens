import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { ArrowLeftRight, Loader, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getComparisonUrl } from '../utils/cloudinary';
import { compareMedia } from '../services/api';
import toast from 'react-hot-toast';

export default function BeforeAfter({ media, projectId }) {
  const [beforeId, setBeforeId] = useState('');
  const [afterId, setAfterId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzedMedia = media.filter(m => m.analysis?.status === 'ready' && m.resourceType === 'image');

  const handleCompare = async () => {
    if (!beforeId || !afterId) {
      toast.error('Select both before and after images');
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
      <div className="glass-card p-8 text-center">
        <ArrowLeftRight size={28} className="text-surface-700 mx-auto mb-3" />
        <p className="text-sm text-surface-700">Need at least 2 analyzed images to compare</p>
        <p className="text-xs text-surface-700 mt-1">Upload and wait for analysis to complete</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-4">
          <ArrowLeftRight size={16} className="text-primary-400" />
          Before / After Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Before (Earlier State)</label>
            <select
              className="input"
              value={beforeId}
              onChange={(e) => setBeforeId(e.target.value)}
            >
              <option value="">Select before image...</option>
              {analyzedMedia.map(m => (
                <option key={m._id} value={m._id} disabled={m._id === afterId}>
                  {m.originalFilename || m.cloudinaryId.split('/').pop()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">After (Later State)</label>
            <select
              className="input"
              value={afterId}
              onChange={(e) => setAfterId(e.target.value)}
            >
              <option value="">Select after image...</option>
              {analyzedMedia.map(m => (
                <option key={m._id} value={m._id} disabled={m._id === beforeId}>
                  {m.originalFilename || m.cloudinaryId.split('/').pop()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!beforeId || !afterId || loading}
          className="btn btn-primary w-full justify-center disabled:opacity-50"
        >
          {loading ? <Loader size={16} className="animate-spin" /> : <ArrowLeftRight size={16} />}
          {loading ? 'Analyzing Changes...' : 'Compare & Analyze'}
        </button>
      </div>

      {/* Slider */}
      {beforeMedia && afterMedia && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={getComparisonUrl(beforeMedia.cloudinaryId)}
                alt="Before"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={getComparisonUrl(afterMedia.cloudinaryId)}
                alt="After"
              />
            }
            style={{ height: '400px' }}
          />
          <div className="flex justify-between px-4 py-2 text-xs text-surface-700">
            <span>← Before</span>
            <span>After →</span>
          </div>
        </div>
      )}

      {/* AI Analysis Results */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Overall Assessment */}
          <div className={`glass-card p-5 border-l-4 ${
            result.overallAssessment?.direction === 'positive' ? 'border-l-success-500' :
            result.overallAssessment?.direction === 'negative' ? 'border-l-danger-500' :
            'border-l-warning-500'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {result.overallAssessment?.direction === 'positive' ?
                <TrendingUp size={20} className="text-success-500" /> :
                result.overallAssessment?.direction === 'negative' ?
                <TrendingDown size={20} className="text-danger-500" /> :
                <Minus size={20} className="text-warning-500" />
              }
              <div>
                <h4 className="text-sm font-semibold text-surface-200 capitalize">
                  {result.overallAssessment?.direction} Change Detected
                </h4>
                {result.overallAssessment?.impactScore && (
                  <span className="text-xs text-surface-700">
                    Impact Score: {result.overallAssessment.impactScore}/10
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-surface-200">{result.overallAssessment?.summary}</p>
          </div>

          {/* Individual Changes */}
          {result.changes?.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-semibold text-surface-200 mb-3">Detected Changes</h4>
              <div className="space-y-3">
                {result.changes.map((change, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white/[0.02] text-xs">
                    <div>
                      <span className="label text-[0.65rem]">Aspect</span>
                      <p className="text-surface-200 font-medium">{change.aspect}</p>
                    </div>
                    <div>
                      <span className="label text-[0.65rem]">Before → After</span>
                      <p className="text-surface-700">{change.before}</p>
                      <p className="text-surface-200 mt-0.5">→ {change.after}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`badge ${
                        change.changeType === 'improvement' ? 'badge-success' :
                        change.changeType === 'degradation' ? 'badge-danger' : 'badge-info'
                      }`}>
                        {change.changeType}
                      </span>
                      <span className="badge badge-info mt-1">{change.magnitude}</span>
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
