import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, FolderOpen, Sparkles, X, MapPin, Calendar, Image as ImageIcon,
  Brain, TreePine, Building2, Wheat, ClipboardCheck, FlaskConical,
  CalendarDays, MapPinned, Users, Upload, ChevronRight
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const USE_CASES = [
  { id: 'environment', label: 'Environmental', icon: TreePine, color: '#22c55e', bg: '#f0fdf4' },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2, color: '#3b82f6', bg: '#eff6ff' },
  { id: 'agriculture', label: 'Agriculture', icon: Wheat, color: '#f59e0b', bg: '#fffbeb' },
  { id: 'inspection', label: 'Inspection', icon: ClipboardCheck, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'research', label: 'Research', icon: FlaskConical, color: '#06b6d4', bg: '#ecfeff' },
  { id: 'events', label: 'Events', icon: CalendarDays, color: '#ec4899', bg: '#fdf2f8' },
  { id: 'water', label: 'Field Operations', icon: MapPinned, color: '#14b8a6', bg: '#f0fdfa' },
  { id: 'health', label: 'Community Programs', icon: Users, color: '#f97316', bg: '#fff7ed' },
];

export default function Home() {
  const { projects, loading, addProject, removeProject } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    category: 'environment',
    startDate: '',
    endDate: '',
    coverImage: ''
  });
  const [creating, setCreating] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    try {
      await addProject(form);
      toast.success('Project created!');
      setForm({ name: '', description: '', location: '', category: 'environment', startDate: '', endDate: '', coverImage: '' });
      setThumbnailPreview(null);
      setShowCreate(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its media?')) return;
    try {
      await removeProject(id);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setThumbnailPreview(URL.createObjectURL(file));

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'impactlens/thumbnails');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setForm(prev => ({ ...prev, coverImage: data.secure_url }));
    } catch {
      toast.error('Thumbnail upload failed');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900">Projects</h2>
          <p className="text-sm text-surface-400 mt-0.5">Manage your impact & sustainability projects</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="p-6 lg:p-8">
        {/* Step Indicator */}
        <div className="flex items-start gap-4 mb-8">
          <div className="step-number">1</div>
          <div>
            <h3 className="text-lg font-bold text-surface-900">Create / Select a Project</h3>
            <p className="text-sm text-surface-400 mt-0.5">Start a new project and set basic details.</p>
          </div>
        </div>

        {/* Supported Use Cases */}
        <div className="card-flat p-5 mb-8">
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Supported Use Cases</h4>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {USE_CASES.map(uc => {
              const Icon = uc.icon;
              return (
                <button
                  key={uc.id}
                  onClick={() => {
                    setForm(prev => ({ ...prev, category: uc.id }));
                    setShowCreate(true);
                  }}
                  className={`usecase-chip ${form.category === uc.id ? 'selected' : ''}`}
                >
                  <div className="usecase-chip-icon" style={{ background: uc.bg }}>
                    <Icon size={20} style={{ color: uc.color }} />
                  </div>
                  <span className="usecase-chip-label">{uc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-flat p-0 overflow-hidden">
                <div className="h-40 skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 skeleton w-2/3" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-5">
              <FolderOpen size={36} className="text-surface-300" />
            </div>
            <h3 className="text-lg font-semibold text-surface-700 mb-2">No Projects Yet</h3>
            <p className="text-sm text-surface-400 mb-6 max-w-sm mx-auto">
              Create your first impact monitoring project to start uploading media and generating AI-powered insights.
            </p>
            <button onClick={() => setShowCreate(true)} className="btn btn-primary btn-lg">
              <Plus size={18} /> Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <ProjectCard key={p._id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* ─── Create Project Modal ──────────────────────────────────────── */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreate}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FolderOpen size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-surface-900">Create New Project</h3>
                    <p className="text-xs text-surface-400">Organize your field media and get AI-powered insights.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowCreate(false)} className="btn btn-icon btn-ghost">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Project Name */}
                <div>
                  <label className="label">Project Name</label>
                  <input
                    type="text"
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Riverside Restoration Initiative"
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Restoration and monitoring of riverside area with regular site visits, documentation and progress tracking."
                    rows={3}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="label">Location (Optional)</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      className="input pl-10"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Pune, Maharashtra"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input
                        type="date"
                        className="input pl-10"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input
                        type="date"
                        className="input pl-10"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="label">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {USE_CASES.slice(0, 8).map(uc => {
                      const Icon = uc.icon;
                      return (
                        <button
                          key={uc.id}
                          type="button"
                          onClick={() => setForm({ ...form, category: uc.id })}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                            form.category === uc.id
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-surface-200 text-surface-500 hover:border-surface-300'
                          }`}
                        >
                          <Icon size={14} style={{ color: uc.color }} />
                          <span className="truncate">{uc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project Thumbnail */}
                <div>
                  <label className="label">Project Thumbnail</label>
                  <div
                    className="thumbnail-upload"
                    onClick={() => document.getElementById('thumb-input').click()}
                  >
                    <input
                      id="thumb-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail preview" />
                    ) : (
                      <div className="thumbnail-upload-placeholder">
                        <Upload size={24} />
                        <span className="text-xs font-medium">Upload Image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-surface-100">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !form.name.trim()}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
