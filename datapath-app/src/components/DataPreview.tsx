import React from 'react';
import type { DataRow, Lang } from '../types';

interface Props {
  data: DataRow[];
  lang: Lang;
}

export const DataPreview: React.FC<Props> = ({ data, lang }) => {
  const previewData = data.slice(0, 5);
  const columns = previewData.length > 0 ? Object.keys(previewData[0]) : [];

  if (columns.length === 0) return null;

  return (
    <div className="data-preview-container glass mt-6 overflow-hidden rounded-xl border border-white/20">
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h4 className="text-sm font-semibold text-white/90">
          {lang === 'ar' ? 'معاينة سريعة (أول 5 صفوف)' : 'Quick Preview (First 5 rows)'}
        </h4>
        <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
          {data.length} {lang === 'ar' ? 'سجل إجمالي' : 'total records'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-white/70">
          <thead className="bg-white/5 text-white/90 uppercase tracking-wider">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-2 font-medium border-b border-white/10 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {previewData.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 whitespace-nowrap max-w-[200px] truncate">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
