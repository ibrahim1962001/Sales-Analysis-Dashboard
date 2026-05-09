import jsPDF from 'jspdf';
import type { DatasetInfo } from '../types';
import logoImg from '../assets/logo.png';

// ── Ultra-Premium Color Palette ─────────────────────────────────────
const C = {
  bgDark:   [10, 15, 30]    as [number,number,number], // Deep Obsidian Blue
  bgCard:   [18, 25, 45]    as [number,number,number],
  gold:     [212, 175, 55]  as [number,number,number], // Luxury Gold
  goldLight:[235, 205, 110] as [number,number,number],
  white:    [255, 255, 255] as [number,number,number],
  offWhite: [240, 244, 252] as [number,number,number],
  slate:    [100, 116, 139] as [number,number,number],
  slateLight:[148, 163, 184] as [number,number,number],
  green:    [16, 185, 129]  as [number,number,number],
  red:      [239, 68, 68]   as [number,number,number],
  orange:   [245, 158, 11]  as [number,number,number],
  cyan:     [6, 182, 212]   as [number,number,number],
  border:   [40, 50, 75]    as [number,number,number],
};

export interface ReportOptions {
  title?: string;
  subtitle?: string;
  author?: string;
  aiSummary?: string;
  insights?: { title: string; description: string; type: 'info'|'positive'|'warning' }[];
}

// ── High-End Rendering Helpers ────────────────────────────────────────
const rgb = (d: jsPDF, c: [number,number,number]) => d.setTextColor(...c);
const fill = (d: jsPDF, c: [number,number,number], x: number, y: number, w: number, h: number, rx = 0) => {
  d.setFillColor(...c); 
  if (rx > 0) d.roundedRect(x, y, w, h, rx, rx, 'F');
  else d.rect(x, y, w, h, 'F');
};
const line = (d: jsPDF, c: [number,number,number], x1: number, y1: number, x2: number, lw = 0.4) => {
  d.setDrawColor(...c); d.setLineWidth(lw); d.line(x1, y1, x2, y1);
};
const fmtN = (n: number) =>
  n >= 1e6 ? (n/1e6).toFixed(2)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n.toLocaleString();
const pct = (a: number, b: number) => b === 0 ? '0%' : ((a/b)*100).toFixed(1)+'%';

async function loadLogo(): Promise<HTMLImageElement|null> {
  return new Promise(res => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = logoImg;
    img.onload = () => res(img);
    img.onerror = () => res(null);
  });
}

function drawHexagon(d: jsPDF, x: number, y: number, size: number, color: [number,number,number], alpha = 1) {
  d.setFillColor(...color);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d.setGState(new (d as any).GState({ opacity: alpha }));
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    points.push([x + size * Math.cos(angle), y + size * Math.sin(angle)]);
  }
  d.lines(points.map((p, i) => i === 0 ? [p[0]-x, p[1]-y] : [p[0] - points[i-1][0], p[1] - points[i-1][1]]), x, y, [1, 1], 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d.setGState(new (d as any).GState({ opacity: 1 }));
}

// ── PAGE CHROME (Dark Theme) ──────────────────────────────────────────
function pageChrome(d: jsPDF, page: number, total: number, filename: string, logo: HTMLImageElement|null) {
  const W = d.internal.pageSize.getWidth();
  const H = d.internal.pageSize.getHeight();

  // Background is already drawn before page content

  // Header
  fill(d, C.bgCard, 0, 0, W, 20);
  fill(d, C.gold, 0, 20, W, 0.5);
  
  if (logo) d.addImage(logo, 'PNG', 12, 4, 12, 12);
  d.setFont('helvetica', 'bold'); d.setFontSize(10);
  rgb(d, C.gold); d.text('KIMIT AI STUDIO', 30, 12.5);
  
  d.setFont('helvetica', 'italic'); d.setFontSize(8);
  rgb(d, C.slateLight); d.text(filename, W/2, 12.5, { align: 'center' });
  
  d.setFont('helvetica', 'normal'); d.setFontSize(8);
  rgb(d, C.goldLight); d.text(`PAGE ${page} / ${total}`, W - 12, 12.5, { align: 'right' });

  // Footer
  fill(d, C.bgCard, 0, H - 14, W, 14);
  line(d, C.border, 0, H - 14, W, 0.5);
  d.setFontSize(7); rgb(d, C.slate);
  d.text('© KIMIT AI STUDIO • CONFIDENTIAL EXECUTIVE INTELLIGENCE', W/2, H - 6, { align: 'center', charSpace: 1 });
}

