import {
  ExternalLink, Target, MapPin, Sparkles, RefreshCw, Eye, Clock, Box,
  Activity, HelpCircle, ShieldCheck, Star, Users, Car, Landmark, Trees, Loader
} from 'lucide-react';
import AnalysisBadge from './AnalysisBadge';

export default function FindingCard({ analysis, cloudinaryUrl, cloudinaryId, onReanalyze, onSetCover, isCover }) {
  const isAnalyzing = analysis?.status === 'analyzing' || analysis?.status === 'pending';

  if (!analysis?.result) {
    if (isAnalyzing) {
      return (
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-5 space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200">
            <Loader size={14} className="text-stone-500 animate-spin" />
            <span className="text-[13px] font-medium text-stone-700">
              Analyzing visual content...
            </span>
          </div>

          <div className="space-y-2 text-[12px] text-stone-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
              <span>Detecting objects and patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span>Extracting location signals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-pulse" style={{ animationDelay: '0.6s' }} />
              <span>Generating evidence references</span>
            </div>
          </div>

          <div className="pt-1">
            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-500 rounded-full animate-pulse"
                style={{ width: '65%' }}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-stone-50 rounded-xl p-5 text-center border border-stone-200">
        <AnalysisBadge status={analysis?.status || 'pending'} />
        {analysis?.status === 'failed' && (
          <div className="mt-3">
            <p className="text-[12px] text-red-500 mb-2">{analysis.error}</p>
            <button onClick={onReanalyze} className="btn btn-secondary btn-sm">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  const r = analysis.result;

  return (
    <div className="space-y-3 animate-fade-in text-[12px]">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2">
          <span className={`badge ${
            r.confidence === 'high' ? 'badge-success' :
            r.confidence === 'medium' ? 'badge-warning' : 'badge-neutral'
          }`}>
            {r.confidence || 'analyzed'}
          </span>
          {r._meta?.processingTimeMs && (
            <span className="text-[11px] text-stone-400">
              {(r._meta.processingTimeMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onSetCover && (
            <button
              onClick={onSetCover}
              className={`btn btn-sm ${isCover ? 'btn-primary' : 'btn-secondary'} py-1 px-2.5 text-[11px]`}
              title="Set as cover"
            >
              <Star size={11} fill={isCover ? 'currentColor' : 'none'} />
              {isCover ? 'Cover' : 'Set Cover'}
            </button>
          )}
          <button
            onClick={onReanalyze}
            className="btn btn-ghost btn-sm text-stone-400 hover:text-stone-700 p-1"
            title="Re-analyze"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-3.5 border border-stone-200 space-y-2">
        <h4 className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5">
          Summary
        </h4>
        <p className="text-stone-600 leading-relaxed text-[12px]">
          {r.description || r.summary}
        </p>

        {r.scene && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
            {r.scene.setting && (
              <div>
                <span className="text-stone-400">Setting </span>
                <span className="text-stone-700 font-medium">{r.scene.setting}</span>
              </div>
            )}
            {r.scene.environment && (
              <div>
                <span className="text-stone-400">Environment </span>
                <span className="text-stone-700 font-medium capitalize">{r.scene.environment}</span>
              </div>
            )}
            {r.scene.weather && (
              <div>
                <span className="text-stone-400">Weather </span>
                <span className="text-stone-700 font-medium capitalize">{r.scene.weather}</span>
              </div>
            )}
            {r.scene.timeOfDay && (
              <div>
                <span className="text-stone-400">Time </span>
                <span className="text-stone-700 font-medium capitalize">{r.scene.timeOfDay}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detected Objects */}
      {r.visibleObjects?.length > 0 && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <h4 className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
            <Box size={12} className="text-stone-500" />
            Detected ({r.visibleObjects.length})
          </h4>
          <div className="space-y-1.5">
            {r.visibleObjects.map((obj, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 rounded bg-stone-50 border border-stone-100 text-[12px]">
                <span className="font-medium text-stone-700">{obj.name}</span>
                <div className="flex items-center gap-1.5">
                  {obj.count && <span className="badge badge-neutral text-[10px]">{obj.count}</span>}
                  {obj.condition && <span className="badge badge-neutral text-[10px]">{obj.condition}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {r.activities?.length > 0 && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <h4 className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
            <Activity size={12} className="text-stone-500" />
            Activities ({r.activities.length})
          </h4>
          <div className="space-y-1.5">
            {r.activities.map((act, i) => (
              <div key={i} className="p-2 rounded bg-stone-50 border border-stone-100 text-[12px]">
                <p className="font-medium text-stone-800">{act.name}</p>
                <p className="text-stone-500 mt-0.5 leading-relaxed text-[11px]">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entities */}
      {r.detectedEntities && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200 space-y-2">
          <h4 className="text-[12px] font-semibold text-stone-800">Entities</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {r.detectedEntities.people?.present && (
              <div className="p-2 rounded bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1 font-medium text-stone-700 mb-0.5">
                  <Users size={10} className="text-stone-500" /> People
                </div>
                <p className="text-stone-500">Count: {r.detectedEntities.people.estimatedCount}</p>
              </div>
            )}
            {r.detectedEntities.vehicles?.length > 0 && (
              <div className="p-2 rounded bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1 font-medium text-stone-700 mb-0.5">
                  <Car size={10} className="text-stone-500" /> Vehicles
                </div>
                <p className="text-stone-500 truncate">{r.detectedEntities.vehicles.join(', ')}</p>
              </div>
            )}
            {r.detectedEntities.landmarks?.length > 0 && (
              <div className="p-2 rounded bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1 font-medium text-stone-700 mb-0.5">
                  <Landmark size={10} className="text-stone-500" /> Landmarks
                </div>
                <p className="text-stone-500 truncate">{r.detectedEntities.landmarks.join(', ')}</p>
              </div>
            )}
            {r.detectedEntities.floraFauna?.length > 0 && (
              <div className="p-2 rounded bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1 font-medium text-stone-700 mb-0.5">
                  <Trees size={10} className="text-stone-500" /> Nature
                </div>
                <p className="text-stone-500 truncate">{r.detectedEntities.floraFauna.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {r.locationClues && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <h4 className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 mb-1.5">
            <MapPin size={12} className="text-stone-500" />
            Location
          </h4>
          <div className="space-y-1 text-[11px]">
            {r.locationClues.estimatedRegion && (
              <div><span className="text-stone-400">Region: </span><span className="text-stone-800 font-medium">{r.locationClues.estimatedRegion}</span></div>
            )}
            {r.locationClues.terrain && (
              <div><span className="text-stone-400">Terrain: </span><span className="text-stone-600">{r.locationClues.terrain}</span></div>
            )}
            {r.locationClues.signsOrLanguage && (
              <div><span className="text-stone-400">Signs: </span><span className="text-stone-600">{r.locationClues.signsOrLanguage}</span></div>
            )}
            {r.locationClues.landmarks?.length > 0 && (
              <div><span className="text-stone-400">Landmarks: </span><span className="text-stone-600">{r.locationClues.landmarks.join(', ')}</span></div>
            )}
          </div>
        </div>
      )}

      {/* Visual Signals */}
      {r.visualSignals?.length > 0 && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <h4 className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
            <Eye size={12} className="text-stone-500" />
            Signals ({r.visualSignals.length})
          </h4>
          <div className="space-y-1.5">
            {r.visualSignals.map((sig, i) => (
              <div key={i} className="p-2 rounded bg-stone-50 border border-stone-100 text-[11px]">
                <div className="flex items-center justify-between font-medium text-stone-800">
                  <span>{sig.signal}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    sig.significance === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    sig.significance === 'medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {sig.significance}
                  </span>
                </div>
                {sig.observation && (
                  <p className="text-stone-500 mt-0.5 leading-relaxed">{sig.observation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Reasoning */}
      {r.evidenceReferences?.length > 0 && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <h4 className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
            <Target size={12} className="text-stone-500" />
            Evidence & Reasoning
          </h4>
          <div className="space-y-2">
            {r.evidenceReferences.map((ev, i) => (
              <div key={i} className="pl-3 border-l-2 border-stone-300 text-[11px]">
                <p className="font-medium text-stone-800">{ev.conclusion}</p>
                <p className="text-stone-500 mt-0.5 leading-relaxed">{ev.observation}</p>
                {ev.visualProof && (
                  <p className="text-stone-400 text-[10px] mt-0.5 italic">Proof: {ev.visualProof}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uncertainties */}
      {r.uncertainties?.length > 0 && (
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <h4 className="text-[12px] font-medium text-stone-500 flex items-center gap-1.5 mb-1.5">
            <HelpCircle size={12} />
            Uncertainties
          </h4>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-500">
            {r.uncertainties.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Source */}
      <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 text-[11px] text-stone-500 space-y-1">
        <div className="font-medium text-stone-600 mb-1 flex items-center gap-1">
          <ExternalLink size={10} /> Source
        </div>
        <div className="truncate">
          <a
            href={cloudinaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:underline font-medium"
          >
            {cloudinaryId}
          </a>
        </div>
        {r._meta && (
          <div className="text-[10px] text-stone-400 pt-0.5">
            {r._meta.model} · v{r._meta.promptVersion || '2.0'}
          </div>
        )}
      </div>
    </div>
  );
}
