import { CheckCircle, Loader, AlertCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { icon: Clock, label: 'Pending', className: 'badge-warning' },
  analyzing: { icon: Loader, label: 'Analyzing...', className: 'badge-info' },
  ready: { icon: CheckCircle, label: 'Analyzed', className: 'badge-success' },
  failed: { icon: AlertCircle, label: 'Failed', className: 'badge-danger' }
};

export default function AnalysisBadge({ status = 'pending' }) {
  if (status === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/85 text-cyan-300 border border-cyan-400/50 text-[0.625rem] font-semibold shadow-[0_0_12px_rgba(56,189,248,0.35)] backdrop-blur-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
        </span>
        <span>AI Analyzing</span>
      </span>
    );
  }

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={11} />
      {config.label}
    </span>
  );
}
