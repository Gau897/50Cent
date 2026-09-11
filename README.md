# RiskRoute — Safety-First Navigation Engine

> *"Find the safest route, not just the fastest route."*

RiskRoute is a full-stack interactive prototype web application built for real-time safety navigation. It analyzes multi-factor hazards (environmental telemetry, road elevation/geometry, traffic bottlenecks, and verified historical crash records) to evaluate routes and keep drivers safe.

---

## 🌟 Key Features

1. **Interactive Route Planner (`/app`)**:
   - Compare 3 dynamically computed routes (**Fastest**, **Recommended Safest**, **Alternative**).
   - Visual polyline overlays with color coding on Leaflet mapping engine.
   - Environmental weather conditions panel (precipitation, temperature, visibility, wind speed).
   - Weighted multi-factor risk score breakdown (road grade, weather impact, traffic, crash frequency).

2. **Live Turn-by-Turn Navigation HUD (`/app/navigation`)**:
   - High-fidelity simulated drive mode and hardware GPS tracking (`navigator.geolocation`).
   - Rotatable vehicle marker aligned with live heading and bearing calculation.
   - Proximity radar with slide-down warning banners when entering risk zone radii (<350m, <200m, <100m).
   - Audible Web Audio sonar beeps and spoken speech advisories (Web Speech Synthesis API).
   - Haptic feedback vibration on supported mobile devices.

3. **Historical Accident Inspector & Risk Zones**:
   - Detailed incident markers with interactive photo inspection gallery modal.
   - Categorized by severity (minor, moderate, severe, fatal) and verified incident records.

4. **Risk Intelligence Breakdown (`/app/analysis`)**:
   - Comprehensive comparative charts and danger sector logs.

5. **Trip Session Logs (`/app/history`)**:
   - Persistent logging of completed journeys, alerts encountered, and metrics.

6. **Safety & Radar Settings (`/app/settings`)**:
   - Custom radar proximity thresholds (200m, 350m, 500m), voice alert toggles, and audio sonar switches.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **Mapping**: Leaflet + React-Leaflet
- **Audio & Haptics**: Web Audio API + SpeechSynthesis API + Vibration API
- **Database Schema**: Prisma ORM (PostgreSQL compatible)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
