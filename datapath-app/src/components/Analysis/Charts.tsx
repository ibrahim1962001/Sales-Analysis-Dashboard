import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ErrorBoundary } from './ErrorBoundary';
import type { DataRow, ChartConfig } from '../../types/index';

interface AnalysisChartProps {
  data: DataRow[];
  config: ChartConfig;
  onFilter?: (column: string, value: string) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ChartRenderer: React.FC<AnalysisChartProps> = ({ data, config, onFilter }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const chartData = useMemo(() => {
    if (config.type === 'pie' || config.type === 'bar') {
      const agg: Record<string, number> = {};
      data.forEach(row => {
        const xVal = String(row[config.xAxisKey] || 'Unknown');
        const yVal = Number(row[config.yAxisKey]) || 0;
        agg[xVal] = (agg[xVal] || 0) + yVal;
      });
      return Object.entries(agg).map(([name, value]) => ({ name, value })).slice(0, isMobile ? 15 : 50);
    }
    return data.slice(0, isMobile ? 50 : 100);
  }, [data, config, isMobile]);

  if (!chartData || chartData.length === 0) {
    throw new Error("Insufficient data to render chart");
  }

  const handleChartClick = (state: any) => {
    if (!onFilter) return;
    if (state && state.activeLabel) {
      onFilter(config.xAxisKey, state.activeLabel);
    }
  };

  const handlePieClick = (data: any) => {
    if (!onFilter || !data) return;
    onFilter(config.xAxisKey, data.name);
  };

  const commonXProps = {
    stroke: "#94a3b8",
    fontSize: isMobile ? 10 : 12,
    tickMargin: 8,
    minTickGap: isMobile ? 30 : 15
  };

  const commonYProps = {
    stroke: "#94a3b8",
    fontSize: isMobile ? 10 : 12,
    tickMargin: 5
  };

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={chartData} onClick={handleChartClick} style={{cursor: onFilter ? 'pointer' : 'default'}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" {...commonXProps} />
            <YAxis {...commonYProps} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}} 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: isMobile ? '10px' : '12px' }} />
            <Bar dataKey="value" name={config.yAxisKey} fill={config.color || COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData} onClick={handleChartClick} style={{cursor: onFilter ? 'pointer' : 'default'}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey={config.xAxisKey} {...commonXProps} />
            <YAxis {...commonYProps} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: isMobile ? '10px' : '12px' }} />
            <Line type="monotone" dataKey={config.yAxisKey} stroke={config.color || COLORS[1]} strokeWidth={2} dot={!isMobile} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Legend 
              layout={isMobile ? "horizontal" : "vertical"} 
              verticalAlign={isMobile ? "bottom" : "middle"} 
              align={isMobile ? "center" : "right"} 
              wrapperStyle={isMobile ? { paddingTop: 20 } : { paddingLeft: 20 }} 
              iconType="circle"
            />
            <Pie
              data={chartData}
              cx={isMobile ? "50%" : "40%"}
              cy="50%"
              outerRadius={isMobile ? "60%" : "80%"}
              innerRadius={isMobile ? "30%" : "40%"}
              paddingAngle={4}
              dataKey="value"
              onClick={handlePieClick}
              style={{cursor: onFilter ? 'pointer' : 'default'}}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart onClick={handleChartClick} style={{cursor: onFilter ? 'pointer' : 'default'}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={config.xAxisKey} name={config.xAxisKey} {...commonXProps} />
            <YAxis dataKey={config.yAxisKey} name={config.yAxisKey} {...commonYProps} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Scatter name="Data" data={chartData} fill={config.color || COLORS[3]} />
          </ScatterChart>
        );
      default:
        return <div style={{ color: '#94a3b8' }}>Unsupported chart type</div>;
    }
  };

  const chartHeight = isMobile ? 250 : 350;
  const chartAspect = isMobile ? 1.2 : 2;

  return (
    <div style={{ width: '100%', minHeight: chartHeight }}>
      {config.title && <h3 style={{ textAlign: 'left', fontSize: isMobile ? '12px' : '14px', color: '#e2e8f0', marginBottom: '20px', fontWeight: 600 }}>{config.title}</h3>}
      <div style={{ width: '100%', height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%" aspect={chartAspect}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const AnalysisChart: React.FC<AnalysisChartProps> = (props) => {
  return (
    <ErrorBoundary moduleName="Chart Module">
      <ChartRenderer {...props} />
    </ErrorBoundary>
  );
};
