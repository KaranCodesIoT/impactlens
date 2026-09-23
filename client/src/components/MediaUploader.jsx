import { useState, useCallback } from 'react';
import { Upload, CloudUpload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerMedia } from '../services/api';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function MediaUploader({ projectId, projectSlug, onMediaAdded }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `impactlens/${projectSlug}`);
    formData.append('tags', projectId);
    formData.append('context', `project_id=${projectId}`);

    const progressId = Date.now() + Math.random();
    setUploadProgress(prev => [...prev, { id: progressId, name: file.name, progress: 0 }]);

    try {
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

      const xhr = new XMLHttpRequest();
      const result = await new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(prev =>
              prev.map(p => p.id === progressId ? { ...p, progress: pct } : p)
            );
          }
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
        xhr.send(formData);
      });

      // Register with our backend
      const media = await registerMedia(projectId, {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        original_filename: result.original_filename,
        tags: result.tags || []
      });

      setUploadProgress(prev => prev.filter(p => p.id !== progressId));
      onMediaAdded?.(media);
      toast.success(`${file.name} uploaded & analyzing...`);

      return media;
    } catch (err) {
      setUploadProgress(prev => prev.filter(p => p.id !== progressId));
      toast.error(`Failed to upload ${file.name}`);
      throw err;
    }
  };

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    const promises = fileArray.map(f => uploadFile(f).catch(() => null));
    await Promise.allSettled(promises);
    setUploading(false);
  }, [projectId, projectSlug]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${dragActive
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
          }`}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
            ${dragActive ? 'bg-primary-500/20' : 'bg-white/5'}`}>
            <CloudUpload size={28} className={dragActive ? 'text-primary-400' : 'text-surface-700'} />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-200">
              {dragActive ? 'Drop files here' : 'Drag & drop photos or videos'}
            </p>
            <p className="text-xs text-surface-700 mt-1">
              or click to browse · JPG, PNG, WebP, MP4, MOV · up to 50MB
            </p>
          </div>
        </div>
      </div>

      {/* Upload progress bars */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map(item => (
            <div key={item.id} className="glass-card p-3 flex items-center gap-3">
              <Upload size={14} className="text-primary-400 animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-surface-200 truncate">{item.name}</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-surface-700 flex-shrink-0">{item.progress}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
