import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Train, Droplets, Salad, Laptop, Recycle, RefreshCw, Sun, Moon, Leaf, Zap, Info, ChevronDown } from 'lucide-react';
import type { ActivityLog } from '@/types';
import { useState } from 'react';

interface TimelineProps {
  activities: ActivityLog[];
}

const activityIcons: Record<string, typeof Leaf> = {
  transport: Train,
  water: Droplets,
  food: Salad,
  energy: Laptop,
  waste: Recycle,
  micro_action: RefreshCw
};

const categoryColors: Record<string, string> = {
  transport: 'bg-emerald-500',
  water: 'bg-blue-500',
  food: 'bg-orange-500',
  energy: 'bg-amber-500',
  waste: 'bg-purple-500',
  micro_action: 'bg-pink-500'
};

const categoryLabels: Record<string, string> = {
  transport: 'Transport',
  water: 'Water',
  food: 'Food',
  energy: 'Energy',
  waste: 'Waste',
  micro_action: 'Micro-Move'
};

export function Timeline({ activities }: TimelineProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Sort activities by timestamp
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Group by time of day
  const morningActivities = sortedActivities.filter(a => {
    const hour = new Date(a.timestamp).getHours();
    return hour >= 5 && hour < 12;
  });
  
  const afternoonActivities = sortedActivities.filter(a => {
    const hour = new Date(a.timestamp).getHours();
    return hour >= 12 && hour < 17;
  });
  
  const eveningActivities = sortedActivities.filter(a => {
    const hour = new Date(a.timestamp).getHours();
    return hour >= 17 || hour < 5;
  });

  const TimeSection = ({ 
    title, 
    icon: Icon, 
    activities: sectionActivities,
    delay 
  }: { 
    title: string; 
    icon: typeof Sun; 
    activities: ActivityLog[];
    delay: number;
  }) => (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {sectionActivities.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No activities logged yet</p>
      ) : (
        <div className="space-y-3">
          {sectionActivities.map((activity, index) => {
            const Icon = activityIcons[activity.activityType] || Leaf;
            const colorClass = categoryColors[activity.activityType] || 'bg-gray-500';
            const label = categoryLabels[activity.activityType] || activity.activityType;
            const isExpanded = expandedActivity === activity.id;
            const confidence = activity.calculatedImpact.confidence || 0;
            const co2e = activity.calculatedImpact.co2eKg || 0;
            const avoided = activity.calculatedImpact.avoidedCo2eKg || 0;
            
            return (
              <div 
                key={activity.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 capitalize">{activity.subtype}</span>
                      <span className="text-xs text-gray-400">• {label}</span>
                      {avoided > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          -{avoided.toFixed(2)} kg saved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.calculatedImpact.explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {activity.quantity} {activity.unit}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-3 pt-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Leaf className="w-3.5 h-3.5 text-gray-500" />
                          <p className="text-xs text-gray-500">CO₂e</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">
                          {co2e.toFixed(3)} kg
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Zap className="w-3.5 h-3.5 text-green-600" />
                          <p className="text-xs text-green-600">Avoided</p>
                        </div>
                        <p className="text-base font-bold text-green-700">
                          {avoided.toFixed(3)} kg
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Info className="w-3.5 h-3.5 text-blue-600" />
                          <p className="text-xs text-blue-600">Confidence</p>
                        </div>
                        <p className="text-base font-bold text-blue-700">
                          {Math.round(confidence * 100)}%
                        </p>
                      </div>
                    </div>

                    {activity.metadata.notes && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{activity.metadata.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-md">
                        Source: {activity.metadata.source}
                      </span>
                      {activity.calculatedImpact.kwh && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                          {activity.calculatedImpact.kwh.toFixed(2)} kWh
                        </span>
                      )}
                      {activity.calculatedImpact.waterLiters && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                          {activity.calculatedImpact.waterLiters} L water
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section ref={ref} id="timeline" className="w-full bg-[#F6F8F6] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Your Day
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Alarm to Sleep
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            A complete timeline of your sustainable choices today
          </p>
        </div>

        {/* Timeline Sections */}
        <div className="space-y-8">
          <TimeSection 
            title="Morning" 
            icon={Sun} 
            activities={morningActivities}
            delay={100}
          />
          
          <TimeSection 
            title="Afternoon" 
            icon={Sun} 
            activities={afternoonActivities}
            delay={200}
          />
          
          <TimeSection 
            title="Evening" 
            icon={Moon} 
            activities={eveningActivities}
            delay={300}
          />
        </div>

        {/* Summary Footer */}
        <div 
          className={`mt-12 p-6 bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 rounded-2xl transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Activities</p>
              <p className="text-3xl font-bold text-gray-800">{activities.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Green Points</p>
              <p className="text-3xl font-bold text-[#22C55E]">+{activities.length * 15}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
