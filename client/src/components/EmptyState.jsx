import { Camera, FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = "Ready when you are",
  description = "Upload photos or videos to get started. We'll extract insights, track changes, and organize everything automatically.",
  onUpload = null,
  action = null
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-10 mt-4 min-h-[360px]">

      {/* Modern dark illustration cluster */}
      <div className="relative w-[220px] h-[150px] mx-auto mb-6 flex items-center justify-center">
        {/* Ambient glow circle */}
        <div className="absolute w-28 h-28 rounded-full bg-blue-950/20 blur-xl" />

        {/* Icon cluster */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111622] border border-[#1e2634] shadow-xl flex items-center justify-center">
            <FolderOpen className="w-7 h-7 text-blue-400 stroke-[1.5]" />
          </div>
          <div className="absolute -top-2.5 -right-5 w-10 h-10 rounded-xl bg-[#16202e] border border-[#243247] shadow-lg flex items-center justify-center rotate-6">
            <Camera className="w-4.5 h-4.5 text-slate-300 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center max-w-md mx-auto relative z-20">
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Main Action */}
        {onUpload ? (
          <button
            onClick={onUpload}
            className="bg-[#2563eb] hover:bg-blue-600 text-white font-medium text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Upload Media
          </button>
        ) : action ? (
          action
        ) : null}
      </div>
    </div>
  );
}
