import { Loader } from 'lucide-react';

export default function AIProcessingPipeline({ isAnalyzing, analyzingCount, totalCount, analyzedCount }) {
  if (!isAnalyzing) return null;

  const pct = totalCount > 0 ? Math.round((analyzedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-[#111622] border border-[#1e2634] rounded-xl p-4 flex items-center gap-4 animate-fade-in shadow-md">
      <Loader size={16} className="text-blue-400 animate-spin flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[13px] font-medium text-white">
            Analyzing {analyzingCount} {analyzingCount === 1 ? 'item' : 'items'}...
          </p>
          <span className="text-[11px] text-slate-400 tabular-nums">{analyzedCount}/{totalCount}</span>
        </div>
        <div className="h-1.5 w-full bg-[#090d16] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
