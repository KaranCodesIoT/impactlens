export default function SectionHeader({
  title,
  description,
  badge = null,
  actions = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-surface-100 ${className}`}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-surface-900">{title}</h3>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-surface-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
