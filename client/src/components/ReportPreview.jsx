import { useState } from 'react';
import { FileText, Download, Loader, Printer, CheckCircle } from 'lucide-react';
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
        title: title.trim() || undefined
      });

      if (format === 'html') {
        setReportHtml(data);
        toast.success('Report generated');
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
    a.download = `impactlens-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInNewTabAndPrint = () => {
    if (!reportHtml) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Generator */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-[14px] font-semibold text-stone-900 tracking-tight">
            Generate Report
          </h3>
          <p className="text-[12px] text-stone-500 mt-0.5">
            Compile findings, evidence, and metadata into a shareable document.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="label text-[12px]">
              Report title <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              className="input text-[13px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Visual Evidence Audit — Q3 2026"
            />
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle size={13} className="text-emerald-600 flex-shrink-0" />
              <span><strong>{analyzedMedia.length}</strong> analyzed items will be included</span>
            </div>
          </div>

          <button
            onClick={() => handleGenerate('html')}
            disabled={loading || analyzedMedia.length === 0}
            className="btn btn-primary w-full justify-center text-[13px] py-2.5 disabled:opacity-40"
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <FileText size={14} />}
            <span>{loading ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* Preview */}
      {reportHtml && (
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h4 className="text-[13px] font-semibold text-stone-900">
                Report Preview
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Ready to export or print.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openInNewTabAndPrint}
                className="btn btn-primary btn-sm text-[12px] gap-1.5"
              >
                <Printer size={12} /> Print / PDF
              </button>
              <button
                type="button"
                onClick={downloadHtml}
                className="btn btn-secondary btn-sm text-[12px] gap-1.5"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <iframe
              srcDoc={reportHtml}
              className="w-full h-[680px] border-0 bg-white"
              title="Report Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