// ── SECTION HEADING ───────────────────────────────────────────────────
function secHead(d: jsPDF, label: string, y: number, accent: [number,number,number] = C.gold): number {
  const W = d.internal.pageSize.getWidth();
  fill(d, C.bgCard, 12, y, W - 24, 14, 2);
  fill(d, accent, 12, y, 4, 14); // Left accent bar
  d.setFont('helvetica', 'bold'); d.setFontSize(10);
  d.setTextColor(...accent); 
  d.text(label.toUpperCase(), 22, y + 9.5, { charSpace: 1.5 });
  return y + 22;
}

// ── PREMIUM KPI CARDS ─────────────────────────────────────────────────
function kpiCards(
  d: jsPDF,
  cards: { label: string; val: string; sub?: string; color: [number,number,number] }[],
  y: number
): number {
  const W = d.internal.pageSize.getWidth();
  const n = cards.length;
  const cw = (W - 24 - (n - 1) * 6) / n;
  cards.forEach((c, i) => {
    const cx = 12 + i * (cw + 6);
    fill(d, C.bgCard, cx, y, cw, 26, 3);
    d.setDrawColor(...C.border); d.setLineWidth(0.5);
    d.roundedRect(cx, y, cw, 26, 3, 3, 'S');
    
    // Top colored line
    fill(d, c.color, cx + 2, y, cw - 4, 1.5);
    
    d.setFont('helvetica', 'bold'); d.setFontSize(7);
    rgb(d, C.slateLight); d.text(c.label.toUpperCase(), cx + 6, y + 10, { charSpace: 0.5 });
    
    d.setFont('helvetica', 'bold'); d.setFontSize(16);
    d.setTextColor(...c.color); d.text(c.val, cx + 6, y + 21);
    
    if (c.sub) { 
      d.setFont('helvetica', 'normal'); d.setFontSize(6.5); 
      rgb(d, C.slate); 
      d.text(c.sub, cx + cw - 6, y + 21, { align: 'right' }); 
    }
  });
  return y + 34;
}

// ── ELEGANT TABLE ROW ─────────────────────────────────────────────────
function tableRow(
  d: jsPDF,
  cols: string[],
  y: number,
  widths: number[],
  startX: number,
  isHeader = false,
  isAlt = false
): number {
  const rowH = isHeader ? 11 : 9;
  const totalW = widths.reduce((a, b) => a + b, 0) + (cols.length - 1) * 0.5;
  
  if (isHeader) {
    fill(d, C.gold, startX, y, totalW, rowH, 1);
  } else if (isAlt) {
    fill(d, C.bgCard, startX, y, totalW, rowH);
  }

  d.setFont('helvetica', isHeader ? 'bold' : 'normal');
  d.setFontSize(isHeader ? 8 : 7.5);
  rgb(d, isHeader ? C.bgDark : C.offWhite);

  let x = startX;
  cols.forEach((col, i) => {
    const txt = d.splitTextToSize(col, widths[i] - 4);
    d.text(txt[0] ?? '', x + 4, y + (isHeader ? 7.5 : 6.5));
    x += widths[i] + 0.5;
  });
  
  if (!isHeader) {
    line(d, C.border, startX, y + rowH, startX + totalW, 0.2);
  }
  
  return y + rowH;
}

