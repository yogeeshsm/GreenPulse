// GreenPulse Smart Suggestions Engine
// Analyzes daily activity and suggests better actions for tomorrow

import type { ActivityLog, DayTotals, Goal, ActivityType } from '@/types';

export interface SmartSuggestion {
  id: string;
  category: ActivityType;
  title: string;
  description: string;
  potentialSaving: number; // kg CO₂e
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

interface CategoryImpact {
  category: ActivityType;
  totalCo2e: number;
  count: number;
  avgCo2e: number;
}

/**
 * Analyzes today's activities and generates 3-5 actionable suggestions for tomorrow
 */
export function generateSmartSuggestions(
  activities: ActivityLog[],
  dayTotals: DayTotals
): SmartSuggestion[] {
  // Group activities by category and calculate totals
  const categoryImpacts = calculateCategoryImpacts(activities);

  // Find top 3 emission drivers
  const topDrivers = categoryImpacts
    .sort((a, b) => b.totalCo2e - a.totalCo2e)
    .slice(0, 3);

  const suggestions: SmartSuggestion[] = [];

  // Generate suggestions for each top driver
  topDrivers.forEach((driver, index) => {
    const categorySuggestions = getSuggestionsForCategory(
      driver.category,
      driver.totalCo2e,
      activities
    );
    suggestions.push(...categorySuggestions.slice(0, index === 0 ? 2 : 1));
  });

  // Add general high-impact suggestions if we have less than 3
  if (suggestions.length < 3) {
    suggestions.push(...getGeneralSuggestions(dayTotals));
  }

  return suggestions.slice(0, 5);
}

/**
 * Calculate total impact per category
 */
function calculateCategoryImpacts(activities: ActivityLog[]): CategoryImpact[] {
  const impactMap = new Map<ActivityType, { total: number; count: number }>();

  activities.forEach((activity) => {
    const co2e = activity.calculatedImpact.co2eKg || 0;
    const existing = impactMap.get(activity.activityType) || { total: 0, count: 0 };
    impactMap.set(activity.activityType, {
      total: existing.total + co2e,
      count: existing.count + 1
    });
  });

  return Array.from(impactMap.entries()).map(([category, data]) => ({
    category,
    totalCo2e: data.total,
    count: data.count,
    avgCo2e: data.total / data.count
  }));
}

/**
 * Generate category-specific suggestions
 */
function getSuggestionsForCategory(
  category: ActivityType,
  totalImpact: number,
  activities: ActivityLog[]
): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];

  switch (category) {
    case 'transport':
      suggestions.push({
        id: `sug-transport-${Date.now()}`,
        category: 'transport',
        title: 'Try metro or bus tomorrow',
        description: 'Public transport can reduce your commute emissions by 80%',
        potentialSaving: totalImpact * 0.8,
        difficulty: 'easy',
        icon: 'Train'
      });

      suggestions.push({
        id: `sug-transport-pool-${Date.now()}`,
        category: 'transport',
        title: 'Pool your ride',
        description: 'Sharing a cab splits emissions. Even 2 people = 50% less per person',
        potentialSaving: totalImpact * 0.5,
        difficulty: 'medium',
        icon: 'Users'
      });
      break;

    case 'energy':
      const hasAC = activities.some(
        (a) => a.activityType === 'energy' && a.subtype.includes('ac')
      );

      if (hasAC) {
        suggestions.push({
          id: `sug-energy-ac-${Date.now()}`,
          category: 'energy',
          title: 'Reduce AC by 1 hour',
          description: 'AC uses ~1.5 kWh/hour. Reducing usage saves significant energy',
          potentialSaving: 1.05, // ~1.5 kWh * 0.7 kg/kWh
          difficulty: 'easy',
          icon: 'Wind'
        });
      }

      suggestions.push({
        id: `sug-energy-lights-${Date.now()}`,
        category: 'energy',
        title: 'Switch to LED bulbs',
        description: 'LEDs use 85% less energy than incandescent bulbs',
        potentialSaving: totalImpact * 0.3,
        difficulty: 'easy',
        icon: 'Lightbulb'
      });
      break;

    case 'food':
      const hasMeat = activities.some(
        (a) =>
          a.activityType === 'food' &&
          ['chicken', 'mutton', 'beef', 'fish'].includes(a.subtype)
      );

      if (hasMeat) {
        suggestions.push({
          id: `sug-food-veg-${Date.now()}`,
          category: 'food',
          title: 'Try a plant-based meal',
          description: 'One veg meal instead of chicken saves ~1.8 kg CO₂e',
          potentialSaving: 1.8,
          difficulty: 'easy',
          icon: 'Salad'
        });
      }

      suggestions.push({
        id: `sug-food-waste-${Date.now()}`,
        category: 'food',
        title: 'Finish what\'s on your plate',
        description: 'Food waste adds to your footprint. Eat what you take!',
        potentialSaving: totalImpact * 0.2,
        difficulty: 'easy',
        icon: 'Utensils'
      });
      break;

    case 'water':
      suggestions.push({
        id: `sug-water-shower-${Date.now()}`,
        category: 'water',
        title: 'Shorter shower = water saved',
        description: 'Reducing shower by 2 minutes saves ~18 liters',
        potentialSaving: 0.01, // water has low direct CO2, but still valuable
        difficulty: 'easy',
        icon: 'Droplets'
      });

      suggestions.push({
        id: `sug-water-tap-${Date.now()}`,
        category: 'water',
        title: 'Turn off tap while brushing',
        description: 'A running tap wastes 6 liters per minute',
        potentialSaving: 0.005,
        difficulty: 'easy',
        icon: 'Droplet'
      });
      break;

    case 'waste':
      suggestions.push({
        id: `sug-waste-refuse-${Date.now()}`,
        category: 'waste',
        title: 'Refuse extra packaging',
        description: 'Say no to plastic bags, straws, and disposable cutlery',
        potentialSaving: 0.05,
        difficulty: 'easy',
        icon: 'Ban'
      });

      suggestions.push({
        id: `sug-waste-compost-${Date.now()}`,
        category: 'waste',
        title: 'Compost food scraps',
        description: 'Composting diverts waste from landfills and enriches soil',
        potentialSaving: 0.1,
        difficulty: 'medium',
        icon: 'Recycle'
      });
      break;

    case 'shopping':
      suggestions.push({
        id: `sug-shop-thrift-${Date.now()}`,
        category: 'shopping',
        title: 'Try thrifting or repair',
        description: 'Second-hand shopping saves ~90% emissions vs new items',
        potentialSaving: totalImpact * 0.9,
        difficulty: 'medium',
        icon: 'ShoppingBag'
      });

      suggestions.push({
        id: `sug-shop-local-${Date.now()}`,
        category: 'shopping',
        title: 'Shop locally',
        description: 'Local purchases eliminate delivery emissions',
        potentialSaving: 0.8,
        difficulty: 'easy',
        icon: 'Store'
      });
      break;

    default:
      break;
  }

  return suggestions;
}

