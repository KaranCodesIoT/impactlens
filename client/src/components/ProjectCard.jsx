import { Link } from 'react-router-dom';
import { FolderOpen, MapPin, Image, Brain, Sparkles, Trash2, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_COLORS = {
  environment: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  infrastructure: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  agriculture: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  education: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  health: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  water: { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
  energy: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  inspection: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  research: { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
  events: { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' },
  other: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' }
};

export default function ProjectCard({ project, onDelete }) {
  const color = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other;

  return (
    <Link
      to={`/project/${project._id}`}
      className="card block overflow-hidden no-underline text-inherit animate-fade-in group"
    >
      {/* Cover image */}
      <div className="h-40 overflow-hidden relative bg-surface-50">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <FolderOpen size={36} className="text-primary-300" />
          </div>
        )}
        {/* Category badge */}
        <span
          className="absolute top-3 right-3 text-[0.65rem] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
        >
          {project.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-surface-900 mb-1 group-hover:text-primary-700 transition-colors">
          {project.name}
        </h3>

        {project.description && (
          <p className="text-xs text-surface-400 mb-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {project.location && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400 mb-3">
            <MapPin size={12} />
            {project.location}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-surface-400 pt-3 border-t border-surface-100">
          <div className="flex items-center gap-1.5">
            <Image size={12} className="text-primary-500" />
            <span>{project.stats?.totalMedia || 0} media</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Brain size={12} className="text-accent-500" />
            <span>{project.stats?.analyzedMedia || 0} analyzed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-warning-500" />
            <span>{project.stats?.findings || 0} findings</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2">
          <span className="text-[0.7rem] text-surface-300">
            {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(project._id); }}
              className="btn btn-icon btn-ghost text-surface-300 hover:text-danger-500 p-1"
              title="Delete project"
            >
              <Trash2 size={14} />
            </button>
            <ChevronRight size={16} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
