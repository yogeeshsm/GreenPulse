import { useState } from 'react';
import {
  Zap, Flame, Fuel, Car, Plane, Bus, Wallet,
  BarChart3, HelpCircle, TreePine, Building2,
  ChevronUp, ChevronDown, ArrowLeft, Leaf
} from 'lucide-react';
import { StepWizard } from './StepWizard';
import { ResultsTable, type FootprintEntry } from './ResultsTable';
import { CategoryForm, type CategoryConfig } from './CategoryForm';

// ─── Category Definitions ───────────────────────────────────────────
const INPUT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'electricity',
    label: 'Electricity',
    icon: Zap,
    fields: [
      {
        name: 'country',
        label: 'Your Country',
        type: 'select',
        options: [
          { value: 'india', label: 'India' },
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'germany', label: 'Germany' },
          { value: 'australia', label: 'Australia' },
          { value: 'canada', label: 'Canada' },
          { value: 'china', label: 'China' },
          { value: 'japan', label: 'Japan' },
        ],
        placeholder: 'Your Country',
      },
      {
        name: 'renewable',
        label: "Do you know your energy provider's emissions per kWh or are you on a renewable tariff?",
        type: 'select',
        options: [
          { value: 'no', label: 'No' },
          { value: 'yes_renewable', label: 'Yes - Renewable tariff' },
          { value: 'yes_known', label: 'Yes - I know my provider emissions' },
        ],
        placeholder: 'No',
      },
      { name: 'usage_kwh', label: 'Usage in kWh', type: 'number', placeholder: 'Enter kWh' },
    ],
    instructions: 'Enter the amount of household electricity and then press the Calculate button.',
    emissionFactor: 0.0007, // tCO₂e per kWh (India avg)
    unit: 'kWh',
    detailTemplate: (vals: Record<string, string>) => `${vals.usage_kwh || 0} kWh electricity${vals.country ? ` (${vals.country})` : ''}`,
  },
  {
    id: 'natural_gas',
    label: 'Natural Gas',
    icon: Flame,
    fields: [
      {
        name: 'country',
        label: 'Your Country',
        type: 'select',
        options: [
          { value: 'india', label: 'India' },
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'germany', label: 'Germany' },
        ],
        placeholder: 'Your Country',
      },
      {
        name: 'unit_type',
        label: 'Unit',
        type: 'select',
        options: [
          { value: 'kwh', label: 'kWh' },
          { value: 'therms', label: 'Therms' },
          { value: 'cubic_meters', label: 'Cubic Meters' },
        ],
        placeholder: 'kWh',
      },
      { name: 'usage', label: 'Usage', type: 'number', placeholder: 'Enter amount' },
    ],
    instructions: 'Enter the amount of natural gas used and then press the Calculate button.',
    emissionFactor: 0.000184, // tCO₂e per kWh of natural gas
    unit: 'kWh',
    detailTemplate: (vals: Record<string, string>) => `${vals.usage || 0} ${vals.unit_type || 'kWh'} natural gas`,
  },
  {
    id: 'fuel',
    label: 'Fuel',
    icon: Fuel,
    fields: [
      {
        name: 'fuel_type',
        label: 'Fuel Type',
        type: 'select',
        options: [
          { value: 'petrol', label: 'Petrol' },
          { value: 'diesel', label: 'Diesel' },
          { value: 'lpg', label: 'LPG' },
          { value: 'kerosene', label: 'Kerosene' },
        ],
        placeholder: 'Select fuel type',
      },
      { name: 'litres', label: 'Amount in Litres', type: 'number', placeholder: 'Enter litres' },
    ],
    instructions: 'Enter the amount of fuel consumed and then press the Calculate button.',
    emissionFactor: 0.002315, // tCO₂e per litre petrol
    unit: 'litres',
    detailTemplate: (vals: Record<string, string>) => `${vals.litres || 0}L ${vals.fuel_type || 'petrol'}`,
  },
  {
    id: 'cars',
    label: 'Cars',
    icon: Car,
    fields: [
      {
        name: 'vehicle_type',
        label: 'Vehicle Type',
        type: 'select',
        options: [
          { value: 'petrol_small', label: 'Petrol - Small Car' },
          { value: 'petrol_medium', label: 'Petrol - Medium Car' },
          { value: 'petrol_large', label: 'Petrol - Large/SUV' },
          { value: 'diesel_small', label: 'Diesel - Small Car' },
          { value: 'diesel_medium', label: 'Diesel - Medium Car' },
          { value: 'diesel_suv', label: 'Diesel - SUV' },
          { value: 'hybrid', label: 'Hybrid' },
          { value: 'electric', label: 'Electric Vehicle' },
          { value: 'cng', label: 'CNG' },
        ],
        placeholder: 'Select vehicle type',
      },
      { name: 'distance_km', label: 'Distance (km)', type: 'number', placeholder: 'Enter km' },
    ],
    instructions: 'Enter the distance driven and type of vehicle. Press Calculate to add to your footprint.',
    emissionFactor: 0.000180, // tCO₂e per km (medium petrol)
    unit: 'km',
    detailTemplate: (vals: Record<string, string>) => `${vals.distance_km || 0} km by ${(vals.vehicle_type || 'car').replace(/_/g, ' ')}`,
  },
  {
    id: 'flights',
    label: 'Flights',
    icon: Plane,
    fields: [
      {
        name: 'flight_type',
        label: 'Flight Type',
        type: 'select',
        options: [
          { value: 'domestic_economy', label: 'Domestic - Economy' },
          { value: 'domestic_business', label: 'Domestic - Business' },
          { value: 'short_haul_economy', label: 'Short Haul - Economy' },
          { value: 'short_haul_business', label: 'Short Haul - Business' },
          { value: 'long_haul_economy', label: 'Long Haul - Economy' },
          { value: 'long_haul_business', label: 'Long Haul - Business' },
          { value: 'long_haul_first', label: 'Long Haul - First Class' },
        ],
        placeholder: 'Select flight type',
      },
      { name: 'distance_km', label: 'Distance (km)', type: 'number', placeholder: 'Enter km (one-way)' },
      {
        name: 'return_flight',
        label: 'Return flight?',
        type: 'select',
        options: [
          { value: 'one_way', label: 'One Way' },
          { value: 'return', label: 'Return (round trip)' },
        ],
        placeholder: 'One Way',
      },
    ],
    instructions: 'Enter your flight details. For return flights, the distance will be doubled automatically.',
    emissionFactor: 0.000255, // tCO₂e per km (domestic economy default)
    unit: 'km',
    detailTemplate: (vals: Record<string, string>) => {
      const rt = vals.return_flight === 'return' ? ' (return)' : '';
      return `${vals.distance_km || 0} km ${(vals.flight_type || 'flight').replace(/_/g, ' ')}${rt}`;
    },
  },
  {
    id: 'public_transport',
    label: 'Public Transport',
    icon: Bus,
    fields: [
      {
        name: 'mode',
        label: 'Mode of Transport',
        type: 'select',
        options: [
          { value: 'metro', label: 'Metro / Subway' },
          { value: 'local_train', label: 'Local Train' },
          { value: 'bus', label: 'Bus' },
          { value: 'auto_rickshaw', label: 'Auto Rickshaw' },
          { value: 'taxi', label: 'Taxi / Cab' },
          { value: 'ferry', label: 'Ferry' },
        ],
        placeholder: 'Select mode',
      },
      { name: 'distance_km', label: 'Distance (km)', type: 'number', placeholder: 'Enter km' },
      {
        name: 'frequency',
        label: 'Frequency',
        type: 'select',
        options: [
          { value: 'one_time', label: 'One Time' },
          { value: 'daily', label: 'Daily (weekdays)' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ],
        placeholder: 'One Time',
      },
    ],
    instructions: 'Enter your public transport usage and press Calculate to add to your footprint.',
    emissionFactor: 0.000035, // tCO₂e per km (metro)
    unit: 'km',
    detailTemplate: (vals: Record<string, string>) => `${vals.distance_km || 0} km by ${(vals.mode || 'public transport').replace(/_/g, ' ')}`,
  },
  {
    id: 'spend',
    label: 'Spend',
    icon: Wallet,
    fields: [
      {
        name: 'spend_category',
        label: 'Spending Category',
        type: 'select',
        options: [
          { value: 'food_drink', label: 'Food & Drink' },
          { value: 'clothing', label: 'Clothing & Textiles' },
          { value: 'electronics', label: 'Electronics' },
          { value: 'furniture', label: 'Furniture & Household' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'education', label: 'Education' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'services', label: 'Services' },
          { value: 'other', label: 'Other' },
        ],
        placeholder: 'Select category',
      },
      {
        name: 'currency',
        label: 'Currency',
        type: 'select',
        options: [
          { value: 'inr', label: 'INR (₹)' },
          { value: 'usd', label: 'USD ($)' },
          { value: 'gbp', label: 'GBP (£)' },
          { value: 'eur', label: 'EUR (€)' },
        ],
        placeholder: 'INR (₹)',
      },
      { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Enter amount spent' },
    ],
    instructions: 'Enter the amount spent in a category. We estimate emissions based on average spending-based factors.',
    emissionFactor: 0.0000005, // tCO₂e per INR (rough estimate)
    unit: '₹',
    detailTemplate: (vals: Record<string, string>) => {
      const curr = vals.currency === 'usd' ? '$' : vals.currency === 'gbp' ? '£' : vals.currency === 'eur' ? '€' : '₹';
      return `${curr}${vals.amount || 0} on ${(vals.spend_category || 'general').replace(/_/g, ' ')}`;
    },
  },
];

// Emission factor lookup tables
const ELECTRICITY_FACTORS: Record<string, number> = {
  india: 0.0007, us: 0.000386, uk: 0.000233, germany: 0.000338,
  australia: 0.000656, canada: 0.000120, china: 0.000555, japan: 0.000457,
};

const FUEL_FACTORS: Record<string, number> = {
  petrol: 0.002315, diesel: 0.002689, lpg: 0.001509, kerosene: 0.002540,
};

const FLIGHT_FACTORS: Record<string, number> = {
  domestic_economy: 0.000255, domestic_business: 0.000382,
  short_haul_economy: 0.000156, short_haul_business: 0.000234,
  long_haul_economy: 0.000150, long_haul_business: 0.000430, long_haul_first: 0.000600,
};

const CAR_FACTORS: Record<string, number> = {
  petrol_small: 0.000140, petrol_medium: 0.000180, petrol_large: 0.000250,
  diesel_small: 0.000120, diesel_medium: 0.000165, diesel_suv: 0.000220,
  hybrid: 0.000100, electric: 0.000050, cng: 0.000130,
};

const TRANSPORT_FACTORS: Record<string, number> = {
  metro: 0.000035, local_train: 0.000025, bus: 0.000080,
  auto_rickshaw: 0.000120, taxi: 0.000200, ferry: 0.000150,
};

const SPEND_FACTORS: Record<string, number> = {
  food_drink: 0.0000008, clothing: 0.0000012, electronics: 0.0000010,
  furniture: 0.0000009, healthcare: 0.0000005, education: 0.0000003,
  entertainment: 0.0000006, services: 0.0000004, other: 0.0000005,
};

function computeEmissions(categoryId: string, values: Record<string, string>): number {
  switch (categoryId) {
    case 'electricity': {
      const kwh = parseFloat(values.usage_kwh) || 0;
      const country = values.country || 'india';
      let factor = ELECTRICITY_FACTORS[country] || 0.0007;
      if (values.renewable === 'yes_renewable') factor *= 0.05;
      return kwh * factor;
    }
    case 'natural_gas': {
      let usage = parseFloat(values.usage) || 0;
      if (values.unit_type === 'therms') usage *= 29.3071; // convert therms to kWh
      if (values.unit_type === 'cubic_meters') usage *= 10.55; // convert m³ to kWh
      return usage * 0.000184;
    }
    case 'fuel': {
      const litres = parseFloat(values.litres) || 0;
      const fuelType = values.fuel_type || 'petrol';
      return litres * (FUEL_FACTORS[fuelType] || 0.002315);
    }
    case 'cars': {
      const km = parseFloat(values.distance_km) || 0;
      const vehicleType = values.vehicle_type || 'petrol_medium';
      return km * (CAR_FACTORS[vehicleType] || 0.000180);
    }
    case 'flights': {
      let km = parseFloat(values.distance_km) || 0;
      if (values.return_flight === 'return') km *= 2;
      const flightType = values.flight_type || 'domestic_economy';
      return km * (FLIGHT_FACTORS[flightType] || 0.000255);
    }
    case 'public_transport': {
      let km = parseFloat(values.distance_km) || 0;
      const mode = values.mode || 'metro';
      const freq = values.frequency || 'one_time';
      if (freq === 'daily') km *= 22;
      else if (freq === 'weekly') km *= 4;
      else if (freq === 'monthly') km *= 1;
      return km * (TRANSPORT_FACTORS[mode] || 0.000035);
    }
    case 'spend': {
      const amount = parseFloat(values.amount) || 0;
      const category = values.spend_category || 'other';
      let multiplier = 1;
      if (values.currency === 'usd') multiplier = 83;
      else if (values.currency === 'gbp') multiplier = 105;
      else if (values.currency === 'eur') multiplier = 91;
      return amount * multiplier * (SPEND_FACTORS[category] || 0.0000005);
    }
    default:
      return 0;
  }
}

// ─── Main Layout Component ──────────────────────────────────────────

interface CalculatorLayoutProps {
  onBack: () => void;
}

export function CalculatorLayout({ onBack }: CalculatorLayoutProps) {
  const [activeCategory, setActiveCategory] = useState('electricity');
  const [inputExpanded, setInputExpanded] = useState(true);
  const [entries, setEntries] = useState<FootprintEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(2); // Start at Input Data

  const activeCat = INPUT_CATEGORIES.find(c => c.id === activeCategory)!;
  const activeIdx = INPUT_CATEGORIES.findIndex(c => c.id === activeCategory);
  const prevCat = activeIdx > 0 ? INPUT_CATEGORIES[activeIdx - 1] : null;
  const nextCat = activeIdx < INPUT_CATEGORIES.length - 1 ? INPUT_CATEGORIES[activeIdx + 1] : null;

  const handleCalculate = (values: Record<string, string>, comment: string) => {
    const emissions = computeEmissions(activeCategory, values);
    const detail = activeCat.detailTemplate(values);

    const newEntry: FootprintEntry = {
      id: `entry-${Date.now()}`,
      dateAdded: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      emissionsTco2e: emissions,
      details: detail,
      comment,
      category: activeCat.label,
    };

    setEntries(prev => [newEntry, ...prev]);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const entryCounts = INPUT_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = entries.filter(e => e.category === cat.label).length;
    return acc;
  }, {} as Record<string, number>);

  // Total footprint
  const totalEmissions = entries.reduce((sum, e) => sum + e.emissionsTco2e, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ─── Sidebar ─── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">GreenPulse</h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">Calculate your emissions</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3">
          {/* Dashboard */}
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Input Section */}
          <button
            onClick={() => setInputExpanded(!inputExpanded)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Input</span>
            </div>
            {inputExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {inputExpanded && (
            <div className="ml-2">
              {INPUT_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = entryCounts[cat.id] || 0;
                const totalForCat = INPUT_CATEGORIES.find(c => c.id === cat.id)?.fields.length || 3;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentStep(2);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-2 text-sm transition-all rounded-l-lg ${
                      isActive
                        ? 'bg-green-50 text-green-700 font-semibold border-l-3 border-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <div>{cat.label}</div>
                      <div className={`text-[10px] ${isActive ? 'text-green-500' : 'text-gray-400'}`}>
                        ({count} of {totalForCat} entries)
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bottom nav */}
          <div className="mt-4 border-t border-gray-100 pt-3">
            <button
              onClick={onBack}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Results</span>
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>FAQs</span>
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <TreePine className="w-4 h-4" />
              <span>Offset</span>
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Building2 className="w-4 h-4" />
              <span>Business Calculator</span>
            </button>
          </div>
        </nav>

        {/* Footer total */}
        <div className="px-5 py-4 border-t border-gray-100 bg-green-50">
          <p className="text-xs text-gray-500">Total Footprint</p>
          <p className="text-xl font-bold text-green-700">{totalEmissions.toFixed(4)} tCO₂e</p>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* Step Wizard */}
          <StepWizard currentStep={currentStep} steps={['Select Form', 'Input Data', 'Review']} />

          {/* Category Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              {(() => {
                const Icon = activeCat.icon;
                return <Icon className="w-5 h-5 text-green-600" />;
              })()}
              <h2 className="text-xl font-bold text-gray-800">{activeCat.label}</h2>
            </div>

            {/* Instructions */}
            <div className="px-6 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Instructions</h3>
              <p className="text-sm text-green-600 italic">{activeCat.instructions}</p>
            </div>

            {/* Form */}
            <CategoryForm category={activeCat} onSubmit={handleCalculate} />
          </div>

          {/* Navigation between categories */}
          <div className="flex items-center justify-between mt-6">
            {prevCat ? (
              <button
                onClick={() => setActiveCategory(prevCat.id)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {prevCat.label}
              </button>
            ) : (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to dashboard
              </button>
            )}

            <button
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled
            >
              Calculate & add to footprint
            </button>

            {nextCat ? (
              <button
                onClick={() => setActiveCategory(nextCat.id)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Next to {nextCat.label}
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Results Table */}
          <ResultsTable
            entries={entries}
            categoryLabel={activeCat.label}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
