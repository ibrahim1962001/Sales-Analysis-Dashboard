import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Copy, Check, Download, Zap } from 'lucide-react';
import { useKimitData } from '../../hooks/useKimitData';
import { exportPowerBICSV, generateDAXMeasures } from '../../lib/exportUtils';

// ── Copy-to-clipboard button ──────────────────────────────────
const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button onClick={handle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11,
        padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 600,
        background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(212,175,55,0.1)',
        border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(212,175,55,0.25)'}`,
        color: copied ? '#10b981' : '#d4af37', transition: 'all 0.2s',
      }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

// ── Main Component ────────────────────────────────────────────
export const PowerBIPanel: React.FC = () => {
  const { info } = useKimitData();
  const [open, setOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState<string>('');

  if (!info) return null;

  const measures = generateDAXMeasures(info.columns);
  const activeMeasure = measures.find(m => m.column === selectedCol) ?? measures[0];

  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)', borderRadius: 14,
      border: '1px solid rgba(212,175,55,0.15)',
      backdropFilter: 'blur(10px)', overflow: 'hidden',
    }}>
      {/* Header / Toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
          color: '#d4af37',
        }}
      >
        <BarChart2 size={16} color="#d4af37" />
        <span style={{ fontSize: 13, fontWeight: 700 }}>Power BI Bridge</span>
        <Zap size={12} color="#d4af37" style={{ marginLeft: 2 }} />
        <span style={{ marginLeft: 'auto', fontSize: 18, color: '#64748b' }}>{open ? '−' : '+'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 18px' }}>
              {/* Export CSV */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>
                  Export with UTF-8 BOM — ready for Power BI Desktop's "Get Data → CSV" flow.
                </p>
                <button
                  onClick={() => exportPowerBICSV(info.workData, `${info.filename}_PowerBI.csv`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: 8, color: '#d4af37', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Download size={13} /> Export Power BI CSV
                </button>
              </div>

              {/* DAX Measures */}
              {measures.length > 0 && (
                <>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>
                    Auto-generated DAX measures — paste directly into Power BI Desktop.
                  </p>

                  {/* Column selector */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {measures.map(m => (
                      <button
                        key={m.column}
                        onClick={() => setSelectedCol(m.column)}
                        style={{
                          padding: '4px 10px', fontSize: 10, borderRadius: 20, cursor: 'pointer',
                          fontWeight: 600, transition: 'all 0.15s',
                          background: (selectedCol === m.column || (!selectedCol && m === measures[0]))
                            ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${(selectedCol === m.column || (!selectedCol && m === measures[0]))
                            ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.07)'}`,
                          color: (selectedCol === m.column || (!selectedCol && m === measures[0]))
                            ? '#d4af37' : '#64748b',
                        }}
                      >
                        {m.column}
                      </button>
                    ))}
                  </div>

                  {/* DAX code block */}
                  <div style={{ position: 'relative' }}>
                    <pre style={{
                      margin: 0, padding: '12px 14px', borderRadius: 8,
                      background: '#020617', border: '1px solid rgba(255,255,255,0.06)',
                      fontSize: 10.5, color: '#94a3b8', overflowX: 'auto',
                      fontFamily: '"Fira Code", "Cascadia Code", monospace',
                      lineHeight: 1.7, maxHeight: 180,
                    }}>
                      {activeMeasure?.dax}
                    </pre>
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <CopyButton text={activeMeasure?.dax ?? ''} label="Copy DAX" />
                    </div>
                  </div>
                </>
              )}

              {measures.length === 0 && (
                <p style={{ fontSize: 12, color: '#475569' }}>No numeric columns detected for DAX generation.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
