import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyScoreChartProps {
  data: { day: string; score: number }[];
}

export function WeeklyScoreLineChart({ data }: WeeklyScoreChartProps) {
  const chartData = {
    labels: data.map(d => d.day),
    datasets: [
      {
        label: 'Sustainability Score',
        data: data.map(d => d.score),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#22C55E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `Score: ${context.parsed.y}/100`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[280px]">
      <Line data={chartData} options={options} />
    </div>
  );
}

interface CategoryBreakdownProps {
  categories: { name: string; value: number; color: string }[];
}

export function CategoryDoughnutChart({ categories }: CategoryBreakdownProps) {
  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.value),
        backgroundColor: categories.map(c => c.color),
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          padding: 15,
          font: {
            size: 11,
            weight: 'normal' as const,
          },
          color: '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toFixed(2)} kg (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[280px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

interface DailyActivityBarChartProps {
  activities: { category: string; impact: number; color: string }[];
}

export function DailyActivityBarChart({ activities }: DailyActivityBarChartProps) {
  const chartData = {
    labels: activities.map(a => a.category),
    datasets: [
      {
        label: 'CO₂e Impact (kg)',
        data: activities.map(a => a.impact),
        backgroundColor: activities.map(a => a.color),
        borderColor: activities.map(a => a.color),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `Impact: ${context.parsed.y.toFixed(2)} kg CO₂e`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return value + ' kg';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}

interface MonthlyComparisonProps {
  months: { month: string; current: number; previous: number }[];
}

export function MonthlyComparisonChart({ months }: MonthlyComparisonProps) {
  const chartData = {
    labels: months.map(m => m.month),
    datasets: [
      {
        label: 'Previous Month',
        data: months.map(m => m.previous),
        backgroundColor: 'rgba(156, 163, 175, 0.6)',
        borderColor: '#9CA3AF',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Current Month',
        data: months.map(m => m.current),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: '#22C55E',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          color: '#374151',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} kg CO₂e`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return value + ' kg';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[320px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
