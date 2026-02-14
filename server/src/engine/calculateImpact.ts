// GreenPulse Impact Calculation Engine (Backend)
// Deterministic: same input → same output, always using factorTable

import { factorTable, getElectricityWatts, getWaterFactor, getPlasticWeight, getMaterialsFactor, getFlightFactor } from '../config/factorTable';

// ─── Core output shape ──────────────────────────────────────────────

export interface CalculatedImpact {
  co2e_kg: number;
  kwh: number;
  water_l: number;
  waste_kg: number;
  saved_co2e_kg?: number;
  confidence: number;
  explanation: string;
}

// ─── Main entry point ───────────────────────────────────────────────

export function calculateImpact(activity: {
  activity_type: string;
  subtype: string;
  quantity: number;
  unit: string;
}): CalculatedImpact {
  switch (activity.activity_type) {
    case 'electricity':
      return calculateElectricity(activity.subtype, activity.quantity);
    case 'water':
      return calculateWater(activity.subtype, activity.quantity);
    case 'waste':
      return calculateWaste(activity.subtype, activity.quantity);
    case 'materials':
      return calculateMaterials(activity.subtype, activity.quantity);
    case 'flights':
      return calculateFlight(activity.subtype, activity.quantity);
    default:
      return {
        co2e_kg: 0,
        kwh: 0,
        water_l: 0,
        waste_kg: 0,
        confidence: 0,
        explanation: `Unknown activity type: ${activity.activity_type}`
      };
  }
}

// ─── ELECTRICITY ────────────────────────────────────────────────────
// watts = factorTable.electricity[subtype]
// kwh   = (watts × hours) / 1000
// co2e  = kwh × grid_kg_per_kwh

function calculateElectricity(subtype: string, hours: number): CalculatedImpact {
  const watts = getElectricityWatts(subtype);
  const kwh = (watts * hours) / 1000;
  const co2e_kg = kwh * factorTable.electricity.grid_kg_per_kwh;

  const deviceLabel = subtype.replace(/_/g, ' ').toUpperCase();

  return {
    co2e_kg:    parseFloat(co2e_kg.toFixed(4)),
    kwh:        parseFloat(kwh.toFixed(4)),
    water_l:    0,
    waste_kg:   0,
    confidence: 0.95,
    explanation: `${deviceLabel} used for ${hours} hours consumed ${kwh.toFixed(2)} kWh and emitted ${co2e_kg.toFixed(2)} kg CO2`
  };
}

// ─── WATER ──────────────────────────────────────────────────────────
// shower → minutes × shower_l_per_min
// bucket → count   × bucket_l
// tap    → minutes × tap_l_per_min

function calculateWater(subtype: string, quantity: number): CalculatedImpact {
  let water_l = 0;
  let explanation = '';

  switch (subtype) {
    case 'shower':
      water_l = quantity * factorTable.water.shower_l_per_min;
      explanation = `Shower used ${quantity} minutes consumed ${water_l} liters water`;
      break;
    case 'bucket':
      water_l = quantity * factorTable.water.bucket_l;
      explanation = `Used ${quantity} bucket(s) consuming ${water_l} liters water`;
      break;
    case 'tap':
      water_l = quantity * factorTable.water.tap_l_per_min;
      explanation = `Tap running ${quantity} minutes consumed ${water_l} liters water`;
      break;
    default:
      water_l = quantity;
      explanation = `Water usage: ${quantity} liters`;
  }

  return {
    co2e_kg:    0,
    kwh:        0,
    water_l:    parseFloat(water_l.toFixed(2)),
    waste_kg:   0,
    confidence: 0.9,
    explanation
  };
}

// ─── WASTE (PLASTIC) ────────────────────────────────────────────────
// waste_kg = factorTable.plastic[subtype] × quantity
// co2e_kg  = waste_kg × 2.5

function calculateWaste(subtype: string, quantity: number): CalculatedImpact {
  const perItemKg = getPlasticWeight(subtype);
  const waste_kg = perItemKg * quantity;
  const co2e_kg = waste_kg * 2.5;

  const itemLabel = subtype.replace(/_/g, ' ');

  return {
    co2e_kg:    parseFloat(co2e_kg.toFixed(4)),
    kwh:        0,
    water_l:    0,
    waste_kg:   parseFloat(waste_kg.toFixed(4)),
    confidence: 0.85,
    explanation: `Disposed ${quantity} ${itemLabel}(s) generating ${waste_kg.toFixed(4)} kg plastic waste`
  };
}

// ─── MATERIALS ──────────────────────────────────────────────────────
// used_plastic_item  → impact = quantity × plastic_item_impact_kg
// used_reusable_item → saved  = quantity × reusable_item_saved_kg

function calculateMaterials(subtype: string, quantity: number): CalculatedImpact {
  if (subtype === 'used_plastic_item') {
    const impact = quantity * factorTable.materials.plastic_item_impact_kg;
    return {
      co2e_kg:    parseFloat(impact.toFixed(4)),
      kwh:        0,
      water_l:    0,
      waste_kg:   0,
      confidence: 0.9,
      explanation: `Used ${quantity} plastic item(s) with impact of ${impact.toFixed(4)} kg CO2`
    };
  }

  if (subtype === 'used_reusable_item') {
    const saved = quantity * factorTable.materials.reusable_item_saved_kg;
    return {
      co2e_kg:       0,
      kwh:           0,
      water_l:       0,
      waste_kg:      0,
      saved_co2e_kg: parseFloat(saved.toFixed(4)),
      confidence:    0.9,
      explanation:   `Used reusable item(s) ${quantity} time(s) saved ${saved.toFixed(4)} kg CO2`
    };
  }

  return {
    co2e_kg: 0, kwh: 0, water_l: 0, waste_kg: 0,
    confidence: 0,
    explanation: `Unknown materials subtype: ${subtype}`
  };
}

// ─── FLIGHTS ────────────────────────────────────────────────────────
// co2e_kg = distance_km × factor_per_km (per passenger)
// Factors include radiative forcing multiplier for high-altitude emissions

function calculateFlight(subtype: string, distanceKm: number): CalculatedImpact {
  const factor = getFlightFactor(subtype);
  const co2e_kg = distanceKm * factor;

  const label = subtype.replace(/_/g, ' ');

  return {
    co2e_kg:    parseFloat(co2e_kg.toFixed(4)),
    kwh:        0,
    water_l:    0,
    waste_kg:   0,
    confidence: 0.8,
    explanation: `Flight (${label}): ${distanceKm} km × ${factor} kg CO₂e/km = ${co2e_kg.toFixed(2)} kg CO₂e`
  };
}
