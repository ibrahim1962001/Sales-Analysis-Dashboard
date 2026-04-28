import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import type { DataRow } from '../../types/index';

interface ExportActionsProps {
  data: DataRow[];
  columns: string[];
  elementIdToCapture?: string; // id of the dashboard to screenshot
}

export const ExportActions: React.FC<ExportActionsProps> = ({ data, columns, elementIdToCapture = 'dashboard-export-area' }) => {
  
  const handleExportPDF = async () => {
    const el = document.getElementById(elementIdToCapture);
    if (!el) {
      alert("Dashboard element not found for export.");
      return;
    }
    
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [canvas.width, canvas.height]
      });
      
      // Watermark / Branding Header
      pdf.setFontSize(24);
      pdf.setTextColor('#10b981'); // Kimit Accent
      pdf.text("Kimit.cloud - Executive Report", 40, 40);
      
      pdf.addImage(imgData, 'PNG', 0, 60, canvas.width, canvas.height);
      pdf.save("Kimit_Dashboard_Report.pdf");
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF.");
    }
  };

  const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Kimit.cloud';
      const sheet = workbook.addWorksheet('Data Export');
      
      // Add Branding / Header Rows
      sheet.addRow(['Kimit.cloud Executive Export']);
      sheet.addRow(['Generated on: ' + new Date().toLocaleString()]);
      sheet.addRow([]); // empty row
      
      // Add Data Headers
      const headerRow = sheet.addRow(columns);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF10B981' } // Accent color
      };
      
      // Add Data
      data.forEach(row => {
        sheet.addRow(columns.map(col => row[col]));
      });
      
      // Generate Blob and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "Kimit_Data_Export.xlsx";
      link.click();
    } catch (error) {
      console.error("Excel Export failed:", error);
      alert("Failed to export Excel.");
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button 
        onClick={handleExportPDF}
        style={{
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        PDF Report
      </button>

      <button 
        onClick={handleExportExcel}
        style={{
          padding: '8px 16px',
          background: 'var(--primary)',
          border: 'none',
          borderRadius: '6px',
          color: '#000',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="17"></line><line x1="16" y1="13" x2="8" y2="17"></line></svg>
        Excel Data
      </button>
    </div>
  );
};
