import React, { useState, useCallback, useEffect } from 'react';
import { useCsvParser } from '../../hooks/useCsvParser';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useKimitExtra } from '../../hooks/useKimitExtra';
import { DataGrid } from './DataGrid';
import { AnalysisChart } from './Charts';
import { ErrorBoundary } from './ErrorBoundary';
import { InsightSummary } from './InsightSummary';
import { SmartFilter } from './SmartFilter';
import { ExportActions } from './ExportActions';
import { validateDataset, runSystemHealthCheck } from '../../lib/validation';
import type { DataRow } from '../../types/index';

export const AnalysisModule: React.FC = () => {
  const { parseFile, isParsing, error: parseError } = useCsvParser();
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [healthStatus, setHealthStatus] = useState<string>('UNKNOWN');

  // Compute stats and anomalies independent of rendering
  const { metadata, anomalies, healthScore } = useAnalytics(data, columns);

  // New Kimit Extra Features
  const { isGeneratingInsights, insights, generateInsights, parseNlqQuery } = useKimitExtra(data, columns);
  const [nlqFilter, setNlqFilter] = useState<Array<{ id: string, value: { operator: string, value: string } }> | null>(null); // Passed down to Grid if supported, or handled here

  // Simple client-side filtering based on NLQ (if DataGrid supports external data modification)
  // For safety, we'll apply it directly to the data passed to DataGrid
  const filteredData = React.useMemo(() => {
    if (!nlqFilter || nlqFilter.length === 0) return data;
    const { id, value: { operator, value } } = nlqFilter[0];
    return data.filter(row => {
      const rowVal = Number(row[id]) || String(row[id]).toLowerCase();
      const numVal = Number(value);
      const strVal = String(value).toLowerCase();
      
      switch (operator) {
        case '>': return typeof rowVal === 'number' && rowVal > numVal;
        case '<': return typeof rowVal === 'number' && rowVal < numVal;
        case '>=': return typeof rowVal === 'number' && rowVal >= numVal;
        case '<=': return typeof rowVal === 'number' && rowVal <= numVal;
        case '=': return rowVal === (isNaN(numVal) ? strVal : numVal);
        case '!=': return rowVal !== (isNaN(numVal) ? strVal : numVal);
        case 'contains': return String(rowVal).includes(strVal);
        default: return true;
      }
    });
  }, [data, nlqFilter]);

  // Run System Health Check on mount
  useEffect(() => {
    runSystemHealthCheck().then(res => setHealthStatus(res.status));
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await parseFile(file);
      validateDataset(result);

      setData(result.data);
      setColumns(result.columns);
      setNlqFilter(null);
      
      // Auto-generate AI insights when data loads
      generateInsights({ rows: result.data.length, cols: result.columns.length });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed: ${msg}`);
    }
  }, [parseFile, generateInsights]);

  const handleSmartSearch = (query: string) => {
    const filter = parseNlqQuery(query);
    if (filter) {
      setNlqFilter(filter);
    } else {
      alert("Could not parse query. Try 'ColumnName > 100' or 'ColumnName contains text'");
      setNlqFilter(null);
    }
  };

  return (
    <div className="analysis-module" id="dashboard-export-area" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100vh', background: 'var(--bg-color)', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2>Strict Modular Analysis Engine</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SmartFilter onSearch={handleSmartSearch} />
          
          <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: healthStatus === 'HEALTHY' ? '#10b981' : '#ef4444' }}>
            System: {healthStatus}
          </span>
          <input type="file" accept=".csv" onChange={handleFileUpload} disabled={isParsing} />
          {isParsing && <span style={{ color: '#3b82f6' }}>Parsing in Background...</span>}
          
          {data.length > 0 && (
            <ExportActions data={filteredData} columns={columns} elementIdToCapture="dashboard-export-area" />
          )}
        </div>
      </header>

      {parseError && (
        <div style={{ color: '#ef4444', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
          Parser Error: {parseError}
        </div>
      )}

      {data.length === 0 && !isParsing && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <p style={{ marginTop: '16px', fontSize: '18px' }}>Upload a CSV file to begin analysis</p>
        </div>
      )}

      {isParsing && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.05)', height: '100px', borderRadius: '8px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1 }}>
             <div style={{ animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
             <div style={{ animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
          </div>
        </div>
      )}

      {data.length > 0 && !isParsing && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1, overflow: 'hidden' }}>
          
          {/* Module B: Virtualized Grid wrapped in Error Boundary */}
          <ErrorBoundary moduleName="Data Grid">
            <DataGrid data={filteredData} columns={columns} />
          </ErrorBoundary>

          {/* Sidebar logic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            
            {/* AI Insight Summary Module */}
            <ErrorBoundary moduleName="AI Storyteller">
              <InsightSummary insights={insights} isLoading={isGeneratingInsights} />
            </ErrorBoundary>

            {/* Logic Results */}
            <ErrorBoundary moduleName="Health Score">
              <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h3>Data Health Score</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: healthScore?.score && healthScore.score > 80 ? '#10b981' : '#f59e0b' }}>
                  {healthScore?.score}%
                </div>
                <div style={{ marginTop: '10px' }}>
                  {healthScore?.issues.map((issue, idx) => <p key={idx} style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0' }}>- {issue}</p>)}
                </div>
                {anomalies && anomalies.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#f59e0b' }}>
                    <p>Detected {anomalies.length} outliers.</p>
                  </div>
                )}
              </div>
            </ErrorBoundary>

            {/* Module D: Charts wrapped in Error Boundary */}
            <ErrorBoundary moduleName="Visualizations">
              <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.03))', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', height: '300px' }}>
                <AnalysisChart 
                  data={filteredData} 
                  config={{ type: 'bar', xAxisKey: columns[0] || 'Unknown', yAxisKey: columns.find(c => metadata.find(m => m.name === c)?.type === 'numeric') || columns[1] || 'Unknown', title: 'Distribution Overview' }} 
                />
              </div>
            </ErrorBoundary>

          </div>
        </div>
      )}
    </div>
  );
};
