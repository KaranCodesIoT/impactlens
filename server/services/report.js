import { getReportUrl } from './cloudinary.js';

/**
 * Generate an HTML report from analyzed media.
 * PDF generation will be added in Day 3 (with Puppeteer).
 */
export async function generateReport(mediaList, options = {}) {
  const { format = 'html', title } = options;
  const project = mediaList[0]?.project;
  const reportTitle = title || `${project?.name || 'Project'} — Impact Report`;

  const html = buildReportHTML(reportTitle, project, mediaList);

  if (format === 'pdf') {
    // Day 3: Puppeteer PDF generation
    // For now, return HTML with print-optimized styles
    return html;
  }

  return html;
}

function buildReportHTML(title, project, mediaList) {
  const mediaSections = mediaList.map(m => {
    const analysis = m.analysis?.result;
    if (!analysis) return '';

    const reportImgUrl = getReportUrl(m.cloudinaryId);
    const observations = (analysis.observations || [])
      .map(obs => `<li><strong>${obs.label}</strong>: ${obs.description} <em>(${obs.significance} significance)</em></li>`)
      .join('');

    const indicators = (analysis.impactIndicators || [])
      .map(ind => `<li><strong>${ind.metric}</strong>: ${ind.value} — Trend: ${ind.trend}. <em>${ind.evidence}</em></li>`)
      .join('');

    const concerns = (analysis.concerns || [])
      .map(c => `<li><strong>[${c.severity.toUpperCase()}]</strong> ${c.issue} — ${c.recommendation}</li>`)
      .join('');

    const categories = (analysis.categories || [])
      .map(c => `<span class="badge">${c.name} (${Math.round(c.confidence * 100)}%) — SDGs: ${c.sdgGoals?.join(', ') || 'N/A'}</span>`)
      .join(' ');

    return `
      <div class="media-section">
        <div class="media-header">
          <img src="${reportImgUrl}" alt="${m.originalFilename || 'Media'}" class="media-image" />
          <div class="media-meta">
            <h3>${m.originalFilename || m.cloudinaryId}</h3>
            <p class="date">Uploaded: ${new Date(m.createdAt).toLocaleDateString()}</p>
            <div class="categories">${categories}</div>
            <p class="asset-link">Source: <a href="${m.cloudinaryUrl}" target="_blank">${m.cloudinaryId}</a></p>
          </div>
        </div>

        <div class="scene">
          <h4>Scene Description</h4>
          <p>${analysis.scene?.description || 'N/A'}</p>
          <p><em>${analysis.scene?.environment} • ${analysis.scene?.setting} • ${analysis.scene?.weather} • ${analysis.scene?.timeOfDay}</em></p>
        </div>

        ${observations ? `<div class="observations"><h4>Key Observations</h4><ul>${observations}</ul></div>` : ''}
        ${indicators ? `<div class="indicators"><h4>Impact Indicators</h4><ul>${indicators}</ul></div>` : ''}
        ${concerns ? `<div class="concerns"><h4>Concerns & Recommendations</h4><ul>${concerns}</ul></div>` : ''}

        <div class="summary">
          <h4>Summary</h4>
          <p>${analysis.summary || 'N/A'}</p>
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding: 40px;
    }

    .report-header {
      text-align: center;
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 2px solid #e2e8f0;
    }

    .report-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .report-header .subtitle {
      color: #64748b;
      font-size: 0.95rem;
    }

    .report-header .meta {
      margin-top: 16px;
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .media-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }

    .media-header {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;
    }

    .media-image {
      width: 280px;
      height: 210px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .media-meta h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .date { color: #64748b; font-size: 0.85rem; margin-bottom: 8px; }

    .badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 10px;
      border-radius: 100px;
      font-size: 0.78rem;
      font-weight: 500;
      margin-right: 6px;
      margin-bottom: 4px;
    }

    .asset-link {
      margin-top: 8px;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .asset-link a { color: #3b82f6; text-decoration: none; }

    h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
      margin-top: 16px;
    }

    ul { padding-left: 20px; }
    li { margin-bottom: 6px; font-size: 0.9rem; }

    .summary p { font-size: 0.95rem; color: #475569; }

    .footer {
      text-align: center;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 0.8rem;
    }

    @media print {
      body { padding: 20px; background: white; }
      .media-section { box-shadow: none; border: 1px solid #e2e8f0; }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <h1>${title}</h1>
    <p class="subtitle">${project?.description || 'AI-Powered Impact Analysis Report'}</p>
    <p class="meta">
      Location: ${project?.location || 'N/A'} •
      Category: ${project?.category || 'N/A'} •
      Assets Analyzed: ${mediaList.length} •
      Generated: ${new Date().toLocaleDateString()}
    </p>
  </div>

  ${mediaSections}

  <div class="footer">
    <p>Generated by ImpactLens — AI Visual Evidence Intelligence</p>
    <p>Every finding is traceable to the original Cloudinary asset linked above.</p>
  </div>
</body>
</html>`;
}
