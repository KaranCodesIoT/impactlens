import { Link } from 'react-router-dom';
import { MapPin, Image, Clock, Info, Trash2, ChevronRight, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ProjectIllustration from './ProjectIllustration';

export default function ProjectCard({ project, onDelete, index = 0 }) {
  const formattedTitle = project.name
    ? project.name.charAt(0).toUpperCase() + project.name.slice(1)
    : 'Untitled Project';

  const isTour = project.name?.toLowerCase().includes('tour') || index % 2 === 1;
  const illustrationType = isTour ? 'tour' : 'coral';
  const emptySubtext = isTour ? 'Add project images to begin' : 'Upload visual data to start';

  const formattedTime = formatDistanceToNow(
    new Date(project.updatedAt || project.createdAt || Date.now()),
    { addSuffix: true }
  );

  return (
    <div className="bg-[#111622] border border-[#1e2634] rounded-2xl overflow-hidden hover:border-[#2b3a52] hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Recessed Media Preview Slot */}
        <Link
          to={`/project/${project._id}`}
          className="block m-3.5 mb-2 h-56 rounded-xl bg-[#090d16] border border-[#182230] relative overflow-hidden group/thumb cursor-pointer"
        >
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full relative flex items-center justify-center">
              {/* 3D Low-Poly Render Background */}
              <div className="absolute inset-0 flex items-center justify-center p-2 opacity-85 transition-transform duration-500 group-hover/thumb:scale-[1.02]">
                <ProjectIllustration type={illustrationType} />
              </div>

              {/* Centered Document Badge Overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <div className="w-10 h-10 rounded-lg bg-[#0e1520]/80 backdrop-blur-sm border border-slate-700/40 flex items-center justify-center mb-1.5 shadow-md">
                  <FileText className="w-5 h-5 text-slate-200 stroke-[1.75]" />
                </div>
                <h4 className="text-[15px] font-semibold text-white tracking-tight drop-shadow-sm">
                  No media yet
                </h4>
                <p className="text-[12px] text-slate-400 mt-0.5 drop-shadow-sm">
                  {emptySubtext}
                </p>
              </div>
            </div>
          )}
        </Link>

        {/* Project Info Section */}
        <div className="px-5 pt-2 pb-4">
          <Link
            to={`/project/${project._id}`}
            className="flex items-center justify-between gap-2 group/title"
          >
            <h3 className="text-[16px] font-semibold text-white group-hover/title:text-blue-400 transition-colors leading-snug truncate">
              {formattedTitle}
            </h3>
            <ChevronRight
              size={16}
              className="text-slate-500 group-hover/title:text-slate-300 group-hover/title:translate-x-0.5 transition-all flex-shrink-0"
            />
          </Link>

          <p className="text-[13px] text-slate-400 mt-1 line-clamp-2 leading-relaxed min-h-[1.75rem]">
            {project.description || 'Visual documentation and change analysis workspace.'}
          </p>

          {/* Location Badge (Matches reference) */}
          {(project.location || true) && (
            <div className="mt-3.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#182232] border border-white/5 text-slate-300 text-xs font-normal">
                <MapPin size={11} className="text-slate-400" />
                <span className="truncate max-w-[140px]">
                  {project.location || 'mumbai'}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Bar */}
      <div className="border-t border-[#1a2332] px-5 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="flex items-center gap-1">
            <Image size={13} className="text-slate-400" />
            <span>{project.stats?.totalMedia || 0} media</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-slate-400" />
            <span>{project.stats?.analyzedMedia || 0} analyzed</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1">
            <Info size={13} className="text-slate-400" />
            <span>{project.stats?.findings || 0} findings</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Updated {formattedTime}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(project._id);
            }}
            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete project"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
