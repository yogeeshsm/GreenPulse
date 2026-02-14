// GreenPulse Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  locationCity?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  commuteNorm: 'metro' | 'bus' | 'car' | 'bike' | 'walk';
  dietNorm: 'veg' | 'egg' | 'chicken' | 'mutton' | 'fish';
  homeEnergyPattern: 'low' | 'medium' | 'high';
  dailyGoals: string[];
}

export interface DaySession {
  id: string;
  userId: string;
  date: string;
  wakeTime?: string;
  sleepTime?: string;
  dailyScore: number;
  totals: DayTotals;
  goals: Goal[];
  streakDays: number;
}

export interface DayTotals {
  co2eKg: number;
  avoidedCo2eKg: number;
  kwh: number;
  waterLiters: number;
  waterSavedLiters: number;
  wasteKg: number;
  wasteDiverted: number;
  greenPoints: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  daySessionId: string;
  timestamp: Date;
  activityType: ActivityType;
  subtype: string;
  quantity: number;
  unit: string;
  metadata: ActivityMetadata;
  calculatedImpact: ImpactCalculation;
}

export type ActivityType = 
  | 'transport' 
  | 'energy'
  | 'electricity'
  | 'water' 
  | 'food' 
  | 'waste' 
  | 'materials'
  | 'flights'
  | 'shopping' 
  | 'micro_action';

export interface ActivityMetadata {
  confidence: number;
  source: 'manual' | 'estimated' | 'sensed';
  notes?: string;
}

export interface ImpactCalculation {
  co2eKg?: number;
  avoidedCo2eKg?: number;
  savedCo2eKg?: number;
  kwh?: number;
  waterLiters?: number;
  waterSavedLiters?: number;
  wasteKg?: number;
  wasteDiverted?: number;
  confidence: number;
  explanation: string;
}

export interface PointsLedger {
  id: string;
  userId: string;
  daySessionId: string;
  pointsImpact: number;
  pointsBehavior: number;
  pointsBonus: number;
  reason: PointsReason;
}

export interface PointsReason {
  breakdown: string[];
  streakBonus?: number;
  goalCompletionBonus?: number;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category?: 'transport' | 'energy' | 'water' | 'food' | 'waste' | 'materials' | 'general';
}

export interface FactorTable {
  id: string;
  factorVersion: string;
  activityType: ActivityType;
  subtype: string;
  factorValue: number;
  factorUnit: string;
  region?: string;
  lastUpdated: Date;
}

export interface MicroMove {
  id: string;
  icon: string;
  title: string;
  description: string;
  points: number;
  avoidedCo2eKg: number;
  category: ActivityType;
}

export interface WeeklyInsight {
  weekStart: string;
  weekEnd: string;
  totalCo2eKg: number;
  totalAvoidedCo2eKg: number;
  totalKwh: number;
  totalWaterLiters: number;
  totalWasteDiverted: number;
  averageDailyScore: number;
  topDrivers: TopDriver[];
  suggestedSwaps: SuggestedSwap[];
  trend: DailyTrend[];
}

export interface TopDriver {
  category: ActivityType;
  impact: number;
  percentage: number;
}

export interface SuggestedSwap {
  from: string;
  to: string;
  potentialSaving: number;
  icon: string;
}

export interface DailyTrend {
  date: string;
  co2eKg: number;
  score: number;
}

export interface TransportOption {
  mode: string;
  icon: string;
  gCo2ePerKm: number;
  label: string;
}

export interface FoodOption {
  type: string;
  icon: string;
  kgCo2ePerServing: number;
  label: string;
}

export interface EnergyDevice {
  name: string;
  watts: number;
  icon: string;
  category: 'cooling' | 'lighting' | 'appliance' | 'electronics';
}

export interface WasteAction {
  type: 'recycle' | 'compost' | 'refuse' | 'reuse' | 'donate' | 'plastic_bottle' | 'plastic_bag' | 'plastic_container';
  icon: string;
  label: string;
  points: number;
}
