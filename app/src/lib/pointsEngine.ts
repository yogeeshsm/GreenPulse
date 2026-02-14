// GreenPulse Points Engine
// Converts impact + behavior into Green Points

import type { ActivityLog, PointsLedger } from '@/types';

export interface PointsCalculation {
  impactPoints: number;
  behaviorPoints: number;
  bonusPoints: number;
  totalPoints: number;
  breakdown: string[];
}

const IMPACT_MULTIPLIER = 100; // 1 kg CO₂e avoided = 100 points
const MAX_BEHAVIOR_RATIO = 2; // Behavior points can't exceed impact points * 2

export function calculatePoints(
  activities: ActivityLog[],
  goalsCompleted: number,
  _totalGoals: number,
  streakDays: number,
  dailyCloseDone: boolean
): PointsCalculation {
  const breakdown: string[] = [];

  // Calculate impact points from avoided emissions
  let totalAvoidedCo2e = 0;
  activities.forEach(activity => {
    totalAvoidedCo2e += activity.calculatedImpact.avoidedCo2eKg || 0;
  });

  const impactPoints = Math.round(totalAvoidedCo2e * IMPACT_MULTIPLIER);
  if (impactPoints > 0) {
    breakdown.push(`Avoided ${totalAvoidedCo2e.toFixed(2)} kg CO₂e = ${impactPoints} impact points`);
  }

  // Calculate behavior points
  let behaviorPoints = 0;

  // Points for goal completion (10 points per goal, max 3 goals)
  const goalPoints = Math.min(goalsCompleted, 3) * 10;
  if (goalPoints > 0) {
    behaviorPoints += goalPoints;
    breakdown.push(`${goalsCompleted} goals completed = ${goalPoints} behavior points`);
  }

  // Points for daily close completion
  if (dailyCloseDone) {
    behaviorPoints += 20;
    breakdown.push(`Daily close completed = 20 behavior points`);
  }

  // Streak bonus (5 points per day, max 50)
  const streakBonus = Math.min(streakDays * 5, 50);
  if (streakBonus > 0) {
    behaviorPoints += streakBonus;
    breakdown.push(`${streakDays}-day streak = ${streakBonus} behavior bonus`);
  }

  // Apply cap: behavior points cannot exceed impact points * 2
  const maxBehaviorPoints = Math.max(impactPoints * MAX_BEHAVIOR_RATIO, 50); // Minimum 50 to allow beginners
  const cappedBehaviorPoints = Math.min(behaviorPoints, maxBehaviorPoints);
  
  if (cappedBehaviorPoints < behaviorPoints) {
    breakdown.push(`Behavior points capped at ${cappedBehaviorPoints} (max ${MAX_BEHAVIOR_RATIO}x impact)`);
  }

  // Calculate bonus points (e.g., for special actions, challenges)
  const bonusPoints = 0; // Reserved for future features

  const totalPoints = impactPoints + cappedBehaviorPoints + bonusPoints;

  return {
    impactPoints,
    behaviorPoints: cappedBehaviorPoints,
    bonusPoints,
    totalPoints,
    breakdown
  };
}

export function createPointsLedger(
  userId: string,
  daySessionId: string,
  activities: ActivityLog[],
  goalsCompleted: number,
  totalGoals: number,
  streakDays: number,
  dailyCloseDone: boolean
): PointsLedger {
  const calculation = calculatePoints(
    activities,
    goalsCompleted,
    totalGoals,
    streakDays,
    dailyCloseDone
  );

  return {
    id: `pl-${Date.now()}`,
    userId,
    daySessionId,
    pointsImpact: calculation.impactPoints,
    pointsBehavior: calculation.behaviorPoints,
    pointsBonus: calculation.bonusPoints,
    reason: {
      breakdown: calculation.breakdown,
      streakBonus: streakDays * 5,
      goalCompletionBonus: goalsCompleted * 10
    }
  };
}

// Calculate micro-action points
export function calculateMicroActionPoints(avoidedCo2eKg: number, basePoints: number): number {
  const impactPoints = Math.round(avoidedCo2eKg * IMPACT_MULTIPLIER);
  return Math.max(impactPoints, basePoints); // Use whichever is higher
}

// Generate next day goals based on biggest drivers
export function suggestNextDayGoals(
  activities: ActivityLog[],
  _currentGoals: string[]
): string[] {
  const suggestions = [];

  // Analyze activities to find biggest impact areas
  const activityTypeCount: Record<string, number> = {};
  activities.forEach(activity => {
    activityTypeCount[activity.activityType] = (activityTypeCount[activity.activityType] || 0) + 1;
  });

  // Suggest goals based on most frequent activity types
  const sortedTypes = Object.entries(activityTypeCount).sort((a, b) => b[1] - a[1]);

  const goalSuggestions: Record<string, string> = {
    transport: 'Use public transport or cycle',
    energy: 'Reduce AC usage by 1 hour',
    water: 'Take a 5-minute shower',
    food: 'Have at least one veg meal',
    waste: 'Recycle or compost waste',
    shopping: 'Avoid unnecessary purchases'
  };

  for (const [type] of sortedTypes.slice(0, 3)) {
    if (goalSuggestions[type]) {
      suggestions.push(goalSuggestions[type]);
    }
  }

  // Fill with general sustainability goals if needed
  const generalGoals = [
    'Switch off unused lights',
    'Carry a reusable bag',
    'Refuse single-use plastic'
  ];

  while (suggestions.length < 3) {
    const goal = generalGoals.shift();
    if (goal && !suggestions.includes(goal)) {
      suggestions.push(goal);
    }
  }

  return suggestions.slice(0, 3);
}