/**
 * General high-impact suggestions
 */
function getGeneralSuggestions(_dayTotals: DayTotals): SmartSuggestion[] {
  return [
    {
      id: `sug-general-walk-${Date.now()}`,
      category: 'transport',
      title: 'Walk for short trips',
      description: 'Trips under 1 km? Walking is faster than you think.',
      potentialSaving: 0.2,
      difficulty: 'easy',
      icon: 'PersonStanding'
    },
    {
      id: `sug-general-bottle-${Date.now()}`,
      category: 'waste',
      title: 'Carry a reusable bottle',
      description: 'Avoid single-use plastic bottles. Refill instead.',
      potentialSaving: 0.05,
      difficulty: 'easy',
      icon: 'Bottle'
    },
    {
      id: `sug-general-unplug-${Date.now()}`,
      category: 'energy',
      title: 'Unplug idle chargers',
      description: 'Chargers draw power even when not charging',
      potentialSaving: 0.02,
      difficulty: 'easy',
      icon: 'Plug'
    }
  ];
}

/**
 * Convert suggestions into daily goals for tomorrow
 */
export function suggestionsToGoals(suggestions: SmartSuggestion[]): Goal[] {
  return suggestions.slice(0, 3).map((suggestion, index) => {
    const goalCategory = suggestion.category === 'shopping' || suggestion.category === 'micro_action'
      ? 'general' as const
      : suggestion.category;
    return {
      id: `goal-${Date.now()}-${index}`,
      text: suggestion.title,
      completed: false,
      category: goalCategory
    };
  });
}

/**
 * Detect if major activity categories are missing from today's logs
 */
export function detectMissingActivities(activities: ActivityLog[]): {
  missing: ActivityType[];
  hasCommute: boolean;
  hasMeals: boolean;
  hasEnergy: boolean;
} {
  const loggedTypes = new Set(activities.map((a) => a.activityType));

  const hasCommute = loggedTypes.has('transport');
  const hasMeals = loggedTypes.has('food');
  const hasEnergy = loggedTypes.has('energy');

  const missing: ActivityType[] = [];
  if (!hasCommute) missing.push('transport');
  if (!hasMeals) missing.push('food');
  if (!hasEnergy) missing.push('energy');

  return { missing, hasCommute, hasMeals, hasEnergy };
}
