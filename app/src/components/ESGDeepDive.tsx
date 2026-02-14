import { useState } from 'react';
import { Building2, Users, Heart, Globe2, FileCheck, Leaf, ChevronRight, Award, TreePine, Droplets, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProductData } from '@/types';
import { esgDetails } from '@/data/extendedData';

interface ESGDeepDiveProps {
  product: ProductData;
}

const ESGDeepDive = ({ product }: ESGDeepDiveProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const esgCategories = [
    {
      id: 'environmental',
      label: 'Environmental',
      icon: Leaf,
      score: 78,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      metrics: [
        { label: 'Carbon Neutral Progress', value: esgDetails.carbonNeutralProgress, icon: TreePine },
        { label: 'Renewable Energy Usage', value: esgDetails.renewableEnergy, icon: Sun },
        { label: 'Waste Recycled', value: esgDetails.wasteRecycled, icon: Leaf },
        { label: 'Water Recycled', value: esgDetails.waterRecycled, icon: Droplets },
      ]
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      score: 82,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      metrics: [
        { label: 'Ethical Sourcing', value: esgDetails.ethicalSourcing, icon: FileCheck },
        { label: 'Supplier Audits', value: Math.min(esgDetails.supplierAudits * 3, 100), icon: Building2 },
        { label: 'Living Wage Coverage', value: esgDetails.livingWagePercent, icon: Heart },
        { label: 'Diversity Score', value: esgDetails.diversityScore, icon: Users },
      ]
    },
    {
      id: 'governance',
      label: 'Governance',
      icon: Building2,
      score: 71,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      metrics: [
        { label: 'Transparency Score', value: product.esg.transparencyScore, icon: FileCheck },
        { label: 'Sustainability Report', value: product.esg.hasSustainabilityReport ? 100 : 0, icon: FileCheck },
        { label: 'Ethical Certifications', value: product.esg.hasEthicalCertification ? 100 : 0, icon: Award },
        { label: 'Carbon Neutral Goal', value: product.esg.carbonNeutralGoal ? 100 : 0, icon: TreePine },
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
      >
        <Building2 className="w-4 h-4" />
        ESG Details
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-purple-500/20 max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              ESG Deep Dive
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-6">
              {/* Manufacturer Header */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">{product.manufacturer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">{product.country}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">
                      {Math.round((esgCategories.reduce((acc, cat) => acc + cat.score, 0)) / 3)}
                    </p>
                    <p className="text-xs text-slate-400">ESG Score</p>
                  </div>
                </div>
              </div>

              {/* ESG Tabs */}
              <Tabs defaultValue="environmental" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 rounded-xl">
                  {esgCategories.map(cat => (
                    <TabsTrigger 
                      key={cat.id}
                      value={cat.id}
                      className={`rounded-lg data-[state=active]:${cat.bgColor} data-[state=active]:${cat.color}`}
                    >
                      <cat.icon className="w-4 h-4 mr-1" />
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {esgCategories.map(cat => (
                  <TabsContent key={cat.id} value={cat.id} className="mt-4 space-y-4">
                    {/* Category Score */}
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">{cat.label} Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(cat.score)}`}>
                          {cat.score}/100
                        </span>
                      </div>
                      <Progress 
                        value={cat.score} 
                        className="h-3 bg-slate-700"
                      />
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {cat.metrics.map((metric, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-slate-800/50 rounded-xl animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <metric.icon className={`w-4 h-4 ${cat.color}`} />
                            <span className="text-xs text-slate-400">{metric.label}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-white">{metric.value}%</span>
                            <div className={`w-2 h-2 rounded-full ${getProgressColor(metric.value)}`} />
                          </div>
                          <Progress 
                            value={metric.value} 
                            className="h-1.5 mt-2 bg-slate-700"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Category Specific Info */}
                    {cat.id === 'environmental' && (
                      <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <h4 className="font-medium text-green-400 mb-2">Environmental Commitments</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            Target: Carbon neutral by 2030
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            100% renewable energy in production
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            Zero waste to landfill initiative
                          </li>
                        </ul>
                      </div>
                    )}

                    {cat.id === 'social' && (
                      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <h4 className="font-medium text-blue-400 mb-2">Social Initiatives</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-400" />
                            Fair wages for all supply chain workers
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-400" />
                            Community investment: ${esgDetails.communityInvestment}M annually
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-400" />
                            {esgDetails.supplierAudits} supplier audits conducted this year
                          </li>
                        </ul>
                      </div>
                    )}

                    {cat.id === 'governance' && (
                      <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <h4 className="font-medium text-purple-400 mb-2">Governance Practices</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-purple-400" />
                            Annual sustainability reporting
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-purple-400" />
                            Board-level sustainability committee
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-purple-400" />
                            Executive compensation tied to ESG goals
                          </li>
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>

              {/* Certifications */}
              {product.certifications.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-3">Certifications & Memberships</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-400 text-sm flex items-center gap-1"
                      >
                        <Award className="w-4 h-4" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              <div className="flex gap-2">
                <button className="flex-1 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 text-sm text-slate-300">
                  <FileCheck className="w-4 h-4" />
                  View Sustainability Report
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper component for checkmarks
const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default ESGDeepDive;
