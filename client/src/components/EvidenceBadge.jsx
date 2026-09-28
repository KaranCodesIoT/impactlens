import { CheckCircle2, Loader2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export function EvidenceBadge({ confidence = 'high', label, className = '' }) {
  const isHigh = confidence === 'high';
  const isMedium = confidence === 'medium';
  
  const badgeClass = isHigh
    ? 'badge-success'
    : isMedium
    ? 'badge-warning'
    : 'badge-neutral';

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <ShieldCheck size={10} />
      <span>{label || `${confidence} confidence`}</span>
    </span>
  );
}

export function StatusIndicator({ status = 'pending', label }) {
  const configs = {
    pending: { icon: Clock, label: 'Pending', className: 'badge-warning' },
    analyzing: { icon: Loader2, label: 'Analyzing', className: 'badge-primary' },
    ready: { icon: CheckCircle2, label: 'Analyzed', className: 'badge-success' },
    failed: { icon: AlertCircle, label: 'Failed', className: 'badge-danger' }
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={10} className={status === 'analyzing' ? 'animate-spin' : ''} />
      <span>{label || config.label}</span>
    </span>
  );
}

export default StatusIndicator;
