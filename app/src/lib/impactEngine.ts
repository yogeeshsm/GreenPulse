// GreenPulse Impact Calculation Engine
// Converts logged activities into emissions estimates

import type { ActivityLog, ImpactCalculation } from '@/types';
import {
  GRID_KG_PER_KWH,
  getTransportFactor,
  getEnergyDeviceWatts,
  getFoodFactor,
  getWasteActionImpact,
  waterFactors,
  baselineAssumptions,
  plasticFactors,
  materialsFactors,
  PLASTIC_CO2E_MULTIPLIER,
  getFlightFactor
} from './factorTable';

export function calculateImpact(
  activityType: string,
  subtype: string,
  quantity: number,
  _unit: string,
  metadata?: { alternative?: string }
): ImpactCalculation {
  switch (activityType) {
    case 'transport':
      return calculateTransportImpact(subtype, quantity, metadata?.alternative);
    case 'electricity':
    case 'energy':
      return calculateEnergyImpact(subtype, quantity);
    case 'water':
      return calculateWaterImpact(subtype, quantity);
    case 'food':
      return calculateFoodImpact(subtype, quantity);
    case 'waste':
      return calculateWasteImpact(subtype, quantity);
    case 'materials':
      return calculateMaterialsImpact(subtype, quantity);
    case 'flights':
      return calculateFlightImpact(subtype, quantity);
    case 'shopping':
      return calculateShoppingImpact(subtype, quantity);
    case 'micro_action':
      return calculateMicroActionImpact(subtype);
    default:
      return {
        confidence: 0.5,
        explanation: 'Unknown activity type'
      };
  }
}

function calculateTransportImpact(
  mode: string,
  distanceKm: number,
  alternative?: string
): ImpactCalculation {
  const factor = getTransportFactor(mode);
  const co2eKg = (distanceKm * factor) / 1000; // Convert grams to kg

  let avoidedCo2eKg = 0;
  let explanation = `${mode}: ${distanceKm} km × ${factor} gCO₂e/km = ${co2eKg.toFixed(2)} kg CO₂e`;

  // Calculate avoided emissions if alternative is provided
  if (alternative) {
    const alternativeFactor = getTransportFactor(alternative);
    const alternativeCo2eKg = (distanceKm * alternativeFactor) / 1000;
    avoidedCo2eKg = Math.max(0, alternativeCo2eKg - co2eKg);
    
    if (avoidedCo2eKg > 0) {
      explanation += ` | Avoided ${avoidedCo2eKg.toFixed(2)} kg CO₂e vs ${alternative}`;
    }
  } else if (mode === 'walk' || mode === 'cycle' || mode === 'metro' || mode === 'bus') {
    // Calculate avoided emissions vs baseline car usage
    const baselineFactor = getTransportFactor(baselineAssumptions.defaultCommute.mode);
    avoidedCo2eKg = Math.max(0, (distanceKm * baselineFactor) / 1000 - co2eKg);
    
    if (avoidedCo2eKg > 0) {
      explanation += ` | Avoided ${avoidedCo2eKg.toFixed(2)} kg CO₂e vs driving`;
    }
  }

  return {
    co2eKg: parseFloat(co2eKg.toFixed(3)),
    avoidedCo2eKg: parseFloat(avoidedCo2eKg.toFixed(3)),
    confidence: 0.85,
    explanation
  };
}

function calculateEnergyImpact(device: string, hours: number): ImpactCalculation {
  const watts = getEnergyDeviceWatts(device);
  const kwh = (watts * hours) / 1000;
  const co2eKg = kwh * GRID_KG_PER_KWH;

  const explanation = `${device}: ${hours} hr × ${watts}W = ${kwh.toFixed(2)} kWh × ${GRID_KG_PER_KWH} = ${co2eKg.toFixed(2)} kg CO₂e`;

  return {
    co2eKg: parseFloat(co2eKg.toFixed(3)),
    kwh: parseFloat(kwh.toFixed(2)),
    confidence: 0.8,
    explanation
  };
}

