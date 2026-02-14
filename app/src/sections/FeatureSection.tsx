import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface FeatureSectionProps {
  id: string;
  headline: string;
  body: string;
  cta: string;
  microText: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
  gradient: string;
  layout: 'left-image' | 'right-image';
  zIndex: number;
  onCtaClick?: () => void;
}

export function FeatureSection({
  id,
  headline,
  body,
  cta,
  microText,
  imageSrc,
  imageAlt,
  icon: Icon,
  gradient,
  layout,
  zIndex,
  onCtaClick
}: FeatureSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const isLeftImage = layout === 'left-image';

  return (
    <section
      ref={ref}
      id={id}
      className={`gp-section-pinned ${gradient} flex items-center justify-center relative`}
      style={{ zIndex }}
    >
      {/* Day Path Ribbon */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg 
          className="absolute w-full h-full"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`ribbonGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <path
            d={isLeftImage 
              ? "M -10 50 Q 30 30, 50 50 Q 70 70, 110 50" 
              : "M -10 50 Q 30 70, 50 50 Q 70 30, 110 50"
            }
            fill="none"
            stroke={`url(#ribbonGradient-${id})`}
            strokeWidth="10"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-center">
        <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full ${
          isLeftImage ? '' : 'lg:flex-row-reverse'
        }`}>
          {/* Image Card */}
          <div 
            className={`w-full lg:w-[40vw] lg:max-w-[520px] transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${isLeftImage ? '-translate-x-[55vw]' : 'translate-x-[55vw]'}`
            }`}
          >
            <div className="gp-card p-3">
              <div className="relative rounded-[20px] overflow-hidden animate-float-slow bg-gradient-to-br from-green-50 to-emerald-100">
                <img 
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  onError={(e) => { 
                    e.currentTarget.style.opacity = '0.4';
                    e.currentTarget.style.filter = 'blur(8px)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Text Card */}
          <div 
            className={`w-full lg:w-[40vw] lg:max-w-[520px] transition-all duration-1000 delay-200 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${isLeftImage ? 'translate-x-[55vw]' : '-translate-x-[55vw]'}`
            }`}
          >
            <div className="gp-card p-8 relative">
              {/* Icon */}
              <div className={`absolute -top-4 ${isLeftImage ? '-right-4' : '-left-4'} w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {headline}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {body}
              </p>

              <button 
                onClick={onCtaClick}
                className="gp-button-primary flex items-center gap-2 mb-4 hover:scale-105 transition-transform"
              >
                {cta}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-400">
                {microText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
