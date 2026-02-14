import React from 'react';
import { Sparkles, AlertTriangle, Droplets, TreePine, Package, Heart } from 'lucide-react';

interface Highlight {
  type: 'positive' | 'warning' | 'negative';
  icon: string;
  text: string;
}

interface AISummaryProps {
  summary: string;
  highlights?: Highlight[];
  funFact?: string;
}

const AISummary: React.FC<AISummaryProps> = ({ summary, highlights = [], funFact = '' }) => {

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'carbon':
        return <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
          <span className="text-orange-400 text-xs font-bold">CO₂</span>
        </div>;
      case 'water':
        return <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Droplets className="w-4 h-4 text-blue-400" />
        </div>;
      case 'deforestation':
        return <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <TreePine className="w-4 h-4 text-red-400" />
        </div>;
      case 'packaging':
        return <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Package className="w-4 h-4 text-green-400" />
        </div>;
      case 'health':
        return <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Heart className="w-4 h-4 text-purple-400" />
        </div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
        </div>;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'negative':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-slate-500/30 bg-slate-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <div className="w-2 h-2 rounded-full bg-green-400" />;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-yellow-400" />;
      case 'negative':
        return <div className="w-2 h-2 rounded-full bg-red-400" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Product Analysis</h3>
      </div>

      {/* Main Summary Card */}
      <div className="glass-panel rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
        <p className="text-slate-300 leading-relaxed relative z-10">
          {summary}
        </p>
      </div>

      {/* Key Highlights - from AI */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${getTypeStyles(highlight.type)} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {getIcon(highlight.icon)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">{highlight.text}</p>
              </div>
              {getTypeIcon(highlight.type)}
            </div>
          ))}
        </div>
      )}

      {/* AI-generated Fun Fact */}
      {funFact && (
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Did you know?</span>
          </div>
          <p className="text-sm text-slate-300">{funFact}</p>
        </div>
      )}
    </div>
  );
};

export default AISummary;
