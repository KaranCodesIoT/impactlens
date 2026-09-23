import { useState } from 'react';
import { FileText, Download, Loader, ExternalLink } from 'lucide-react';
import { generateReport } from '../services/api';
import toast from 'react-hot-toast';

export default function ReportPreview({ projectId, media }) {
  const [loading, setLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState(null);
  const [title, setTitle] = useState('');

  const analyzedMedia = media.filter(m => m.analysis?.status === 'ready');

  const handleGenerate = async (format = 'html') => {
    if (analyzedMedia.length === 0) {
      toast.error('No analyzed media to include in report');
      return;
    }

    setLoading(true);
    try {
      const data = await generateReport(projectId, {
        format,
        title: title || undefined
      });

      if (format === 'html') {
        setReportHtml(data);
        toast.success('Report generated!');
      }
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadHtml = () => {
    if (!reportHtml) return;
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impactlens-report.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    if (!reportHtml) return;
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2 mb-4">
          <FileText size={16} className="text-primary-400" />
          Report Generator
        </h3>

        <div className="mb-4">
          <label className="label">Report Title (optional)</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Custom report title..."
          />
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/[0.02] text-xs text-surface-700">
          <FileText size={14} />
          <span>{analyzedMedia.length} analyzed assets will be included</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleGenerate('html')}
            disabled={loading || analyzedMedia.length === 0}
            className="btn btn-primary flex-1 justify-center disabled:opacity-50"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <FileText size={16} />}
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {reportHtml && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-surface-200">Report Preview</h4>
            <div className="flex gap-2">
              <button onClick={openInNewTab} className="btn btn-secondary btn-sm">
                <ExternalLink size={13} /> Open Full
              </button>
              <button onClick={downloadHtml} className="btn btn-primary btn-sm">
                <Download size={13} /> Download HTML
              </button>
            </div>
          </div>
          <div className="glass-card overflow-hidden rounded-xl">
            <iframe
              srcDoc={reportHtml}
              className="w-full h-[600px] border-0 bg-white rounded-xl"
              title="Report Preview"
            />
          </div>
          <p className="text-xs text-surface-700 mt-2">
            💡 Tip: Open the full report and use Ctrl+P / Cmd+P to save as PDF
          </p>
        </div>
      )}
    </div>
  );
}
