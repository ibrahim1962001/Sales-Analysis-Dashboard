import type { DatasetInfo, ColumnInfo } from '../types';

export interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
  /** Optional DAX snippet for the BI Bridge copy feature */
  daxSnippet?: string;
}

// ── Helpers ──────────────────────────────────────────────────
function fmt(n: number | undefined): string {
  if (n === undefined) return '—';
  return n >= 1_000_000
    ? (n / 1_000_000).toFixed(2) + 'M'
    : n >= 1_000
    ? (n / 1_000).toFixed(1) + 'K'
    : n.toFixed(2);
}

function topNumericCols(info: DatasetInfo, limit = 3): ColumnInfo[] {
  return info.columns.filter(c => c.type === 'numeric').slice(0, limit);
}

// ── Main Generator ────────────────────────────────────────────
export const generateAInarrative = (info: DatasetInfo): Insight[] => {
  const insights: Insight[] = [];
  const numericCols = topNumericCols(info);

  // 1. Data Quality
  if (info.totalNulls > 0) {
    const pct = ((info.totalNulls / (info.rows * info.columns.length)) * 100).toFixed(1);
    insights.push({
      title: 'Data Gaps Detected',
      description: `${info.totalNulls} missing values found (${pct}% of cells). Use "Magic Clean" to auto-fill and restore statistical accuracy.`,
      type: 'warning',
    });
  } else {
    insights.push({
      title: '✓ Clean Dataset',
      description: 'Zero missing values detected. Your dataset is primed for high-accuracy modelling and BI integration.',
      type: 'positive',
    });
  }

  // 2. Trend / Statistical — most interesting numeric col
  if (numericCols.length > 0) {
    const col = numericCols[0];
    const spread = (col.max !== undefined && col.min !== undefined)
      ? ` Range spans from ${fmt(col.min)} to ${fmt(col.max)}.` : '';
    insights.push({
      title: `Trend: ${col.name}`,
      description: `Average ${col.name} = ${fmt(col.mean)}.${spread} Stable distribution detected — suitable for forecasting.`,
      type: 'info',
      daxSnippet: `Avg_${col.name} = AVERAGE('KimitData'[${col.name}])`,
    });
  }

  // 3. Duplicates / Efficiency
  if (info.duplicates > 0) {
    const saving = ((info.duplicates / info.rows) * 100).toFixed(1);
    insights.push({
      title: 'Redundancy Alert',
      description: `${info.duplicates} duplicate rows detected. Removing them reduces dataset size by ${saving}% and eliminates bias in aggregations.`,
      type: 'warning',
    });
  } else if (numericCols.length >= 2) {
    // 3b. Correlation hint
    const [a, b] = numericCols;
    insights.push({
      title: `Correlation Opportunity`,
      description: `Run the Correlation Heatmap on "${a.name}" × "${b.name}" to uncover hidden business relationships that inform pricing or demand models.`,
      type: 'info',
      daxSnippet: `Correlation_${a.name}_${b.name} =\n  DIVIDE(\n    SUMX(KimitData, (KimitData[${a.name}] - [Avg_${a.name}]) * (KimitData[${b.name}] - [Avg_${b.name}])),\n    SQRT(SUMX(KimitData, (KimitData[${a.name}] - [Avg_${a.name}])^2) * SUMX(KimitData, (KimitData[${b.name}] - [Avg_${b.name}])^2))\n  )`,
    });
  }

  return insights;
};
