import { CheckCircle, Loader, AlertCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { icon: Clock, label: 'Pending', className: 'badge-warning' },
  analyzing: { icon: Loader, label: 'Analyzing...', className: 'badge-info' },
  ready: { icon: CheckCircle, label: 'Analyzed', className: 'badge-success' },
  failed: { icon: AlertCircle, label: 'Failed', className: 'badge-danger' }
};

export default function AnalysisBadge({ status = 'pending' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={11} className={status === 'analyzing' ? 'animate-spin' : ''} />
      {config.label}
    </span>
  );
}
