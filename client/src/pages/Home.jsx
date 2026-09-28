import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, FolderGit2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import EmptyState from '../components/EmptyState';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';

export default function Home() {
  const { projects, loading, addProject, removeProject } = useProjects();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: ''
  });
  const [creating, setCreating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    try {
      const created = await addProject({
        name: form.name.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        category: 'auto-detect'
      });
      toast.success('Project created');
      setForm({ name: '', description: '', location: '' });
      setShowCreate(false);
      setShowDetails(false);
      navigate(`/project/${created._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and its media records?')) return;
    try {
      await removeProject(id);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-7 animate-fade-in text-slate-100">
      {/* ─── Page Header Matching Reference ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Projects
          </h1>
          <p className="text-[14px] text-slate-400 mt-1">
            Your visual documentation and change analysis workspaces
          </p>
        </div>

        <button
          onClick={() => { setShowCreate(true); setShowDetails(false); }}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* ─── Projects Grid (2 Columns matching reference) ─────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#111622] border border-[#1e2634] rounded-2xl overflow-hidden p-4 space-y-4">
              <div className="h-56 bg-[#0a0e16] rounded-xl animate-pulse" />
              <div className="space-y-2 px-1">
                <div className="h-5 bg-[#182232] rounded w-2/3 animate-pulse" />
                <div className="h-3.5 bg-[#182232] rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Create a project to start uploading photos and videos. We'll automatically analyze your visual data and extract actionable insights."
          action={
            <button
              onClick={() => { setShowCreate(true); setShowDetails(false); }}
              className="bg-[#2563eb] hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus size={15} /> Create Project
            </button>
          }
          className="my-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, idx) => (
            <ProjectCard
              key={p._id}
              project={p}
              onDelete={handleDelete}
              index={idx}
            />
          ))}
        </div>
      )}

      {/* ─── Create Project Modal (Dark SaaS Theme) ───────────────── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => !creating && setShowCreate(false)}
        >
          <div
            className="bg-[#111622] border border-[#1e2634] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleCreate}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 pb-4 border-b border-[#1a2332]">
                <div>
                  <h3 className="text-[16px] font-semibold text-white leading-tight">New Project</h3>
                  <p className="text-[12px] text-slate-400 mt-0.5">Create a workspace for visual documentation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182232] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1e2634] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Coral reef survey, Tour"
                    required
                    autoFocus
                    disabled={creating}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1e2634] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Visual documentation and change analysis workspace."
                    rows={2}
                    disabled={creating}
                  />
                </div>

                {/* Collapsible Location */}
                <div>
                  {!showDetails ? (
                    <button
                      type="button"
                      onClick={() => setShowDetails(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      + Add location
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#090d16] border border-[#1e2634] space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300">
                          Location
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowDetails(false)}
                          className="text-[11px] text-slate-500 hover:text-slate-300"
                        >
                          Hide
                        </button>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#111622] border border-[#1e2634] rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g., Mumbai, Great Barrier Reef"
                        disabled={creating}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 px-5 py-4 bg-[#090d16]/70 border-t border-[#1a2332]">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#182232] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !form.name.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#2563eb] hover:bg-blue-600 disabled:opacity-50 text-white transition-all shadow-sm cursor-pointer"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
