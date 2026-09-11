export interface GuardianSession {
  tripId: string;
  driverName: string;
  sharePin: string;
  shareUrl: string;
  origin: string;
  destination: string;
  vehicleType: string;
  batteryLevelPercent: number;
  networkSignalBars: number;
  currentSpeedKmh: number;
  speedLimitKmh: number;
  distanceRemainingKm: number;
  etaMinutes: number;
  status: 'active' | 'arrived' | 'sos_triggered' | 'paused';
  currentCoordinates: [number, number];
  breadcrumbs: [number, number][];
  activeHazardsCount: number;
  geofenceRadiusMeters: number;
  lastPingTime: string;
}
