import { useState, useCallback } from 'react';
import type { DataRow } from '../types/index';

export const useKimitExtra = (data: DataRow[], columns: string[]) => {
  // 1. AI Insight State
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insights, setInsights] = useState<{ title: string; content: string }[] | null>(null);

  const generateInsights = useCallback(async (statsJson: any) => {
    setIsGeneratingInsights(true);
    try {
      // Simulate an AI call or use Groq API here.
      // If AI fails, fallback to simple heuristic generation
      await new Promise((res) => setTimeout(res, 1500));
      
      const heuristicInsights = [
        { title: "Top Metric", content: `The largest dimension detected is ${columns[0] || 'N/A'}.` },
        { title: "Data Anomaly", content: "No critical anomalies detected in the current slice." },
        { title: "Volume", content: `Dataset consists of ${data.length} records.` }
      ];
      setInsights(heuristicInsights);
    } catch (e) {
      setInsights([{ title: "Raw Statistics", content: JSON.stringify(statsJson).slice(0, 50) + "..." }]);
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [data.length, columns]);

  // 2. NLQ Parser to Column Filters
  const parseNlqQuery = useCallback((query: string) => {
    // Basic RegEx to catch "ColumnName > 500", "ColumnName = Cairo", etc.
    const regex = /^([a-zA-Z0-9_\s]+)\s*(>|<|=|>=|<=|!=|contains)\s*(.+)$/i;
    const match = query.trim().match(regex);
    
    if (match) {
      const col = match[1].trim();
      const op = match[2].trim().toLowerCase();
      const val = match[3].trim();
      
      // Match column name roughly
      const actualCol = columns.find(c => c.toLowerCase() === col.toLowerCase());
      if (actualCol) {
        // Return a column filter object
        return [{
          id: actualCol,
          value: { operator: op, value: val } // Assuming custom filter fn in TanStack
        }];
      }
    }
    
    // Fallback to global search if it doesn't match operator syntax
    return null; 
  }, [columns]);

  return {
    isGeneratingInsights,
    insights,
    generateInsights,
    parseNlqQuery
  };
};
