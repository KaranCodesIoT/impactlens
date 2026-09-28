import { useState, useCallback } from 'react';
import { CloudUpload, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadMedia } from '../services/api';

export default function MediaUploader({ projectId, projectSlug, onMediaAdded, onProcessingStart }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadItems, setUploadItems] = useState([]);

  const uploadFile = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    const itemKey = `${file.name}-${Date.now()}-${Math.random()}`;

    setUploadItems(prev => [
      ...prev,
      { id: itemKey, name: file.name, previewUrl, progress: 0, status: 'uploading' }
    ]);

    try {
      const media = await uploadMedia(projectId, file, (pct) => {
        setUploadItems(prev =>
          prev.map(p => p.id === itemKey ? { ...p, progress: pct } : p)
        );
      });

      setUploadItems(prev =>
        prev.map(p => p.id === itemKey ? { ...p, progress: 100, status: 'ready' } : p)
      );

      onMediaAdded?.(media);
      return media;
    } catch (err) {
      console.error('Upload error:', err);
      const detail = err.response?.data?.error || err.message;
      setUploadItems(prev =>
        prev.map(p => p.id === itemKey ? { ...p, status: 'error' } : p)
      );
      toast.error(detail ? `Upload error: ${detail}` : `Failed to upload ${file.name}`);
      throw err;
    }
  };

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    onProcessingStart?.(fileArray.length);

    const promises = fileArray.map((f, i) =>
      uploadFile(f, fileArray.length, i).catch(() => null)
    );

    await Promise.allSettled(promises);
    setUploading(false);
    toast.success('Upload complete — analysis starting');

    setTimeout(() => {
      setUploadItems([]);
    }, 4000);
  }, [projectId, projectSlug]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const completedCount = uploadItems.filter(i => i.status === 'ready').length;
  const avgProgress = uploadItems.length > 0
    ? Math.round(uploadItems.reduce((acc, curr) => acc + curr.progress, 0) / uploadItems.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all bg-white cursor-pointer ${
          dragActive
            ? 'border-stone-400 bg-stone-50'
            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
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

        <div className="flex flex-col items-center gap-2.5 max-w-sm mx-auto">
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center border border-stone-200">
            <CloudUpload size={20} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-stone-800">
              Drop files here or click to browse
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              JPG, PNG, MP4, MOV — up to 2GB each
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadItems.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-[12px] font-medium text-stone-700">
            <div className="flex items-center gap-2">
              <Loader2 size={13} className="text-stone-500 animate-spin" />
              <span>
                {uploading
                  ? `Uploading ${completedCount}/${uploadItems.length}`
                  : `Done — ${completedCount}/${uploadItems.length}`}
              </span>
            </div>
            <span className="text-stone-900 font-semibold tabular-nums">{avgProgress}%</span>
          </div>

          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-700 rounded-full transition-all duration-300"
              style={{ width: `${avgProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-1">
            {uploadItems.map(item => (
              <div
                key={item.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100"
              >
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {item.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">
                    {item.progress}%
                  </div>
                )}
                {item.status === 'ready' && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                    <CheckCircle2 size={10} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
