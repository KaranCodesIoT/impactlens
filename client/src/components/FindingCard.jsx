import { ExternalLink, Target, TrendingUp, AlertTriangle, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import AnalysisBadge from './AnalysisBadge';

const SDG_NAMES = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education',
  5: 'Gender Equality', 6: 'Clean Water', 7: 'Affordable Energy', 8: 'Decent Work',
  9: 'Industry & Innovation', 10: 'Reduced Inequalities', 11: 'Sustainable Cities',
  12: 'Responsible Consumption', 13: 'Climate Action', 14: 'Life Below Water',
  15: 'Life on Land', 16: 'Peace & Justice', 17: 'Partnerships'
};

export default function FindingCard({ analysis, cloudinaryUrl, cloudinaryId, onReanalyze }) {
  if (!analysis?.result) {
    return (
      <div className="glass-card p-5 text-center">
        <AnalysisBadge status={analysis?.status || 'pending'} />
        {analysis?.status === 'failed' && (
          <div className="mt-3">
            <p className="text-xs text-danger-500 mb-2">{analysis.error}</p>
            <button onClick={onReanalyze} className="btn btn-secondary btn-sm">
              <RefreshCw size={13} /> Retry Analysis
            </button>
          </div>
        )}
      </div>
    );
  }

  const r = analysis.result;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Scene Description */}
      <div className="glass-card p-5">
        <h4 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-primary-400" />
          Scene Analysis
        </h4>
        <p className="text-sm text-surface-200 leading-relaxed">{r.scene?.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {r.scene?.environment && <span className="badge badge-info">{r.scene.environment}</span>}
          {r.scene?.weather && <span className="badge badge-info">{r.scene.weather}</span>}
          {r.scene?.timeOfDay && <span className="badge badge-info">{r.scene.timeOfDay}</span>}
          {r.scene?.season && <span className="badge badge-info">{r.scene.season}</span>}
        </div>
      </div>

      {/* Categories & SDGs */}
      {r.categories?.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-3">
            <Target size={15} className="text-accent-400" />
            Categories & SDG Alignment
          </h4>
          {r.categories.map((cat, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-surface-200">{cat.name}</span>
                <span className="text-xs text-surface-700">
                  {Math.round(cat.confidence * 100)}% confidence
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded-full"
                  style={{ width: `${cat.confidence * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.sdgGoals?.map(g => (
                  <span key={g} className="text-[0.65rem] px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-300">
                    SDG {g}: {SDG_NAMES[g] || ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Observations */}
      {r.observations?.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-semibold text-surface-200 mb-3">
            Key Observations
          </h4>
          <div className="space-y-3">
            {r.observations.map((obs, i) => (
              <div key={i} className="pl-3 border-l-2 border-primary-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-surface-200">{obs.label}</span>
                  <span className={`badge ${
                    obs.significance === 'high' ? 'badge-success' :
                    obs.significance === 'medium' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {obs.significance}
                  </span>
                  {obs.condition && <span className="badge badge-info">{obs.condition}</span>}
                </div>
                <p className="text-xs text-surface-700 leading-relaxed">{obs.description}</p>
                {obs.count && <p className="text-xs text-surface-700 mt-1">Count: {obs.count}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Indicators */}
      {r.impactIndicators?.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-accent-400" />
            Impact Indicators
          </h4>
          <div className="space-y-3">
            {r.impactIndicators.map((ind, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`badge mt-0.5 ${
                  ind.trend === 'increasing' ? 'badge-success' :
                  ind.trend === 'decreasing' ? 'badge-danger' : 'badge-info'
                }`}>
                  {ind.trend}
                </span>
                <div>
                  <p className="text-sm text-surface-200">
                    <strong>{ind.metric}:</strong> {ind.value}
                  </p>
                  <p className="text-xs text-surface-700 mt-0.5">{ind.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concerns */}
      {r.concerns?.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-warning-500" />
            Concerns & Recommendations
          </h4>
          <div className="space-y-2">
            {r.concerns.map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-warning-500/5 border border-warning-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${
                    c.severity === 'high' ? 'badge-danger' :
                    c.severity === 'medium' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {c.severity}
                  </span>
                  <span className="text-sm text-surface-200">{c.issue}</span>
                </div>
                <p className="text-xs text-surface-700">{c.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Hints */}
      {r.locationHints && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-3">
            <MapPin size={15} className="text-primary-400" />
            Location Hints
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {r.locationHints.terrain && (
              <div><span className="text-surface-700">Terrain:</span> <span className="text-surface-200">{r.locationHints.terrain}</span></div>
            )}
            {r.locationHints.vegetation && (
              <div><span className="text-surface-700">Vegetation:</span> <span className="text-surface-200">{r.locationHints.vegetation}</span></div>
            )}
            {r.locationHints.estimatedRegion && (
              <div className="col-span-2"><span className="text-surface-700">Est. Region:</span> <span className="text-surface-200">{r.locationHints.estimatedRegion}</span></div>
            )}
          </div>
          {r.locationHints.landmarks?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {r.locationHints.landmarks.map((l, i) => (
                <span key={i} className="badge badge-info">{l}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="glass-card p-5 border-primary-500/20">
        <h4 className="text-sm font-semibold text-surface-200 mb-2">Overall Summary</h4>
        <p className="text-sm text-surface-200 leading-relaxed">{r.summary}</p>
      </div>

      {/* Traceability link */}
      <div className="flex items-center gap-2 text-xs text-surface-700">
        <ExternalLink size={12} />
        <span>Source asset:</span>
        <a
          href={cloudinaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 underline truncate"
        >
          {cloudinaryId}
        </a>
      </div>
    </div>
  );
}