// ══════════════════════════════════════════════════════════════════
// PAGE 1 — LUXURY COVER
// ══════════════════════════════════════════════════════════════════
async function drawCover(
  d: jsPDF,
  opts: { title?: string; subtitle?: string; filename: string; rows: number; cols: number; generatedAt: string }
) {
  const W = d.internal.pageSize.getWidth();
  const H = d.internal.pageSize.getHeight();

  // Deep Background
  fill(d, C.bgDark, 0, 0, W, H);
  
  // Decorative Geometric Background (Hexagons)
  drawHexagon(d, W, 0, 120, C.gold, 0.03);
  drawHexagon(d, W - 40, -20, 80, C.cyan, 0.02);
  drawHexagon(d, 0, H, 150, C.gold, 0.03);

  // Logo + Brand
  const logo = await loadLogo();
  if (logo) d.addImage(logo, 'PNG', 20, 30, 30, 30);
  d.setFont('helvetica', 'bold'); d.setFontSize(28);
  rgb(d, C.gold); d.text('KIMIT', 55, 45, { charSpace: 4 });
  rgb(d, C.white); d.text('AI STUDIO', 95, 45, { charSpace: 4 });
  
  d.setFont('helvetica', 'normal'); d.setFontSize(10);
  rgb(d, C.cyan); d.text('ENTERPRISE DATA INTELLIGENCE PLATFORM', 56, 55, { charSpace: 2 });

  // Title Block
  const tY = 110;
  fill(d, C.bgCard, 0, tY, W, 70);
  fill(d, C.gold, 0, tY, 6, 70);
  
  d.setFont('helvetica', 'bold'); d.setFontSize(32);
  rgb(d, C.white);
  const titleLines = d.splitTextToSize((opts.title || 'Executive Intelligence').toUpperCase(), W - 40);
  d.text(titleLines, 24, tY + 28);
  
  d.setFont('helvetica', 'italic'); d.setFontSize(14);
  rgb(d, C.goldLight);
  d.text(opts.subtitle || 'Strategic Data Analysis & Automated Insights', 24, tY + 52);

  // Meta Info Grid
  const metaY = tY + 95;
  const metas = [
    { l: 'SOURCE DATASET', v: opts.filename },
    { l: 'TOTAL RECORDS', v: fmtN(opts.rows) },
    { l: 'DATA DIMENSIONS', v: String(opts.cols) + ' Columns' },
    { l: 'TIMESTAMP', v: opts.generatedAt },
  ];
  
  metas.forEach((m, i) => {
    const cx = 20 + (i % 2) * 90;
    const cy = metaY + Math.floor(i / 2) * 25;
    d.setFont('helvetica', 'bold'); d.setFontSize(8);
    rgb(d, C.slate); d.text(m.l, cx, cy, { charSpace: 1 });
    d.setFont('helvetica', 'bold'); d.setFontSize(12);
    rgb(d, C.offWhite); d.text(m.v, cx, cy + 6);
  });

  // Footer Confidentiality
  const prepY = H - 40;
  line(d, C.border, 20, prepY, W - 20, 0.5);
  d.setFont('helvetica', 'bold'); d.setFontSize(9);
  rgb(d, C.gold); d.text('STRICTLY CONFIDENTIAL', W/2, prepY + 12, { align: 'center', charSpace: 2 });
  d.setFont('helvetica', 'normal'); d.setFontSize(8);
  rgb(d, C.slateLight); d.text('Prepared exclusively for Executive Leadership and Management Teams.', W/2, prepY + 20, { align: 'center' });
}

