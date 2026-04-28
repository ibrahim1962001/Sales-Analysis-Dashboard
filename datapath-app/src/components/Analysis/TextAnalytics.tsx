import React, { useMemo } from 'react';
import type { DataRow } from '../../types/index';
import { ErrorBoundary } from './ErrorBoundary';

interface TextAnalyticsProps {
  data: DataRow[];
  textColumns: string[];
}

const STOP_WORDS = new Set([
  'the', 'is', 'in', 'at', 'of', 'on', 'and', 'a', 'to', 'for', 'with', 'it', 'as', 'by', 'this', 'that', 'an', 'be'
]);

const WordCloud: React.FC<{ words: { text: string; count: number }[] }> = ({ words }) => {
  if (words.length === 0) return <div style={{ color: '#64748b' }}>No words extracted.</div>;
  
  const maxCount = Math.max(...words.map(w => w.count));
  const minCount = Math.min(...words.map(w => w.count));
  
  // Scale font sizes between 10px and 36px
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 16;
    return 10 + ((count - minCount) / (maxCount - minCount)) * 26;
  };
  
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: 'rgba(15,23,42,0.4)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.05)',
      minHeight: '200px'
    }}>
      {words.slice(0, 60).map((w, i) => (
        <span
          key={i}
          style={{
            fontSize: `${getFontSize(w.count)}px`,
            color: `hsl(${(i * 137.5) % 360}, 70%, 70%)`,
            fontWeight: w.count > (maxCount / 2) ? 'bold' : 'normal',
            transition: 'transform 0.2s',
            cursor: 'default'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={`Count: ${w.count}`}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
};

export const TextAnalytics: React.FC<TextAnalyticsProps> = ({ data, textColumns }) => {
  const words = useMemo(() => {
    const counts: Record<string, number> = {};
    
    data.forEach(row => {
      textColumns.forEach(col => {
        const val = row[col];
        if (typeof val === 'string' && val.trim().length > 0) {
          // Tokenize and clean
          const tokens = val.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
          tokens.forEach(token => {
            if (token.length > 3 && !STOP_WORDS.has(token) && isNaN(Number(token))) {
              counts[token] = (counts[token] || 0) + 1;
            }
          });
        }
      });
    });
    
    return Object.entries(counts)
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count);
  }, [data, textColumns]);

  if (textColumns.length === 0) return null;

  return (
    <ErrorBoundary moduleName="Text Analytics">
      <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#f1f5f9' }}>
          Word Cloud (Text Analysis)
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
          Analyzing frequent keywords across {textColumns.length} text column(s): {textColumns.join(', ')}
        </p>
        <WordCloud words={words} />
      </div>
    </ErrorBoundary>
  );
};
