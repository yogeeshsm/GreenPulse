// GreenPulse API Service
// Connects the React frontend to the Express backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ActivityRequest {
  user_id: string;
  day_session_id: string;
  activity_type: string;
  subtype: string;
  quantity: number;
  unit: string;
}

export interface CalculatedImpactResponse {
  co2e_kg: number;
  kwh: number;
  water_l: number;
  waste_kg: number;
  saved_co2e_kg?: number;
  confidence: number;
  explanation: string;
}

export interface ActivityResponse {
  success: boolean;
  activity_id?: string;
  calculated_impact_json?: CalculatedImpactResponse;
  day_totals?: {
    total_co2e_kg: number;
    total_water_l: number;
    total_kwh: number;
    total_waste_kg: number;
    total_saved_co2e_kg: number;
  };
  error?: string;
}

export interface ActivitiesListResponse {
  success: boolean;
  activities: any[];
  day_totals: {
    total_co2e_kg: number;
    total_water_l: number;
    total_kwh: number;
    total_waste_kg: number;
    total_saved_co2e_kg: number;
  };
}

// ─── API Functions ──────────────────────────────────────────────────

/**
 * POST /activity — Log an activity and get calculated impact
 */
export async function logActivity(data: ActivityRequest): Promise<ActivityResponse> {
  try {
    const res = await fetch(`${API_BASE}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.warn('API unavailable, using local calculation only');
    return { success: false, error: 'Server unavailable' };
  }
}

/**
 * POST /calculate — Calculate impact without storing (preview mode)
 */
export async function calculateOnly(data: {
  activity_type: string;
  subtype: string;
  quantity: number;
  unit: string;
}): Promise<{ success: boolean; calculated_impact_json?: CalculatedImpactResponse }> {
  try {
    const res = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

/**
 * GET /activity/:userId/:date — Get all activities for a day
 */
export async function getActivitiesForDay(
  userId: string,
  date: string
): Promise<ActivitiesListResponse> {
  try {
    const res = await fetch(`${API_BASE}/activity/${userId}/${date}`);
    return await res.json();
  } catch {
    return {
      success: false,
      activities: [],
      day_totals: { total_co2e_kg: 0, total_water_l: 0, total_kwh: 0, total_waste_kg: 0, total_saved_co2e_kg: 0 }
    };
  }
}

/**
 * GET /factors — Get the factor table
 */
export async function getFactorTable() {
  try {
    const res = await fetch(`${API_BASE}/factors`);
    return await res.json();
  } catch {
    return { success: false };
  }
}

/**
 * GET /health — Server health check
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch {
    return { status: 'unavailable' };
  }
}
