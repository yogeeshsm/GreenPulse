import type { 
  DaySession, 
  ActivityLog, 
  MicroMove, 
  WeeklyInsight, 
  TransportOption, 
  FoodOption, 
  EnergyDevice,
  WasteAction,
  Goal
} from '@/types';

export const mockDaySession: DaySession = {
  id: 'ds-001',
  userId: 'user-001',
  date: new Date().toISOString().split('T')[0],
  wakeTime: '07:00',
  sleepTime: '23:00',
  dailyScore: 78,
  totals: {
    co2eKg: 1.37,       // Metro 0.42 + Veg 0.70 + Laptop 0.252 = 1.372
    avoidedCo2eKg: 3.59, // Metro vs car 1.74 + Veg vs chicken 1.80 + Refill 0.05
    kwh: 0.36,           // Laptop 6hr × 60W = 0.36 kWh
    waterLiters: 54,     // Shower 6min × 9L = 54L
    waterSavedLiters: 36, // (10min baseline - 6min) × 9L = 36L
    wasteKg: 0,          // No plastic waste logged yet
    wasteDiverted: 2,    // 2 recycled items
    greenPoints: 245
  },
  goals: [
    { id: 'g1', text: 'Use public transport', completed: true, category: 'transport' },
    { id: 'g2', text: 'Take shorter showers', completed: true, category: 'water' },
    { id: 'g3', text: 'Eat vegetarian', completed: false, category: 'food' }
  ],
  streakDays: 5
};

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'al-001',
    userId: 'user-001',
    daySessionId: 'ds-001',
    timestamp: new Date('2026-02-14T07:30:00'),
    activityType: 'transport',
    subtype: 'metro',
    quantity: 12,
    unit: 'km',
    metadata: { confidence: 0.9, source: 'manual' },
    calculatedImpact: {
      co2eKg: 0.42,
      avoidedCo2eKg: 1.74,
      confidence: 0.9,
      explanation: 'Metro: 12 km × 35 gCO₂e/km = 0.42 kg CO₂e | Avoided 1.74 kg CO₂e vs driving'
    }
  },
  {
    id: 'al-002',
    userId: 'user-001',
    daySessionId: 'ds-001',
    timestamp: new Date('2026-02-14T08:00:00'),
    activityType: 'water',
    subtype: 'shower',
    quantity: 6,
    unit: 'minutes',
    metadata: { confidence: 0.8, source: 'manual' },
    calculatedImpact: {
      waterLiters: 54,
      waterSavedLiters: 36,
      confidence: 0.8,
      explanation: 'Shower: 6 min × 9 L/min = 54 L | Saved 36 L vs 10-min shower'
    }
  },
  {
    id: 'al-003',
    userId: 'user-001',
    daySessionId: 'ds-001',
    timestamp: new Date('2026-02-14T13:00:00'),
    activityType: 'food',
    subtype: 'veg',
    quantity: 1,
    unit: 'serving',
    metadata: { confidence: 0.85, source: 'manual' },
    calculatedImpact: {
      co2eKg: 0.7,
      avoidedCo2eKg: 1.8,
      confidence: 0.85,
      explanation: 'Veg meal: 1 serving × 0.7 kgCO₂e = 0.7 kg CO₂e | Avoided 1.80 kg CO₂e vs non-veg'
    }
  },
  {
    id: 'al-004',
    userId: 'user-001',
    daySessionId: 'ds-001',
    timestamp: new Date('2026-02-14T09:00:00'),
    activityType: 'energy',
    subtype: 'laptop',
    quantity: 6,
    unit: 'hours',
    metadata: { confidence: 0.9, source: 'estimated' },
    calculatedImpact: {
      co2eKg: 0.252,
      kwh: 0.36,
      confidence: 0.9,
      explanation: 'Laptop: 6 hr × 60W = 0.36 kWh × 0.7 = 0.252 kg CO₂e'
    }
  },
  {
    id: 'al-005',
    userId: 'user-001',
    daySessionId: 'ds-001',
    timestamp: new Date('2026-02-14T14:00:00'),
    activityType: 'waste',
    subtype: 'recycle',
    quantity: 2,
    unit: 'items',
    metadata: { confidence: 0.95, source: 'manual' },
    calculatedImpact: {
      avoidedCo2eKg: 0.16,
      wasteDiverted: 2,
      confidence: 0.95,
      explanation: 'recycle: 2 items | Avoided ~0.16 kg CO₂e'
    }
  },
  {
    id: 'al-006',
    userId: 'user-001',
    daySessionId: 'ds-001',
    timestamp: new Date('2026-02-14T19:00:00'),
    activityType: 'micro_action',
    subtype: 'refill_bottle',
    quantity: 1,
    unit: 'action',
    metadata: { confidence: 1, source: 'manual' },
    calculatedImpact: {
      avoidedCo2eKg: 0.05,
      confidence: 1,
      explanation: 'Refilled bottle: avoided single-use plastic'
    }
  }
];

