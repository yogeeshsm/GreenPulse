import { useState, useCallback, useEffect } from 'react';
import type { DaySession, ActivityLog, Goal, MicroMove } from '@/types';
import { mockDaySession, mockActivityLogs, microMoves } from '@/data/mockData';
import { calculateDayTotals, calculateSustainabilityScore } from '@/lib/impactEngine';
import { calculatePoints } from '@/lib/pointsEngine';
import { generateSmartSuggestions, suggestionsToGoals } from '@/lib/suggestionsEngine';

export function useAppState() {
  const [currentView, setCurrentView] = useState<'home' | 'timeline' | 'micromoves' | 'insights' | 'profile'>('home');
  const [daySession, setDaySession] = useState<DaySession>(mockDaySession);
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivityLogs);
  const [goals, setGoals] = useState<Goal[]>(mockDaySession.goals);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [quickLogCategory, setQuickLogCategory] = useState<string | null>(null);
  const [dailyCloseDone, setDailyCloseDone] = useState(false);

  // Recalculate totals and score when activities or goals change
  useEffect(() => {
    const totals = calculateDayTotals(activities);
    const goalsCompleted = goals.filter(g => g.completed).length;
    const score = calculateSustainabilityScore(
      totals.co2eKg,
      totals.avoidedCo2eKg,
      goalsCompleted,
      goals.length
    );
    
    const pointsCalc = calculatePoints(
      activities,
      goalsCompleted,
      goals.length,
      daySession.streakDays,
      dailyCloseDone
    );

    setDaySession(prev => ({
      ...prev,
      goals: goals,
      totals: {
        ...totals,
        greenPoints: pointsCalc.totalPoints
      },
      dailyScore: score
    }));
  }, [activities, goals, daySession.streakDays, dailyCloseDone]);

  const addActivity = useCallback((activity: ActivityLog) => {
    setActivities(prev => [...prev, activity]);
  }, []);

  const toggleGoal = useCallback((goalId: string) => {
    setGoals(prev => 
      prev.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
    );
  }, []);

  const addGoal = useCallback((goalText: string) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      text: goalText,
      completed: false
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const executeMicroMove = useCallback((move: MicroMove) => {
    const activity: ActivityLog = {
      id: `al-${Date.now()}`,
      userId: 'user-001',
      daySessionId: daySession.id,
      timestamp: new Date(),
      activityType: move.category,
      subtype: move.id,
      quantity: 1,
      unit: 'action',
      metadata: { confidence: 1, source: 'manual' },
      calculatedImpact: {
        avoidedCo2eKg: move.avoidedCo2eKg,
        confidence: 1,
        explanation: `${move.title}: ${move.description}`
      }
    };
    addActivity(activity);
  }, [addActivity, daySession.id]);

  const completeDailyClose = useCallback(() => {
    setDailyCloseDone(true);
    
    // Generate smart suggestions and convert to next-day goals
    const totals = calculateDayTotals(activities);
    const suggestions = generateSmartSuggestions(activities, totals);
    const nextDayGoals = suggestionsToGoals(suggestions);

    // Update daySession with next-day goals suggestion
    setDaySession(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1
    }));

    // Store next-day goals (will be activated on next session)
    if (nextDayGoals.length > 0) {
      setGoals(prev => {
        // Keep completed goals and add new suggestions
        const completedGoals = prev.filter(g => g.completed);
        return [...completedGoals, ...nextDayGoals];
      });
    }
  }, [activities]);

  const openQuickLog = useCallback((category: string) => {
    setQuickLogCategory(category);
    setShowQuickLog(true);
  }, []);

  const closeQuickLog = useCallback(() => {
    setShowQuickLog(false);
    setQuickLogCategory(null);
  }, []);

  return {
    currentView,
    setCurrentView,
    daySession,
    activities,
    goals,
    microMoves,
    showQuickLog,
    quickLogCategory,
    addActivity,
    toggleGoal,
    addGoal,
    executeMicroMove,
    openQuickLog,
    closeQuickLog,
    completeDailyClose,
    dailyCloseDone
  };
}
