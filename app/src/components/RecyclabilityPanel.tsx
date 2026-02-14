

import { Recycle, Leaf, Factory, AlertCircle, CheckCircle2, Info, Wind } from 'lucide-react';
import type { ProductData, AnalysisResult } from '@/types';

interface RecyclabilityPanelProps {
    product: ProductData;
    analysis: AnalysisResult;
}

const RecyclabilityPanel = ({ product, analysis }: RecyclabilityPanelProps) => {
    const { packaging } = product;

    // Helper for Recyclability Status
    const getStatus = (recyclability: number) => {
        if (recyclability >= 80) return { label: 'Recyclable', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle2 };
        if (recyclability >= 50) return { label: 'Partially Recyclable', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Info };
        return { label: 'Not Recyclable', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertCircle };
    };

    const status = getStatus(packaging.recyclability);

    // Carbon footprint estimate (mock logic if not provided, but usually comes from analysis)
    const carbonFootprint = analysis.carbonTotal.toFixed(1);

    return (
        <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Recyclability & Eco-Info</h2>
                    <p className="text-xs text-muted-foreground">Dispose responsibly</p>
                </div>
            </div>

            {/* Main Status Badge */}
            <div className={`rounded-xl p-4 border border-dashed ${status.bg.replace('/20', '/10')} border-${status.color.split('-')[1]}-500/30 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${status.bg}`}>
                        <status.icon className={`w-6 h-6 ${status.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Status</p>
                        <p className={`font-bold text-lg ${status.color}`}>{status.label}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{packaging.recyclability}%</p>
                    <p className="text-xs text-slate-500">Recyclable</p>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Material Type */}
                <div className="p-3 bg-slate-800/50 rounded-lg space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Factory className="w-3 h-3" />
                        Material
                    </div>
                    <p className="text-white font-medium truncate" title={packaging.material}>{packaging.type}</p>
                </div>

                {/* Carbon Footprint */}
                <div className="p-3 bg-slate-800/50 rounded-lg space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Wind className="w-3 h-3" />
                        Carbon Output
                    </div>
                    <p className="text-white font-medium">{carbonFootprint} kg CO₂e</p>
                </div>
            </div>

            {/* Certifications Badges */}
            {product.certifications.length > 0 && (
                <div>
                    <p className="text-xs text-slate-400 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                        {product.certifications.map((cert, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
                                <Leaf className="w-3 h-3" />
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Disposal Instructions */}
            <div className="bg-slate-800/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    Disposal Instructions
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {packaging.instructions}
                </p>
            </div>

            {/* Eco Tip */}
            <div className="flex gap-3 items-start p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                <Leaf className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-blue-400 mb-0.5">Eco Tip</p>
                    <p className="text-xs text-slate-300">
                        Choosing products with {packaging.recyclability > 70 ? 'high recyclability' : 'lower packaging waste'} helps reduce landfill impact.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default RecyclabilityPanel;