// ══════════════════════════════════════════════════════════════════
// PAGE 2 — EXECUTIVE SUMMARY
// ══════════════════════════════════════════════════════════════════
function drawPage2(d: jsPDF, info: DatasetInfo, health: { score: number; label: string }) {
  const W = d.internal.pageSize.getWidth();
  let y = 30;

  const completeness = info.totalNulls > 0
    ? (100 - (info.totalNulls / (info.rows * info.columns.length) * 100)).toFixed(1)
    : '100.0';

  y = secHead(d, '01. Executive Overview', y, C.gold);

  // Situation block
  fill(d, C.bgCard, 12, y, W - 24, 28, 2);
  d.setDrawColor(...C.border); d.roundedRect(12, y, W - 24, 28, 2, 2, 'S');
  fill(d, C.cyan, 12, y, 4, 28);
  
  d.setFont('helvetica', 'bold'); d.setFontSize(8); rgb(d, C.cyan);
  d.text('DATASET PROFILE', 22, y + 8, { charSpace: 1 });
  d.setFont('helvetica', 'normal'); d.setFontSize(9); rgb(d, C.offWhite);
  const sit = `The dataset "${info.filename}" comprises ${fmtN(info.rows)} records across ${info.columns.length} dimensions. Overall data completeness is currently evaluated at ${completeness}%. System health algorithm assigns a status of "${health.label}".`;
  const sitW = d.splitTextToSize(sit, W - 36);
  d.text(sitW, 22, y + 16);
  y += 36;

  // KPI Cards
  y = kpiCards(d, [
    { label: 'Dataset Volume',  val: fmtN(info.rows),        color: C.cyan },
    { label: 'Data Density',    val: `${completeness}%`,     color: info.totalNulls > 0 ? C.orange : C.green },
    { label: 'Null Values',     val: fmtN(info.totalNulls),  sub: pct(info.totalNulls, info.rows * info.columns.length), color: info.totalNulls > 0 ? C.red : C.green },
    { label: 'Duplications',    val: fmtN(info.duplicates),  sub: pct(info.duplicates, info.rows), color: info.duplicates > 0 ? C.red : C.green },
    { label: 'Health Index',    val: `${health.score}/100`,  color: health.score >= 80 ? C.green : health.score >= 60 ? C.orange : C.red },
  ], y + 4) + 12;

  // 02 — COLUMN SUMMARY TABLE
  y = secHead(d, '02. Dimensional Architecture', y, C.cyan);

  const colW = [60, 25, 25, 25, 25, 20];
  y = tableRow(d, ['Dimension Name', 'Data Type', 'Null Count', 'Null %', 'Distinct Vals', 'Health'], y, colW, 12, true);
  
  info.columns.slice(0, 18).forEach((col, i) => {
    const missPct = info.rows > 0 ? ((col.nullCount ?? 0) / info.rows * 100).toFixed(1) + '%' : '0%';
    const colHealth = info.rows > 0 ? Math.round(((info.rows - (col.nullCount ?? 0)) / info.rows) * 100) : 100;
    y = tableRow(d, [
      col.name.length > 25 ? col.name.substring(0,22)+'...' : col.name,
      col.type.toUpperCase(),
      fmtN(col.nullCount ?? 0),
      missPct,
      fmtN(col.uniqueCount ?? 0),
      `${colHealth}%`,
    ], y, colW, 12, false, i % 2 === 1);
    if (y > 260) return;
  });
  
  if (info.columns.length > 18) {
    d.setFontSize(8); rgb(d, C.slateLight); d.setFont('helvetica', 'italic');
    d.text(`... plus ${info.columns.length - 18} additional dimensions omitted for brevity.`, 16, y + 6);
    y += 10;
  }
}