function calculateWaterImpact(type: string, quantity: number): ImpactCalculation {
  let waterLiters = 0;
  let explanation = '';

  switch (type) {
    case 'shower':
      waterLiters = quantity * waterFactors.showerLitersPerMin;
      explanation = `Shower: ${quantity} min × ${waterFactors.showerLitersPerMin} L/min = ${waterLiters} L`;
      break;
    case 'bucket':
      waterLiters = quantity * waterFactors.bucketBathLiters;
      explanation = `Bucket bath: ${quantity} buckets × ${waterFactors.bucketBathLiters} L = ${waterLiters} L`;
      break;
    case 'tap':
      waterLiters = quantity * waterFactors.tapRunningLitersPerMin;
      explanation = `Tap running: ${quantity} min × ${waterFactors.tapRunningLitersPerMin} L/min = ${waterLiters} L`;
      break;
    case 'washing_machine':
      waterLiters = quantity * waterFactors.washingMachineLiters;
      explanation = `Washing machine: ${quantity} loads × ${waterFactors.washingMachineLiters} L = ${waterLiters} L`;
      break;
    default:
      waterLiters = quantity;
      explanation = `Water usage: ${quantity} L`;
  }

  // Calculate water saved vs baseline (for shower)
  let waterSavedLiters = 0;
  if (type === 'shower' && quantity < baselineAssumptions.defaultShower.durationMin) {
    waterSavedLiters = (baselineAssumptions.defaultShower.durationMin - quantity) * waterFactors.showerLitersPerMin;
    explanation += ` | Saved ${waterSavedLiters} L vs ${baselineAssumptions.defaultShower.durationMin}-min shower`;
  }

  return {
    waterLiters: parseFloat(waterLiters.toFixed(1)),
    waterSavedLiters: waterSavedLiters > 0 ? parseFloat(waterSavedLiters.toFixed(1)) : undefined,
    confidence: 0.75,
    explanation
  };
}

function calculateFoodImpact(foodType: string, servings: number): ImpactCalculation {
  const factor = getFoodFactor(foodType);
  const co2eKg = servings * factor;

  let avoidedCo2eKg = 0;
  let explanation = `${foodType} meal: ${servings} serving × ${factor} kgCO₂e = ${co2eKg.toFixed(2)} kg CO₂e`;

  // Calculate avoided emissions for vegetarian meals
  if (foodType === 'veg' || foodType === 'vegan') {
    const baselineFactor = getFoodFactor(baselineAssumptions.defaultMeal.type);
    avoidedCo2eKg = Math.max(0, servings * baselineFactor - co2eKg);
    
    if (avoidedCo2eKg > 0) {
      explanation += ` | Avoided ${avoidedCo2eKg.toFixed(2)} kg CO₂e vs non-veg`;
    }
  }

  return {
    co2eKg: parseFloat(co2eKg.toFixed(3)),
    avoidedCo2eKg: parseFloat(avoidedCo2eKg.toFixed(3)),
    confidence: 0.8,
    explanation
  };
}

function calculateWasteImpact(action: string, quantity: number): ImpactCalculation {
  // Check if this is a plastic waste subtype (per spec: waste_kg × 2.5 = co2e)
  const plasticKey = action as keyof typeof plasticFactors;
  if (plasticFactors[plasticKey] !== undefined) {
    const wasteKg = plasticFactors[plasticKey] * quantity;
    const co2eKg = wasteKg * PLASTIC_CO2E_MULTIPLIER;
    const explanation = `${action}: ${quantity} items × ${plasticFactors[plasticKey]} kg = ${wasteKg.toFixed(3)} kg waste → ${co2eKg.toFixed(3)} kg CO₂e`;
    return {
      co2eKg: parseFloat(co2eKg.toFixed(3)),
      wasteKg: parseFloat(wasteKg.toFixed(3)),
      wasteDiverted: quantity,
      confidence: 0.85,
      explanation
    };
  }

  // Existing waste diversion actions (recycle, compost, etc.)
  const impact = getWasteActionImpact(action);
  const avoidedCo2eKg = impact.avoidedCo2eKg * quantity;

  const explanation = `${action}: ${quantity} items | Avoided ~${avoidedCo2eKg.toFixed(2)} kg CO₂e`;

  return {
    avoidedCo2eKg: parseFloat(avoidedCo2eKg.toFixed(3)),
    wasteDiverted: quantity,
    confidence: impact.confidence,
    explanation
  };
}

function calculateMaterialsImpact(subtype: string, quantity: number): ImpactCalculation {
  if (subtype === 'used_reusable_item') {
    // Reusable item saves CO₂e (per spec: quantity × 0.04 saved)
    const savedCo2eKg = quantity * materialsFactors.reusable_item_saved_kg;
    return {
      savedCo2eKg: parseFloat(savedCo2eKg.toFixed(3)),
      avoidedCo2eKg: parseFloat(savedCo2eKg.toFixed(3)),
      confidence: 0.8,
      explanation: `Reusable item: ${quantity} uses × ${materialsFactors.reusable_item_saved_kg} kg saved = ${savedCo2eKg.toFixed(3)} kg CO₂e saved`
    };
  }

  // Plastic item used (per spec: quantity × 0.05 impact)
  const co2eKg = quantity * materialsFactors.plastic_item_impact_kg;
  return {
    co2eKg: parseFloat(co2eKg.toFixed(3)),
    confidence: 0.8,
    explanation: `Plastic item: ${quantity} items × ${materialsFactors.plastic_item_impact_kg} kg CO₂e = ${co2eKg.toFixed(3)} kg CO₂e`
  };
}

