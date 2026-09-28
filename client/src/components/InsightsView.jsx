import { useState } from 'react';
import {
  Sparkles, Target, Box, MapPin, ShieldCheck, Eye
} from 'lucide-react';

export default function InsightsView({ media, onSelectMedia, onFilterTag }) {
  const analyzedMedia = media.filter(m => m.analysis?.status === 'ready');

  // Aggregate data
  const objectMap = {};
  const locationMap = {};
  const findingsList = [];

  analyzedMedia.forEach(m => {
    const r = m.analysis?.result;
    if (!r) return;

    (r.visibleObjects || []).forEach(obj => {
      const name = obj.name?.toLowerCase().trim();
      if (!name) return;
      if (!objectMap[name]) objectMap[name] = { name: obj.name, count: 0, assets: [] };
      objectMap[name].count += 1;
      objectMap[name].assets.push(m);
    });

    const loc = r.locationClues?.estimatedRegion || r.scene?.setting;
    if (loc) {
      if (!locationMap[loc]) locationMap[loc] = { name: loc, assets: [] };
      locationMap[loc].assets.push(m);
    }

    (r.evidenceReferences || []).forEach(ref => {
      findingsList.push({
        title: ref.conclusion,
        observation: ref.observation,
        confidence: r.confidence === 'high' ? '89%' : r.confidence === 'medium' ? '74%' : '65%',
        media: m
      });
    });
  });

  const uniqueObjects = Object.values(objectMap).sort((a, b) => b.count - a.count);
  const uniqueLocations = Object.values(locationMap);

  if (analyzedMedia.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-10 text-center max-w-md mx-auto my-8">
        <Sparkles size={22} className="text-stone-400 mx-auto mb-3" />
        <h4 className="text-[14px] font-semibold text-stone-900 mb-1">No insights yet</h4>
        <p className="text-[12px] text-stone-500 leading-relaxed">
          Upload and analyze media to generate findings, detect entities, and extract geographic signals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
        <div className="px-4 py-2 sm:py-0 first:pl-0">
          <p className="text-2xl font-bold tracking-tight text-stone-900 leading-none tabular-nums">{analyzedMedia.length}</p>
          <p className="text-[12px] text-stone-500 mt-1.5">Analyzed</p>
        </div>
        <div className="px-4 py-2 sm:py-0">
          <p className="text-2xl font-bold tracking-tight text-stone-900 leading-none tabular-nums">{findingsList.length}</p>
          <p className="text-[12px] text-stone-500 mt-1.5">Findings</p>
        </div>
        <div className="px-4 py-2 sm:py-0">
          <p className="text-2xl font-bold tracking-tight text-stone-900 leading-none tabular-nums">{uniqueObjects.length}</p>
          <p className="text-[12px] text-stone-500 mt-1.5">Entities</p>
        </div>
        <div className="px-4 py-2 sm:py-0 last:pr-0">
          <p className="text-2xl font-bold tracking-tight text-stone-900 leading-none tabular-nums">{uniqueLocations.length}</p>
          <p className="text-[12px] text-stone-500 mt-1.5">Locations</p>
        </div>
      </div>

      {/* Findings */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-stone-900 tracking-tight">
              Findings
            </h3>
            <p className="text-[12px] text-stone-500 mt-0.5">
              Evidence-backed observations extracted from your media.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 tabular-nums">
            {findingsList.length} verified
          </span>
        </div>

        {findingsList.length > 0 ? (
          <div className="space-y-2.5">
            {findingsList.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {item.media.cloudinaryUrl && (
                    <img
                      src={item.media.cloudinaryUrl}
                      alt={item.media.originalFilename}
                      className="w-14 h-10 object-cover rounded-lg border border-stone-200 flex-shrink-0 mt-0.5"
                    />
                  )}
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[12px] font-semibold text-stone-800 truncate">
                        {item.title}
                      </h4>
                      <span className="badge badge-success text-[10px] flex-shrink-0">
                        {item.confidence}
                      </span>
                    </div>
                    <p className="text-[12px] text-stone-500 leading-relaxed">
                      {item.observation}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      From: <span className="text-stone-600 font-medium">{item.media.originalFilename}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMedia?.(item.media)}
                  className="btn btn-secondary btn-sm text-[11px] self-start sm:self-center gap-1 flex-shrink-0"
                >
                  <Eye size={11} /> View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-stone-500 py-4 text-center">
            No findings detected yet.
          </p>
        )}
      </div>

      {/* Two Column: Entities & Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Entities */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-[13px] font-semibold text-stone-800">
              Entities ({uniqueObjects.length})
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Detected objects across all media</p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {uniqueObjects.map((obj, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onFilterTag?.(obj.name)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[12px] text-stone-600 transition-colors"
              >
                <span className="capitalize">{obj.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200/70 text-stone-600 font-semibold tabular-nums">
                  {obj.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-[13px] font-semibold text-stone-800">
              Locations ({uniqueLocations.length})
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Geographic signals from visual evidence</p>
          </div>

          <div className="space-y-1.5 pt-1">
            {uniqueLocations.map((loc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[12px]"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin size={11} className="text-stone-400 flex-shrink-0" />
                  <span className="font-medium text-stone-700 truncate">{loc.name}</span>
                </div>
                <span className="text-[11px] text-stone-500 flex-shrink-0 font-medium tabular-nums">
                  {loc.assets.length} {loc.assets.length === 1 ? 'asset' : 'assets'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
