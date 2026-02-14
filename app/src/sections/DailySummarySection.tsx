import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, Share2, Leaf, Zap, Droplets, Recycle } from 'lucide-react';
import type { DaySession } from '@/types';

interface DailySummarySectionProps {
  daySession: DaySession;
  onViewLedger?: () => void;
  onShareSummary?: () => void;
}

export function DailySummarySection({ daySession, onViewLedger, onShareSummary }: DailySummarySectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { totals } = daySession;

  const metrics = [
    { value: `${totals.co2eKg.toFixed(1)} kg`, label: 'CO₂e', icon: Leaf },
    { value: `${totals.kwh.toFixed(1)} kWh`, label: 'Electricity', icon: Zap },
    { value: `${totals.waterLiters} L`, label: 'Water', icon: Droplets },
    { value: `${totals.wasteDiverted} items`, label: 'Diverted', icon: Recycle },
  ];

  return (
    <section
      ref={ref}
      id="summary"
      className="gp-section-pinned sky-gradient-night flex items-center justify-center relative"
      style={{ zIndex: 100 }}
    >
      {/* Day Path Ribbon */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg 
          className="absolute w-full h-full"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbonGradient-summary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <path
            d="M -10 60 Q 50 40, 110 55"
            fill="none"
            stroke="url(#ribbonGradient-summary)"
            strokeWidth="12"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Summary Card */}
      <div 
        className={`gp-card w-[min(88vw,1200px)] relative z-10 p-8 md:p-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-98 translate-y-[18vh]'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Image */}
          <div 
            className={`w-full lg:w-[42%] transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[12vw]'
            }`}
          >
            <div className="relative rounded-[22px] overflow-hidden shadow-xl animate-float bg-gradient-to-br from-blue-100 to-indigo-200">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
                alt="Family sustainable evening routine"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Right Content */}
          <div 
            className={`flex-1 w-full transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[12vw]'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Day closed.<br />
              <span className="text-[#22C55E]">Impact logged.</span>
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Here's what today looked like—and where you can improve tomorrow.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {metrics.map((metric, index) => (
                <div 
                  key={metric.label}
                  className={`gp-metric-chip flex flex-col items-start p-4 transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-96'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <metric.icon className="w-5 h-5 text-[#22C55E] mb-2" />
                  <span className="gp-metric-value text-lg">{metric.value}</span>
                  <span className="gp-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={onViewLedger}
                className="gp-button-primary flex items-center gap-2"
              >
                View full ledger
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onShareSummary}
                className="gp-button-secondary flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
