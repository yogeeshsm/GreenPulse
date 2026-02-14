import { useState } from 'react';
import { Droplets, ShoppingBag, Leaf, UtensilsCrossed, Bike, Zap, Thermometer, Recycle, Check, Sparkles } from 'lucide-react';
import type { MicroMove } from '@/types';

interface MicroMovesProps {
  moves: MicroMove[];
  onExecute: (move: MicroMove) => void;
}

const iconMap: Record<string, typeof Leaf> = {
  Droplets, ShoppingBag, Leaf, UtensilsCrossed, Bike, Zap, Thermometer, Recycle
};

export function MicroMoves({ moves, onExecute }: MicroMovesProps) {
  const [completedMoves, setCompletedMoves] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleExecute = (move: MicroMove) => {
    if (completedMoves.has(move.id)) return;
    
    onExecute(move);
    setCompletedMoves(prev => new Set(prev).add(move.id));
    setShowSuccess(move.id);
    
    setTimeout(() => setShowSuccess(null), 1500);
  };

  return (
    <section id="micromoves" className="w-full bg-[#F6F8F6] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Quick Wins
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Micro-Moves
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            One-tap actions that add up to real impact. Earn points for every sustainable choice.
          </p>
        </div>

        {/* Moves Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moves.map((move, index) => {
            const Icon = iconMap[move.icon] || Leaf;
            const isCompleted = completedMoves.has(move.id);
            const isSuccess = showSuccess === move.id;

            return (
              <button
                key={move.id}
                onClick={() => handleExecute(move)}
                disabled={isCompleted}
                className={`relative group p-6 rounded-2xl transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#22C55E]/10 border-2 border-[#22C55E]/30' 
                    : 'bg-white border-2 border-transparent hover:border-[#22C55E]/30 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Success Overlay */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-[#22C55E] rounded-2xl flex items-center justify-center animate-in fade-in zoom-in duration-200">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isCompleted 
                    ? 'bg-[#22C55E]' 
                    : 'bg-[#22C55E]/10 group-hover:bg-[#22C55E]/20'
                }`}>
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className="w-6 h-6 text-[#22C55E]" />
                  )}
                </div>

                {/* Content */}
                <h3 className={`font-semibold text-sm mb-1 ${isCompleted ? 'text-[#22C55E]' : 'text-gray-800'}`}>
                  {move.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{move.description}</p>

                {/* Points */}
                <div className={`inline-flex items-center gap-1 text-xs font-medium ${
                  isCompleted ? 'text-[#22C55E]' : 'text-gray-400'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  +{move.points} pts
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 p-6 bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 rounded-2xl text-center">
          <p className="text-sm text-gray-500 mb-2">Today's Micro-Moves</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-[#22C55E]">{completedMoves.size}</span>
            <span className="text-gray-400">/</span>
            <span className="text-3xl font-bold text-gray-400">{moves.length}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completedMoves.size === 0 
              ? 'Start with one small action!' 
              : completedMoves.size === moves.length 
                ? 'Amazing! You completed all moves today!' 
                : 'Keep going! Every action counts.'}
          </p>
        </div>
      </div>
    </section>
  );
}
