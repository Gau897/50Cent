export type AlertnessLevel = 'optimal' | 'mild_drowsiness' | 'fatigued' | 'critical_microsleep';

export interface DriverAlertnessState {
  alertnessScore: number; // 0 - 100 (100 is fully alert)
  level: AlertnessLevel;
  continuousDriveMinutes: number;
  timeOfDayRiskMultiplier: number;
  circadianRiskDescription: string;
  recommendedRestInMinutes: number;
  lastReactionTimeMs: number | null;
  suggestedAction: string;
  needsImmediateBreak: boolean;
}

export interface RestStop {
  id: string;
  name: string;
  category: 'dhaba' | 'fuel_plaza' | 'motel' | 'service_area';
  distanceKm: number;
  driveTimeMinutes: number;
  rating: number;
  amenities: string[];
  address: string;
  open24x7: boolean;
  coordinates: [number, number];
}