function calculateShoppingImpact(type: string, quantity: number): ImpactCalculation {
  let co2eKg = 0;
  let avoidedCo2eKg = 0;
  let explanation = '';

  // Baseline: new purchase with delivery = ~1.5 kg CO₂e per item
  const baselinePerItem = 1.5;

  switch (type) {
    case 'online_delivery':
      co2eKg = quantity * 0.8;
      explanation = `Online delivery: ${quantity} orders × 0.8 kg CO₂e = ${co2eKg.toFixed(2)} kg CO₂e`;
      break;
    case 'packaging':
      co2eKg = quantity * 0.3;
      explanation = `Packaged products: ${quantity} items × 0.3 kg CO₂e = ${co2eKg.toFixed(2)} kg CO₂e`;
      break;
    case 'thrift':
      co2eKg = quantity * 0.1;
      avoidedCo2eKg = quantity * (baselinePerItem - 0.1);
      explanation = `Thrift purchase: ${quantity} items × 0.1 kg CO₂e = ${co2eKg.toFixed(2)} kg CO₂e | Avoided ${avoidedCo2eKg.toFixed(2)} kg vs new purchase`;
      break;
    case 'local':
      co2eKg = quantity * 0.2;
      avoidedCo2eKg = quantity * (baselinePerItem - 0.2);
      explanation = `Local purchase: ${quantity} items × 0.2 kg CO₂e = ${co2eKg.toFixed(2)} kg CO₂e | Avoided ${avoidedCo2eKg.toFixed(2)} kg vs delivery`;
      break;
    default:
      co2eKg = quantity * 0.5;
      explanation = `Shopping: ${quantity} items × 0.5 kg CO₂e = ${co2eKg.toFixed(2)} kg CO₂e`;
  }

  return {
    co2eKg: parseFloat(co2eKg.toFixed(3)),
    avoidedCo2eKg: avoidedCo2eKg > 0 ? parseFloat(avoidedCo2eKg.toFixed(3)) : undefined,
    confidence: type === 'thrift' || type === 'local' ? 0.70 : 0.60,
    explanation
  };
}

function calculateMicroActionImpact(action: string): ImpactCalculation {
  const impact = getWasteActionImpact(action);

  return {
    avoidedCo2eKg: impact.avoidedCo2eKg,
    confidence: impact.confidence,
    explanation: `${action}: avoided ${impact.avoidedCo2eKg} kg CO₂e`
  };
}

function calculateFlightImpact(subtype: string, distanceKm: number): ImpactCalculation {
  const factor = getFlightFactor(subtype);
  const co2eKg = distanceKm * factor;
  const label = subtype.replace(/_/g, ' ');

  return {
    co2eKg: parseFloat(co2eKg.toFixed(3)),
    confidence: 0.8,
    explanation: `Flight (${label}): ${distanceKm} km × ${factor} kg CO₂e/km = ${co2eKg.toFixed(2)} kg CO₂e`
  };
}

// Helper function to calculate daily totals from activities
export function calculateDayTotals(activities: ActivityLog[]) {
  let co2eKg = 0;
  let avoidedCo2eKg = 0;
  let kwh = 0;
  let waterLiters = 0;
  let waterSavedLiters = 0;
  let wasteKg = 0;
  let wasteDiverted = 0;

  activities.forEach(activity => {
    const impact = activity.calculatedImpact;
    co2eKg += impact.co2eKg || 0;
    avoidedCo2eKg += impact.avoidedCo2eKg || 0;
    kwh += impact.kwh || 0;
    waterLiters += impact.waterLiters || 0;
    waterSavedLiters += impact.waterSavedLiters || 0;
    wasteKg += impact.wasteKg || 0;
    wasteDiverted += impact.wasteDiverted || 0;
  });

  return {
    co2eKg: parseFloat(co2eKg.toFixed(2)),
    avoidedCo2eKg: parseFloat(avoidedCo2eKg.toFixed(2)),
    kwh: parseFloat(kwh.toFixed(2)),
    waterLiters: parseFloat(waterLiters.toFixed(1)),
    waterSavedLiters: parseFloat(waterSavedLiters.toFixed(1)),
    wasteKg: parseFloat(wasteKg.toFixed(3)),
    wasteDiverted
  };
}

// Calculate sustainability score (0-100)
export function calculateSustainabilityScore(
  co2eKg: number,
  avoidedCo2eKg: number,
  goalsCompleted: number,
  totalGoals: number
): number {
  // Base score starts at 50
  let score = 50;

  // Deduct points for emissions (max -30)
  const emissionPenalty = Math.min(30, co2eKg * 10);
  score -= emissionPenalty;

  // Add points for avoided emissions (max +30)
  const avoidedBonus = Math.min(30, avoidedCo2eKg * 10);
  score += avoidedBonus;

  // Add points for goal completion (max +20)
  const goalBonus = totalGoals > 0 ? (goalsCompleted / totalGoals) * 20 : 0;
  score += goalBonus;

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}
