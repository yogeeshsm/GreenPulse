# 🌿 GreenPulse AI is an AI-powered, image-assisted carbon footprint estimation tool that makes environmental impact assessment simple and accessible.
* Users can estimate the carbon cost of everyday objects by uploading a photo and adding optional context.
* The system combines computer vision, generative AI, and sustainability science to deliver meaningful insights.
* It identifies objects from images and analyzes their lifecycle impact.
* Carbon emissions are estimated in grams of CO₂ equivalent (gCO₂e).
* Calculations consider manufacturing processes, materials, and usage impacts.
* The platform transforms complex environmental data into clear, understandable results.
* It supports informed decision-making for individuals and organizations.
* GreenPulse AI empowers users to take practical steps toward reducing their carbon footprint.
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-purple?logo=vite)
![Express](https://img.shields.io/badge/Express-4.21-black?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-blue?logo=sqlite)

---

## 📸 Features

### 🏠 Dashboard
- Real-time sustainability score with daily progress tracking
- Interactive charts (CO₂ emissions, water usage, energy consumption)
- Streak counter and daily activity timeline
- Quick-log modal for fast activity entry

### 📊 Input Calculator 
- **7 input categories:** Electricity, Natural Gas, Fuel, Cars, Flights, Public Transport, Spend
- Sidebar navigation with step wizard (Select → Input → Review)
- Country-based emission factors for accurate calculations
- Results table with date, emissions (tCO₂e), details, and comments

### ⚡ Impact Engine
- **5 activity types** with scientifically-backed emission factors:
  - **Electricity** — AC, fan, laptop, LED bulb, geyser (kWh → kg CO₂e)
  - **Water** — Shower, bucket, tap (minutes → litres)
  - **Waste** — Plastic bottle, bag, container (count → kg waste + CO₂e)
  - **Materials** — Reusable vs single-use items (CO₂e saved)
  - **Flights** — 7 class/distance subtypes (km → kg CO₂e)

### 🎯 Additional Features
- Carbon Credit Calculator
- QR code sharing for sustainability scores
- Micro Moves — small daily eco-actions
- Weekly insights with trend analysis
- Ledger view for detailed activity history
- Toast notification system

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2, TypeScript, Vite 7.2, Tailwind CSS |
| **UI Components** | shadcn/ui, Lucide icons |
| **Charts** | Recharts, Chart.js + react-chartjs-2 |
| **Backend** | Node.js, Express 4.21, TypeScript |
| **Database** | SQLite (better-sqlite3) — zero config, file-based |
| **Dev Tools** | tsx (runtime), ESLint, PostCSS |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### 1. Clone the repository
```bash
git clone https://github.com/yogeeshsm/GreenPulse.git
cd GreenPulse
```

### 2. Start the Backend
```bash
cd server
npm install
npx tsx src/index.ts
```
The server starts at **http://localhost:3001** with:
- ✅ All calculation assertions verified on startup
- ✅ SQLite database auto-created (`greenpulse.db`)
- ✅ Tables initialized automatically

### 3. Start the Frontend
```bash
cd app
npm install
npm run dev
```
The app opens at **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/activity` | Log an activity and get calculated impact |
| `GET` | `/activity/:userId/:date` | Get all activities for a user on a date |
| `GET` | `/activity/totals/:userId/:date` | Get day totals for a user |
| `POST` | `/calculate` | Calculate impact without saving (preview) |
| `GET` | `/factors` | Get the full emission factor table |
| `GET` | `/health` | Server health check |

### Example: Log an Activity
```bash
curl -X POST http://localhost:3001/activity \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-1",
    "day_session_id": "2026-02-14",
    "activity_type": "electricity",
    "subtype": "ac",
    "quantity": 2,
    "unit": "hours"
  }'
```

**Response:**
```json
{
  "success": true,
  "activity_id": 1,
  "calculated_impact_json": {
    "co2e_kg": 2.1,
    "kwh": 3,
    "water_l": 0,
    "waste_kg": 0,
    "confidence": 0.95,
    "explanation": "AC used for 2 hours consumed 3.00 kWh and emitted 2.10 kg CO2"
  },
  "day_totals": {
    "total_co2e_kg": 2.1,
    "total_water_l": 0,
    "total_kwh": 3,
    "total_waste_kg": 0,
    "total_saved_co2e_kg": 0
  }
}
```

---

## 📁 Project Structure

```
GreenPulse/
├── app/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── calculator/       # Sustrax Vita-style calculator
│   │   │   │   ├── CalculatorLayout.tsx
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   ├── ResultsTable.tsx
│   │   │   │   └── StepWizard.tsx
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── QuickLogModal.tsx
│   │   │   └── ...
│   │   ├── sections/             # Landing page sections
│   │   ├── lib/                  # Engines & utilities
│   │   │   ├── impactEngine.ts
│   │   │   ├── factorTable.ts
│   │   │   └── ...
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript type definitions
│   │   └── data/                 # Mock data
│   └── public/                   # Static assets
│
├── server/                       # Backend (Express + SQLite)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts       # SQLite connection & table setup
│   │   │   └── factorTable.ts    # Emission factor definitions
│   │   ├── engine/
│   │   │   └── calculateImpact.ts # Core calculation engine
│   │   ├── routes/
│   │   │   └── activity.ts       # Activity CRUD endpoints
│   │   └── index.ts              # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🔬 Emission Factors

| Activity | Subtype | Factor | Unit |
|----------|---------|--------|------|
| Electricity | AC | 1.5 kWh/hr → 0.7 kg CO₂e/kWh | hours |
| Electricity | Fan | 0.075 kWh/hr | hours |
| Water | Shower | 9 L/min | minutes |
| Waste | Plastic Bottle | 0.02 kg waste, 0.05 kg CO₂e | count |
| Flights | Domestic Economy | 0.255 kg CO₂e/km | km |
| Flights | Long Haul First | 0.600 kg CO₂e/km | km |

---

## 🛠️ Development

```bash
# Frontend dev server (hot reload)
cd app && npm run dev

# Backend dev server
cd server && npx tsx src/index.ts

# TypeScript type check (frontend)
cd app && npx tsc --noEmit

# Build frontend for production
cd app && npm run build
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with 💚 for a sustainable future.**
