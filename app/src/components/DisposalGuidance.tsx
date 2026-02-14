import React from 'react';
import { Recycle, Trash2, MapPin, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { PackagingData } from '@/types';

interface DisposalGuidanceProps {
  packaging: PackagingData;
}

const DisposalGuidance: React.FC<DisposalGuidanceProps> = ({ packaging }) => {
  const getPackagingIcon = () => {
    switch (packaging.type) {
      case 'glass':
        return <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <Recycle className="w-6 h-6 text-green-400" />
        </div>;
      case 'metal':
        return <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Recycle className="w-6 h-6 text-blue-400" />
        </div>;
      case 'mono-plastic':
        return <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Recycle className="w-6 h-6 text-yellow-400" />
        </div>;
      case 'biodegradable':
        return <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-teal-400" />
        </div>;
      case 'composite':
      case 'e-waste':
        return <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-orange-400" />
        </div>;
      default:
        return <div className="w-12 h-12 rounded-full bg-slate-500/20 flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-slate-400" />
        </div>;
    }
  };

  const getRecyclabilityBadge = () => {
    if (packaging.recyclability >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Highly Recyclable
        </span>
      );
    } else if (packaging.recyclability >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
          <Info className="w-4 h-4" />
          Partially Recyclable
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          Limited Recycling
        </span>
      );
    }
  };

  const getWasteClassification = () => {
    const classifications: Record<string, string> = {
      'glass': 'Recyclable Glass',
      'metal': 'Recyclable Metal',
      'mono-plastic': 'Plastic Recycling',
      'biodegradable': 'Compostable Waste',
      'composite': 'Specialized Disposal',
      'e-waste': 'E-Waste Collection'
    };
    return classifications[packaging.type] || 'General Waste';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Recycle className="w-5 h-5 text-teal-400" />
        <h3 className="text-lg font-semibold text-white">Disposal Guidance</h3>
      </div>

      {/* Main Card */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-start gap-4">
          {getPackagingIcon()}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-white">{getWasteClassification()}</h4>
              {getRecyclabilityBadge()}
            </div>
            
            <p className="text-sm text-slate-300 mb-3">
              {packaging.material}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Recyclability:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${packaging.recyclability}%`,
                      background: packaging.recyclability >= 80 ? '#22c55e' : 
                                  packaging.recyclability >= 50 ? '#eab308' : '#ef4444'
                    }}
                  />
                </div>
                <span className="font-semibold text-white">{packaging.recyclability}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-teal-400" />
          <h4 className="font-medium text-white">How to Dispose</h4>
        </div>
        
        <ol className="space-y-2">
          {packaging.instructions.split('. ').filter(Boolean).map((step, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span>{step.trim().replace(/\.$/, '')}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Find Collection Point */}
      <button className="w-full eco-button rounded-xl p-4 flex items-center justify-center gap-2 text-white font-medium">
        <MapPin className="w-5 h-5" />
        Find Nearest Recycling Center
      </button>

      {/* Tips */}
      <div className="p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-medium text-teal-400">Eco Tip</span>
        </div>
        <p className="text-sm text-slate-300">
          Properly cleaned packaging has a <span className="text-white font-semibold">40% higher chance</span> of being 
          successfully recycled. Always rinse containers before disposal.
        </p>
      </div>
    </div>
  );
};

export default DisposalGuidance;
