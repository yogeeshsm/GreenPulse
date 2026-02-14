import { useState } from 'react';
import { Zap, Fuel, Home as HomeIcon, Car, Leaf, Users, RotateCcw, ChevronDown, Info, TrendingDown, TreePine, Globe } from 'lucide-react';

// ─── Indian Emission Factors (kg CO₂e) ─────────────────────────────
const FACTORS = {
  electricity: 0.82,        // kg CO₂e per kWh (India CEA grid factor 2023)
  lpg: 44.98,              // kg CO₂e per 14.2 kg cylinder (1 cylinder = 14.2 kg LPG)
  coal: 2.86,              // kg CO₂e per kg coal
  wood: 1.65,              // kg CO₂e per kg firewood
  petrol: 2.296,           // kg CO₂e per litre
  diesel: 2.653,           // kg CO₂e per litre
  cng: 2.74,               // kg CO₂e per kg CNG
  autoLpg: 1.665,          // kg CO₂e per kg Auto LPG
  twoWheeler: 0.035,       // kg CO₂e per km (avg two-wheeler)
  bus: 0.027,              // kg CO₂e per km (bus per passenger)
  train: 0.006,            // kg CO₂e per km (train per passenger)
  metro: 0.005,            // kg CO₂e per km (metro per passenger)
  autoRickshaw: 0.06,      // kg CO₂e per km
};

const INDIA_AVG_PER_CAPITA = 1600; // kg CO₂e per year
const GLOBAL_AVG_PER_CAPITA = 4000; // kg CO₂e per year

interface SectionValues {
  [key: string]: string;
}