// ══════════════════════════════════════════════════════════════════
// PAGE 3 — ANOMALIES & STRATEGY
// ══════════════════════════════════════════════════════════════════
function drawPage3(
  d: jsPDF,
  info: DatasetInfo,
  health: { score: number; label: string },
  insights: { title: string; description: string; type: string }[]
) {
  const W = d.internal.pageSize.getWidth();
  let y = 30;

  const numCols = info.columns.filter(c => c.type === 'numeric');

  y = secHead(d, '03. Risk Signals & Anomalies', y, C.red);

  const anomalies: { tag: string; text: string; color: [number,number,number] }[] = [];
  if (health.score < 100) {
    anomalies.push({ tag: 'HEALTH STATUS', text: `System health score is ${health.score}/100. "${health.label}". Immediate attention to following anomalies is advised.`, color: health.score >= 80 ? C.green : health.score >= 60 ? C.orange : C.red });
  }

  if (info.duplicates > 0)
    anomalies.push({ tag: 'CRITICAL RISK — DUPLICATES', text: `${fmtN(info.duplicates)} duplicate records detected (${pct(info.duplicates, info.rows)} of dataset). This heavily skews aggregations. Immediate sanitization required.`, color: C.red });
  if (info.totalNulls > 0) {
    const np = ((info.totalNulls / (info.rows * info.columns.length)) * 100).toFixed(1);
    anomalies.push({ tag: 'WARNING — DATA SPARSITY', text: `${fmtN(info.totalNulls)} null elements (${np}%). Model training or financial analysis requires strict imputation protocols.`, color: C.orange });
  }
  numCols.forEach(c => {
    if (c.min !== undefined && c.max !== undefined && c.mean !== undefined && c.max > 0) {
      const ratio = (c.max - c.min) / (c.mean || 1);
      if (ratio > 15)
        anomalies.push({ tag: `OUTLIER DETECTED — ${c.name.toUpperCase()}`, text: `Variance extreme: Range [${fmtN(c.min)} → ${fmtN(c.max)}]. Ratio to mean is ${ratio.toFixed(1)}x. Investigate for data entry errors.`, color: C.cyan });
    }
  });
  if (anomalies.length === 0)
    anomalies.push({ tag: 'SYSTEM VALIDATED', text: 'Zero structural anomalies detected. All parameters fall within acceptable enterprise thresholds.', color: C.green });

  anomalies.slice(0, 4).forEach(item => {
    fill(d, C.bgCard, 12, y, W - 24, 18, 2);
    fill(d, item.color, 12, y, 4, 18);
    d.setFont('helvetica', 'bold'); d.setFontSize(8); d.setTextColor(...item.color);
    d.text(item.tag, 22, y + 7, { charSpace: 0.5 });
    d.setFont('helvetica', 'normal'); d.setFontSize(8); rgb(d, C.offWhite);
    const w = d.splitTextToSize(item.text, W - 38);
    d.text(w[0] ?? '', 22, y + 13);
    y += 22;
  });
  y += 6;

  y = secHead(d, '04. AI Strategic Advisory', y, C.gold);

  fill(d, C.bgCard, 12, y, W - 24, 70, 2);
  fill(d, C.gold, 12, y, W - 24, 3);
  
  const recs = [
    info.duplicates > 0 || info.totalNulls > 0
      ? `PHASE 1: Execute Automated Sanitization. Purge ${fmtN(info.duplicates)} duplicates and impute ${fmtN(info.totalNulls)} missing vectors.`
      : `PHASE 1: Data Integrity Verified. Proceed immediately to advanced segmentation modeling.`,
    numCols.length > 0
      ? `PHASE 2: Establish KPI telemetry on dimension "${numCols[0].name}". Set variance triggers at ±20% of the baseline mean (${fmtN(numCols[0].mean ?? 0)}).`
      : `PHASE 2: Ingest continuous numerical metrics to enable algorithmic forecasting.`,
    `PHASE 3: Distribute this intelligence payload to Department Heads. Enforce 48-hour SLA for anomaly resolution.`,
  ];

  recs.forEach((rec, i) => {
    d.setFont('helvetica', 'bold'); d.setFontSize(10); rgb(d, C.goldLight);
    d.text(`0${i+1}`, 20, y + 16 + i * 18);
    d.setFont('helvetica', 'normal'); d.setFontSize(9); rgb(d, C.offWhite);
    const w = d.splitTextToSize(rec, W - 40);
    d.text(w, 32, y + 16 + i * 18);
  });
  y += 78;

  if (insights.length > 0 && y < 220) {
    y = secHead(d, '05. Automated Pattern Recognition', y, C.cyan);
    const cfg: Record<string, { c: [number,number,number]; lbl: string }> = {
      positive: { c: C.green, lbl: 'POSITIVE VARIANCE' },
      warning:  { c: C.red,   lbl: 'RISK VECTOR'  },
      info:     { c: C.cyan,  lbl: 'NEUTRAL INSIGHT'  },
    };
    insights.slice(0, 3).forEach(ins => {
      if (y > 260) return;
      const t = cfg[ins.type] ?? cfg.info;
      fill(d, C.bgCard, 12, y, W - 24, 20, 2);
      fill(d, t.c, 12, y, 4, 20);
      d.setFont('helvetica', 'bold'); d.setFontSize(7); d.setTextColor(...t.c);
      d.text(t.lbl, 22, y + 7, { charSpace: 0.5 });
      d.setFont('helvetica', 'bold'); d.setFontSize(9); rgb(d, C.offWhite);
      d.text(d.splitTextToSize(ins.title.toUpperCase(), W - 38)[0] ?? '', 22, y + 12);
      d.setFont('helvetica', 'normal'); d.setFontSize(8); rgb(d, C.slateLight);
      d.text(d.splitTextToSize(ins.description, W - 38)[0] ?? '', 22, y + 17);
      y += 24;
    });
  }
}

