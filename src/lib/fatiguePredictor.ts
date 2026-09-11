import { DriverAlertnessState, AlertnessLevel, RestStop } from '@/types/fatigue';

export const MOCK_REST_STOPS: RestStop[] = [
  {
    id: 'rest-1',
    name: 'Shere Punjab Dhaba & Oasis Rest Stop',
    category: 'dhaba',
    distanceKm: 2.1,
    driveTimeMinutes: 4,
    rating: 4.6,
    amenities: ['24/7 Chai & Meals', 'Clean Washrooms', 'Truck & Car Parking', 'Power Backup'],
    address: 'Wardha Road NH-44, near Khapri Flyover, Nagpur',
    open24x7: true,
    coordinates: [21.0421, 79.0345],
  },
  {
    id: 'rest-2',
    name: 'HPCL Comfort Fuel & Highway Oasis Hub',
    category: 'fuel_plaza',
    distanceKm: 4.8,
    driveTimeMinutes: 8,
    rating: 4.4,
    amenities: ['24/7 EV Fast Charger', 'Café Coffee Day', 'Resting Lounge', 'Air & Tire Pressure'],
    address: 'Outer Ring Road Junction, Besa, Nagpur',
    open24x7: true,
    coordinates: [21.0850, 79.0820],
  },
  {
    id: 'rest-3',
    name: 'Nagpur Highway Grand Rest Stop & Motel',
    category: 'service_area',
    distanceKm: 7.2,
    driveTimeMinutes: 12,
    rating: 4.7,
    amenities: ['Driver Dormitory', 'Medical Aid Kit', 'Family Restaurant', 'CCTV Secured Parking'],
    address: 'Amravati Road, Wadi Bypass, Nagpur',
    open24x7: true,
    coordinates: [21.1495, 78.9950],
  },
];

export function calculateFatigueState(
  driveMinutes: number,
  customHour?: number,
  reactionTimeMs?: number | null
): DriverAlertnessState {
  const currentHour = customHour !== undefined ? customHour : new Date().getHours();

  // Circadian rhythm fatigue factor:
  // 00:00 - 06:00: Peak sleep deprivation window (High risk)
  // 13:00 - 15:30: Post-lunch circadian dip (Moderate risk)
  // 07:00 - 12:00 & 16:00 - 21:00: High alertness window
  let timeMultiplier = 1.0;
  let circadianDesc = 'Normal daylight alertness window.';

  if (currentHour >= 1 && currentHour <= 5) {
    timeMultiplier = 2.4;
    circadianDesc = 'Peak biological sleep window (Circadian Low 1 AM - 5 AM). Critical micro-sleep hazard.';
  } else if (currentHour === 0 || currentHour === 6) {
    timeMultiplier = 1.8;
    circadianDesc = 'Late night / early dawn transition window. Elevated sleep debt.';
  } else if (currentHour >= 13 && currentHour <= 15) {
    timeMultiplier = 1.35;
    circadianDesc = 'Post-prandial afternoon circadian dip. Mild drowsy reflex drop.';
  } else if (currentHour >= 22 || currentHour === 23) {
    timeMultiplier = 1.5;
    circadianDesc = 'Night driving fatigue accumulation window.';
  }

  // Base fatigue increases by 0.45 per continuous drive minute
  let fatigueAccumulation = driveMinutes * 0.45 * timeMultiplier;

  // If reaction time test was conducted and is slow (> 400ms), degrade alertness further
  if (reactionTimeMs && reactionTimeMs > 450) {
    fatigueAccumulation += Math.min(30, (reactionTimeMs - 450) / 15);
  }

  const alertnessScore = Math.max(10, Math.min(100, Math.round(100 - fatigueAccumulation)));

  let level: AlertnessLevel = 'optimal';
  let suggestedAction = 'Driver alertness is optimal. Keep smooth pacing.';
  let needsImmediateBreak = false;
  let recommendedRestInMinutes = Math.max(15, Math.min(180, 180 - driveMinutes));

  if (alertnessScore < 40) {
    level = 'critical_microsleep';
    suggestedAction = 'DANGER: Critical micro-sleep risk detected! Pull over immediately at the nearest rest stop.';
    needsImmediateBreak = true;
    recommendedRestInMinutes = 0;
  } else if (alertnessScore < 60) {
    level = 'fatigued';
    suggestedAction = 'Driver fatigue threshold reached. Rest break strongly advised within next 10-15 minutes.';
    needsImmediateBreak = true;
    recommendedRestInMinutes = 10;
  } else if (alertnessScore < 80) {
    level = 'mild_drowsiness';
    suggestedAction = 'Mild fatigue building up. Lower windows for fresh air or take a quick hydration break.';
    needsImmediateBreak = false;
    recommendedRestInMinutes = 30;
  }

  return {
    alertnessScore,
    level,
    continuousDriveMinutes: driveMinutes,
    timeOfDayRiskMultiplier: timeMultiplier,
    circadianRiskDescription: circadianDesc,
    recommendedRestInMinutes,
    lastReactionTimeMs: reactionTimeMs ?? null,
    suggestedAction,
    needsImmediateBreak,
  };
}
