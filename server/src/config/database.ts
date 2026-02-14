// SQLite Database Configuration & Table Setup
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || './greenpulse.db';
const dbPath = path.resolve(DB_PATH);

export const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Table creation SQL ─────────────────────────────────────────────

export function initializeDatabase(): boolean {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id         TEXT NOT NULL,
        day_session_id  TEXT NOT NULL,
        activity_type   TEXT NOT NULL,
        subtype         TEXT NOT NULL,
        quantity        REAL NOT NULL,
        unit            TEXT NOT NULL,
        calculated_impact TEXT NOT NULL,
        metadata        TEXT NOT NULL,
        timestamp       TEXT NOT NULL DEFAULT (datetime('now')),
        created_at      TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_al_user_id ON activity_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_al_session ON activity_logs(user_id, day_session_id);
      CREATE INDEX IF NOT EXISTS idx_al_timestamp ON activity_logs(timestamp);

      CREATE TABLE IF NOT EXISTS day_sessions (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id             TEXT NOT NULL,
        date                TEXT NOT NULL,
        total_co2e_kg       REAL NOT NULL DEFAULT 0,
        total_water_l       REAL NOT NULL DEFAULT 0,
        total_kwh           REAL NOT NULL DEFAULT 0,
        total_waste_kg      REAL NOT NULL DEFAULT 0,
        total_saved_co2e_kg REAL NOT NULL DEFAULT 0,
        activity_count      INTEGER NOT NULL DEFAULT 0,
        daily_score         INTEGER NOT NULL DEFAULT 50,
        streak_days         INTEGER NOT NULL DEFAULT 0,
        created_at          TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at          TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, date)
      );

      CREATE INDEX IF NOT EXISTS idx_ds_user_date ON day_sessions(user_id, date);
    `);
    console.log('✅ SQLite tables initialized');
    return true;
  } catch (err) {
    console.error('❌ Failed to initialize database tables:', err);
    return false;
  }
}

export function checkConnection(): boolean {
  try {
    const row = db.prepare('SELECT 1 AS test').get() as any;
    return row?.test === 1;
  } catch {
    return false;
  }
}
