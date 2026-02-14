import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Leaf, TrendingUp, Award, Target, Zap, Droplets, Recycle, Wind, Calendar, Share2, Download, Info, ChevronRight, QrCode } from 'lucide-react';
import type { DaySession, ActivityLog } from '@/types';
import { generateSmartSuggestions } from '@/lib/suggestionsEngine';
import { generateShareCard } from '@/lib/ledgerEngine';
import { generateHTMLReport } from '@/lib/qrEngine';
import { useState } from 'react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { MonthlyComparisonChart } from '@/components/ChartJsComponents';

interface DailySummaryProps {
  daySession: DaySession;
  activities: ActivityLog[];
  onClose?: () => void;
  onOpenQR?: () => void;
}

const categoryColors: Record<string, string> = {
  transport: '#22C55E',
  energy: '#F59E0B',
  water: '#3B82F6',
  food: '#10B981',
  waste: '#A855F7',
  shopping: '#EC4899',
  micro_action: '#6366F1'
};

const chartConfig = {
  impact: {
    label: "Impact (kg CO₂e)",
  },
  transport: {
    label: "Transport",
    color: categoryColors.transport,
  },
  energy: {
    label: "Energy",
    color: categoryColors.energy,
  },
  water: {
    label: "Water",
    color: categoryColors.water,
  },
  food: {
    label: "Food",
    color: categoryColors.food,
  },
  waste: {
    label: "Waste",
    color: categoryColors.waste,
  },
  shopping: {
    label: "Shopping",
    color: categoryColors.shopping,
  },
  micro_action: {
    label: "Micro Action",
    color: categoryColors.micro_action,
  },
} satisfies ChartConfig;

