export type AccidentSeverity = 'minor' | 'moderate' | 'severe' | 'fatal';

export interface Accident {
  id: string;
  riskZoneId: string;
  title: string;
  locationName: string;
  coordinates: [number, number];
  date: string;
  formattedDate: string;
  severity: AccidentSeverity;
  vehiclesInvolved: number;
  weatherCondition: string;
  description: string;
  imageUrl: string;
  cause: string;
  timeOfDay: string;
}
