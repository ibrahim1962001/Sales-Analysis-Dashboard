/* eslint-disable */
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, PlayCircle } from 'lucide-react';
import type { Lang } from '../types';
import { GoogleSheetsPicker } from './GoogleSheetsPicker';

interface Props {
  lang: Lang;
  onFile: (file: File) => void;
}

const T = {
  ar: {
    title: 'اسحب ملف البيانات هنا',
    sub: 'أو اضغط لاختيار ملف من جهازك',
    hint: 'يدعم CSV و Excel (XLSX, XLS)',
    badge: 'يعمل بالكامل في المتصفح · بياناتك لا تغادر جهازك',
    sampleBtn: 'جرب ملف عينة',
    or: '— أو —',
  },
  en: {
    title: 'Drag your data file here',
    sub: 'or click to choose a file from your device',
    hint: 'Supports CSV & Excel (XLSX, XLS)',
    badge: 'Fully browser-based · Your data never leaves your device',
    sampleBtn: 'Try Sample File',
    or: '— OR —',
  },
};

const SAMPLE_CSV = `Name,Age,Country,Sales,Date
Ahmed,28,Egypt,1200,2023-01-15
John,34,USA,2500,2023-01-20
Maria,25,Spain,1800,2023-02-05
Li,29,China,3100,2023-02-10
Sarah,31,UK,1400,2023-02-15
Omar,22,Jordan,900,2023-03-01
Elena,27,Italy,2100,2023-03-05`;

export const DropZone: React.FC<Props> = ({ lang, onFile }) => {
  const t = T[lang];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onFile(acceptedFiles[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    const file = new File([SAMPLE_CSV], 'sample_data.csv', { type: 'text/csv' });
    onFile(file);
  };

  return (
    <div className="dropzone-outer">
      {/* ─── File Drop Area ─── */}
      <div
        {...getRootProps()}
        onClick={open}
        className={`dropzone ${isDragActive ? 'dragging border-primary bg-primary/10' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="dropzone-icon">
          {isDragActive ? (
            <FileSpreadsheet size={52} className="animate-bounce" />
          ) : (
            <UploadCloud size={52} strokeWidth={1.5} />
          )}
        </div>
        <h3 className="dropzone-title">
          {isDragActive ? (lang === 'ar' ? 'أفلت الملف الآن! 🎯' : 'Drop it now! 🎯') : t.title}
        </h3>
        <p className="dropzone-sub">{t.sub}</p>
        <div className="dropzone-formats">
          {['CSV', 'XLSX', 'XLS'].map((f) => (
            <span key={f} className="format-tag">
              {f}
            </span>
          ))}
        </div>
        <div className="dropzone-badge">{t.badge}</div>
      </div>

      {/* ─── Divider ─── */}
      <div className="dz-divider">
        <span>{t.or}</span>
      </div>

      {/* ─── Google Sheets Picker ─── */}
      <GoogleSheetsPicker onFile={onFile} lang={lang} />

      {/* ─── Sample Button ─── */}
      <button onClick={handleSample} className="sample-data-btn">
        <PlayCircle size={20} className="sample-icon" />
        {t.sampleBtn}
      </button>

      <style>{`
        .dropzone-outer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 680px;
        }

        .dz-divider {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 12px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .dz-divider::before,
        .dz-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .sample-data-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 99px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .sample-data-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.22);
          color: #fff;
          transform: translateY(-2px);
        }
        .sample-icon {
          color: var(--primary);
          transition: transform 0.3s ease;
        }
        .sample-data-btn:hover .sample-icon {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
};
