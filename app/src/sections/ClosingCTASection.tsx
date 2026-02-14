import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, Users } from 'lucide-react';

interface ClosingCTASectionProps {
  onStartDay?: () => void;
  onJoinCircle?: () => void;
}

export function ClosingCTASection({ onStartDay, onJoinCircle }: ClosingCTASectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="cta"
      className="w-full bg-[#E9F3E9] py-16 md:py-24 relative"
      style={{ zIndex: 120 }}
    >
      {/* Gradient band at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#D6E4FF]/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* CTA Card */}
        <div 
          className={`gp-card p-8 md:p-12 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready for a <span className="text-[#22C55E]">lighter day?</span>
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Start tomorrow with a 60-second plan. No sensors. No guilt. Just progress.
          </p>

          <div 
            className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
            }`}
          >
            <button 
              onClick={onStartDay}
              className="gp-button-primary flex items-center gap-2"
            >
              Start your day
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onJoinCircle}
              className="gp-button-secondary flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Join a circle
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GP</span>
              </div>
              <span className="font-semibold text-gray-800">GreenPulse</span>
            </div>

            <nav className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </nav>

            <p className="text-sm text-gray-400">
              © 2026 GreenPulse
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
