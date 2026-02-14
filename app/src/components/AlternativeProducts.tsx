import React from 'react';
import { ArrowRight, Leaf, Package, Heart, TrendingDown } from 'lucide-react';
import type { AlternativeProduct } from '@/types';
import { getScoreColor } from '@/data/sampleData';

interface AlternativeProductsProps {
  alternatives: AlternativeProduct[];
  currentScore: number;
}

const AlternativeProducts: React.FC<AlternativeProductsProps> = ({
  alternatives,
  currentScore
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Smarter Alternatives</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Based on your product&apos;s score of <span className="text-yellow-400 font-semibold">{currentScore}/100</span>, 
        consider these more sustainable options:
      </p>

      <div className="grid gap-4">
        {alternatives.map((alt, index) => (
          <div
            key={alt.id}
            className="eco-card glass-panel rounded-xl p-4 cursor-pointer animate-slide-in-right"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              {/* Product Image Placeholder */}
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-8 h-8 text-teal-400" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-white truncate">{alt.name}</h4>
                    <p className="text-sm text-muted-foreground">{alt.brand}</p>
                  </div>
                  <div 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: `${getScoreColor(alt.sustainableScore)}20`,
                      color: getScoreColor(alt.sustainableScore)
                    }}
                  >
                    {alt.sustainableScore}
                  </div>
                </div>

                {/* Improvements */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs">
                    <TrendingDown className="w-3 h-3" />
                    {alt.carbonReduction}% less carbon
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs">
                    <Package className="w-3 h-3" />
                    {alt.packagingImprovement}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs">
                    <Heart className="w-3 h-3" />
                    {alt.healthImprovement}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 self-center" />
            </div>
          </div>
        ))}
      </div>

      {/* Impact Summary */}
      <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-5 h-5 text-green-400" />
          <span className="font-semibold text-green-400">Potential Impact</span>
        </div>
        <p className="text-sm text-slate-300">
          Switching to <span className="text-white font-semibold">{alternatives[0].name}</span> could 
          reduce your carbon footprint by <span className="text-green-400 font-bold">{alternatives[0].carbonReduction}%</span> 
          and improve overall sustainability score to <span className="text-green-400 font-bold">{alternatives[0].sustainableScore}/100</span>.
        </p>
      </div>
    </div>
  );
};

export default AlternativeProducts;
