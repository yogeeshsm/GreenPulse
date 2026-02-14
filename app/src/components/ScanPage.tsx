import { useState, useRef } from 'react';
import { ScanBarcode, Camera, Upload, Search, Leaf, ArrowRight, Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BarcodeScanner from '@/components/BarcodeScanner';
import ImageUploader from '@/components/ImageUploader';
import { analyzeProductFromImage, analyzeProductFromBarcode } from '@/services/aiService';
import type { ProductData, AnalysisResult, ChartData, BarChartData } from '@/types';

interface ScanPageProps {
    onFullAnalysis: (
        analysis: AnalysisResult,
        radarData?: ChartData[],
        barData?: BarChartData[],
        highlights?: { type: 'positive' | 'warning' | 'negative'; icon: string; text: string }[],
        funFact?: string
    ) => void;
    onProductScanned: (product: ProductData) => void;
    allProducts: ProductData[];
}

const ScanPage = ({ onFullAnalysis, onProductScanned, allProducts }: ScanPageProps) => {
    const [activeMode, setActiveMode] = useState<'barcode' | 'camera' | 'upload' | 'search' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const quickTryProducts = allProducts.slice(0, 3);

    const modes = [
        { id: 'barcode' as const, label: 'Barcode', icon: ScanBarcode, desc: 'Scan product barcode' },
        { id: 'camera' as const, label: 'Camera', icon: Camera, desc: 'Take a photo' },
        { id: 'upload' as const, label: 'Upload', icon: Upload, desc: 'Upload an image' },
        { id: 'search' as const, label: 'Search', icon: Search, desc: 'Search manually' },
    ];

    const handleImageSelected = async (base64: string) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzeProductFromImage(base64);
            if (result) {
                // Extract chart data and pass full analysis
                const { radarData, barChartData, highlights, funFact, ...analysis } = result;
                onFullAnalysis(analysis, radarData, barChartData, highlights, funFact);
            } else {
                setError('Could not identify the product. Please try again.');
            }
        } catch {
            setError('AI analysis failed. Please check your API key.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleBarcodeDetected = async (code: string) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzeProductFromBarcode(code);
            if (result) {
                const { radarData, barChartData, highlights, funFact, ...analysis } = result;
                onFullAnalysis(analysis, radarData, barChartData, highlights, funFact);
            } else {
                setError(`No product found for barcode: ${code}`);
            }
        } catch {
            setError('Barcode lookup failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        const found = allProducts.find(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (found) {
            onProductScanned(found);
        } else {
            setError(`No product found for "${searchQuery}". Try one of the suggestions below.`);
        }
    };

    const handleQuickTry = (product: ProductData) => {
        onProductScanned(product);
    };

    return (
        <div className="min-h-screen eco-gradient-bg flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-10">
                {/* Header */}
                <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                        <span className="eco-gradient-text">Environmental Impact</span>
                        <br />
                        <span className="text-white">Scanner</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                        Understand what you buy. Measure impact. Make better choices.
                    </p>
                </div>

                {/* Mode Selector */}
                <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    {/* Mode Buttons */}
                    <div className="grid grid-cols-4 gap-3">
                        {modes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => { setActiveMode(activeMode === mode.id ? null : mode.id); setError(null); }}
                                className={`group relative flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-xl border transition-all duration-300 ${activeMode === mode.id
                                    ? 'bg-teal-500/15 border-teal-500/40 shadow-lg shadow-teal-500/10'
                                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-lg transition-colors ${activeMode === mode.id ? 'bg-teal-500/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                                    }`}>
                                    <mode.icon className={`w-6 h-6 transition-colors ${activeMode === mode.id ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-300'
                                        }`} />
                                </div>
                                <span className={`text-sm font-medium transition-colors ${activeMode === mode.id ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-300'
                                    }`}>
                                    {mode.label}
                                </span>

                                {/* Active indicator dot */}
                                {activeMode === mode.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400 border-2 border-slate-900 animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search a product manually..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                onFocus={() => setActiveMode('search')}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all text-sm"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Scan'}
                        </Button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in-up">
                            <X className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Active Mode Content */}
                    {activeMode === 'barcode' && (
                        <div className="animate-fade-in-up">
                            <BarcodeScanner
                                onScanSuccess={handleBarcodeDetected}
                                onScanFailure={(err) => setError(err)}
                                onClose={() => setActiveMode(null)}
                            />
                        </div>
                    )}

                    {(activeMode === 'camera' || activeMode === 'upload') && (
                        <div className="animate-fade-in-up">
                            <ImageUploader
                                onImageSelected={handleImageSelected}
                                isLoading={isAnalyzing}
                            />
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isAnalyzing && (
                        <div className="flex flex-col items-center gap-3 py-4 animate-fade-in-up">
                            <div className="relative">
                                <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
                                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <p className="text-sm text-slate-400">Analyzing with AI...</p>
                        </div>
                    )}
                </div>

                {/* Quick Try Section */}
                <div className="flex items-center justify-center gap-3 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <span className="text-sm text-slate-500">Try:</span>
                    {quickTryProducts.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleQuickTry(product)}
                            className="group flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700/50 bg-slate-800/30 text-sm text-slate-400 hover:text-teal-400 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all"
                        >
                            {product.name}
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScanPage;
