import { useState, useEffect } from 'react';
import { Scan, BarChart3, Leaf, Info, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SustainableScoreGauge from '@/components/SustainableScoreGauge';
import ImpactRadarChart from '@/components/ImpactRadarChart';
import ImpactBarChart from '@/components/ImpactBarChart';
import TransparencyPanel from '@/components/TransparencyPanel';
import AlternativeProducts from '@/components/AlternativeProducts';
import DisposalGuidance from '@/components/DisposalGuidance';
import AISummary from '@/components/AISummary';
import ReportGenerator from '@/components/ReportGenerator';
import ProductHeader from '@/components/ProductHeader';
import ProductComparison from '@/components/ProductComparison';
import ScanHistory from '@/components/ScanHistory';
import UserDashboard from '@/components/UserDashboard';
import SearchFilter from '@/components/SearchFilter';
import ShareButton from '@/components/ShareButton';
import ESGDeepDive from '@/components/ESGDeepDive';
import IngredientAnalyzer from '@/components/IngredientAnalyzer';
import RecyclabilityPanel from '@/components/RecyclabilityPanel';
import ScanPage from '@/components/ScanPage';
import ThemeToggle from '@/components/ThemeToggle';

import { analysisResult, radarData as defaultRadarData, barChartData as defaultBarChartData } from '@/data/sampleData';
import { additionalProducts } from '@/data/extendedData';
import type { ProductData, AnalysisResult, ChartData, BarChartData } from '@/types';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [activePage, setActivePage] = useState<'scan' | 'dashboard'>('scan');
  const [currentProduct, setCurrentProduct] = useState<ProductData>(analysisResult.product);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult>(analysisResult);
  const [currentRadarData, setCurrentRadarData] = useState<ChartData[]>(defaultRadarData);
  const [currentBarChartData, setCurrentBarChartData] = useState<BarChartData[]>(defaultBarChartData);
  const [currentHighlights, setCurrentHighlights] = useState<{ type: 'positive' | 'warning' | 'negative'; icon: string; text: string }[]>([]);
  const [currentFunFact, setCurrentFunFact] = useState<string>('');

  const allProducts = [analysisResult.product, ...additionalProducts];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle full AI analysis result (from ScanPage)
  const handleFullAnalysis = (
    analysis: AnalysisResult,
    radarData?: ChartData[],
    barData?: BarChartData[],
    highlights?: { type: 'positive' | 'warning' | 'negative'; icon: string; text: string }[],
    funFact?: string
  ) => {
    setCurrentProduct(analysis.product);
    setCurrentAnalysis(analysis);
    if (radarData) setCurrentRadarData(radarData);
    if (barData) setCurrentBarChartData(barData);
    if (highlights) setCurrentHighlights(highlights);
    if (funFact) setCurrentFunFact(funFact);
    setActivePage('dashboard');
  };

  // Handle selecting from existing product list (keeps mock data)
  const handleProductSelect = (product: ProductData) => {
    setCurrentProduct(product);
    const mockScore = Math.floor(Math.random() * 40) + 50;
    setCurrentAnalysis({
      ...analysisResult,
      product,
      sustainableScore: mockScore,
      scoreLabel: mockScore >= 70 ? 'Good' : mockScore >= 55 ? 'Moderate' : 'Low',
      carbonTotal: product.ingredients ? product.ingredients.reduce((acc, i) => acc + i.carbonIntensity * (i.percentage / 100), 0) : 0,
      waterTotal: product.ingredients ? product.ingredients.reduce((acc, i) => acc + i.waterIntensity * (i.percentage / 100), 0) : 0,
    });
    setActivePage('dashboard');
  };



  return (
    <div className="min-h-screen eco-gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-teal-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold eco-gradient-text">EcoScan</h1>
                <p className="text-xs text-muted-foreground">Environmental Impact Scanner</p>
              </div>
            </div>

            {/* Desktop Nav - Removed */}
            <div className="hidden md:flex items-center gap-1">
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2">
                <UserDashboard />
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Scan Landing Page */}
      {activePage === 'scan' && (
        <div className="pt-16">
          <ScanPage onFullAnalysis={handleFullAnalysis} onProductScanned={handleProductSelect} allProducts={allProducts} />
        </div>
      )}

      {/* Dashboard Content */}
      {activePage === 'dashboard' && (
        <main className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Product Header */}
            <div className="mb-8 animate-fade-in-up">
              <ProductHeader product={currentProduct} />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <ProductComparison products={allProducts} currentProduct={currentProduct} />
              <ScanHistory currentProduct={currentProduct} />
              <SearchFilter products={allProducts} onSelectProduct={handleProductSelect} />
              <ShareButton analysis={currentAnalysis} />
              <ReportGenerator analysis={currentAnalysis} />
              <ESGDeepDive product={currentProduct} />
              {currentProduct.type === 'food' && (
                <IngredientAnalyzer product={currentProduct} />
              )}
              {currentProduct.type === 'non-food' && currentProduct.materials && (
                <div className="glass-panel rounded-xl p-4 eco-card">
                  <h3 className="text-white font-medium mb-2">Material Composition</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.materials.map((mat, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-sm border border-slate-600">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Score & Charts */}
              <div className="lg:col-span-5 space-y-6">
                {/* Sustainable Score Card */}
                <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                    Sustainable Score
                  </h2>
                  <div className="flex justify-center">
                    <SustainableScoreGauge
                      score={currentAnalysis.sustainableScore}
                      size={260}
                      strokeWidth={14}
                    />
                  </div>
                </div>

                {/* Radar Chart Card */}
                <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    Impact Analysis
                  </h2>
                  <ImpactRadarChart data={currentRadarData} size={320} />
                </div>

                {/* Bar Chart Card */}
                <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    Impact Breakdown
                  </h2>
                  <ImpactBarChart data={currentBarChartData} height={220} />
                </div>

                {/* Recyclability Panel */}
                <div style={{ animationDelay: '0.4s' }}>
                  <RecyclabilityPanel product={currentProduct} analysis={currentAnalysis} />
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-7 space-y-6">
                {/* Tabs for different sections */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 rounded-xl">
                    <TabsTrigger
                      value="overview"
                      className="rounded-lg data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="alternatives"
                      className="rounded-lg data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
                    >
                      Alternatives
                    </TabsTrigger>
                    <TabsTrigger
                      value="disposal"
                      className="rounded-lg data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
                    >
                      Disposal
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    {/* AI Summary */}
                    <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                      <AISummary summary={currentAnalysis.aiSummary} highlights={currentHighlights} funFact={currentFunFact} />
                    </div>

                    {/* Transparency Panel */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                      <TransparencyPanel
                        scoreBreakdown={currentAnalysis.scoreBreakdown}
                        totalScore={currentAnalysis.sustainableScore}
                        dataConfidence={currentAnalysis.dataConfidence}
                      />
                    </div>

                    {/* Environmental Metrics */}
                    <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        Environmental Metrics
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-orange-400">{currentAnalysis.carbonTotal.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground mt-1">kg CO₂e</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-blue-400">{Math.round(currentAnalysis.waterTotal)}</p>
                          <p className="text-xs text-muted-foreground mt-1">Liters Water</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-purple-400">{currentAnalysis.healthScore}</p>
                          <p className="text-xs text-muted-foreground mt-1">Health Score</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Alternatives Tab */}
                  <TabsContent value="alternatives" className="mt-6">
                    <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up">
                      <AlternativeProducts
                        alternatives={currentAnalysis.alternatives}
                        currentScore={currentAnalysis.sustainableScore}
                      />
                    </div>
                  </TabsContent>

                  {/* Disposal Tab */}
                  <TabsContent value="disposal" className="mt-6">
                    <div className="glass-panel rounded-2xl p-6 eco-card animate-fade-in-up">
                      <DisposalGuidance packaging={currentProduct.packaging} />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="glass-panel rounded-xl p-4 eco-card cursor-pointer group" onClick={() => setActivePage('scan')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                          <Scan className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Scan New Product</p>
                          <p className="text-xs text-muted-foreground">Barcode or image</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-teal-400 transition-colors" />
                    </div>
                  </div>

                  <div className="glass-panel rounded-xl p-4 eco-card cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">View Dashboard</p>
                          <p className="text-xs text-muted-foreground">Track your impact</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-teal-400" />
                  <span className="text-sm text-slate-400">
                    Environmental Impact Scanner v2.0
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <a href="#" className="text-sm text-slate-500 hover:text-teal-400 transition-colors">
                    About
                  </a>
                  <a href="#" className="text-sm text-slate-500 hover:text-teal-400 transition-colors">
                    Methodology
                  </a>
                  <a href="#" className="text-sm text-slate-500 hover:text-teal-400 transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="text-sm text-slate-500 hover:text-teal-400 transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
