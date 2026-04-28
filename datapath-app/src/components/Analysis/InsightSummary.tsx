import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Insight {
  title: string;
  content: string;
}

interface InsightSummaryProps {
  insights: Insight[] | null;
  isLoading: boolean;
}

// Typewriter effect component
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

export const InsightSummary: React.FC<InsightSummaryProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Executive Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.1)', height: '24px', borderRadius: '4px', width: i % 2 === 0 ? '80%' : '100%' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) return null;

  return (
    <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Executive Summary (AI Insights)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}
          >
            <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}>{insight.title}</h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              <TypewriterText text={insight.content} />
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
