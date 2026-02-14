import { useEffect, useRef, useState } from 'react';
import { Leaf, ArrowRight, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="gp-section-pinned sky-gradient-morning flex items-center justify-center relative z-10"
    >
      {/* Day Path Ribbon */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18vh]'
        }`}
      >
        <svg 
          className="absolute w-full h-full"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <path
            d="M -10 80 Q 25 70, 50 50 Q 75 30, 110 40"
            fill="none"
            stroke="url(#ribbonGradient)"
            strokeWidth="12"
            opacity="0.6"
            style={{ filter: 'drop-shadow(0 18px 40px rgba(34,197,94,0.18))' }}
          />
        </svg>
      </div>

      {/* Hero Card */}
      <div 
        className={`gp-card w-[min(84vw,1100px)] relative z-10 p-8 md:p-12 transition-all duration-1000 delay-300 ${
          isLoaded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-96 translate-y-6'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-left">
            {/* Micro Label */}
            <div 
              className={`gp-pill inline-flex items-center gap-2 mb-6 text-xs text-gray-500 transition-all duration-700 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-[#22C55E]" />
              Personal sustainability ledger
            </div>

            {/* Headline */}
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-700 delay-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Your day.<br />
              <span className="text-[#22C55E]">Your impact.</span>
            </h1>

            {/* Subheadline */}
            <p 
              className={`text-base md:text-lg text-gray-600 mb-8 max-w-md leading-relaxed transition-all duration-700 delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Track small choices—from your morning commute to bedtime—and see how they add up.
            </p>

            {/* CTAs */}
            <div 
              className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-800 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <button 
                onClick={onGetStarted}
                className="gp-button-primary flex items-center gap-2"
              >
                Start your day
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onGetStarted}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium underline underline-offset-4"
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div 
            className={`flex-1 w-full max-w-md lg:max-w-none transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[10vw]'
            }`}
          >
            <div className="relative rounded-[22px] overflow-hidden shadow-xl animate-float bg-gradient-to-br from-green-100 to-emerald-200">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" 
                alt="Eco-friendly morning yoga routine"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>
        </div>

        {/* Decorative Leaf */}
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
          <Leaf className="w-8 h-8 text-[#22C55E]" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-xs">Scroll to explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}
