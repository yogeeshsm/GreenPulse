import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ScoreBreakdown } from '@/types';

interface TransparencyPanelProps {
  scoreBreakdown: ScoreBreakdown;
  totalScore: number;
  dataConfidence: 'High' | 'Medium' | 'Estimated';
}

interface ScoreItem {
  label: string;
  score: number;
  max: number;
  weight: number;
  description: string;
  icon: React.ReactNode;
}

const TransparencyPanel: React.FC<TransparencyPanelProps> = ({
  scoreBreakdown,
  totalScore,
  dataConfidence
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scoreItems: ScoreItem[] = [
    {
      label: 'Carbon',
      score: scoreBreakdown.carbon,
      max: 30,
      weight: 30,
      description: 'Based on ingredient carbon intensity and manufacturing emissions',
      icon: <div className="w-2 h-2 rounded-full bg-teal-400" />
    },
    {
      label: 'Water',
      score: scoreBreakdown.water,
      max: 15,
      weight: 15,
      description: 'Water footprint from ingredient cultivation and processing',
      icon: <div className="w-2 h-2 rounded-full bg-blue-400" />
    },
    {
      label: 'Energy',
      score: scoreBreakdown.energy,
      max: 10,
      weight: 10,
      description: 'Energy consumption in production and transportation',
      icon: <div className="w-2 h-2 rounded-full bg-yellow-400" />
    },
    {
      label: 'Ingredients',
      score: scoreBreakdown.ingredientSustainability || 0,
      max: 15,
      weight: 15,
      description: 'Sustainability of sourcing and cultivation practices',
      icon: <div className="w-2 h-2 rounded-full bg-green-400" />
    },
    {
      label: 'Health',
      score: scoreBreakdown.health,
      max: 10,
      weight: 10,
      description: 'Nutritional quality and health impact assessment',
      icon: <div className="w-2 h-2 rounded-full bg-purple-400" />
    },
    {
      label: 'Packaging',
      score: scoreBreakdown.packaging,
      max: 10,
      weight: 10,
      description: 'Recyclability and environmental impact of packaging',
      icon: <div className="w-2 h-2 rounded-full bg-orange-400" />
    },
    {
      label: 'ESG',
      score: scoreBreakdown.esg,
      max: 10,
      weight: 10,
      description: 'Manufacturer transparency and sustainability commitments',
      icon: <div className="w-2 h-2 rounded-full bg-cyan-400" />
    }
  ];

  const getConfidenceIcon = () => {
    switch (dataConfidence) {
      case 'High':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Medium':
        return <Info className="w-4 h-4 text-yellow-400" />;
      case 'Estimated':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    }
  };

  const getConfidenceColor = () => {
    switch (dataConfidence) {
      case 'High':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Estimated':
        return 'text-orange-400';
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">View Score Breakdown</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Total: <span className="text-teal-400 font-bold">{totalScore}/100</span>
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-white/10 animate-fade-in-up">
          {/* Data Confidence */}
          <div className="flex items-center gap-2 py-3 border-b border-white/10">
            {getConfidenceIcon()}
            <span className="text-sm text-muted-foreground">Data Confidence Level:</span>
            <span className={`text-sm font-semibold ${getConfidenceColor()}`}>
              {dataConfidence}
            </span>
          </div>

          {/* Score Breakdown List */}
          <div className="mt-4 space-y-3">
            {scoreItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {item.score}/{item.max}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.weight}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(item.score / item.max) * 100}%`,
                      background: `linear-gradient(90deg, ${item.score / item.max > 0.6 ? '#22c55e' :
                          item.score / item.max > 0.4 ? '#eab308' : '#ef4444'
                        }, ${item.score / item.max > 0.6 ? '#2dd4bf' :
                          item.score / item.max > 0.4 ? '#f59e0b' : '#f97316'
                        })`
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Formula Note */}
          <div className="mt-4 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
            <p className="text-xs text-teal-400/80">
              <span className="font-semibold">Scoring Formula:</span> Each category is normalized
              to 0-100 and weighted according to environmental impact significance.
              Carbon (30%), Water (15%), Energy (10%), Ingredients (15%), Health (10%),
              Packaging (10%), ESG (10%).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransparencyPanel;
