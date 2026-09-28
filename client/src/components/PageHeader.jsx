import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({
  breadcrumbs = [],
  title,
  description,
  metrics = [],
  actions = null
}) {
  return (
    <div className="px-4 sm:px-8 pt-5 sm:pt-7 pb-5 relative z-10 shrink-0 border-b border-[#1a2332]/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center text-[12px] text-slate-400 mb-1.5 font-medium">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={idx} className="flex items-center">
                    {crumb.to && !isLast ? (
                      <Link to={crumb.to} className="hover:text-white transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? 'text-slate-200 font-semibold' : ''}>
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-600" />}
                  </span>
                );
              })}
            </nav>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-[13px] text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

          {/* Metrics */}
          {metrics.length > 0 && (
            <div className="flex items-center gap-4 mt-3 text-[12px] text-slate-400">
              {metrics.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="text-white font-semibold tabular-nums">{item.count}</span>
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
