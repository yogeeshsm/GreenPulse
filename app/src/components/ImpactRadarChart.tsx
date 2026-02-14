import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface ImpactRadarChartProps {
  data: RadarDataPoint[];
  size?: number;
}

const ImpactRadarChart: React.FC<ImpactRadarChartProps> = ({ data, size = 300 }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="eco-tooltip p-3 rounded-lg">
          <p className="text-teal-400 font-semibold mb-1">{label}</p>
          <p className="text-white text-sm">
            Score: <span className="font-bold">{payload[0].value}</span>/100
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
            </linearGradient>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <PolarGrid 
            stroke="rgba(45, 212, 191, 0.2)"
            strokeWidth={1}
          />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: '#94a3b8', 
              fontSize: 12,
              fontWeight: 500
            }}
          />
          
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ 
              fill: 'rgba(148, 163, 184, 0.5)', 
              fontSize: 10 
            }}
            tickCount={5}
            stroke="rgba(45, 212, 191, 0.15)"
          />
          
          <Radar
            name="Impact Score"
            dataKey="A"
            stroke="#2dd4bf"
            strokeWidth={2}
            fill="url(#radarGradient)"
            fillOpacity={1}
            filter="url(#radarGlow)"
          />
          
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactRadarChart;
