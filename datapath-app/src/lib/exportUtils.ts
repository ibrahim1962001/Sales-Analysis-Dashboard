import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import type { DataRow, ColumnInfo } from '../types';

// ─────────────────────────────────────────────
//  PDF Export
// ─────────────────────────────────────────────
export const exportBrandedPDF = async (
  elementId: string,
  filename = 'Kimit_Report.pdf',
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) { console.error(`Element #${elementId} not found`); return; }
  try {
    const canvas = await html2canvas(element, {
      scale: 2, useCORS: true, backgroundColor: '#020617', logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pdfWidth, 20, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text('KIMIT CLOUD — EXECUTIVE REPORT', 10, 13);
    pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated on ${new Date().toLocaleString()} | kimit.cloud`, 10, 290);
    pdf.save(filename);
  } catch (err) { console.error('PDF export error:', err); }
};

// ─────────────────────────────────────────────
//  Excel Export (strictly typed)
// ─────────────────────────────────────────────
export const exportToExcel = (data: DataRow[], filename = 'Kimit_Data.xlsx'): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics');
  XLSX.writeFile(workbook, filename);
};

// ─────────────────────────────────────────────
//  Power BI — Optimised CSV Export
//  Adds a header row with proper BOM so Power BI detects UTF-8
// ─────────────────────────────────────────────
export const exportPowerBICSV = (data: DataRow[], filename = 'Kimit_PowerBI.csv'): void => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const escape = (v: string | number | null): string => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [
    headers.join(','),
    ...data.map(row => headers.map(h => escape(row[h])).join(',')),
  ];
  // BOM for Power BI UTF-8 auto-detect
  const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// ─────────────────────────────────────────────
//  Power BI — DAX Measure Generator
//  Generates ready-to-paste DAX for each numeric column
// ─────────────────────────────────────────────
export interface DAXMeasure {
  column: string;
  dax: string;
}

export const generateDAXMeasures = (
  columns: ColumnInfo[],
  tableName = 'KimitData',
): DAXMeasure[] =>
  columns
    .filter(c => c.type === 'numeric')
    .map(c => ({
      column: c.name,
      dax: [
        `// ── ${c.name} ──────────────────────────────────────`,
        `Total_${c.name} = SUM('${tableName}'[${c.name}])`,
        `Avg_${c.name} = AVERAGE('${tableName}'[${c.name}])`,
        `Max_${c.name} = MAX('${tableName}'[${c.name}])`,
        `Min_${c.name} = MIN('${tableName}'[${c.name}])`,
        `// MoM Growth`,
        `MoM_${c.name} =`,
        `  VAR _cur = CALCULATE(SUM('${tableName}'[${c.name}]), DATESMTD('${tableName}'[Date]))`,
        `  VAR _prev = CALCULATE(SUM('${tableName}'[${c.name}]), DATEADD(DATESMTD('${tableName}'[Date]), -1, MONTH))`,
        `  RETURN DIVIDE(_cur - _prev, _prev, 0)`,
      ].join('\n'),
    }));

// ─────────────────────────────────────────────
//  High-Res Chart PNG (ECharts instance based)
//  Called directly with the ECharts instance from DataChart
// ─────────────────────────────────────────────
export const downloadChartPNG = (
  getDataURL: (opts: { type: string; pixelRatio: number; backgroundColor: string }) => string,
  title: string,
): void => {
  const url = getDataURL({ type: 'png', pixelRatio: 3, backgroundColor: '#0a0f1d' });
  const link = document.createElement('a');
  link.download = `${title.replace(/\s+/g, '_')}_hires.png`;
  link.href = url;
  link.click();
};