export const microMoves: MicroMove[] = [
  { id: 'mm1', icon: 'Droplets', title: 'Refill bottle', description: 'Used reusable water bottle', points: 15, avoidedCo2eKg: 0.05, category: 'waste' },
  { id: 'mm2', icon: 'ShoppingBag', title: 'Cloth bag', description: 'Carried reusable bag', points: 10, avoidedCo2eKg: 0.03, category: 'waste' },
  { id: 'mm3', icon: 'Leaf', title: 'Composted', description: 'Composted organic waste', points: 25, avoidedCo2eKg: 0.1, category: 'waste' },
  { id: 'mm4', icon: 'UtensilsCrossed', title: 'No cutlery', description: 'Refused disposable cutlery', points: 10, avoidedCo2eKg: 0.02, category: 'waste' },
  { id: 'mm5', icon: 'Bike', title: 'Cycled', description: 'Cycled instead of driving', points: 30, avoidedCo2eKg: 0.5, category: 'transport' },
  { id: 'mm6', icon: 'Zap', title: 'Turned off', description: 'Switched off unused lights', points: 5, avoidedCo2eKg: 0.02, category: 'energy' },
  { id: 'mm7', icon: 'Thermometer', title: 'AC +1°C', description: 'Raised AC temperature', points: 20, avoidedCo2eKg: 0.15, category: 'energy' },
  { id: 'mm8', icon: 'Recycle', title: 'Recycled', description: 'Recycled paper/plastic', points: 15, avoidedCo2eKg: 0.08, category: 'waste' }
];

export const transportOptions: TransportOption[] = [
  { mode: 'walk', icon: 'Footprints', gCo2ePerKm: 0, label: 'Walk' },
  { mode: 'cycle', icon: 'Bike', gCo2ePerKm: 0, label: 'Cycle' },
  { mode: 'metro', icon: 'Train', gCo2ePerKm: 35, label: 'Metro' },
  { mode: 'bus', icon: 'Bus', gCo2ePerKm: 80, label: 'Bus' },
  { mode: 'local_train', icon: 'Train', gCo2ePerKm: 25, label: 'Local Train' },
  { mode: 'car_solo', icon: 'Car', gCo2ePerKm: 180, label: 'Car (Solo)' },
  { mode: 'carpool', icon: 'Users', gCo2ePerKm: 90, label: 'Carpool' }
];

export const foodOptions: FoodOption[] = [
  { type: 'veg', icon: 'Salad', kgCo2ePerServing: 0.7, label: 'Vegetarian' },
  { type: 'egg', icon: 'Egg', kgCo2ePerServing: 1.0, label: 'With Eggs' },
  { type: 'chicken', icon: 'Drumstick', kgCo2ePerServing: 2.5, label: 'Chicken' },
  { type: 'mutton', icon: 'Beef', kgCo2ePerServing: 5.0, label: 'Mutton/Beef' },
  { type: 'fish', icon: 'Fish', kgCo2ePerServing: 2.0, label: 'Fish' }
];

export const energyDevices: EnergyDevice[] = [
  { name: 'fan', watts: 60, icon: 'Wind', category: 'cooling' },
  { name: 'led_bulb', watts: 10, icon: 'Lightbulb', category: 'lighting' },
  { name: 'geyser', watts: 2000, icon: 'Flame', category: 'appliance' },
  { name: 'ac', watts: 1500, icon: 'Snowflake', category: 'cooling' },
  { name: 'laptop', watts: 60, icon: 'Laptop', category: 'electronics' },
  { name: 'tv', watts: 100, icon: 'Tv', category: 'electronics' },
  { name: 'wifi', watts: 15, icon: 'Wifi', category: 'electronics' },
  { name: 'microwave', watts: 1200, icon: 'Microwave', category: 'appliance' }
];

