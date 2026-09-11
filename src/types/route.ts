export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteRiskFactor {
  category: 'road' | 'weather' | 'traffic' | 'accidents' | 'visibility';
  label: string;
  score: number; // 0 to 100
  description: string;
  impact: 'low' | 'moderate' | 'high' | 'severe';
}

export interface Route {
  id: string;
  name: string;
  type: 'fastest' | 'safest' | 'alternative';
  tag: string;
  distanceKm: number;
  durationMinutes: number;
  riskScore: number; // 0 to 100
  safetyScore: number; // 100 - riskScore
  color: string;
  isRecommended: boolean;
  coordinates: [number, number][]; // [lat, lng] array
  summary: string;
  via: string;
  riskFactors: RouteRiskFactor[];
  elevationGainM: number;
  averageSpeedKmh: number;
}
