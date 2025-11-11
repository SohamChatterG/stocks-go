import React from 'react';

interface PriceChartProps {
  data: number[];
  height?: number; // px
  color?: string;
  showGradient?: boolean;
  className?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, height = 120, color = '#3b82f6', showGradient = true, className }) => {
  if (!data || data.length < 2) {
    return <div className={className || ''} style={{ height }} />;
  }

  const paddingX = 8;
  const paddingY = 8;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = data.length - 1 === 0 ? 1 : (data.length - 1) * 10 + paddingX * 2; // flexible width based on points

  const points = data.map((v, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = paddingY + (1 - (v - min) / range) * (height - paddingY * 2);
    return [x, y] as const;
  });

  const path = points.map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`)).join(' ');

  const areaPath = `${path} L ${points[points.length - 1][0]},${height - paddingY} L ${points[0][0]},${height - paddingY} Z`;

  const gradientId = `grad-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className} style={{ display: 'block', width: '100%', height }}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color} floodOpacity="0.15" />
        </filter>
      </defs>

      {showGradient && (
        <path d={areaPath} fill={`url(#${gradientId})`} />
      )}

      {/* Line */}
      <path d={path} stroke={color} strokeWidth={2} fill="none" filter="url(#shadow)" />

      {/* Last point */}
      {points.length > 0 && (
        <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={2.5} fill={color} />
      )}
    </svg>
  );
};

export default PriceChart;