export function CarbonFootprintCalculator() {
  const [householdMembers, setHouseholdMembers] = useState('4');
  const [household, setHousehold] = useState<SectionValues>({
    electricity: '',
    lpg: '',
    coal: '',
    wood: '',
  });
  const [transport, setTransport] = useState<SectionValues>({
    petrol: '',
    diesel: '',
    cng: '',
    autoLpg: '',
    twoWheeler: '',
    bus: '',
    train: '',
    metro: '',
    autoRickshaw: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const members = Math.max(1, parseInt(householdMembers) || 1);

  // ─── Calculate Household Footprint (kg CO₂e / month) ─────────────
  const householdFootprint =
    (parseFloat(household.electricity) || 0) * FACTORS.electricity +
    (parseFloat(household.lpg) || 0) * FACTORS.lpg +
    (parseFloat(household.coal) || 0) * FACTORS.coal +
    (parseFloat(household.wood) || 0) * FACTORS.wood;

  // ─── Calculate Transport Footprint (kg CO₂e / month) ─────────────
  const transportFootprint =
    (parseFloat(transport.petrol) || 0) * FACTORS.petrol +
    (parseFloat(transport.diesel) || 0) * FACTORS.diesel +
    (parseFloat(transport.cng) || 0) * FACTORS.cng +
    (parseFloat(transport.autoLpg) || 0) * FACTORS.autoLpg +
    (parseFloat(transport.twoWheeler) || 0) * FACTORS.twoWheeler +
    (parseFloat(transport.bus) || 0) * FACTORS.bus +
    (parseFloat(transport.train) || 0) * FACTORS.train +
    (parseFloat(transport.metro) || 0) * FACTORS.metro +
    (parseFloat(transport.autoRickshaw) || 0) * FACTORS.autoRickshaw;

  const totalMonthly = householdFootprint + transportFootprint;
  const totalYearly = totalMonthly * 12;
  const perPersonMonthly = totalMonthly / members;
  const perPersonYearly = totalYearly / members;

  const handleReset = () => {
    setHousehold({ electricity: '', lpg: '', coal: '', wood: '' });
    setTransport({ petrol: '', diesel: '', cng: '', autoLpg: '', twoWheeler: '', bus: '', train: '', metro: '', autoRickshaw: '' });
    setShowResults(false);
    setShowTips(false);
  };

  const handleCalculate = () => {
    setShowResults(true);
    setShowTips(true);
  };

  const getComparisonLevel = (): { label: string; color: string; message: string } => {
    if (perPersonYearly <= INDIA_AVG_PER_CAPITA * 0.5) return { label: 'Excellent', color: 'text-emerald-600', message: 'Well below India average! Great job!' };
    if (perPersonYearly <= INDIA_AVG_PER_CAPITA) return { label: 'Good', color: 'text-green-600', message: 'Below or at India average (1.6 tCO₂e/year)' };
    if (perPersonYearly <= GLOBAL_AVG_PER_CAPITA) return { label: 'Average', color: 'text-amber-600', message: 'Above India average but below global average (4.0 tCO₂e/year)' };
    return { label: 'High', color: 'text-red-600', message: 'Above global average. Consider reducing your footprint.' };
  };

  const comparison = getComparisonLevel();

  const InputField = ({
    label,
    unit,
    hint,
    value,
    onChange,
    icon: Icon,
  }: {
    label: string;
    unit: string;
    hint: string;
    value: string;
    onChange: (val: string) => void;
    icon: typeof Zap;
  }) => (
    <div className="flex items-start gap-3 py-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mt-0.5 flex-shrink-0">
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <span className="text-xs text-gray-400 whitespace-nowrap min-w-[80px]">{unit}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Carbon Footprint Calculator
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculate your Carbon Footprint</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            Based on the methodology by Climate Change Department, Government of Gujarat.
            Enter your monthly consumption to estimate your carbon footprint.
          </p>
        </div>

        {/* Household Members */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Household Members</p>
                <p className="text-xs text-gray-400">Number of people in your home</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHouseholdMembers(String(Math.max(1, members - 1)))}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={householdMembers}
                onChange={e => setHouseholdMembers(e.target.value)}
                className="w-14 text-center py-1.5 border border-gray-200 rounded-xl text-lg font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setHouseholdMembers(String(Math.min(20, members + 1)))}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ─── HOUSEHOLD SECTION ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5 text-white" />
              <div>
                <h2 className="text-white font-bold text-lg">Household</h2>
                <p className="text-emerald-100 text-xs">Monthly energy consumption at home</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-1 divide-y divide-gray-50">
            <InputField
              label="Electricity"
              unit="Units / Month"
              hint="Enter units from your last month's electricity bill (in kWh)"
              value={household.electricity}
              onChange={val => setHousehold(prev => ({ ...prev, electricity: val }))}
              icon={Zap}
            />
            <InputField
              label="LPG"
              unit="Cylinders / Month"
              hint="Number of LPG cylinders consumed last month (cooking)"
              value={household.lpg}
              onChange={val => setHousehold(prev => ({ ...prev, lpg: val }))}
              icon={Fuel}
            />
            <InputField
              label="Coal"
              unit="Kg / Month"
              hint="Weight of coal used for domestic purposes (cooking or heating)"
              value={household.coal}
              onChange={val => setHousehold(prev => ({ ...prev, coal: val }))}
              icon={Fuel}
            />
            <InputField
              label="Firewood"
              unit="Kg / Month"
              hint="Weight of firewood used for cooking or heating"
              value={household.wood}
              onChange={val => setHousehold(prev => ({ ...prev, wood: val }))}
              icon={TreePine}
            />
          </div>

          {/* Household Subtotal */}
          <div className="px-5 py-4 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800">Household Footprint</span>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-700">{householdFootprint.toFixed(1)} <span className="text-xs font-normal">kg CO₂e/month</span></p>
              <p className="text-xs text-emerald-600">{(householdFootprint / 1000).toFixed(3)} tCO₂e/month</p>
            </div>
          </div>
        </div>

        {/* ─── TRANSPORTATION SECTION ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-white" />
              <div>
                <h2 className="text-white font-bold text-lg">Transportation</h2>
                <p className="text-sky-100 text-xs">Monthly fuel consumption & travel</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-1 divide-y divide-gray-50">
            <InputField
              label="Petrol"
              unit="Litres / Month"
              hint="Quantity of petrol consumed by your vehicle(s)"
              value={transport.petrol}
              onChange={val => setTransport(prev => ({ ...prev, petrol: val }))}
              icon={Fuel}
            />
            <InputField
              label="Diesel"
              unit="Litres / Month"
              hint="Quantity of diesel consumed by your vehicle(s)"
              value={transport.diesel}
              onChange={val => setTransport(prev => ({ ...prev, diesel: val }))}
              icon={Fuel}
            />
            <InputField
              label="CNG"
              unit="Kg / Month"
              hint="Quantity of CNG consumed by your vehicle(s)"
              value={transport.cng}
              onChange={val => setTransport(prev => ({ ...prev, cng: val }))}
              icon={Fuel}
            />
            <InputField
              label="Auto LPG"
              unit="Kg / Month"
              hint="Quantity of auto LPG consumed by your vehicle(s)"
              value={transport.autoLpg}
              onChange={val => setTransport(prev => ({ ...prev, autoLpg: val }))}
              icon={Fuel}
            />
            <InputField
              label="Two-Wheeler"
              unit="Km / Month"
              hint="Distance travelled by two-wheeler/scooter"
              value={transport.twoWheeler}
              onChange={val => setTransport(prev => ({ ...prev, twoWheeler: val }))}
              icon={Car}
            />
            <InputField
              label="Bus"
              unit="Km / Month"
              hint="Distance travelled by bus"
              value={transport.bus}
              onChange={val => setTransport(prev => ({ ...prev, bus: val }))}
              icon={Car}
            />
            <InputField
              label="Train"
              unit="Km / Month"
              hint="Distance travelled by train"
              value={transport.train}
              onChange={val => setTransport(prev => ({ ...prev, train: val }))}
              icon={Car}
            />
            <InputField
              label="Metro"
              unit="Km / Month"
              hint="Distance travelled by metro"
              value={transport.metro}
              onChange={val => setTransport(prev => ({ ...prev, metro: val }))}
              icon={Car}
            />
            <InputField
              label="Auto Rickshaw"
              unit="Km / Month"
              hint="Distance travelled by auto rickshaw"
              value={transport.autoRickshaw}
              onChange={val => setTransport(prev => ({ ...prev, autoRickshaw: val }))}
              icon={Car}
            />
          </div>

          {/* Transport Subtotal */}
          <div className="px-5 py-4 bg-sky-50 border-t border-sky-100 flex items-center justify-between">
            <span className="text-sm font-medium text-sky-800">Transportation Footprint</span>
            <div className="text-right">
              <p className="text-lg font-bold text-sky-700">{transportFootprint.toFixed(1)} <span className="text-xs font-normal">kg CO₂e/month</span></p>
              <p className="text-xs text-sky-600">{(transportFootprint / 1000).toFixed(3)} tCO₂e/month</p>
            </div>
          </div>
        </div>

        {/* ─── ACTION BUTTONS ──────────────────────────────────────── */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleCalculate}
            className="flex-1 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Leaf className="w-5 h-5" />
            Calculate Footprint
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-3.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* ─── RESULTS SECTION ─────────────────────────────────────── */}
        {showResults && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-5 text-center">
              <h2 className="text-white font-bold text-xl mb-1">Your Carbon Footprint</h2>
              <p className="text-emerald-100 text-sm">Based on your monthly consumption</p>
            </div>

            <div className="p-5">
              {/* Main totals grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Household (Monthly)</p>
                  <p className="text-2xl font-bold text-emerald-700">{householdFootprint.toFixed(1)}</p>
                  <p className="text-xs text-emerald-500">kg CO₂e</p>
                </div>
                <div className="bg-sky-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-sky-600 font-medium mb-1">Transport (Monthly)</p>
                  <p className="text-2xl font-bold text-sky-700">{transportFootprint.toFixed(1)}</p>
                  <p className="text-xs text-sky-500">kg CO₂e</p>
                </div>
              </div>

              {/* Total Summary Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Metric</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">kg CO₂e</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">tCO₂e</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-gray-600">Total Household (per month)</td>
                      <td className="px-4 py-3 text-right font-medium">{householdFootprint.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right font-medium">{(householdFootprint / 1000).toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-600">Total Household (per year)</td>
                      <td className="px-4 py-3 text-right font-medium">{(householdFootprint * 12).toFixed(1)}</td>
                      <td className="px-4 py-3 text-right font-medium">{((householdFootprint * 12) / 1000).toFixed(3)}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-600">Total Transport (per month)</td>
                      <td className="px-4 py-3 text-right font-medium">{transportFootprint.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right font-medium">{(transportFootprint / 1000).toFixed(3)}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-600">Total Transport (per year)</td>
                      <td className="px-4 py-3 text-right font-medium">{(transportFootprint * 12).toFixed(1)}</td>
                      <td className="px-4 py-3 text-right font-medium">{((transportFootprint * 12) / 1000).toFixed(3)}</td>
                    </tr>
                    <tr className="bg-emerald-50 font-semibold">
                      <td className="px-4 py-3 text-emerald-800">Total per Person (per month)</td>
                      <td className="px-4 py-3 text-right text-emerald-700">{perPersonMonthly.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-emerald-700">{(perPersonMonthly / 1000).toFixed(3)}</td>
                    </tr>
                    <tr className="bg-emerald-50 font-bold">
                      <td className="px-4 py-3 text-emerald-900">Total per Person (per year)</td>
                      <td className="px-4 py-3 text-right text-emerald-800">{perPersonYearly.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-emerald-800">{(perPersonYearly / 1000).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Comparison */}
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Your rating: <span className={comparison.color}>{comparison.label}</span>
                    </p>
                    <p className="text-xs text-gray-500">{comparison.message}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs text-gray-500">You</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min((perPersonYearly / (GLOBAL_AVG_PER_CAPITA * 1.5)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-20 text-right">{(perPersonYearly / 1000).toFixed(2)} t</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs text-gray-500">India avg</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${(INDIA_AVG_PER_CAPITA / (GLOBAL_AVG_PER_CAPITA * 1.5)) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-20 text-right">1.60 t</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs text-gray-500">Global avg</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${(GLOBAL_AVG_PER_CAPITA / (GLOBAL_AVG_PER_CAPITA * 1.5)) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-20 text-right">4.00 t</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual breakdown */}
              <div className="flex gap-2 h-8 rounded-xl overflow-hidden mb-2">
                {householdFootprint > 0 && (
                  <div
                    className="bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ width: `${totalMonthly > 0 ? (householdFootprint / totalMonthly) * 100 : 50}%` }}
                  >
                    Household {totalMonthly > 0 ? ((householdFootprint / totalMonthly) * 100).toFixed(0) : 0}%
                  </div>
                )}
                {transportFootprint > 0 && (
                  <div
                    className="bg-sky-500 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ width: `${totalMonthly > 0 ? (transportFootprint / totalMonthly) * 100 : 50}%` }}
                  >
                    Transport {totalMonthly > 0 ? ((transportFootprint / totalMonthly) * 100).toFixed(0) : 0}%
                  </div>
                )}
                {totalMonthly === 0 && (
                  <div className="bg-gray-200 flex-1 flex items-center justify-center text-gray-400 text-xs">
                    No data entered
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TIPS SECTION ────────────────────────────────────────── */}
        {showTips && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-gray-800">How to Reduce Your Footprint</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform`} />
            </button>
            <div className="px-5 pb-5 space-y-3">
              {[
                { tip: 'Switch to LED lights and star-rated appliances', save: 'Save up to 80% on lighting energy' },
                { tip: 'Use public transport or carpool', save: 'Reduce transport emissions by 50-90%' },
                { tip: 'Solar water heater instead of electric geyser', save: 'Save ~1,500 kWh/year' },
                { tip: 'Pressure cooker for cooking', save: 'Uses 70% less energy than open cooking' },
                { tip: 'Cycle or walk for short distances (<3 km)', save: 'Zero emissions + health benefits' },
                { tip: 'Plant trees — 1 tree absorbs ~22 kg CO₂/year', save: 'Natural carbon sequestration' },
                { tip: 'Reduce, Reuse, Recycle', save: 'Lower waste-related emissions' },
                { tip: 'Switch to induction cooktop from LPG', save: 'Up to 50% more energy efficient' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.tip}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{item.save}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-xs text-gray-500">
          <h3 className="font-semibold text-gray-700 text-sm mb-2">Legend</h3>
          <div className="space-y-1">
            <p><strong>e</strong> = Equivalent Carbon Dioxide</p>
            <p><strong>t</strong> = Tonnes</p>
            <p><strong>kg</strong> = Kilograms</p>
          </div>
          <p className="mt-3 text-gray-400 leading-relaxed">
            Carbon footprint values are approximate estimates based on standard emission factors for India (CEA 2023).
            Scope 1 (direct) and Scope 2 (purchased electricity) emissions are included. The average carbon footprint for
            people in India is about 1.6 tonnes per year, compared to the global average of 4 tonnes per year.
          </p>
          <p className="mt-2 text-gray-400">
            Reference: Climate Change Department, Government of Gujarat &bull; GHG Protocol
          </p>
        </div>

      </div>
    </div>
  );
}
