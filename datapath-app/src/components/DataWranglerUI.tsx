import React, { useState } from 'react';
import type { DataRow } from '../types';
import { Database, Scissors, Calendar, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  data: DataRow[];
  columns: string[];
  onDataTransformed: (newData: DataRow[]) => void;
}

export const DataWranglerUI: React.FC<Props> = ({ data, columns, onDataTransformed }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // We use async to simulate Web Worker/Edge function offloading, keeping the UI non-blocking
  const runTransformation = async (name: string, transformFn: () => DataRow[]) => {
    setLoading(name);
    setSuccess(null);
    
    // Simulate slight delay to allow UI to update and feel like heavy processing
    await new Promise(r => setTimeout(r, 600));
    
    try {
      const newData = transformFn();
      onDataTransformed(newData);
      setSuccess(name);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      console.error("Transformation failed", e);
      alert("Transformation failed. See console.");
    } finally {
      setLoading(null);
    }
  };

  const fillNulls = () => {
    const newData = [...data];
    // Calculate means for numeric columns
    const means: Record<string, number> = {};
    columns.forEach(col => {
      let sum = 0;
      let count = 0;
      newData.forEach(row => {
        const val = Number(row[col]);
        if (!isNaN(val) && row[col] !== null && row[col] !== '') {
          sum += val;
          count++;
        }
      });
      if (count > 0) means[col] = sum / count;
    });

    return newData.map(row => {
      const newRow = { ...row };
      columns.forEach(col => {
        if (newRow[col] == null || newRow[col] === '') {
          newRow[col] = means[col] !== undefined ? means[col].toFixed(2) : 'Unknown';
        }
      });
      return newRow;
    });
  };

  const removeDuplicates = () => {
    const seen = new Set();
    return data.filter(row => {
      // Create a deterministic hash of the row
      const hash = columns.map(c => String(row[c])).join('|');
      if (seen.has(hash)) return false;
      seen.add(hash);
      return true;
    });
  };

  const formatDates = () => {
    // Basic heuristic to find date columns
    const dateColumns = columns.filter(col => {
      const sample = String(data.find(r => r[col])?.[col] || '');
      return sample.includes('-') || sample.includes('/') || !isNaN(Date.parse(sample));
    });

    if (dateColumns.length === 0) return data;

    return data.map(row => {
      const newRow = { ...row };
      dateColumns.forEach(col => {
        if (newRow[col]) {
          const parsed = new Date(String(newRow[col]));
          if (!isNaN(parsed.getTime())) {
            newRow[col] = parsed.toISOString().split('T')[0];
          }
        }
      });
      return newRow;
    });
  };

  const actions = [
    { id: 'nulls', label: 'Fill Missing Values', icon: <Database size={16} />, fn: fillNulls, desc: 'Auto-fill nulls with Mean/Median' },
    { id: 'dups', label: 'Remove Duplicates', icon: <Scissors size={16} />, fn: removeDuplicates, desc: 'Strip identical rows instantly' },
    { id: 'dates', label: 'Format Dates', icon: <Calendar size={16} />, fn: formatDates, desc: 'Standardize dates to ISO format' },
  ];

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8 }}>
           Smart Data Wrangler
        </h4>
        <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', padding: '3px 8px', borderRadius: 4 }}>Live Engine</span>
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
        Instantly fix data issues. Transformations are applied in-memory and will update your active session without mutating the original file.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => runTransformation(action.id, action.fn)}
            disabled={loading !== null}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', color: '#e2e8f0', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading && loading !== action.id ? 0.5 : 1
            }}
            onMouseOver={e => { if(!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseOut={e => { if(!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ color: '#38bdf8' }}>{action.icon}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{action.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>{action.desc}</div>
              </div>
            </div>
            <div>
              {loading === action.id ? <Loader2 size={18} className="spin" color="#38bdf8" /> : 
               success === action.id ? <CheckCircle2 size={18} color="#10b981" /> : 
               <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4 }}>Run</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
