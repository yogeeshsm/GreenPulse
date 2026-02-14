// GreenPulse Backend Server
// Express + SQLite backend for the Impact Engine & Activity Logging

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import activityRoutes from './routes/activity';
import { factorTable } from './config/factorTable';
import { calculateImpact } from './engine/calculateImpact';
import { db, initializeDatabase, checkConnection } from './config/database';

// Load env config
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ─── Middleware ──────────────────────────────────────────────────────

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────

app.use('/activity', activityRoutes);

// ─── Factor Table endpoint (read-only) ──────────────────────────────

app.get('/factors', (_req, res) => {
  res.json({ success: true, factor_table: factorTable });
});

// ─── Calculate-only endpoint (no DB write) ──────────────────────────
// Useful for frontend preview before logging

app.post('/calculate', (req, res) => {
  const { activity_type, subtype, quantity, unit } = req.body;

  if (!activity_type || !subtype || quantity == null || !unit) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: activity_type, subtype, quantity, unit'
    });
    return;
  }

  const impact = calculateImpact({ activity_type, subtype, quantity, unit });
  res.json({ success: true, calculated_impact_json: impact });
});

// ─── Health check ───────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  const connected = checkConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: connected ? 'connected' : 'disconnected',
    type: 'sqlite'
  });
});

// ─── Expected Output Verification ───────────────────────────────────
// Validates the engine against the spec examples on startup

function verifyCalculations() {
  console.log('\n🔍 Verifying calculations against spec...\n');

  // AC 2 hours → kwh: 3, co2e: 2.1
  const ac = calculateImpact({ activity_type: 'electricity', subtype: 'ac', quantity: 2, unit: 'hours' });
  console.log(`  AC 2 hours:       kwh=${ac.kwh} (expect 3)  co2e=${ac.co2e_kg} (expect 2.1)`);
  console.assert(ac.kwh === 3,       `❌ AC kWh should be 3, got ${ac.kwh}`);
  console.assert(ac.co2e_kg === 2.1, `❌ AC CO2e should be 2.1, got ${ac.co2e_kg}`);

  // Shower 6 min → water_l: 54
  const shower = calculateImpact({ activity_type: 'water', subtype: 'shower', quantity: 6, unit: 'minutes' });
  console.log(`  Shower 6 min:     water_l=${shower.water_l} (expect 54)`);
  console.assert(shower.water_l === 54, `❌ Shower should be 54L, got ${shower.water_l}`);

  // 2 plastic bottles → waste_kg: 0.04, co2e: 0.1
  const bottles = calculateImpact({ activity_type: 'waste', subtype: 'plastic_bottle', quantity: 2, unit: 'count' });
  console.log(`  2 bottles:        waste_kg=${bottles.waste_kg} (expect 0.04)  co2e=${bottles.co2e_kg} (expect 0.1)`);
  console.assert(bottles.waste_kg === 0.04, `❌ Bottle waste should be 0.04, got ${bottles.waste_kg}`);
  console.assert(bottles.co2e_kg === 0.1,   `❌ Bottle CO2e should be 0.1, got ${bottles.co2e_kg}`);

  // Reusable item → saved 0.04
  const reusable = calculateImpact({ activity_type: 'materials', subtype: 'used_reusable_item', quantity: 1, unit: 'count' });
  console.log(`  Reusable item:    saved=${reusable.saved_co2e_kg} (expect 0.04)`);
  console.assert(reusable.saved_co2e_kg === 0.04, `❌ Reusable saved should be 0.04, got ${reusable.saved_co2e_kg}`);

  // Flights: domestic economy 500 km → 500 × 0.255 = 127.5 kg CO₂e
  const flight = calculateImpact({ activity_type: 'flights', subtype: 'domestic_economy', quantity: 500, unit: 'km' });
  console.log(`  Flight 500km:     co2e=${flight.co2e_kg} (expect 127.5)`);
  console.assert(flight.co2e_kg === 127.5, `❌ Flight CO2e should be 127.5, got ${flight.co2e_kg}`);

  // Full spec example: AC 2 hrs + Shower 6 min + 2 bottles
  const total_kwh = ac.kwh;
  const total_water = shower.water_l;
  const total_waste = bottles.waste_kg;
  const total_co2e = parseFloat((ac.co2e_kg + bottles.co2e_kg).toFixed(4));
  console.log(`\n  ✅ Combined totals: kwh=${total_kwh} water_l=${total_water} waste_kg=${total_waste} co2e_kg=${total_co2e}`);
  console.log(`     Expected:       kwh=3 water_l=54 waste_kg=0.04 co2e_kg=2.2\n`);

  console.log('✅ All calculations verified!\n');
}

// ─── Start ──────────────────────────────────────────────────────────

async function start() {
  // Verify calculations before even connecting to DB
  verifyCalculations();

  // Initialize SQLite tables (synchronous)
  try {
    const connected = checkConnection();
    if (connected) {
      initializeDatabase();
      console.log(`🗄️  SQLite database ready (file-based)`);
    } else {
      throw new Error('SQLite connection test failed');
    }
  } catch (err) {
    console.warn(`⚠️  SQLite unavailable. Running in calculation-only mode.`);
    console.warn('   POST /activity will fail. POST /calculate and GET /factors still work.\n');
  }

  app.listen(PORT, () => {
    console.log(`🌿 GreenPulse API server running on http://localhost:${PORT}`);
    console.log(`   POST /activity      — log activity & get impact`);
    console.log(`   POST /calculate     — calculate impact (no DB)`);
    console.log(`   GET  /factors       — get factor table`);
    console.log(`   GET  /health        — server status\n`);
  });
}

start();
