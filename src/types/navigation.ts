import { Coordinates } from './route';
import { RiskZone } from './riskZone';

export interface LiveLocation {
  position: Coordinates;
  heading: number; // 0 - 360 degrees
  speed: number; // km/h
  accuracy: number; // meters
  timestamp: number;
}

export interface ProximityAlert {
  zone: RiskZone;
  distanceMeters: number;
  isTriggered: boolean;
  level: 'approaching' | 'imminent' | 'inside';
  advice: string;
}

export interface NavigationSession {
  id: string;
  routeId: string;
  routeName: string;
  originName: string;
  destinationName: string;
  startedAt: string;
  endedAt?: string;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  riskZonesEncountered: number;
  alertsTriggered: number;
  averageSpeedKmh: number;
  status: 'active' | 'completed' | 'cancelled';
}
