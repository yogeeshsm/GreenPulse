# GreenPulse - Personal Sustainability Ledger App

A comprehensive full-day sustainability tracking application that monitors your environmental impact from alarm to sleep.

## 🌱 Overview

GreenPulse is a daily operating system for sustainability that tracks activities and estimates emissions/impact across multiple domains:
- **Transport**: Tracks commute methods and calculates CO₂e emissions
- **Energy**: Monitors electricity usage from various devices
- **Water**: Tracks water consumption and savings
- **Food**: Estimates meal-based carbon footprint
- **Waste**: Records recycling, composting, and waste diversion
- **Shopping**: Monitors packaging and delivery impact

## ✨ Key Features Implemented

### 1. **Impact Calculation Engine** (`lib/impactEngine.ts`)
- Real-time emissions calculations using comprehensive factor tables
- Avoided emissions tracking (e.g., metro vs car)
- Confidence scoring for estimates
- Transparent calculation explanations

### 2. **Points System** (`lib/pointsEngine.ts`)
- **Impact Points**: Based on actual avoided emissions (100 points per kg CO₂e)
- **Behavior Points**: Rewards consistency, goal completion, and streaks
- **Smart Capping**: Prevents gaming the system while rewarding real impact

### 3. **Factor Table** (`lib/factorTable.ts`)
Complete emission factors for:
- Transport modes (walk, cycle, metro, bus, car, etc.)
- Energy devices (AC, laptop, lights, appliances)
- Water consumption (shower, bucket, tap)
- Food types (veg, egg, chicken, mutton, fish)
- Waste actions (compost, recycle, reuse)

### 4. **Dashboard View** 
- Real-time sustainability score (0-100)
- Daily totals for CO₂e, kWh, water, waste
- Quick action buttons for fast logging
- Today's goals with completion tracking
- Streak counter

### 5. **Quick Log Modal**
- Category-specific logging: transport, food, energy, water, waste
- Two-step process: select type → enter quantity
- Automatic impact calculation
- Visual feedback with icons and colors

### 6. **Timeline View**
- Chronological activity log
- Shows all logged activities with timestamps
- Impact breakdown for each activity

### 7. **Micro-Moves**
- One-tap actions for quick sustainability wins
- Pre-defined actions: refill bottle, cloth bag, composted, etc.
- Instant points and avoided emissions credit

### 8. **Daily Summary**
- Comprehensive end-of-day report
- Visual score representation
- Top impact categories analysis
- Goal completion tracker
- Tomorrow's suggestions based on today's activities
- Share progress & export report functionality

### 9. **Weekly Insights**
- 7-day trend analysis
- Top drivers identification
- Suggested swaps for bigger impact
- Historical data visualization

### 10. **Calculation Features**
- **Sustainability Score**: Dynamic 0-100 score based on emissions, avoided impact, and goals
- **Avoided Emissions**: Automatic calculation vs baseline (e.g., public transport vs driving)
- **Water Savings**: Comparison against default usage patterns
- **Confidence Scoring**: Each estimate includes confidence level

## 🚀 How to Use

### Starting Your Day
1. Open the app - it shows your dashboard
2. Set 3 daily goals (automatically suggested based on past behavior)
3. Start logging activities as they happen

### During the Day
- Use **Quick Log** buttons on Dashboard for fast entry
- Tap **+** floating button for any category
- Execute **Micro-Moves** for instant quick actions
- View your **Timeline** to see all activities

### Ending Your Day
- Click **"End Day ✨"** button (bottom right)
- Review your Daily Summary
- See your score, points, and impact
- Get suggestions for tomorrow
- Share your progress or export report

### Weekly Review
- Navigate to **Insights** from menu
- See your 7-day trends
- Identify top impact areas
- Get personalized swap suggestions

## 📊 Understanding Your Metrics

### Sustainability Score (0-100)
- Starts at 50 (baseline)
- -30 max for emissions (higher emissions = lower score)
- +30 max for avoided emissions
- +20 max for goal completion

### Green Points
- **Impact Points**: 100 points per kg CO₂e avoided
- **Behavior Points**: Goals (10 each), Daily close (20), Streaks (5/day)
- Behavior points capped at 2× impact points

### Carbon Emissions (kg CO₂e)
- Total emissions from activities
- Avoided emissions vs alternatives
- Range-based estimates with confidence scores

## 🎯 Daily Goals System

Goals are automatically suggested based on:
- Your most frequent activity types
- Biggest impact categories from previous days
- Common sustainability actions

Complete goals to earn behavior points and maintain streaks!

## 📱 Navigation

