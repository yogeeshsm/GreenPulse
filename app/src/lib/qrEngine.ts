// GreenPulse QR Code Share System
// Generates QR codes encoding sustainability data for sharing/verification

import type { DaySession, ActivityLog } from '@/types';

export interface QRPayload {
  version: string;
  type: 'daily' | 'weekly' | 'badge';
  userId: string;
  date: string;
  score: number;
  co2eKg: number;
  avoidedCo2eKg: number;
  greenPoints: number;
  streakDays: number;
  activitiesCount: number;
  signature: string; // simple hash for verification
}

/**
 * Generate a QR payload from a day session
 */
export function generateDailyQRPayload(
  daySession: DaySession,
  activities: ActivityLog[]
): QRPayload {
  const payload: QRPayload = {
    version: '1.0',
    type: 'daily',
    userId: daySession.userId,
    date: daySession.date,
    score: daySession.dailyScore,
    co2eKg: daySession.totals.co2eKg,
    avoidedCo2eKg: daySession.totals.avoidedCo2eKg,
    greenPoints: daySession.totals.greenPoints,
    streakDays: daySession.streakDays,
    activitiesCount: activities.length,
    signature: ''
  };

  payload.signature = generateSimpleHash(payload);
  return payload;
}

/**
 * Convert QR payload to a compact URL-safe string for QR encoding
 */
export function encodeQRPayload(payload: QRPayload): string {
  const data = {
    v: payload.version,
    t: payload.type,
    u: payload.userId,
    d: payload.date,
    s: payload.score,
    c: payload.co2eKg,
    a: payload.avoidedCo2eKg,
    p: payload.greenPoints,
    k: payload.streakDays,
    n: payload.activitiesCount,
    h: payload.signature
  };

  // Create a compact URL with base64-encoded data
  const jsonStr = JSON.stringify(data);
  const encoded = btoa(jsonStr);
  return `https://greenpulse.app/verify#${encoded}`;
}

/**
 * Decode a QR payload from the encoded string
 */
export function decodeQRPayload(encoded: string): QRPayload | null {
  try {
    const hash = encoded.split('#')[1];
    if (!hash) return null;
    
    const jsonStr = atob(hash);
    const data = JSON.parse(jsonStr);
    
    return {
      version: data.v,
      type: data.t,
      userId: data.u,
      date: data.d,
      score: data.s,
      co2eKg: data.c,
      avoidedCo2eKg: data.a,
      greenPoints: data.p,
      streakDays: data.k,
      activitiesCount: data.n,
      signature: data.h
    };
  } catch {
    return null;
  }
}

/**
 * Generate a simple hash for verification (not cryptographic - demo only)
 */