export function DailySummary({ daySession, activities, onClose, onOpenQR }: DailySummaryProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const { totals, streakDays, goals, dailyScore } = daySession;
  const [showConfidence, setShowConfidence] = useState(false);

  const completedGoals = goals.filter(g => g.completed).length;
  
  // Calculate top categories
  const categoryImpact: Record<string, number> = {};
  activities.forEach(activity => {
    const category = activity.activityType;
    const impact = activity.calculatedImpact.co2eKg || 0;
    categoryImpact[category] = (categoryImpact[category] || 0) + impact;
  });

  const topCategories = Object.entries(categoryImpact)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Prepare data for donut chart
  const pieData = Object.entries(categoryImpact)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category,
      value: Number(value.toFixed(2)),
      fill: categoryColors[category] || '#6B7280'
    }));

  const categoryIcons: Record<string, any> = {
    transport: Wind,
    energy: Zap,
    water: Droplets,
    food: Leaf,
    waste: Recycle
  };

  // Generate smart suggestions using engine
  const smartSuggestions = generateSmartSuggestions(activities, totals);

  // Chart.js data for monthly comparison
  const monthlyComparisonData = [
    { month: 'Week 1', current: totals.co2eKg * 0.9, previous: totals.co2eKg * 1.2 },
    { month: 'Week 2', current: totals.co2eKg * 0.85, previous: totals.co2eKg * 1.15 },
    { month: 'Week 3', current: totals.co2eKg * 0.8, previous: totals.co2eKg * 1.1 },
    { month: 'Week 4', current: totals.co2eKg, previous: totals.co2eKg * 1.05 },
  ];

  // Calculate average confidence from activities
 const avgConfidence =
    activities.length > 0
      ? activities.reduce((sum, a) => sum + (a.calculatedImpact.confidence || 0), 0) /
        activities.length
      : 0;
  const confidencePercentage = Math.round(avgConfidence * 100);

  const handleShare = () => {
    const shareData = generateShareCard({
      periodType: 'day',
      startDate: daySession.date,
      endDate: daySession.date,
      totalCo2eKg: totals.co2eKg,
      totalAvoidedCo2eKg: totals.avoidedCo2eKg,
      totalKwh: totals.kwh,
      totalWaterLiters: totals.waterLiters,
      totalWasteDiverted: totals.wasteDiverted,
      totalGreenPoints: totals.greenPoints,
      averageDailyScore: dailyScore,
      daysTracked: 1,
      topCategories: [],
      dailyTrend: []
    });

    const shareText = `${shareData.headline}\n\n${shareData.stats.join('\n')}\n\n#GreenPulse`;

    if (navigator.share) {
      navigator.share({
        title: 'My Daily Sustainability Impact',
        text: shareText,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Report copied to clipboard!');
      }).catch(() => {
        // Final fallback: prompt
        prompt('Copy this report:', shareText);
      });
    }
  };

  const handleExport = () => {
    // Generate full HTML report with embedded QR code placeholder
    const html = generateHTMLReport(daySession, activities, '');
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greenpulse-${daySession.date}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section ref={ref} className="w-full bg-gradient-to-br from-[#22C55E]/10 via-white to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div 
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#22C55E] rounded-full mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily Summary</h2>
          <p className="text-gray-600">Here's how you did today!</p>
        </div>

        {/* Main Score Card */}
        <div 
          className={`gp-card p-8 mb-6 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="text-center mb-6">
            <div className="inline-block relative">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="8"
                  strokeDasharray={`${dailyScore * 2.827} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{dailyScore}</span>
                <span className="text-sm text-gray-500">Score</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.avoidedCo2eKg.toFixed(1)}</p>
              <p className="text-xs text-gray-500">kg CO₂e saved</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.kwh.toFixed(1)}</p>
              <p className="text-xs text-gray-500">kWh used</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.waterLiters}</p>
              <p className="text-xs text-gray-500">L water</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Recycle className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totals.wasteDiverted}</p>
              <p className="text-xs text-gray-500">items diverted</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#22C55E]/10 to-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Green Points Earned</p>
                  <p className="text-2xl font-bold text-gray-900">{totals.greenPoints}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{streakDays}-day streak</span>
              </div>
            </div>

            {/* Confidence Badge */}
            <button
              onClick={() => setShowConfidence(!showConfidence)}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Data Confidence: {confidencePercentage}%
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 text-blue-600 transition-transform ${showConfidence ? 'rotate-90' : ''}`} />
            </button>

            {showConfidence && (
              <div className="p-4 bg-white border-2 border-blue-100 rounded-xl space-y-2">
                <p className="text-xs text-gray-600 mb-2">Activity Breakdown:</p>
                {activities.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-500 capitalize">{activity.activityType}:</span>
                    <span className="flex-1 text-gray-700">{activity.calculatedImpact.explanation}</span>
                    <span className="text-blue-600 font-medium">
                      {Math.round((activity.calculatedImpact.confidence || 0) * 100)}%
                    </span>
                  </div>
                ))}
                {activities.length > 5 && (
                  <p className="text-xs text-gray-400 pt-2">+ {activities.length - 5} more activities</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Impact Breakdown Donut Chart */}
        {pieData.length > 0 && (
          <div 
            className={`gp-card p-6 mb-6 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-4">Impact by Category</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-sm capitalize text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Goals Progress */}
        <div 
          className={`gp-card p-6 mb-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-[#22C55E]" />
            <h3 className="font-semibold text-gray-900">Today's Goals</h3>
            <span className="ml-auto text-sm text-[#22C55E] font-medium">
              {completedGoals}/{goals.length} completed
            </span>
          </div>
          <div className="space-y-2">
            {goals.map((goal) => (
              <div 
                key={goal.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  goal.completed ? 'bg-[#22C55E]/10' : 'bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  goal.completed 
                    ? 'bg-[#22C55E] border-[#22C55E]' 
                    : 'border-gray-300'
                }`}>
                  {goal.completed && <Leaf className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {goal.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div 
            className={`gp-card p-6 mb-6 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-4">Biggest Impact Areas</h3>
            <div className="space-y-3">
              {topCategories.map(([category, impact]) => {
                const Icon = categoryIcons[category] || Leaf;
                const percentage = (impact / totals.co2eKg) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-sm capitalize text-gray-700">{category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {impact.toFixed(2)} kg CO₂e
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22C55E] rounded-full transition-all duration-1000"
                        style={{ width: isVisible ? `${percentage}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart.js Monthly Progress Comparison */}
        <div 
          className={`gp-card p-6 mb-6 transition-all duration-700 delay-350 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#22C55E]" />
            Monthly Progress
          </h3>
          <MonthlyComparisonChart months={monthlyComparisonData} />
        </div>

        {/* Smart Suggestions */}
        {smartSuggestions.length > 0 && (
          <div 
            className={`gp-card p-6 mb-6 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Smart Suggestions for Tomorrow</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">AI-powered</span>
            </div>
            <div className="space-y-3">
              {smartSuggestions.map((suggestion) => (
                <div 
                  key={suggestion.id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-[#22C55E] font-medium">
                          ↓ {suggestion.potentialSaving.toFixed(2)} kg CO₂e
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          suggestion.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-700' 
                            : suggestion.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {suggestion.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div 
          className={`flex gap-3 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <button
            onClick={handleShare}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-[#22C55E] text-[#22C55E] font-medium hover:bg-[#22C55E]/10 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={handleExport}
            className="flex-1 py-3 px-4 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          {onOpenQR && (
            <button
              onClick={onOpenQR}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              QR Code
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Close Summary
          </button>
        )}
      </div>
    </section>
  );
}
