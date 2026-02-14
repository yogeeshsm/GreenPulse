import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Calculator, Leaf, DollarSign, Wind, Droplets, Trees, Award, FileText, Check } from 'lucide-react';
import { showToast } from '@/components/Toast';

interface OffsetProvider {
  id: string;
  name: string;
  type: string;
  pricePerTon: number;
  icon: typeof Trees;
  verified: boolean;
  description: string;
}

const offsetProviders: OffsetProvider[] = [
  {
    id: 'vcs',
    name: 'Verified Carbon Standard',
    type: 'Forest Conservation',
    pricePerTon: 15,
    icon: Trees,
    verified: true,
    description: 'REDD+ forest protection projects'
  },
  {
    id: 'gold',
    name: 'Gold Standard',
    type: 'Renewable Energy',
    pricePerTon: 22,
    icon: Wind,
    verified: true,
    description: 'Solar and wind energy projects'
  },
  {
    id: 'blue',
    name: 'Blue Carbon Initiative',
    type: 'Ocean & Coastal',
    pricePerTon: 28,
    icon: Droplets,
    verified: true,
    description: 'Marine ecosystem restoration'
  }
];

const presets = [50, 100, 150, 250, 500];

export function CarbonCreditCalculator() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const [emissions, setEmissions] = useState<string>('144');
  const [selectedProvider, setSelectedProvider] = useState<string>(offsetProviders[0].id);
  const [showCertificate, setShowCertificate] = useState(false);

  const emissionsValue = parseFloat(emissions) || 0;
  const provider = offsetProviders.find(p => p.id === selectedProvider) || offsetProviders[0];
  const creditsNeeded = Math.ceil(emissionsValue);
  const totalCost = creditsNeeded * provider.pricePerTon;

  const handlePreset = (value: number) => {
    setEmissions(value.toString());
  };

  const handleGenerateCertificate = () => {
    setShowCertificate(true);
  };

  return (
    <section
      ref={ref}
      className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-[#0a3d2a] py-24 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#22C55E] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#10B981] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full">
            <Calculator className="w-5 h-5 text-[#22C55E]" />
            <span className="text-[#22C55E] font-semibold">Carbon Credit Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Carbon Credit Calculator
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Calculate offset requirements and costs for carbon neutrality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Emissions Input */}
          <div 
            className={`transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              {/* Emissions Input */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-5 h-5 text-[#22C55E]" />
                  <h2 className="text-xl font-semibold text-white">Emissions Input</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Enter your production's total carbon emissions
                </p>

                <label className="block text-gray-300 font-medium mb-3">
                  Total CO₂ Emissions (tons)
                </label>
                <input
                  type="number"
                  value={emissions}
                  onChange={(e) => setEmissions(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white text-2xl font-bold focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all"
                  placeholder="144"
                  min="0"
                  step="any"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Based on your production activities and energy usage
                </p>
              </div>

              {/* Quick Presets */}
              <div className="mb-8">
                <label className="block text-gray-300 font-medium mb-3">Quick Presets</label>
                <div className="flex gap-2 flex-wrap">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePreset(preset)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        emissions === preset.toString()
                          ? 'bg-[#22C55E] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {preset}t
                    </button>
                  ))}
                </div>
              </div>

              {/* Offset Provider Selection */}
              <div>
                <label className="block text-gray-300 font-medium mb-3">Select Offset Provider</label>
                <div className="space-y-3">
                  {offsetProviders.map((providerOption) => {
                    const Icon = providerOption.icon;
                    const isSelected = selectedProvider === providerOption.id;
                    
                    return (
                      <button
                        key={providerOption.id}
                        onClick={() => setSelectedProvider(providerOption.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-[#22C55E] bg-[#22C55E]/10'
                            : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-[#22C55E]' : 'bg-gray-700'
                          }`}>
                            <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white">{providerOption.name}</span>
                              {providerOption.verified && (
                                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{providerOption.type}</p>
                            <p className="text-xs text-gray-500">{providerOption.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-white">${providerOption.pricePerTon}</div>
                            <div className="text-xs text-gray-400">/ton</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Offset Summary */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-5 h-5 text-[#22C55E]" />
                <h2 className="text-xl font-semibold text-white">Offset Summary</h2>
              </div>

              {/* Credits Needed */}
              <div className="mb-6 p-6 bg-gray-900/50 rounded-2xl border border-gray-700/50">
                <div className="text-gray-400 text-sm mb-2">Credits Needed</div>
                <div className="text-5xl font-bold text-white mb-1">{creditsNeeded}</div>
                <div className="text-gray-500 text-sm">carbon credits</div>
              </div>

              {/* Total Cost */}
              <div className="mb-8 p-6 bg-gradient-to-br from-[#22C55E]/20 to-[#10B981]/20 rounded-2xl border border-[#22C55E]/30">
                <div className="text-[#22C55E] text-sm font-medium mb-2">Total Cost</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <DollarSign className="w-8 h-8 text-[#22C55E]" />
                  <span className="text-5xl font-bold text-white">
                    {totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="text-[#22C55E]/80 text-sm">for carbon neutrality</div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button 
                  disabled={!emissionsValue}
                  onClick={() => {
                    if (emissionsValue) {
                      setShowCertificate(true);
                      showToast(`Successfully purchased ${creditsNeeded} carbon credits from ${provider.name} for $${totalCost.toLocaleString()}! 🌍`, 'success', 5000);
                    }
                  }}
                  className="w-full py-4 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Purchase Credits
                </button>
                <button 
                  onClick={handleGenerateCertificate}
                  disabled={!emissionsValue}
                  className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Generate Certificate
                </button>
              </div>

              {/* Certificate Preview */}
              {showCertificate && emissionsValue > 0 && (
                <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-[#22C55E]/50">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#22C55E] rounded-full mb-3">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Carbon Neutral</h3>
                    <div className="flex items-center justify-center gap-2 text-[#22C55E]">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Certified</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-700 text-center">
                    <p className="text-gray-400 text-sm">
                      Offset {creditsNeeded} tons of CO₂ to achieve carbon neutrality for your production
                    </p>
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Provider</div>
                      <div className="font-semibold text-white">{provider.name}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div 
          className={`mt-12 p-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-[#22C55E] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About Carbon Credits</h3>
              <p className="text-gray-400 leading-relaxed">
                Carbon credits represent one ton of carbon dioxide removed from the atmosphere. 
                By purchasing carbon credits from verified projects, you can offset your emissions 
                and achieve carbon neutrality. All providers listed are internationally recognized 
                and follow strict verification standards to ensure real climate impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
