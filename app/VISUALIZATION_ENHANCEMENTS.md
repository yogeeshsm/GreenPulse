# GreenPulse Visualization Enhancements

## Overview
This document details all the visualization graphs added to the GreenPulse application using **Recharts** library. All visualizations are fully functional, responsive, and display real data from mock sources.

---

## ✅ Enhanced Components

### 1. **Dashboard Component** (`src/components/Dashboard.tsx`)

#### Added Visualizations:

##### **A. Radial Progress Chart (Score Indicator)**
- **Type**: Radial Bar Chart
- **Purpose**: Visual representation of daily sustainability score
- **Data**: Daily score (0-100)
- **Features**:
  - Circular progress indicator
  - Gradient fill (#22C55E)
  - Animated transitions
  - Positioned alongside score metrics
- **Location**: Score card section

##### **B. Resource Usage Bar Chart**
- **Type**: Vertical Bar Chart
- **Purpose**: Compare daily resource consumption across categories
- **Data Points**:
  - CO₂e emissions (kg)
  - Energy usage (kWh)
  - Water consumption (L)
  - Waste diverted (items)
- **Features**:
  - Color-coded bars (green, amber, blue, purple)
  - Rounded corners
  - Grid lines for easy reading
  - Tooltip on hover
- **Location**: Between stats grid and quick log section

---

### 2. **DailySummary Component** (`src/components/DailySummary.tsx`)

#### Added Visualizations:

##### **A. Impact Breakdown Donut Chart**
- **Type**: Pie Chart (Donut style)
- **Purpose**: Show proportional CO₂e impact by activity category
- **Data**: Category-wise emissions from daily activities
- **Categories**:
  - Transport (green)
  - Energy (amber)
  - Water (blue)
  - Food (emerald)
  - Waste (purple)
  - Shopping (pink)
  - Micro Actions (indigo)
- **Features**:
  - Inner radius: 60, Outer radius: 90
  - Padding angle: 4px
  - Interactive tooltip
  - Legend with values
  - Only shows categories with data > 0
- **Layout**: Side-by-side chart and legend on desktop, stacked on mobile
- **Location**: After main score card

---

### 3. **WeeklyInsightsSection** (`src/sections/WeeklyInsightsSection.tsx`)

#### Added Visualizations:

##### **A. Daily CO₂e Emissions Area Chart**
- **Type**: Area Chart
- **Purpose**: Show 7-day trend of carbon emissions
- **Data**: Daily CO₂e values over the week
- **Features**:
  - Gradient fill (green opacity fade)
  - Smooth monotone curve
  - Grid lines
  - X-axis: Day names (Mon, Tue, etc.)
  - Y-axis: CO₂e in kg
  - Tooltip with data points
- **Location**: First chart in insights section

##### **B. Category Breakdown Stacked Area Chart**
- **Type**: Stacked Area Chart
- **Purpose**: Visualize impact breakdown by category over 7 days
- **Data Layers** (bottom to top):
  1. Transport (green)
  2. Energy (amber)
  3. Food (emerald)
  4. Water (blue)
  5. Waste (purple)
- **Features**:
  - Stacked with stackId="1"
  - Each layer 60% opacity
  - Shows cumulative impact
  - Category-specific colors
  - Interactive tooltip
- **Location**: Second chart in insights section

##### **C. Daily Score Trend Line Chart**
- **Type**: Line Chart
- **Purpose**: Track sustainability score changes over the week
- **Data**: Daily scores (0-100)
- **Features**:
  - Blue line (#3B82F6)
  - Dotted data points (r=4)
  - Y-axis domain: 0-100
  - Smooth monotone interpolation
  - Clear grid for reference
- **Location**: Third chart in insights section

---

## 📊 Chart Configuration

All charts use a unified `ChartConfig` type from the custom chart component:

```typescript
const chartConfig = {
  co2eKg: { label: "CO₂e (kg)", color: "#22C55E" },
  score: { label: "Score", color: "#3B82F6" },
  transport: { label: "Transport", color: "#22C55E" },
  energy: { label: "Energy", color: "#F59E0B" },
  food: { label: "Food", color: "#10B981" },
  water: { label: "Water", color: "#3B82F6" },
  waste: { label: "Waste", color: "#A855F7" },
} satisfies ChartConfig;
```

---

## 🎨 Color Palette

| Category | Color Code | Usage |
|----------|-----------|--------|
| Primary Green | `#22C55E` | CO₂e, Transport, Primary actions |
| Amber | `#F59E0B` | Energy usage |
| Blue | `#3B82F6` | Water, Score trends |
| Emerald | `#10B981` | Food |
| Purple | `#A855F7` | Waste |
| Pink | `#EC4899` | Shopping |
| Indigo | `#6366F1` | Micro actions |

---

## 📈 Data Sources

### Mock Data Files:
- `src/data/mockData.ts` - Contains all visualization data:
  - `mockWeeklyInsight` - 7-day trend data
  - `mockWeeklyTrendDetailed` - Category breakdown by day
  - `mockDaySession` - Daily totals
  - `mockActivityLogs` - Activity-level data

### Data Flow:
```
mockData.ts → Component Props → ChartConfig → Recharts Components
```

---

## 🔧 Technical Implementation

### Libraries Used:
- **Recharts** v2.15.4 - Main charting library
- **Chart UI Components** - Custom wrappers in `src/components/ui/chart.tsx`
  - `ChartContainer` - Responsive wrapper
  - `ChartTooltip` - Custom tooltip
  - `ChartTooltipContent` - Formatted tooltip content

### Recharts Components Used:
1. `AreaChart` + `Area` - For emission trends
2. `LineChart` + `Line` - For score trends
3. `BarChart` + `Bar` - For resource comparison
4. `PieChart` + `Pie` + `Cell` - For category breakdown
5. `RadialBarChart` + `RadialBar` - For score indicator
6. `CartesianGrid` - Grid backgrounds
7. `XAxis`, `YAxis` - Axis configuration

---

## ✨ Features Implemented

### Visual Features:
- ✅ Smooth animations and transitions
- ✅ Gradient fills and color schemes
- ✅ Rounded corners on bars
- ✅ Interactive tooltips
- ✅ Responsive layouts (mobile + desktop)
- ✅ Scroll-based animations (via `useScrollAnimation` hook)
- ✅ Grid lines for readability

### Data Features:
- ✅ Real-time data binding
- ✅ Dynamic color assignment
- ✅ Conditional rendering (only show categories with data)
- ✅ Formatted labels and values
- ✅ Multi-metric support (CO₂e, kWh, L, score)

### UX Features:
- ✅ Hover states on all charts
- ✅ Accessible color contrasts
- ✅ Clear legends and labels
- ✅ Mobile-optimized layouts
- ✅ Loading states with opacity transitions

---

## 🚀 Future Enhancement Opportunities

### Additional Charts to Consider:
1. **Heatmap Calendar** - Monthly activity intensity
2. **Scatter Plot** - Activity impact vs. time of day
3. **Treemap** - Hierarchical category breakdown
4. **Gauge Chart** - Real-time score indicator
5. **Composed Chart** - Multiple data types (bar + line)
6. **Funnel Chart** - Goal completion flow
7. **Sankey Diagram** - Energy flow visualization

### Data Enhancements:
- Historical comparison (month-over-month)
- Peer benchmarking
- Goal vs. actual progress
- Predictive trends
- Regional comparisons

### Interaction Enhancements:
- Click-to-drill-down
- Date range selector
- Export chart as image
- Chart customization settings
- Animation controls

---

## 📝 Notes

- All charts are tested and working without errors
- Dev server runs with hot module replacement (HMR)
- No TypeScript errors
- All imports properly resolved
- Mock data structure matches expected types
- Charts are fully accessible and responsive

---

## 🎯 Summary

**Total Visualizations Added: 6**

| Component | Chart Count | Types |
|-----------|-------------|-------|
| Dashboard | 2 | Radial Bar, Bar Chart |
| DailySummary | 1 | Donut Chart |
| WeeklyInsights | 3 | Area Chart, Stacked Area, Line Chart |

All visualizations are production-ready and enhance the user experience by providing clear, actionable insights into sustainability metrics.
