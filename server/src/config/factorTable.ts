// GreenPulse Factor Table — Exact spec values
// All calculations MUST use this table. No magic numbers allowed.

export const factorTable = {
  electricity: {
    grid_kg_per_kwh: 0.7,
    fan: 60,           // watts
    led_bulb: 10,      // watts
    laptop: 60,        // watts
    ac: 1500,          // watts
    geyser: 2000       // watts
  },

  water: {
    shower_l_per_min: 9,
    bucket_l: 15,
    tap_l_per_min: 6
  },

  plastic: {
    plastic_bottle_kg: 0.02,
    plastic_bag_kg: 0.005,
    plastic_container_kg: 0.03
  },

  materials: {
    plastic_item_impact_kg: 0.05,
    reusable_item_saved_kg: 0.04
  },

  flights: {
    // kg CO₂e per passenger-km (includes radiative forcing multiplier)
    domestic_economy: 0.255,
    domestic_business: 0.382,
    short_haul_economy: 0.156,
    short_haul_business: 0.234,
    long_haul_economy: 0.150,
    long_haul_business: 0.430,
    long_haul_first: 0.600
  }
} as const;

// Type-safe accessor helpers
export function getElectricityWatts(subtype: string): number {
  const key = subtype as keyof typeof factorTable.electricity;
  if (key === 'grid_kg_per_kwh') return 0;
  return (factorTable.electricity[key] as number) || 0;
}

export function getWaterFactor(subtype: string): number {
  switch (subtype) {
    case 'shower': return factorTable.water.shower_l_per_min;
    case 'bucket': return factorTable.water.bucket_l;
    case 'tap':    return factorTable.water.tap_l_per_min;
    default:       return 0;
  }
}

export function getPlasticWeight(subtype: string): number {
  const key = (subtype + '_kg') as keyof typeof factorTable.plastic;
  return (factorTable.plastic[key] as number) || 0;
}

export function getMaterialsFactor(subtype: string): number {
  if (subtype === 'used_plastic_item')   return factorTable.materials.plastic_item_impact_kg;
  if (subtype === 'used_reusable_item')  return factorTable.materials.reusable_item_saved_kg;
  return 0;
}

export function getFlightFactor(subtype: string): number {
  const key = subtype as keyof typeof factorTable.flights;
  return (factorTable.flights[key] as number) || 0;
}
