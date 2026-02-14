import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarDataPoint {
  name: string;
  value: number;
  color: string;
}

interface ImpactBarChartProps {
  data: BarDataPoint[];
  height?: number;
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ data, height = 250 }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="eco-tooltip p-3 rounded-lg">
          <p className="text-teal-400 font-semibold mb-1">{label}</p>
          <p className="text-white text-sm">
            Impact: <span className="font-bold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <defs>
            {data.map((entry, index) => (
              <linearGradient 
                key={`gradient-${index}`}
                id={`barGradient-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(45, 212, 191, 0.1)"
            horizontal={false}
          />
          
          <XAxis 
            type="number"
            domain={[0, 40]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(45, 212, 191, 0.2)' }}
            tickLine={{ stroke: 'rgba(45, 212, 191, 0.2)' }}
          />
          
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: 'rgba(45, 212, 191, 0.2)' }}
            tickLine={{ stroke: 'rgba(45, 212, 191, 0.2)' }}
            width={100}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45, 212, 191, 0.05)' }} />
          
          <Bar 
            dataKey="value" 
            radius={[0, 6, 6, 0]}
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#barGradient-${index})`}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactBarChart;