export const wasteActions: WasteAction[] = [
  { type: 'recycle', icon: 'Recycle', label: 'Recycled items', points: 15 },
  { type: 'compost', icon: 'Leaf', label: 'Composted waste', points: 25 },
  { type: 'refuse', icon: 'Ban', label: 'Refused plastic', points: 10 },
  { type: 'reuse', icon: 'RefreshCw', label: 'Reused container', points: 15 },
  { type: 'donate', icon: 'Gift', label: 'Donated items', points: 20 }
];

export const defaultGoals: Goal[] = [
  { id: 'dg1', text: 'Use public transport', completed: false, category: 'transport' },
  { id: 'dg2', text: 'Take 5-min shower', completed: false, category: 'water' },
  { id: 'dg3', text: 'Eat vegetarian', completed: false, category: 'food' },
  { id: 'dg4', text: 'Carry reusable bag', completed: false, category: 'waste' },
  { id: 'dg5', text: 'Switch off unused lights', completed: false, category: 'energy' },
  { id: 'dg6', text: 'Refuse plastic cutlery', completed: false, category: 'waste' }
];

export const mockWeeklyInsight: WeeklyInsight = {
  weekStart: '2026-02-08',
  weekEnd: '2026-02-14',
  totalCo2eKg: 5.6,
  totalAvoidedCo2eKg: 8.4,
  totalKwh: 8.4,
  totalWaterLiters: 294,
  totalWasteDiverted: 21,
  averageDailyScore: 72,
  topDrivers: [
    { category: 'transport', impact: 2.8, percentage: 50 },
    { category: 'energy', impact: 1.68, percentage: 30 },
    { category: 'food', impact: 1.12, percentage: 20 }
  ],
  suggestedSwaps: [
    { from: '10-min shower', to: '5-min shower', potentialSaving: 45, icon: 'Droplets' },
    { from: 'Cab ride', to: 'Metro + walk', potentialSaving: 1.8, icon: 'Train' },
    { from: 'AC at 22°C', to: 'AC at 24°C', potentialSaving: 0.3, icon: 'Thermometer' }
  ],
  trend: [
    { date: '2026-02-08', co2eKg: 1.2, score: 65 },
    { date: '2026-02-09', co2eKg: 0.9, score: 70 },
    { date: '2026-02-10', co2eKg: 1.0, score: 68 },
    { date: '2026-02-11', co2eKg: 0.7, score: 75 },
    { date: '2026-02-12', co2eKg: 0.8, score: 72 },
    { date: '2026-02-13', co2eKg: 0.6, score: 78 },
    { date: '2026-02-14', co2eKg: 0.8, score: 78 }
  ]
};

// Extended weekly trend with category breakdown
export const mockWeeklyTrendDetailed = [
  { date: '2026-02-08', transport: 0.5, energy: 0.4, food: 0.3, water: 0.0, waste: 0.0 },
  { date: '2026-02-09', transport: 0.4, energy: 0.3, food: 0.2, water: 0.0, waste: 0.0 },
  { date: '2026-02-10', transport: 0.5, energy: 0.3, food: 0.2, water: 0.0, waste: 0.0 },
  { date: '2026-02-11', transport: 0.3, energy: 0.2, food: 0.2, water: 0.0, waste: 0.0 },
  { date: '2026-02-12', transport: 0.4, energy: 0.2, food: 0.2, water: 0.0, waste: 0.0 },
  { date: '2026-02-13', transport: 0.3, energy: 0.2, food: 0.1, water: 0.0, waste: 0.0 },
  { date: '2026-02-14', transport: 0.4, energy: 0.2, food: 0.2, water: 0.0, waste: 0.0 },
];

// Monthly comparison data for visualizations
export const mockMonthlyComparison = [
  { month: 'Jan', co2eKg: 28.5, score: 68, activities: 124 },
  { month: 'Feb', co2eKg: 19.2, score: 78, activities: 145 },
];

// Factor table for calculations
export const emissionFactors = {
  transport: {
    walk: 0,
    cycle: 0,
    metro: 35,
    bus: 80,
    local_train: 25,
    car_solo: 180,
    cab_solo: 200,
    carpool: 90
  },
  electricity: {
    gridKgPerKwh: 0.7
  },
  water: {
    showerLitersPerMin: 9,
    bucketLiters: 15
  },
  food: {
    veg: 0.7,
    egg: 1.0,
    chicken: 2.5,
    mutton: 5.0,
    fish: 2.0
  }
};
