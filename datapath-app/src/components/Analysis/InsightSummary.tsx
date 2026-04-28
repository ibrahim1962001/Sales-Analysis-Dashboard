import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import type { Insight } from '../../lib/narrativeEngine';

interface Props {
  insights: Insight[];
  isLoading?: boolean;
}

// ── Typewriter effect ──────────────────────────────────────────
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [text]);
  return <span>{displayed}</span>;
};

// ── DAX copy button ──────────────────────────────────────────
const CopyDAX: React.FC<{ dax: string }> = ({ dax }) => {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(async () => {
    await navigator.clipboard.writeText(dax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [dax]);

  return (
    <button onClick={handle}
      title="Copy DAX to clipboard"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
        background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(212,175,55,0.1)',
        border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(212,175,55,0.25)'}`,
        color: copied ? '#10b981' : '#d4af37', cursor: 'pointer', transition: 'all 0.2s',
      }}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied!' : 'Copy DAX'}
    </button>
  );
};

// ── Icon selector ──────────────────────────────────────────
const InsightIcon: React.FC<{ type: Insight['type'] }> = ({ type }) => {
  if (type === 'positive') return <TrendingUp size={14} color="#10b981" />;
  if (type === 'warning')  return <AlertTriangle size={14} color="#f59e0b" />;
  return <Info size={14} color="#38bdf8" />;
};

const BORDER_COLOR: Record<Insight['type'], string> = {
  positive: '#10b981',
  warning:  '#f59e0b',
  info:     '#38bdf8',
};
const BG_COLOR: Record<Insight['type'], string> = {
  positive: 'rgba(16,185,129,0.05)',
  warning:  'rgba(245,158,11,0.05)',
  info:     'rgba(56,189,248,0.05)',
};

// ── Skeleton loader ──────────────────────────────────────────
const Skeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[100, 80, 90].map((w, i) => (
      <div key={i} style={{
        height: 56, borderRadius: 10, width: `${w}%`,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }} />
    ))}
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </div>
);

// ── Main Component ────────────────────────────────────────────
export const InsightSummary: React.FC<Props> = ({ insights, isLoading = false }) => {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)', borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(10px)', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>🧠</span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
          AI Business Insights
        </h3>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#475569', fontStyle: 'italic' }}>
          Auto-generated
        </span>
      </div>

      {isLoading ? <Skeleton /> : (
        <AnimatePresence>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                style={{
                  padding: '11px 14px', borderRadius: 10,
                  background: BG_COLOR[ins.type],
                  borderLeft: `3px solid ${BORDER_COLOR[ins.type]}`,
                  border: `1px solid rgba(255,255,255,0.04)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <InsightIcon type={ins.type} />
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#e2e8f0' }}>{ins.title}</span>
                  {ins.daxSnippet && (
                    <span style={{ marginLeft: 'auto' }}>
                      <CopyDAX dax={ins.daxSnippet} />
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.55 }}>
                  <TypewriterText text={ins.description} />
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};
