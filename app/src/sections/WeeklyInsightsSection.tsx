import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TrendingDown, Droplets, Train, Thermometer, Leaf } from 'lucide-react';
import type { WeeklyInsight } from '@/types';
import { mockWeeklyTrendDetailed } from '@/data/mockData';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
import { WeeklyScoreLineChart, CategoryDoughnutChart } from '@/components/ChartJsComponents';

interface WeeklyInsightsSectionProps {
  insight: WeeklyInsight;
}

const chartConfig = {
  co2eKg: {
    label: "CO₂e (kg)",
    color: "#22C55E",
  },
  score: {
    label: "Score",
    color: "#3B82F6",
  },
  transport: {
    label: "Transport",
    color: "#22C55E",
  },
  energy: {
    label: "Energy",
    color: "#F59E0B",
  },
  food: {
    label: "Food",
    color: "#10B981",
  },
  water: {
    label: "Water",
    color: "#3B82F6",
  },
  waste: {
    label: "Waste",
    color: "#A855F7",
  },
} satisfies ChartConfig;

export function WeeklyInsightsSection({ insight }: WeeklyInsightsSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const categoryIcons: Record<string, typeof Leaf> = {
    transport: Train,
    energy: Thermometer,
    food: Leaf,
    water: Droplets,
    waste: TrendingDown
  };

  const swapIcons: Record<string, typeof Leaf> = {
    Droplets: Droplets,
    Train: Train,
    Thermometer: Thermometer
  };

  // Format data for chart with day labels
  const chartData = insight.trend.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    co2eKg: day.co2eKg,
    score: day.score,
  }));

  // Format detailed breakdown data
  const detailedChartData = mockWeeklyTrendDetailed.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    transport: day.transport,
    energy: day.energy,
    food: day.food,
    water: day.water,
    waste: day.waste,
  }));

  // Chart.js data for weekly score
  const weeklyScoreData = chartData.map(d => ({ day: d.date, score: d.score }));

  // Chart.js data for category breakdown — derive from actual topDrivers by category name
  const categoryColorMap: Record<string, string> = {
    transport: '#22C55E',
    food: '#F59E0B',
    energy: '#3B82F6',
    water: '#10B981',
    waste: '#A855F7',
    shopping: '#EC4899',
  };

  const categoryData = insight.topDrivers.map(driver => ({
    name: driver.category.charAt(0).toUpperCase() + driver.category.slice(1),
    value: driver.percentage,
    color: categoryColorMap[driver.category] || '#6B7280',
  }));

  return (
    <section
      ref={ref}
      id="insights"
      className="w-full bg-[#F6F8F6] py-16 md:py-24 relative"
      style={{ zIndex: 110 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your 7-day trend
          </h2>
          <p className="text-gray-600">
            See how your choices are adding up over time
          </p>
        </div>

        {/* Trend Chart Card */}
        <div 
          className={`gp-card p-6 md:p-8 mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily CO₂e Emissions</h3>
          
          {/* Recharts Area Chart */}
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCo2e" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="co2eKg" 
                stroke="#22C55E" 
                strokeWidth={3}
                fill="url(#colorCo2e)" 
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Category Breakdown Stacked Area Chart */}
        <div 
          className={`gp-card p-6 md:p-8 mb-8 transition-all duration-700 delay-175 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Impact Breakdown by Category</h3>
          
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={detailedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="transport" 
                stackId="1"
                stroke="#22C55E" 
                fill="#22C55E"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stackId="1"
                stroke="#F59E0B" 
                fill="#F59E0B"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="food" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="water" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="waste" 
                stackId="1"
                stroke="#A855F7" 
                fill="#A855F7"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Score Trend Line Chart */}
        <div 
          className={`gp-card p-6 md:p-8 mb-8 transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Score Trend</h3>
          
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Chart.js Enhanced Score Visualization */}
        <div 
          className={`gp-card p-6 md:p-8 mb-8 transition-all duration-700 delay-225 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-[#22C55E]" />
            Weekly Score Trend
          </h3>
          <WeeklyScoreLineChart data={weeklyScoreData} />
        </div>

        {/* Chart.js Category Breakdown */}
        <div 
          className={`gp-card p-6 md:p-8 mb-8 transition-all duration-700 delay-250 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Distribution
          </h3>
          <CategoryDoughnutChart categories={categoryData} />
        </div>

        {/* Top Drivers */}
        <div 
          className={`gp-card p-6 md:p-8 mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Impact Drivers</h3>
          
          <div className="space-y-4">
            {insight.topDrivers.map((driver, index) => {
              const Icon = categoryIcons[driver.category] || Leaf;
              return (
                <div key={driver.category} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {driver.category}
                      </span>
                      <span className="text-sm text-gray-500">{driver.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#22C55E] rounded-full transition-all duration-1000"
                        style={{ 
                          width: isVisible ? `${driver.percentage}%` : '0%',
                          transitionDelay: `${300 + index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Swaps */}
        <div 
          className={`gp-card p-6 md:p-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Suggested Swaps</h3>
          
          <div className="space-y-4">
            {insight.suggestedSwaps.map((swap, index) => {
              const Icon = swapIcons[swap.icon as keyof typeof swapIcons] || Leaf;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-[#22C55E]/5 rounded-2xl"
                >
                  <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Switch from <span className="font-medium text-gray-800">{swap.from}</span> to{' '}
                      <span className="font-medium text-[#22C55E]">{swap.to}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#22C55E]">
                      -{swap.potentialSaving} {swap.icon === 'Droplets' ? 'L' : 'kg'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
