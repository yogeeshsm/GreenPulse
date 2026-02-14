import { useState } from 'react';
import { FlaskConical, AlertTriangle, Droplets, TreePine, Cloud, Info, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import type { ProductData, Ingredient } from '@/types';

interface IngredientAnalyzerProps {
  product: ProductData;
}

const IngredientAnalyzer = ({ product }: IngredientAnalyzerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string | null>(null);

  const filteredIngredients = product.ingredients?.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = !filterRisk || ing.riskFactors.includes(filterRisk);
    return matchesSearch && matchesRisk;
  }) || [];

  const allRiskFactors = [...new Set(product.ingredients?.flatMap(i => i.riskFactors) || [])];

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      'high-carbon': 'text-orange-400',
      'methane-emissions': 'text-red-400',
      'deforestation-risk': 'text-red-500',
      'water-intensive': 'text-blue-400',
      'biodiversity-impact': 'text-purple-400'
    };
    return colors[risk] || 'text-yellow-400';
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high-carbon':
      case 'methane-emissions':
        return <Cloud className="w-4 h-4" />;
      case 'deforestation-risk':
      case 'biodiversity-impact':
        return <TreePine className="w-4 h-4" />;
      case 'water-intensive':
        return <Droplets className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getImpactLevel = (ingredient: Ingredient) => {
    const totalImpact = ingredient.carbonIntensity + (ingredient.waterIntensity / 1000) + ingredient.landUse;
    if (totalImpact > 15) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (totalImpact > 8) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const totalCarbon = product.ingredients?.reduce((acc, i) => acc + i.carbonIntensity * (i.percentage / 100), 0) || 0;
  const totalWater = product.ingredients?.reduce((acc, i) => acc + i.waterIntensity * (i.percentage / 100), 0) || 0;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
      >
        <FlaskConical className="w-4 h-4" />
        Ingredients
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-orange-500/20 max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-orange-400" />
              Ingredient Analyzer
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-white">{product.ingredients?.length || 0}</p>
                  <p className="text-xs text-slate-400">Ingredients</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-orange-400">{totalCarbon.toFixed(1)}</p>
                  <p className="text-xs text-slate-400">kg CO₂e</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-400">{Math.round(totalWater)}</p>
                  <p className="text-xs text-slate-400">Liters Water</p>
                </div>
              </div>

              {/* Risk Factor Legend */}
              {allRiskFactors.length > 0 && (
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-400 mb-3">Environmental Risk Factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {allRiskFactors.map(risk => (
                      <button
                        key={risk}
                        onClick={() => setFilterRisk(filterRisk === risk ? null : risk)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${filterRisk === risk
                          ? 'bg-orange-500/30 text-orange-400'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                      >
                        {getRiskIcon(risk)}
                        <span className={getRiskColor(risk)}>
                          {risk.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Ingredients List */}
              <div className="space-y-2">
                {filteredIngredients.length === 0 ? (
                  <div className="text-center py-8">
                    <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No ingredients found</p>
                  </div>
                ) : (
                  filteredIngredients.map((ingredient, index) => {
                    const impact = getImpactLevel(ingredient);
                    const isExpanded = expandedIngredient === ingredient.name;

                    return (
                      <div
                        key={ingredient.name}
                        className="bg-slate-800/50 rounded-xl overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <button
                          onClick={() => setExpandedIngredient(isExpanded ? null : ingredient.name)}
                          className="w-full p-4 flex items-center gap-4"
                        >
                          {/* Percentage */}
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">{ingredient.percentage}%</span>
                          </div>

                          {/* Name & Impact */}
                          <div className="flex-1 text-left">
                            <p className="font-medium text-white">{ingredient.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${impact.bg} ${impact.color}`}>
                                {impact.level} Impact
                              </span>
                              {ingredient.riskFactors.map((risk, i) => (
                                <span key={i} className={`text-xs ${getRiskColor(risk)}`}>
                                  {getRiskIcon(risk)}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Expand Icon */}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-slate-700/50">
                            <div className="grid grid-cols-3 gap-4 pt-4">
                              <div className="p-3 bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Cloud className="w-4 h-4 text-orange-400" />
                                  <span className="text-xs text-slate-400">Carbon</span>
                                </div>
                                <p className="text-lg font-bold text-white">{ingredient.carbonIntensity}</p>
                                <p className="text-xs text-slate-500">kg CO₂e/kg</p>
                              </div>

                              <div className="p-3 bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Droplets className="w-4 h-4 text-blue-400" />
                                  <span className="text-xs text-slate-400">Water</span>
                                </div>
                                <p className="text-lg font-bold text-white">{ingredient.waterIntensity}</p>
                                <p className="text-xs text-slate-500">liters/kg</p>
                              </div>

                              <div className="p-3 bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <TreePine className="w-4 h-4 text-green-400" />
                                  <span className="text-xs text-slate-400">Land Use</span>
                                </div>
                                <p className="text-lg font-bold text-white">{ingredient.landUse}</p>
                                <p className="text-xs text-slate-500">m²/kg</p>
                              </div>
                            </div>

                            {/* Risk Factors Detail */}
                            {ingredient.riskFactors.length > 0 && (
                              <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                                  <span className="text-sm font-medium text-orange-400">Environmental Concerns</span>
                                </div>
                                <ul className="space-y-1">
                                  {ingredient.riskFactors.map((risk, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                      {getRiskIcon(risk)}
                                      {risk.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Educational Note */}
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-400">Understanding Impact</span>
                </div>
                <p className="text-sm text-slate-300">
                  Ingredient impact is calculated based on carbon emissions, water usage, and land use
                  during cultivation and production. Higher percentages in the product mean greater
                  contribution to overall environmental footprint.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IngredientAnalyzer;
