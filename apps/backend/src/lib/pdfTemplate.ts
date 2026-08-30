import type { Plan } from '@build-planner/shared';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  // Basic markdown conversion for headers, bold, bullet lists, and paragraphs
  let html = escapeHtml(markdown);

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Bullet lists
  const lines = html.split('\n');
  let inList = false;
  const processedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (trimmed.length > 0) {
        processedLines.push(`<p>${trimmed}</p>`);
      }
    }
  }

  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('');
}

export function generatePdfHtml(plan: Plan): string {
  const formattedDate = new Date(plan.generatedAt).toLocaleDateString('en-GB', {
    dateStyle: 'long',
  });

  const s = plan.sections;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(plan.businessName)} — Business Plan</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #18181b;
      background: #ffffff;
      font-size: 10pt;
      line-height: 1.6;
    }

    /* Page Breaks */
    .page-break {
      page-break-after: always;
    }

    /* Cover Page */
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10pt;
      font-weight: 600;
      color: #0d9488;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
    }

    .brand-dot {
      width: 8px;
      height: 8px;
      background-color: #0d9488;
      border-radius: 50%;
    }

    .cover-title {
      font-size: 28pt;
      font-weight: 800;
      color: #09090b;
      line-height: 1.2;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .cover-tagline {
      font-size: 13pt;
      color: #71717a;
      max-width: 480px;
      margin-bottom: 40px;
      line-height: 1.5;
    }

    .cover-meta {
      font-size: 9pt;
      color: #a1a1aa;
      border-top: 1px solid #e4e4e7;
      padding-top: 16px;
      width: 240px;
    }

    /* Section Styling */
    .section-card {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #09090b;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f4f4f5;
    }

    .prose p {
      margin-bottom: 10px;
      color: #27272a;
    }

    .prose p:last-child {
      margin-bottom: 0;
    }

    .prose ul {
      margin-bottom: 10px;
      padding-left: 20px;
    }

    .prose li {
      margin-bottom: 4px;
      color: #27272a;
    }

    /* Competitors Table */
    .competitor-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 9.5pt;
    }

    .competitor-table th {
      background-color: #f4f4f5;
      color: #09090b;
      font-weight: 600;
      text-align: left;
      padding: 10px 12px;
      border: 1px solid #e4e4e7;
    }

    .competitor-table td {
      padding: 10px 12px;
      border: 1px solid #e4e4e7;
      vertical-align: top;
      color: #27272a;
    }

    /* SWOT Grid */
    .swot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 14px;
    }

    .swot-quadrant {
      border-radius: 8px;
      padding: 14px;
      border: 1px solid;
    }

    .swot-quadrant-title {
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }

    .swot-quadrant ul {
      list-style-type: disc;
      padding-left: 16px;
    }

    .swot-quadrant li {
      font-size: 9pt;
      margin-bottom: 4px;
    }

    .swot-strengths {
      background-color: #ecfdf5;
      border-color: #a7f3d0;
      color: #065f46;
    }
    .swot-strengths .swot-quadrant-title { color: #047857; }

    .swot-weaknesses {
      background-color: #fef2f2;
      border-color: #fecaca;
      color: #991b1b;
    }
    .swot-weaknesses .swot-quadrant-title { color: #b91c1c; }

    .swot-opportunities {
      background-color: #eff6ff;
      border-color: #bfdbfe;
      color: #1e40af;
    }
    .swot-opportunities .swot-quadrant-title { color: #1d4ed8; }

    .swot-threats {
      background-color: #fff7ed;
      border-color: #ffedd5;
      color: #9a3412;
    }
    .swot-threats .swot-quadrant-title { color: #c2410c; }

    /* Financial Placeholder Styling */
    .placeholder-card {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .placeholder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .placeholder-badge {
      background-color: #fef3c7;
      border: 1px solid #fde68a;
      color: #b45309;
      font-size: 8pt;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page page-break">
    <div class="brand-badge">
      <span class="brand-dot"></span>
      BuildPlanner
    </div>
    <h1 class="cover-title">${escapeHtml(plan.businessName)}</h1>
    <p class="cover-tagline">${escapeHtml(plan.tagline)}</p>
    <div class="cover-meta">
      Generated on ${formattedDate}
    </div>
  </div>

  <!-- Executive Summary -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.executiveSummary.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.executiveSummary.content)}</div>
  </div>

  <!-- Company Description -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.companyDescription.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.companyDescription.content)}</div>
  </div>

  <!-- Products & Services -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.productsServices.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.productsServices.content)}</div>
  </div>

  <!-- Market Analysis -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.marketAnalysis.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.marketAnalysis.content)}</div>
  </div>

  <!-- Competitive Landscape -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.competitiveLandscape.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.competitiveLandscape.content || '')}</div>
    ${
      s.competitiveLandscape.competitors && s.competitiveLandscape.competitors.length > 0
        ? `
      <table class="competitor-table">
        <thead>
          <tr>
            <th style="width: 25%;">Competitor</th>
            <th style="width: 37.5%;">Strengths</th>
            <th style="width: 37.5%;">Weaknesses</th>
          </tr>
        </thead>
        <tbody>
          ${s.competitiveLandscape.competitors
            .map(
              (c) => `
            <tr>
              <td><strong>${escapeHtml(c.name)}</strong></td>
              <td>${escapeHtml(c.strengths)}</td>
              <td>${escapeHtml(c.weaknesses)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `
        : ''
    }
  </div>

  <!-- Marketing Strategy -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.marketingStrategy.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.marketingStrategy.content)}</div>
  </div>

  <!-- Operations Plan -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.operationsPlan.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.operationsPlan.content)}</div>
  </div>

  <!-- Management Team -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.managementTeam.title)}</h2>
    <div class="prose">${renderMarkdownToHtml(s.managementTeam.content)}</div>
  </div>

  <!-- SWOT Analysis -->
  <div class="section-card">
    <h2 class="section-title">${escapeHtml(s.swot.title)}</h2>
    <div class="swot-grid">
      <div class="swot-quadrant swot-strengths">
        <div class="swot-quadrant-title">Strengths</div>
        <ul>
          ${s.swot.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
      <div class="swot-quadrant swot-weaknesses">
        <div class="swot-quadrant-title">Weaknesses</div>
        <ul>
          ${s.swot.weaknesses.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
      <div class="swot-quadrant swot-opportunities">
        <div class="swot-quadrant-title">Opportunities</div>
        <ul>
          ${s.swot.opportunities.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
      <div class="swot-quadrant swot-threats">
        <div class="swot-quadrant-title">Threats</div>
        <ul>
          ${s.swot.threats.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <!-- Financial Plan Placeholder -->
  <div class="placeholder-card">
    <div class="placeholder-header">
      <h2 class="section-title" style="border: none; margin: 0; padding: 0;">${escapeHtml(s.financialPlanPlaceholder.title)}</h2>
      <span class="placeholder-badge">Coming Soon</span>
    </div>
    <p style="font-size: 9.5pt; color: #78350f;">${escapeHtml(s.financialPlanPlaceholder.content)}</p>
  </div>

</body>
</html>`;
}