- **Home**: Feature showcase and app overview
- **Dashboard**: Your daily operating center
- **Timeline**: Chronological activity log
- **Micro-Moves**: One-tap quick actions
- **Insights**: Weekly trends and analysis
- **Daily Summary**: End-of-day comprehensive report

## 🔬 Demo Scenario (from Whitepaper)

Example user day:
- Shower: 6 min (54L water)
- Metro commute: 12 km (0.42 kg CO₂e)
- Veg lunch (0.7 kg CO₂e)
- Laptop: 6 hours (0.36 kWh)
- AC: 2 hours (3 kWh)
- Recycled packaging
- Refused plastic cutlery

**Result**: ~78/100 score, 245 points, 1.2 kg CO₂e avoided

## 🛠️ Technical Implementation

### Architecture
- **Frontend**: React with TypeScript
- **State Management**: Custom hooks (useAppState)
- **Styling**: Tailwind CSS with custom design system
- **Components**: Modular, reusable UI components
- **Type Safety**: Full TypeScript coverage

### Key Files
```
src/
├── lib/
│   ├── factorTable.ts      # Emission factors and constants
│   ├── impactEngine.ts     # Calculation logic
│   └── pointsEngine.ts     # Points and rewards system
├── components/
│   ├── Dashboard.tsx       # Main dashboard view
│   ├── DailySummary.tsx    # End-of-day report
│   ├── QuickLogModal.tsx   # Activity logging
│   ├── Timeline.tsx        # Activity timeline
│   └── MicroMoves.tsx      # Quick actions
├── hooks/
│   └── useAppState.ts      # Global state management
├── types/
│   └── index.ts            # TypeScript definitions
└── App.tsx                 # Main app component
```

## 🌟 Whitepaper Features Status

✅ **Implemented:**
- Full-day tracking (Alarm → Sleep conceptual model)
- Impact estimation engine with factor tables
- Points engine (Impact + Behavior)
- Activity logging for all 7 domains
- Daily closing ritual with summary
- Weekly insights with trends
- Micro-moves library
- Goals system with streaks
- Dashboard with quick actions
- Timeline view
- Sustainability scoring
- Avoided emissions calculation
- Export and share functionality

🎯 **Future Enhancements** (Beyond MVP):
- Backend API integration
- User authentication
- Cloud data sync
- Community circles/challenges
- Verified action partnerships
- Mobile app (React Native)
- Real-time notifications
- AQI data integration (optional)
- CVE scanning for dependencies

## 📈 Calculation Examples

### Transport
```
Metro: 12 km × 35 gCO₂e/km = 0.42 kg CO₂e
Avoided: (12 km × 180 gCO₂e/km [car]) - 0.42 = 1.74 kg CO₂e saved
```

### Energy
```
Laptop: 6 hr × 60W = 360 Wh = 0.36 kWh
Emissions: 0.36 kWh × 0.7 kg/kWh = 0.25 kg CO₂e
```

### Water
```
Shower: 6 min × 9 L/min = 54 L
Saved vs 10-min baseline: 4 min × 9 L/min = 36 L saved
```

### Food
```
Veg meal: 1 serving × 0.7 kg CO₂e = 0.7 kg CO₂e
Avoided vs chicken: (2.5 - 0.7) = 1.8 kg CO₂e saved
```

## 🎨 Design Principles

1. **Frictionless First**: Log your day in < 60 seconds
2. **Range-Based Honesty**: Show estimates as ranges with confidence
3. **Behavior Change > Perfection**: Reward consistency and improvement
4. **Privacy by Default**: Minimal data collection, clear controls
5. **Transparency**: Show how calculations work

## 📝 Data Privacy

- All data stored locally in browser
- No personal information required
- Optional location for better estimates
- Export your data anytime
- Clear calculation explanations

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

4. **Start tracking:**
   - Navigate to Dashboard
   - Log your first activity
   - Set your daily goals
   - See your impact in real-time!

## 🎯 Hackathon Deliverables (Completed)

✅ Working app prototype
✅ Complete calculation engines
✅ Factor table with MVP data
✅ All major UI components
✅ Points and scoring system
✅ Daily summary and reports
✅ Demo-ready with sample data
✅ Full TypeScript coverage
✅ Responsive design
✅ No compilation errors

## 📞 Support

This is a hackathon MVP demonstration of the GreenPulse concept as outlined in the whitepaper. All emission factors are illustrative placeholders for demonstration purposes.

---

**GreenPulse** - Track your day, see your impact, build better habits 🌱

*Made with ❤️ for a sustainable future*
