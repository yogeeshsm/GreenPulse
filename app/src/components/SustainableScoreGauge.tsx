import React, { useEffect, useState, useRef } from 'react';
import { getScoreColor, getScoreLabel, getScoreDescription } from '@/data/sampleData';

interface SustainableScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  animated?: boolean;
}

const SustainableScoreGauge: React.FC<SustainableScoreGaugeProps> = ({
  score,
  size = 280,
  strokeWidth = 16,
  showLabel = true,
  animated = true
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const gaugeRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (gaugeRef.current) {
      observer.observe(gaugeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !animated) {
      setAnimatedScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, isVisible, animated]);

  const getGradientColors = () => {
    if (score >= 85) return ['#22c55e', '#16a34a'];
    if (score >= 70) return ['#2dd4bf', '#14b8a6'];
    if (score >= 55) return ['#eab308', '#ca8a04'];
    if (score >= 40) return ['#f97316', '#ea580c'];
    return ['#ef4444', '#dc2626'];
  };

  const [startColor, endColor] = getGradientColors();

  return (
    <div ref={gaugeRef} className="flex flex-col items-center">
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer Glow Ring */}
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transform: 'scale(1.2)'
          }}
        />

        {/* SVG Gauge */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={`gaugeGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
            <filter id={`glow-${score}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(45, 212, 191, 0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#gaugeGradient-${score})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            filter={`url(#glow-${score})`}
            className={animated ? "progress-ring-circle" : ""}
            style={{
              transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none'
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-6xl font-bold tabular-nums"
            style={{ 
              color,
              textShadow: `0 0 20px ${color}40`,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            {animatedScore}
          </span>
          <span className="text-sm text-muted-foreground mt-1 font-medium tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {/* Labels */}
      {showLabel && (
        <div className="mt-6 text-center animate-fade-in-up">
          <h3 
            className="text-2xl font-bold mb-2"
            style={{ color }}
          >
            {getScoreLabel(score)}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {getScoreDescription(score)}
          </p>
        </div>
      )}
    </div>
  );
};

export default SustainableScoreGauge;
