// Activity API Routes — SQLite (better-sqlite3) version
// POST /activity — log an activity and get calculated impact back

import { Router, Request, Response } from 'express';
import { calculateImpact } from '../engine/calculateImpact';
import { db } from '../config/database';

const router = Router();

// ─── Validation helpers ─────────────────────────────────────────────

const VALID_ACTIVITY_TYPES = ['electricity', 'water', 'waste', 'materials', 'flights'] as const;

const VALID_SUBTYPES: Record<string, string[]> = {
  electricity: ['ac', 'fan', 'laptop', 'led_bulb', 'geyser'],
  water:       ['shower', 'bucket', 'tap'],
  waste:       ['plastic_bottle', 'plastic_bag', 'plastic_container'],
  materials:   ['used_plastic_item', 'used_reusable_item'],
  flights:     ['domestic_economy', 'domestic_business', 'short_haul_economy', 'short_haul_business', 'long_haul_economy', 'long_haul_business', 'long_haul_first']
};

const VALID_UNITS: Record<string, string[]> = {
  electricity: ['hours'],
  water:       ['minutes', 'count'],
  waste:       ['count'],
  materials:   ['count'],
  flights:     ['km']
};

function validateActivity(body: any): string | null {
  const { user_id, day_session_id, activity_type, subtype, quantity, unit } = body;

  if (!user_id)          return 'user_id is required';
  if (!day_session_id)   return 'day_session_id is required';
  if (!activity_type)    return 'activity_type is required';
  if (!subtype)          return 'subtype is required';
  if (quantity == null)  return 'quantity is required';
  if (!unit)             return 'unit is required';

  if (!VALID_ACTIVITY_TYPES.includes(activity_type)) {
    return `Invalid activity_type. Must be one of: ${VALID_ACTIVITY_TYPES.join(', ')}`;
  }

  if (!VALID_SUBTYPES[activity_type]?.includes(subtype)) {
    return `Invalid subtype "${subtype}" for ${activity_type}. Must be one of: ${VALID_SUBTYPES[activity_type]?.join(', ')}`;
  }

  if (typeof quantity !== 'number' || quantity < 0) {
    return 'quantity must be a non-negative number';
  }

  if (!VALID_UNITS[activity_type]?.includes(unit)) {
    return `Invalid unit "${unit}" for ${activity_type}. Must be one of: ${VALID_UNITS[activity_type]?.join(', ')}`;
  }

  return null;
}

// ─── Update DaySession totals (SQLite upsert) ───────────────────────

function updateDayTotals(
  userId: string,
  impact: ReturnType<typeof calculateImpact>
) {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO day_sessions (user_id, date, total_co2e_kg, total_water_l, total_kwh, total_waste_kg, total_saved_co2e_kg, activity_count, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
     ON CONFLICT (user_id, date) DO UPDATE SET
       total_co2e_kg       = total_co2e_kg       + excluded.total_co2e_kg,
       total_water_l       = total_water_l       + excluded.total_water_l,
       total_kwh           = total_kwh           + excluded.total_kwh,
       total_waste_kg      = total_waste_kg      + excluded.total_waste_kg,
       total_saved_co2e_kg = total_saved_co2e_kg + excluded.total_saved_co2e_kg,
       activity_count      = activity_count      + 1,
       updated_at          = ?`
  ).run(userId, today, impact.co2e_kg, impact.water_l, impact.kwh, impact.waste_kg, impact.saved_co2e_kg || 0, now, now);

  const row = db.prepare(
    `SELECT total_co2e_kg, total_water_l, total_kwh, total_waste_kg, total_saved_co2e_kg
     FROM day_sessions WHERE user_id = ? AND date = ?`
  ).get(userId, today) as any;

  return row;
}

// ─── POST /activity ─────────────────────────────────────────────────

router.post('/', (req: Request, res: Response) => {
  try {
    const error = validateActivity(req.body);
    if (error) {
      res.status(400).json({ success: false, error });
      return;
    }

    const { user_id, day_session_id, activity_type, subtype, quantity, unit } = req.body;

    const calculated_impact = calculateImpact({ activity_type, subtype, quantity, unit });
    const now = new Date().toISOString();

    const insertResult = db.prepare(
      `INSERT INTO activity_logs (user_id, day_session_id, activity_type, subtype, quantity, unit, calculated_impact, metadata, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      user_id, day_session_id, activity_type, subtype, quantity, unit,
      JSON.stringify(calculated_impact),
      JSON.stringify({ source: 'manual', confidence: calculated_impact.confidence }),
      now
    );

    const updatedSession = updateDayTotals(user_id, calculated_impact);

    res.status(201).json({
      success: true,
      activity_id: insertResult.lastInsertRowid,
      calculated_impact_json: calculated_impact,
      day_totals: {
        total_co2e_kg:       updatedSession.total_co2e_kg,
        total_water_l:       updatedSession.total_water_l,
        total_kwh:           updatedSession.total_kwh,
        total_waste_kg:      updatedSession.total_waste_kg,
        total_saved_co2e_kg: updatedSession.total_saved_co2e_kg
      }
    });
  } catch (err) {
    console.error('Error logging activity:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── GET /activity/:userId/:date ────────────────────────────────────

router.get('/:userId/:date', (req: Request, res: Response) => {
  try {
    const { userId, date } = req.params;

    const activities = db.prepare(
      `SELECT id, user_id, day_session_id, activity_type, subtype, quantity, unit, calculated_impact, metadata, timestamp
       FROM activity_logs WHERE user_id = ? AND DATE(timestamp) = ? ORDER BY timestamp DESC`
    ).all(userId, date);

    const dayTotals = db.prepare(
      `SELECT total_co2e_kg, total_water_l, total_kwh, total_waste_kg, total_saved_co2e_kg
       FROM day_sessions WHERE user_id = ? AND date = ?`
    ).get(userId, date) as any || {
      total_co2e_kg: 0, total_water_l: 0, total_kwh: 0, total_waste_kg: 0, total_saved_co2e_kg: 0
    };

    res.json({
      success: true,
      activities,
      day_totals: {
        total_co2e_kg:       dayTotals.total_co2e_kg,
        total_water_l:       dayTotals.total_water_l,
        total_kwh:           dayTotals.total_kwh,
        total_waste_kg:      dayTotals.total_waste_kg,
        total_saved_co2e_kg: dayTotals.total_saved_co2e_kg
      }
    });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── GET /activity/totals/:userId/:date ─────────────────────────────

router.get('/totals/:userId/:date', (req: Request, res: Response) => {
  try {
    const { userId, date } = req.params;

    const totals = db.prepare(
      `SELECT total_co2e_kg, total_water_l, total_kwh, total_waste_kg, total_saved_co2e_kg
       FROM day_sessions WHERE user_id = ? AND date = ?`
    ).get(userId, date) as any || {
      total_co2e_kg: 0, total_water_l: 0, total_kwh: 0, total_waste_kg: 0, total_saved_co2e_kg: 0
    };

    res.json({
      success: true,
      day_totals: {
        total_co2e_kg:       totals.total_co2e_kg,
        total_water_l:       totals.total_water_l,
        total_kwh:           totals.total_kwh,
        total_waste_kg:      totals.total_waste_kg,
        total_saved_co2e_kg: totals.total_saved_co2e_kg
      }
    });
  } catch (err) {
    console.error('Error fetching totals:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
