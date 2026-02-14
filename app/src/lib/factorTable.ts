// GreenPulse Factor Table v1.0 (MVP Demo)
// All values are illustrative for hackathon demonstration

export interface EmissionFactor {
  value: number;
  unit: string;
  confidence: number;
  region: string;
}

export const FACTOR_VERSION = 'v1.0';
export const GRID_KG_PER_KWH = 0.7; // India-average placeholder

// Transport emissions (gCO₂e per km)
export const transportFactors: Record<string, EmissionFactor> = {
  walk: { value: 0, unit: 'gCO2e/km', confidence: 1.0, region: 'India' },
  cycle: { value: 0, unit: 'gCO2e/km', confidence: 1.0, region: 'India' },
  metro: { value: 35, unit: 'gCO2e/km', confidence: 0.9, region: 'India' },
  bus: { value: 80, unit: 'gCO2e/km', confidence: 0.85, region: 'India' },
  local_train: { value: 25, unit: 'gCO2e/km', confidence: 0.9, region: 'India' },
  car_solo: { value: 180, unit: 'gCO2e/km', confidence: 0.85, region: 'India' },
  cab_solo: { value: 200, unit: 'gCO2e/km', confidence: 0.8, region: 'India' },
  carpool: { value: 90, unit: 'gCO2e/km', confidence: 0.85, region: 'India' },
  bike: { value: 100, unit: 'gCO2e/km', confidence: 0.85, region: 'India' },
  auto: { value: 120, unit: 'gCO2e/km', confidence: 0.8, region: 'India' }
};

// Energy device power consumption (watts)
export const energyDeviceWatts: Record<string, number> = {
  fan: 60,
  led_bulb: 10,
  cfl_bulb: 20,
  incandescent_bulb: 60,
  geyser: 2000,
  ac: 1500,
  ac_inverter: 1000,
  laptop: 60,
  desktop: 200,
  tv: 100,
  tv_led: 80,
  tv_old: 150,
  wifi_router: 15,
  microwave: 1200,
  induction_cooktop: 2000,
  kettle: 1500,
  refrigerator: 150,
  washing_machine: 500,
  iron: 1000,
  hair_dryer: 1500,
  vacuum_cleaner: 1400
};

// Water consumption (liters)
export const waterFactors = {
  showerLitersPerMin: 9,
  bucketBathLiters: 15,
  tapRunningLitersPerMin: 6,
  washingMachineLiters: 50,
  dishwasherLiters: 15,
  toiletFlushLiters: 6,
  carWashLiters: 150,
  gardenWateringPerMin: 20
};

// Food emissions (kgCO₂e per serving)
export const foodFactors: Record<string, EmissionFactor> = {
  veg: { value: 0.7, unit: 'kgCO2e/serving', confidence: 0.85, region: 'India' },
  egg: { value: 1.0, unit: 'kgCO2e/serving', confidence: 0.85, region: 'India' },
  chicken: { value: 2.5, unit: 'kgCO2e/serving', confidence: 0.8, region: 'India' },
  mutton: { value: 5.0, unit: 'kgCO2e/serving', confidence: 0.75, region: 'India' },
  beef: { value: 5.5, unit: 'kgCO2e/serving', confidence: 0.75, region: 'India' },
  fish: { value: 2.0, unit: 'kgCO2e/serving', confidence: 0.8, region: 'India' },
  dairy_high: { value: 0.5, unit: 'kgCO2e/serving', confidence: 0.8, region: 'India' },
  dairy_low: { value: 0.2, unit: 'kgCO2e/serving', confidence: 0.8, region: 'India' },
  vegan: { value: 0.5, unit: 'kgCO2e/serving', confidence: 0.85, region: 'India' }
};

// Waste action impact (behavior points + avoided emissions proxy)
export const wasteActionImpact = {
  compost: { points: 25, avoidedCo2eKg: 0.1, confidence: 0.7 },
  recycle: { points: 15, avoidedCo2eKg: 0.08, confidence: 0.75 },
  refuse: { points: 10, avoidedCo2eKg: 0.02, confidence: 0.9 },
  refuse_plastic: { points: 10, avoidedCo2eKg: 0.02, confidence: 0.9 },
  reuse: { points: 15, avoidedCo2eKg: 0.05, confidence: 0.8 },
  reuse_container: { points: 15, avoidedCo2eKg: 0.05, confidence: 0.8 },
  donate: { points: 20, avoidedCo2eKg: 0.15, confidence: 0.7 },
  refill_bottle: { points: 10, avoidedCo2eKg: 0.05, confidence: 0.9 },
  cloth_bag: { points: 10, avoidedCo2eKg: 0.03, confidence: 0.85 },
  no_cutlery: { points: 10, avoidedCo2eKg: 0.02, confidence: 0.9 }
};

// Packaging/shopping emissions proxy (kgCO₂e per item)
export const shoppingFactors = {
  fast_fashion: 6.0,
  thrift_purchase: 0.5,
  online_delivery: 0.8,
  local_purchase: 0.2,
  packaged_product: 0.3,
  fresh_product: 0.05
};

// Baseline assumptions for avoided emissions calculations
export const baselineAssumptions = {
  defaultCommute: {
    mode: 'car_solo' as const,
    distanceKm: 10
  },
  defaultShower: {
    durationMin: 10
  },
  defaultMeal: {
    type: 'chicken' as const
  }
};

// ─── Plastic waste factors (kg per item) — per spec ─────────────────
export const plasticFactors = {
  plastic_bottle: 0.02,
  plastic_bag: 0.005,
  plastic_container: 0.03
};

// ─── Materials impact factors (kg CO₂e) — per spec ─────────────────
export const materialsFactors = {
  plastic_item_impact_kg: 0.05,
  reusable_item_saved_kg: 0.04
};

// Plastic waste CO₂e multiplier (per spec: waste_kg × 2.5)
export const PLASTIC_CO2E_MULTIPLIER = 2.5;

// ─── Flight emission factors (kg CO₂e per passenger-km) ────────────
export const flightFactors: Record<string, number> = {
  domestic_economy: 0.255,
  domestic_business: 0.382,
  short_haul_economy: 0.156,
  short_haul_business: 0.234,
  long_haul_economy: 0.150,
  long_haul_business: 0.430,
  long_haul_first: 0.600
};

export function getFlightFactor(subtype: string): number {
  return flightFactors[subtype] || 0;
}

export function getTransportFactor(mode: string): number {
  return transportFactors[mode]?.value || 0;
}

export function getEnergyDeviceWatts(device: string): number {
  return energyDeviceWatts[device] || 0;
}

export function getFoodFactor(type: string): number {
  return foodFactors[type]?.value || 0;
}

export function getWasteActionImpact(action: string) {
  return wasteActionImpact[action as keyof typeof wasteActionImpact] || { points: 0, avoidedCo2eKg: 0, confidence: 0.5 };
}