function generateSimpleHash(payload: Omit<QRPayload, 'signature'>): string {
  const str = `${payload.userId}-${payload.date}-${payload.score}-${payload.co2eKg}-${payload.avoidedCo2eKg}-${payload.greenPoints}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a badge QR payload (for achievements)
 */
export function generateBadgeQRPayload(
  userId: string,
  badgeType: string,
  earnedDate: string,
  score: number
): QRPayload {
  const payload: QRPayload = {
    version: '1.0',
    type: 'badge',
    userId,
    date: earnedDate,
    score,
    co2eKg: 0,
    avoidedCo2eKg: 0,
    greenPoints: 0,
    streakDays: 0,
    activitiesCount: 0,
    signature: ''
  };
  payload.signature = generateSimpleHash(payload);
  return payload;
}

/**
 * Generate share text for the QR code
 */
export function generateShareText(payload: QRPayload): string {
  if (payload.type === 'daily') {
    return [
      `🌱 GreenPulse Daily Report`,
      `📅 ${payload.date}`,
      `🏆 Score: ${payload.score}/100`,
      `🌍 CO₂e: ${payload.co2eKg.toFixed(2)} kg`,
      `💚 Avoided: ${payload.avoidedCo2eKg.toFixed(2)} kg`,
      `⭐ Points: ${payload.greenPoints}`,
      `🔥 Streak: ${payload.streakDays} days`,
      `📊 Activities: ${payload.activitiesCount}`,
      '',
      'Scan QR to verify 🔍'
    ].join('\n');
  }

  return `🌱 GreenPulse Badge - Score: ${payload.score}/100`;
}

/**
 * Generate full HTML report string for export
 */
export function generateHTMLReport(
  daySession: DaySession,
  activities: ActivityLog[],
  qrDataUrl: string
): string {
  const { totals } = daySession;

  const activityRows = activities.map(a => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${new Date(a.timestamp).toLocaleTimeString()}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-transform:capitalize">${a.activityType}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-transform:capitalize">${a.subtype}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${a.quantity} ${a.unit}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${a.calculatedImpact.co2eKg?.toFixed(3) || '—'} kg</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${Math.round((a.calculatedImpact.confidence || 0) * 100)}%</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GreenPulse Report - ${daySession.date}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f8f6; color: #1a1a1a; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .logo-icon { width: 40px; height: 40px; background: #22C55E; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; }
    .header h1 { font-size: 28px; color: #111; }
    .header .date { color: #666; margin-top: 4px; }
    .score-ring { text-align: center; margin: 32px 0; }
    .score-ring .number { font-size: 64px; font-weight: 800; color: #22C55E; }
    .score-ring .label { color: #999; font-size: 14px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .stat-card { background: white; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .stat-card .value { font-size: 24px; font-weight: 700; color: #111; }
    .stat-card .label { font-size: 12px; color: #666; margin-top: 4px; }
    .card { background: white; border-radius: 16px; padding: 24px; margin: 16px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .card h2 { font-size: 18px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 8px; border-bottom: 2px solid #22C55E; color: #22C55E; font-weight: 600; }
    .qr-section { text-align: center; margin: 32px 0; padding: 24px; background: white; border-radius: 16px; }
    .qr-section img { width: 200px; height: 200px; }
    .qr-section p { margin-top: 12px; color: #666; font-size: 13px; }
    .footer { text-align: center; padding: 24px 0; color: #999; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #16a34a; }
    .badge-blue { background: #dbeafe; color: #2563eb; }
    @media print { body { background: white; } .container { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">GP</div>
        <span style="font-size:20px;font-weight:600">GreenPulse</span>
      </div>
      <h1>Daily Sustainability Report</h1>
      <p class="date">${daySession.date} &nbsp;|&nbsp; ${activities.length} activities tracked</p>
    </div>

    <div class="score-ring">
      <div class="number">${daySession.dailyScore}</div>
      <div class="label">Sustainability Score / 100</div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="value">${totals.co2eKg.toFixed(2)}</div>
        <div class="label">kg CO₂e emitted</div>
      </div>
      <div class="stat-card">
        <div class="value" style="color:#22C55E">${totals.avoidedCo2eKg.toFixed(2)}</div>
        <div class="label">kg CO₂e avoided</div>
      </div>
      <div class="stat-card">
        <div class="value">${totals.kwh.toFixed(1)}</div>
        <div class="label">kWh energy</div>
      </div>
      <div class="stat-card">
        <div class="value">${totals.waterLiters}</div>
        <div class="label">L water</div>
      </div>
    </div>

    <div class="stats" style="grid-template-columns: repeat(3, 1fr);">
      <div class="stat-card">
        <div class="value">${totals.wasteDiverted}</div>
        <div class="label">waste items diverted</div>
      </div>
      <div class="stat-card">
        <div class="value" style="color:#22C55E">${totals.greenPoints}</div>
        <div class="label">Green Points</div>
      </div>
      <div class="stat-card">
        <div class="value">${daySession.streakDays}</div>
        <div class="label">day streak 🔥</div>
      </div>
    </div>

    <div class="card">
      <h2>📊 Activity Log</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Category</th>
            <th>Activity</th>
            <th>Quantity</th>
            <th>CO₂e</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${activityRows || '<tr><td colspan="6" style="padding:16px;text-align:center;color:#999">No activities logged yet</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="qr-section">
      <h2 style="margin-bottom:16px">📱 Scan to Verify</h2>
      <img src="${qrDataUrl}" alt="QR Code" />
      <p>Scan this QR code to verify this report's authenticity</p>
      <p style="margin-top:4px"><span class="badge badge-green">Verified by GreenPulse</span></p>
    </div>

    <div class="footer">
      <p>Generated by GreenPulse — Your Daily Sustainability Ledger</p>
      <p style="margin-top:4px">Data confidence average: ${activities.length > 0 ? Math.round(activities.reduce((s, a) => s + (a.calculatedImpact.confidence || 0), 0) / activities.length * 100) : 0}%</p>
    </div>
  </div>
</body>
</html>`;
}