// ══════════════════════════════════════════════════════════════════
// PAGE 4 — LLM NARRATIVE
// ══════════════════════════════════════════════════════════════════
function drawAIStrategyPage(d: jsPDF, summary: string) {
  const W = d.internal.pageSize.getWidth();
  let y = 30;

  y = secHead(d, '06. Executive LLM Synthesis', y, C.gold);

  fill(d, C.bgCard, 12, y, W - 24, 230, 3);
  
  // Fancy quote mark
  d.setFont('helvetica', 'bold'); d.setFontSize(60); rgb(d, C.border);
  d.text('"', 20, y + 30);

  d.setFont('helvetica', 'normal'); d.setFontSize(10); rgb(d, C.offWhite);
  
  const lines = d.splitTextToSize(summary, W - 40);
  let currentY = y + 20;
  
  lines.forEach((line: string) => {
    if (line.includes('**')) {
      const parts = line.split('**');
      let currentX = 22;
      parts.forEach((part, idx) => {
        d.setFont('helvetica', idx % 2 === 1 ? 'bold' : 'normal');
        d.setTextColor(...(idx % 2 === 1 ? C.goldLight : C.offWhite));
        d.text(part, currentX, currentY);
        currentX += d.getTextWidth(part);
      });
    } else {
      d.setFont('helvetica', 'normal'); rgb(d, C.offWhite);
      d.text(line, 22, currentY);
    }
    currentY += 6.5;
  });
}

// ══════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════
export async function generateExecutiveReport(
  info: DatasetInfo,
  health: { score: number; label: string; color: string },
  options: ReportOptions = {}
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const file = info.filename || 'Dataset';
  const now = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }).toUpperCase();
  const logo = await loadLogo();

  // Page 1
  await drawCover(doc, { ...options, filename: file.toUpperCase(), rows: info.rows, cols: info.columns.length, generatedAt: now });

  // Page 2
  doc.addPage();
  fill(doc, C.bgDark, 0, 0, 210, 297);
  drawPage2(doc, info, health);

  // Page 3
  doc.addPage();
  fill(doc, C.bgDark, 0, 0, 210, 297);
  drawPage3(doc, info, health, options.insights ?? []);

  // Page 4 (Optional AI)
  if (options.aiSummary) {
    doc.addPage();
    fill(doc, C.bgDark, 0, 0, 210, 297);
    drawAIStrategyPage(doc, options.aiSummary);
  }

  // Apply Chrome
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    pageChrome(doc, p, total, file.toUpperCase(), logo);
  }

  doc.save(`KIMIT_EXECUTIVE_${file.replace(/[^a-z0-9_-]/gi, '_').toUpperCase()}.pdf`);
}
