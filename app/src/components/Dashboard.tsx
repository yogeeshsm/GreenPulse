import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Leaf, Zap, Droplets, Recycle, TrendingUp, Calendar, Plus, Train, Salad, Wind, Droplets as WaterIcon } from 'lucide-react';
import { showToast } from '@/components/Toast';
import type { DaySession, ActivityLog } from '@/types';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { DailyActivityBarChart } from '@/components/ChartJsComponents';

interface DashboardProps {
  daySession: DaySession;
  activities: ActivityLog[];
  onQuickLog: (category: string) => void;
  onToggleGoal?: (goalId: string) => void;
  onAddGoal?: (goalText: string) => void;
}

const chartConfig = {
  value: {
    label: "Impact",
    color: "#22C55E",
  },
} satisfies ChartConfig;

export function Dashboard({ daySession, activities, onQuickLog, onToggleGoal, onAddGoal }: DashboardProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const { totals, streakDays, goals } = daySession;

  const handleAddGoal = () => {
    const goalText = prompt('Enter your sustainability goal:');
    if (goalText && goalText.trim() && onAddGoal) {
      onAddGoal(goalText.trim());
      showToast('Goal added! Keep pushing toward sustainability! 🎯', 'success');
    }
  };

  const stats = [
    { label: 'CO₂e', value: `${totals.co2eKg.toFixed(1)} kg`, icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Energy', value: `${totals.kwh.toFixed(1)} kWh`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Water', value: `${totals.waterLiters} L`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Waste', value: `${totals.wasteDiverted} items`, icon: Recycle, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  // Data for bar chart showing resource usage
  const resourceData = [
    { name: 'CO₂e', value: totals.co2eKg, unit: 'kg', fill: '#22C55E' },
    { name: 'Energy', value: totals.kwh, unit: 'kWh', fill: '#F59E0B' },
    { name: 'Water', value: totals.waterLiters / 10, unit: 'L (÷10)', fill: '#3B82F6' },
    { name: 'Waste', value: totals.wasteDiverted, unit: 'items', fill: '#A855F7' },
  ];

  const quickActions = [
    { label: 'Transport', icon: Train, category: 'transport', color: 'bg-emerald-500' },
    { label: 'Meal', icon: Salad, category: 'food', color: 'bg-orange-500' },
    { label: 'Energy', icon: Wind, category: 'energy', color: 'bg-amber-500' },
    { label: 'Water', icon: WaterIcon, category: 'water', color: 'bg-blue-500' },
  ];

  const completedGoals = goals.filter(g => g.completed).length;

  // Calculate real activity impact breakdown from actual logged activities
  const categoryImpacts = activities.reduce<Record<string, number>>((acc, activity) => {
    const cat = activity.activityType;
    const impact = activity.calculatedImpact.co2eKg || 0;
    acc[cat] = (acc[cat] || 0) + impact;
    return acc;
  }, {});

  const dailyActivities = [
    { category: 'Transport', impact: parseFloat((categoryImpacts['transport'] || 0).toFixed(3)), color: 'rgba(34, 197, 94, 0.8)' },
    { category: 'Food', impact: parseFloat((categoryImpacts['food'] || 0).toFixed(3)), color: 'rgba(245, 158, 11, 0.8)' },
    { category: 'Energy', impact: parseFloat((categoryImpacts['energy'] || 0).toFixed(3)), color: 'rgba(59, 130, 246, 0.8)' },
    { category: 'Water', impact: parseFloat((categoryImpacts['water'] || 0).toFixed(3)), color: 'rgba(99, 102, 241, 0.8)' },
    { category: 'Waste', impact: parseFloat((categoryImpacts['waste'] || 0).toFixed(3)), color: 'rgba(168, 85, 247, 0.8)' },
  ].filter(d => d.impact > 0);

  return (
    <section ref={ref} id="dashboard" className="w-full bg-[#F6F8F6] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Welcome Header */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Good morning</p>
              <h1 className="text-2xl font-bold text-gray-900">Your Daily Impact</h1>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div 
          className={`gp-card p-6 mb-6 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Sustainability Score</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-[#22C55E]">{daySession.dailyScore}</span>
                <span className="text-gray-400">/100</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {totals.avoidedCo2eKg > 0 
                      ? `${totals.avoidedCo2eKg.toFixed(1)} kg CO₂e avoided today` 
                      : 'Start logging to track impact'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{streakDays}-day streak</span>
                </div>
              </div>
            </div>
            
            {/* Radial Chart */}
            <div className="w-40 h-40">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  barSize={12}
                  data={[{ name: 'Score', value: daySession.dailyScore, fill: '#22C55E' }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar 
                    background 
                    dataKey="value" 
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ChartContainer>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#22C55E] to-[#86EFAC] rounded-full transition-all duration-1000"
              style={{ width: isVisible ? `${daySession.dailyScore}%` : '0%' }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="gp-card p-4 text-center"
              style={{ transitionDelay: `${300 + index * 50}ms` }}
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Resource Usage Bar Chart */}
        <div 
          className={`gp-card p-6 mb-6 transition-all duration-700 delay-250 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-4">Today's Resource Usage</h3>
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={resourceData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Chart.js Enhanced Visualization */}
        <div 
          className={`gp-card p-6 mb-6 transition-all duration-700 delay-350 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            Activity Impact Breakdown
          </h3>
          <DailyActivityBarChart activities={dailyActivities} />
        </div>

        {/* Quick Log Buttons */}
        <div 
          className={`gp-card p-6 mb-6 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Log</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.category}
                onClick={() => onQuickLog(action.category)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Goals */}
        <div 
          className={`gp-card p-6 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Today's Goals</h3>
            <span className="text-xs text-[#22C55E] font-medium">
              {completedGoals}/{goals.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => {
                  onToggleGoal?.(goal.id);
                  if (!goal.completed) {
                    showToast('Goal completed! Great job! 🎯', 'success');
                  }
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] ${
                  goal.completed ? 'bg-[#22C55E]/10' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  goal.completed 
                    ? 'bg-[#22C55E] border-[#22C55E]' 
                    : 'border-gray-300'
                }`}>
                  {goal.completed && <Leaf className="w-3 h-3 text-white" />}
                </div>
                <span className={`flex-1 text-sm text-left ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {goal.text}
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleAddGoal}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-[#22C55E]/30 hover:text-[#22C55E] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add a goal</span>
          </button>
        </div>
      </div>
    </section>
  );
}
