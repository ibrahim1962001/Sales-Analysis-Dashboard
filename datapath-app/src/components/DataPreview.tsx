import React from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import type { DataRow, Lang } from '../types';

interface Props {
  data: DataRow[];
  lang: Lang;
}

export const DataPreview: React.FC<Props> = ({ data, lang }) => {
  const previewData = data.slice(0, 5);
  const columnKeys = previewData.length > 0 ? Object.keys(previewData[0]) : [];

  if (columnKeys.length === 0) return null;

  const columns = columnKeys.map(key => ({
    key,
    name: key,
    resizable: true,
  }));

  return (
    <div className="data-preview-container mt-6 w-full" style={{ boxSizing: 'border-box' }}>
      {/* Header section outside the card to prevent overlap and clipping */}
      <div 
        className="flex justify-between items-center w-full box-border"
        style={{ 
          direction: lang === 'ar' ? 'rtl' : 'ltr',
          marginBottom: '20px',
          fontFamily: lang === 'ar' ? "'Cairo', 'Tajawal', sans-serif" : "inherit"
        }}
      >
        <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#10b981', textAlign: lang === 'ar' ? 'right' : 'left' }}>
          {lang === 'ar' ? 'معاينة سريعة (أول 5 صفوف)' : 'Quick Preview (First 5 rows)'}
        </h4>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
          {data.length} {lang === 'ar' ? 'سجل إجمالي' : 'total records'}
        </span>
      </div>
      
      {/* DataGrid inside its own card container */}
      <div className="card-base overflow-hidden border border-white/10 shadow-lg w-full box-border" style={{ borderRadius: '15px' }}>
        <div className="rdg-dark" style={{ height: '240px', width: '100%', boxSizing: 'border-box', fontFamily: lang === 'ar' ? "'Cairo', 'Tajawal', sans-serif" : "inherit" }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
           <style>
               {`
                 .rdg-dark .rdg {
                    background-color: transparent !important;
                    color: rgba(255, 255, 255, 0.85) !important;
                    border: none !important;
                    font-size: 14px !important;
                    height: 100%;
                 }
                 .rdg-dark .rdg-header-row {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    color: rgba(255, 255, 255, 0.95) !important;
                    font-weight: bold;
                 }
                 .rdg-dark .rdg-row {
                    background-color: transparent !important;
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                 }
                 .rdg-dark .rdg-row:hover {
                    background-color: rgba(255,255,255,0.08) !important;
                 }
                 .rdg-dark .rdg-cell {
                    border-right: 1px solid rgba(255,255,255,0.05) !important;
                    padding: 0 12px !important;
                    display: flex;
                    align-items: center;
                 }
                 .rdg-dark[dir="rtl"] .rdg-cell {
                    text-align: right;
                 }
                 .rdg-dark[dir="ltr"] .rdg-cell {
                    text-align: left;
                 }
               `}
           </style>
        <DataGrid
          columns={columns}
          rows={previewData}
          direction={lang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
      </div>
    </div>
  );
};
