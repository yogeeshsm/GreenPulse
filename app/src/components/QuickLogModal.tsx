import { useState } from 'react';
import { X, Train, Bus, Bike, Car, Users, Footprints, Wind, Lightbulb, Flame, Snowflake, Laptop, Tv, Wifi, Microwave, Droplets, Salad, Egg, Drumstick, Beef, Fish, Recycle, Leaf, Ban, RefreshCw, Gift, ShoppingBag, Package, Store, Cylinder, ShoppingCart, Repeat, Plane, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import type { ActivityLog, TransportOption, FoodOption, EnergyDevice, WasteAction } from '@/types';
import { calculateImpact } from '@/lib/impactEngine';

interface QuickLogModalProps {
  isOpen: boolean;
  category: string | null;
  onClose: () => void;
  onLog: (activity: Partial<ActivityLog>) => void;
}

const transportOptions: TransportOption[] = [
  { mode: 'walk', icon: 'Footprints', gCo2ePerKm: 0, label: 'Walk' },
  { mode: 'cycle', icon: 'Bike', gCo2ePerKm: 0, label: 'Cycle' },
  { mode: 'metro', icon: 'Train', gCo2ePerKm: 35, label: 'Metro' },
  { mode: 'bus', icon: 'Bus', gCo2ePerKm: 80, label: 'Bus' },
  { mode: 'local_train', icon: 'Train', gCo2ePerKm: 25, label: 'Local Train' },
  { mode: 'car_solo', icon: 'Car', gCo2ePerKm: 180, label: 'Car (Solo)' },
  { mode: 'carpool', icon: 'Users', gCo2ePerKm: 90, label: 'Carpool' },
];

const foodOptions: FoodOption[] = [
  { type: 'veg', icon: 'Salad', kgCo2ePerServing: 0.7, label: 'Vegetarian' },
  { type: 'egg', icon: 'Egg', kgCo2ePerServing: 1.0, label: 'With Eggs' },
  { type: 'chicken', icon: 'Drumstick', kgCo2ePerServing: 2.5, label: 'Chicken' },
  { type: 'mutton', icon: 'Beef', kgCo2ePerServing: 5.0, label: 'Mutton/Beef' },
  { type: 'fish', icon: 'Fish', kgCo2ePerServing: 2.0, label: 'Fish' },
];

const energyDevices: EnergyDevice[] = [
  { name: 'fan', watts: 60, icon: 'Wind', category: 'cooling' },
  { name: 'led_bulb', watts: 10, icon: 'Lightbulb', category: 'lighting' },
  { name: 'geyser', watts: 2000, icon: 'Flame', category: 'appliance' },
  { name: 'ac', watts: 1500, icon: 'Snowflake', category: 'cooling' },
  { name: 'laptop', watts: 60, icon: 'Laptop', category: 'electronics' },
  { name: 'tv', watts: 100, icon: 'Tv', category: 'electronics' },
  { name: 'wifi', watts: 15, icon: 'Wifi', category: 'electronics' },
  { name: 'microwave', watts: 1200, icon: 'Microwave', category: 'appliance' },
];

const wasteActions: WasteAction[] = [
  { type: 'recycle', icon: 'Recycle', label: 'Recycled items', points: 15 },
  { type: 'compost', icon: 'Leaf', label: 'Composted waste', points: 25 },
  { type: 'refuse', icon: 'Ban', label: 'Refused plastic', points: 10 },
  { type: 'reuse', icon: 'RefreshCw', label: 'Reused container', points: 15 },
  { type: 'donate', icon: 'Gift', label: 'Donated items', points: 20 },
  { type: 'plastic_bottle', icon: 'Cylinder', label: 'Plastic Bottle', points: 5 },
  { type: 'plastic_bag', icon: 'ShoppingBag', label: 'Plastic Bag', points: 5 },
  { type: 'plastic_container', icon: 'Package', label: 'Plastic Container', points: 5 },
];

const materialsOptions = [
  { type: 'used_plastic_item', icon: 'ShoppingCart', label: 'Plastic Item Used' },
  { type: 'used_reusable_item', icon: 'Repeat', label: 'Reusable Item Used' },
];

const flightOptions = [
  { type: 'domestic_economy', icon: 'Plane', label: 'Domestic Economy' },
  { type: 'domestic_business', icon: 'PlaneTakeoff', label: 'Domestic Business' },
  { type: 'short_haul_economy', icon: 'Plane', label: 'Short-Haul Economy' },
  { type: 'short_haul_business', icon: 'PlaneTakeoff', label: 'Short-Haul Business' },
  { type: 'long_haul_economy', icon: 'PlaneLanding', label: 'Long-Haul Economy' },
  { type: 'long_haul_business', icon: 'PlaneTakeoff', label: 'Long-Haul Business' },
  { type: 'long_haul_first', icon: 'PlaneTakeoff', label: 'Long-Haul First Class' },
];

const iconMap: Record<string, typeof Train> = {
  Footprints, Bike, Train, Bus, Car, Users,
  Wind, Lightbulb, Flame, Snowflake, Laptop, Tv, Wifi, Microwave,
  Droplets, Salad, Egg, Drumstick, Beef, Fish,
  Recycle, Leaf, Ban, RefreshCw, Gift, ShoppingBag, Package, Store,
  Cylinder, ShoppingCart, Repeat,
  Plane, PlaneTakeoff, PlaneLanding
};

export function QuickLogModal({ isOpen, category, onClose, onLog }: QuickLogModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [step, setStep] = useState<'select' | 'quantity'>('select');

  if (!isOpen || !category) return null;

  const categoryConfig: Record<string, { title: string; options: any[]; unit: string; placeholder: string }> = {
    transport: {
      title: 'Log Commute',
      options: transportOptions,
      unit: 'km',
      placeholder: 'Distance in km'
    },
    food: {
      title: 'Log Meal',
      options: foodOptions,
      unit: 'servings',
      placeholder: 'Number of servings'
    },
    energy: {
      title: 'Log Energy Use',
      options: energyDevices,
      unit: 'hours',
      placeholder: 'Hours used'
    },
    water: {
      title: 'Log Water Use',
      options: [
        { type: 'shower', icon: 'Droplets', label: 'Shower', litersPerMin: 9 },
        { type: 'bucket', icon: 'Droplets', label: 'Bucket Bath', litersPerBucket: 15 },
        { type: 'tap', icon: 'Droplets', label: 'Tap Running', litersPerMin: 6 },
      ],
      unit: 'minutes',
      placeholder: 'Duration in minutes'
    },
    waste: {
      title: 'Log Waste Action',
      options: wasteActions,
      unit: 'items',
      placeholder: 'Number of items'
    },
    shopping: {
      title: 'Log Shopping',
      options: [
        { type: 'online_delivery', icon: 'ShoppingBag', label: 'Online Delivery' },
        { type: 'packaging', icon: 'Package', label: 'Packaged Products' },
        { type: 'thrift', icon: 'RefreshCw', label: 'Thrift/Second-hand' },
        { type: 'local', icon: 'Store', label: 'Local Purchase' },
      ],
      unit: 'items',
      placeholder: 'Number of items'
    },
    materials: {
      title: 'Log Materials',
      options: materialsOptions,
      unit: 'count',
      placeholder: 'Number of items'
    },
    electricity: {
      title: 'Log Electricity',
      options: energyDevices,
      unit: 'hours',
      placeholder: 'Hours used'
    },
    flights: {
      title: 'Log Flight',
      options: flightOptions,
      unit: 'km',
      placeholder: 'Distance in km'
    }
  };

  const config = categoryConfig[category];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setStep('quantity');
  };

  const handleSubmit = () => {
    if (!selectedOption || !quantity) return;

    const parsedQuantity = parseFloat(quantity);
    const calculatedImpact = calculateImpact(
      category,
      selectedOption,
      parsedQuantity,
      config.unit
    );

    const activity: Partial<ActivityLog> = {
      activityType: category as any,
      subtype: selectedOption,
      quantity: parsedQuantity,
      unit: config.unit,
      timestamp: new Date(),
      metadata: { confidence: calculatedImpact.confidence, source: 'manual' },
      calculatedImpact
    };

    onLog(activity);
    handleClose();
  };

  const handleClose = () => {
    setSelectedOption(null);
    setQuantity('');
    setStep('select');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{config.title}</h2>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 'select' ? (
            <div className="grid grid-cols-2 gap-3">
              {config.options.map((option) => {
                const Icon = iconMap[option.icon] || Leaf;
                return (
                  <button
                    key={option.mode || option.type || option.name}
                    onClick={() => handleOptionSelect(option.mode || option.type || option.name)}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-[#22C55E]/10 hover:border-[#22C55E]/30 border border-transparent transition-all"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center">{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {config.placeholder}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={config.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all text-lg"
                  autoFocus
                  min="0"
                  step="any"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep('select'); setQuantity(''); }}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!quantity || parseFloat(quantity) <= 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Log Activity
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
