import { Route } from '@/types/route';

// Corridor: MIHAN SEZ (Wardha Road) to Sitabuldi / Zero Mile, Nagpur
// Route 1 (Fastest): Direct via Wardha Road Arterial & Chhatrapati Flyover (Green #22C55E)
// Route 2 (Safest - Recommended): via Hingna Bypass, Subhash Nagar & Dharampeth (Blue #3B82F6)
// Route 3 (Alternative): via Manewada Outer Ring Road & Medical Square (Orange #F97316)

export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Wardha Road Express',
    type: 'fastest',
    tag: 'Fastest',
    distanceKm: 14.3,
    durationMinutes: 22,
    riskScore: 18,
    safetyScore: 82,
    color: '#22C55E',
    isRecommended: false,
    summary: 'Direct arterial highway with elevated metro flyovers and high commuter volume.',
    via: 'Wardha Road & Chhatrapati Flyover',
    elevationGainM: 45,
    averageSpeedKmh: 48,
    riskFactors: [
      { category: 'road', label: 'Flyover Exit Merges', score: 24, description: 'Rapid deceleration zone near Chhatrapati Square flyover exit ramp.', impact: 'moderate' },
      { category: 'weather', label: 'Open Road Exposure', score: 12, description: 'Dry asphalt with optimal tire grip along metro corridor.', impact: 'low' },
      { category: 'traffic', label: 'Peak Hour Volume', score: 28, description: 'Heavy commuter and airport transit traffic during morning/evening.', impact: 'moderate' },
      { category: 'accidents', label: 'Rear-End Collisions', score: 18, description: '6 recorded tailgating incidents at U-turns in past 12 months.', impact: 'low' },
      { category: 'visibility', label: 'High Luminance LED', score: 8, description: 'Full modern LED pole lighting across 95% of route.', impact: 'low' },
    ],
    coordinates: [
      [21.0617, 79.0460], // MIHAN SEZ Entry
      [21.0745, 79.0523], // AIIMS Nagpur
      [21.0892, 79.0589], // Nagpur Airport South
      [21.1012, 79.0645], // Ujjwal Nagar
      [21.1124, 79.0682], // Chhatrapati Square
      [21.1245, 79.0721], // Ajni Square
      [21.1356, 79.0778], // Rahate Colony
      [21.1445, 79.0812], // Panchsheel Square
      [21.1484, 79.0840], // Sitabuldi Metro Interchange
    ],
  },
  {
    id: 'route-2',
    name: 'Dharampeth & West Arterial',
    type: 'safest',
    tag: 'Recommended Safest',
    distanceKm: 15.8,
    durationMinutes: 26,
    riskScore: 12,
    safetyScore: 88,
    color: '#3B82F6',
    isRecommended: true,
    summary: 'Wide residential-arterial corridor with segregated lanes, speed calming, and minimal heavy trucks.',
    via: 'Hingna Link & West High Court Road',
    elevationGainM: 35,
    averageSpeedKmh: 42,
    riskFactors: [
      { category: 'road', label: 'Segregated Dual Carriageway', score: 8, description: 'Resurfaced pavement with median barriers and dedicated turning bays.', impact: 'low' },
      { category: 'weather', label: 'Tree-Canopied Boulevard', score: 10, description: 'Shaded boulevard reducing asphalt heat degradation.', impact: 'low' },
      { category: 'traffic', label: 'Smart Signal Synchronization', score: 15, description: 'Smooth progressive signal pacing prevents sudden braking.', impact: 'low' },
      { category: 'accidents', label: 'Low Crash History', score: 9, description: 'Only 2 minor fender benders reported along this corridor in 24 months.', impact: 'low' },
      { category: 'visibility', label: 'Full Street Illumination', score: 6, description: 'Uninterrupted LED street lighting with high contrast road markings.', impact: 'low' },
    ],
    coordinates: [
      [21.0617, 79.0460], // MIHAN SEZ
      [21.0789, 79.0389], // Hingna T-Point
      [21.0956, 79.0412], // Trimurti Nagar
      [21.1123, 79.0456], // Subhash Nagar Metro
      [21.1289, 79.0534], // Shankar Nagar Square
      [21.1398, 79.0623], // Dharampeth WHC Road
      [21.1465, 79.0745], // Law College / Alankar Square
      [21.1484, 79.0840], // Sitabuldi Metro Interchange
    ],
  },
  {
    id: 'route-3',
    name: 'Outer Ring & Medical Corridor',
    type: 'alternative',
    tag: 'Alternative Bypass',
    distanceKm: 17.6,
    durationMinutes: 31,
    riskScore: 39,
    safetyScore: 61,
    color: '#F97316',
    isRecommended: false,
    summary: 'Outer ring route with heavy freight transit, multiple truck terminals, and active flyover works.',
    via: 'Manewada Ring Road & Medical Square',
    elevationGainM: 60,
    averageSpeedKmh: 36,
    riskFactors: [
      { category: 'road', label: 'Unbanked Truck Corridors', score: 48, description: 'Pavement rutting and loose gravel from heavy transport trailers.', impact: 'high' },
      { category: 'weather', label: 'Dust & Pavement Friction Drop', score: 38, description: 'Construction dust pockets reducing wet braking traction.', impact: 'moderate' },
      { category: 'traffic', label: 'Heavy Freight Trucks', score: 45, description: 'Commercial cargo carriers making wide turn radius maneuvers.', impact: 'high' },
      { category: 'accidents', label: 'Intersection Rollovers', score: 42, description: '14 multi-vehicle collisions near Manewada Square in past year.', impact: 'high' },
      { category: 'visibility', label: 'Intermittent Unlit Patches', score: 32, description: 'Sparse lighting on Ring Road bypass sectors.', impact: 'moderate' },
    ],
    coordinates: [
      [21.0617, 79.0460], // MIHAN SEZ
      [21.0712, 79.0654], // Besa Link Road
      [21.0898, 79.0812], // Shatabdi Nagar
      [21.1068, 79.0965], // Manewada Ring Road Square
      [21.1234, 79.1023], // Tukdoji Square
      [21.1345, 79.0956], // Medical Square
      [21.1423, 79.0898], // Cotton Market
      [21.1484, 79.0840], // Sitabuldi Metro Interchange
    ],
  },
];
