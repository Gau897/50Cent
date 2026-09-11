export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskZone {
  id: string;
  name: string;
  title: string;
  level: RiskLevel;
  center: [number, number]; // [lat, lng]
  radiusMeters: number;
  description: string;
  reason: string;
  accidentCount: number;
  mostCommonSeverity: 'minor' | 'moderate' | 'severe' | 'fatal';
  speedLimitKmh: number;
  recommendedSpeedKmh: number;
  color: string;
  tags: string[];
}
