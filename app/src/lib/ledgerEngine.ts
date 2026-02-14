// GreenPulse Personal Impact Ledger
// Aggregates daily, weekly, and monthly sustainability data

import type { DaySession, ActivityLog, ActivityType } from '@/types';

export interface LedgerPeriod {
  periodType: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  totalCo2eKg: number;
  totalAvoidedCo2eKg: number;
  totalKwh: number;
  totalWaterLiters: number;
  totalWasteDiverted: number;
  totalGreenPoints: number;
  averageDailyScore: number;
  daysTracked: number;
  topCategories: CategoryBreakdown[];
  dailyTrend: DailyTrendPoint[];
}

export interface CategoryBreakdown {
  category: ActivityType;
  co2eKg: number;
  percentage: number;
  activityCount: number;
}

export interface DailyTrendPoint {
  date: string;
  co2eKg: number;
  avoidedCo2eKg: number;
  score: number;
  greenPoints: number;
}

/**
 * Aggregate daily sessions into a weekly report
 */
export function aggregateWeeklyLedger(
  daySessions: DaySession[],
  activities: ActivityLog[]
): LedgerPeriod {
  if (daySessions.length === 0) {
    return createEmptyLedger('week');
  }

  // Sort by date
  const sortedSessions = [...daySessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const startDate = sortedSessions[0].date;
  const endDate = sortedSessions[sortedSessions.length - 1].date;

  // Sum all totals
  const totals = sortedSessions.reduce(
    (acc, session) => ({
      co2eKg: acc.co2eKg + session.totals.co2eKg,
      avoidedCo2eKg: acc.avoidedCo2eKg + session.totals.avoidedCo2eKg,
      kwh: acc.kwh + session.totals.kwh,
      waterLiters: acc.waterLiters + session.totals.waterLiters,
      wasteDiverted: acc.wasteDiverted + session.totals.wasteDiverted,
      greenPoints: acc.greenPoints + session.totals.greenPoints,
      scoreSum: acc.scoreSum + session.dailyScore
    }),
    {
      co2eKg: 0,
      avoidedCo2eKg: 0,
      kwh: 0,
      waterLiters: 0,
      wasteDiverted: 0,
      greenPoints: 0,
      scoreSum: 0
    }
  );

  const daysTracked = sortedSessions.length;
  const averageDailyScore = totals.scoreSum / daysTracked;

  // Calculate category breakdown
  const topCategories = calculateCategoryBreakdown(activities, totals.co2eKg);

  // Build daily trend
  const dailyTrend: DailyTrendPoint[] = sortedSessions.map((session) => ({
    date: session.date,
    co2eKg: session.totals.co2eKg,
    avoidedCo2eKg: session.totals.avoidedCo2eKg,
    score: session.dailyScore,
    greenPoints: session.totals.greenPoints
  }));

  return {
    periodType: 'week',
    startDate,
    endDate,
    totalCo2eKg: totals.co2eKg,
    totalAvoidedCo2eKg: totals.avoidedCo2eKg,
    totalKwh: totals.kwh,
    totalWaterLiters: totals.waterLiters,
    totalWasteDiverted: totals.wasteDiverted,
    totalGreenPoints: totals.greenPoints,
    averageDailyScore,
    daysTracked,
    topCategories,
    dailyTrend
  };
}

/**
 * Aggregate daily sessions into a monthly report
 */
export function aggregateMonthlyLedger(
  daySessions: DaySession[],
  activities: ActivityLog[]
): LedgerPeriod {
  if (daySessions.length === 0) {
    return createEmptyLedger('month');
  }

  // Same aggregation logic as weekly, but periodType is 'month'
  const weeklyLedger = aggregateWeeklyLedger(daySessions, activities);

  return {
    ...weeklyLedger,
    periodType: 'month'
  };
}

/**
 * Calculate emissions breakdown by category
 */
function calculateCategoryBreakdown(
  activities: ActivityLog[],
  totalCo2e: number
): CategoryBreakdown[] {
  const categoryMap = new Map<
    ActivityType,
    { co2e: number; count: number }
  >();

  activities.forEach((activity) => {
    const co2e = activity.calculatedImpact.co2eKg || 0;
    const type = activity.activityType;
    const existing = categoryMap.get(type) || { co2e: 0, count: 0 };
    categoryMap.set(type, {
      co2e: existing.co2e + co2e,
      count: existing.count + 1
    });
  });

  const breakdowns: CategoryBreakdown[] = Array.from(
    categoryMap.entries()
  ).map(([category, data]) => ({
    category,
    co2eKg: data.co2e,
    percentage: totalCo2e > 0 ? (data.co2e / totalCo2e) * 100 : 0,
    activityCount: data.count
  }));

  // Sort by highest emissions
  return breakdowns.sort((a, b) => b.co2eKg - a.co2eKg);
}

/**
 * Create empty ledger template
 */
function createEmptyLedger(periodType: 'week' | 'month'): LedgerPeriod {
  const today = new Date().toISOString().split('T')[0];
  return {
    periodType,
    startDate: today,
    endDate: today,
    totalCo2eKg: 0,
    totalAvoidedCo2eKg: 0,
    totalKwh: 0,
    totalWaterLiters: 0,
    totalWasteDiverted: 0,
    totalGreenPoints: 0,
    averageDailyScore: 0,
    daysTracked: 0,
    topCategories: [],
    dailyTrend: []
  };
}

/**
 * Format ledger period for export
 */
export function formatLedgerForExport(ledger: LedgerPeriod): string {
  const lines = [
    `GreenPulse ${ledger.periodType.toUpperCase()} Report`,
    `Period: ${ledger.startDate} to ${ledger.endDate}`,
    `Days Tracked: ${ledger.daysTracked}`,
    '',
    '=== TOTALS ===',
    `CO₂e Emissions: ${ledger.totalCo2eKg.toFixed(2)} kg`,
    `Avoided Emissions: ${ledger.totalAvoidedCo2eKg.toFixed(2)} kg`,
    `Energy Used: ${ledger.totalKwh.toFixed(2)} kWh`,
    `Water Used: ${ledger.totalWaterLiters.toFixed(0)} L`,
    `Waste Diverted: ${ledger.totalWasteDiverted} items`,
    `Green Points: ${ledger.totalGreenPoints}`,
    `Average Daily Score: ${ledger.averageDailyScore.toFixed(0)}/100`,
    '',
    '=== TOP CATEGORIES ===',
    ...ledger.topCategories.map(
      (cat) =>
        `${cat.category}: ${cat.co2eKg.toFixed(2)} kg (${cat.percentage.toFixed(1)}%) - ${cat.activityCount} activities`
    ),
    '',
    '=== DAILY TREND ===',
    ...ledger.dailyTrend.map(
      (day) =>
        `${day.date}: ${day.co2eKg.toFixed(2)} kg CO₂e | Score: ${day.score}/100 | Points: ${day.greenPoints}`
    )
  ];

  return lines.join('\n');
}

/**
 * Calculate streak days from consecutive day sessions
 */
export function calculateStreak(daySessions: DaySession[]): number {
  if (daySessions.length === 0) return 0;

  // Sort by date descending (most recent first)
  const sorted = [...daySessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let expectedDate = new Date();

  for (const session of sorted) {
    const sessionDate = new Date(session.date);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    const sessionDateStr = sessionDate.toISOString().split('T')[0];

    if (sessionDateStr === expectedDateStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Generate share-worthy stats for social media
 */
export function generateShareCard(ledger: LedgerPeriod): {
  headline: string;
  stats: string[];
  emoji: string;
} {
  const netImpact = ledger.totalCo2eKg - ledger.totalAvoidedCo2eKg;
  const isPositive = ledger.totalAvoidedCo2eKg > ledger.totalCo2eKg * 0.3;

  const headline = isPositive
    ? `I avoided ${ledger.totalAvoidedCo2eKg.toFixed(1)} kg CO₂e this ${ledger.periodType}! 🌱`
    : `I tracked ${ledger.daysTracked} days on GreenPulse 📊`;

  const stats = [
    `🌍 ${netImpact.toFixed(1)} kg net CO₂e`,
    `⚡ ${ledger.totalKwh.toFixed(1)} kWh energy`,
    `💧 ${ledger.totalWaterLiters.toFixed(0)} L water`,
    `♻️ ${ledger.totalWasteDiverted} waste items diverted`,
    `🏆 ${ledger.totalGreenPoints} Green Points`
  ];

  const emoji = isPositive ? '🌟' : '🌱';

  return { headline, stats, emoji };
}
