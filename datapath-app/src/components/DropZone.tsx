import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, PlayCircle } from 'lucide-react';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  onFile: (file: File) => void;
}

const T = {
  ar: { 
    title: 'اسحب ملف البيانات هنا', 
    sub: 'أو اضغط لاختيار ملف', 
    hint: 'يدعم CSV و Excel (XLSX, XLS)', 
    badge: 'يعمل بالكامل في المتصفح · بدون رفع بيانات',
    sampleBtn: 'جرب ملف عينة',
    previewTitle: 'معاينة الملف المختار:'
  },
  en: { 
    title: 'Drag your data file here', 
    sub: 'or click to choose a file', 
    hint: 'Supports CSV & Excel (XLSX, XLS)', 
    badge: 'Fully browser-based · No data is uploaded',
    sampleBtn: 'Try Sample File',
    previewTitle: 'Selected file preview:'
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFile(acceptedFiles[0]);
    }
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    const file = new File([SAMPLE_CSV], 'sample_data.csv', { type: 'text/csv' });
    onFile(file);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-4">
      <div
        {...getRootProps()}
        className={`dropzone w-full transition-all duration-300 ${isDragActive ? 'dragging border-primary bg-primary/10' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon">
          {isDragActive ? <FileSpreadsheet size={52} className="animate-bounce" /> : <UploadCloud size={52} strokeWidth={1.5} />}
        </div>
        <h3 className="dropzone-title">
          {isDragActive ? (lang === 'ar' ? 'أفلت الملف الآن' : 'Drop it now!') : t.title}
        </h3>
        <p className="dropzone-sub">{t.sub}</p>
        <div className="dropzone-formats">
          {['CSV', 'XLSX', 'XLS'].map(f => <span key={f} className="format-tag">{f}</span>)}
        </div>
        <div className="dropzone-badge">{t.badge}</div>
      </div>

      <button 
        onClick={handleSample}
        className="sample-data-btn mt-2 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white/90 font-medium group"
      >
        <PlayCircle size={20} className="group-hover:scale-110 transition-transform text-primary" />
        {t.sampleBtn}
      </button>
    </div>
  );
};

