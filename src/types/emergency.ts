export interface CrashDetectionPayload {
  timestamp: string;
  simulatedGForce: number; // e.g. 5.8g impact
  impactVelocityKmh: number;
  latitude: number;
  longitude: number;
  locationName: string;
  nearestBlackspotName?: string;
  isBlackspotLocked: boolean;
  vehicleType: string;
  driverName: string;
  bloodGroup: string;
  medicalNotes: string;
  emergencyContacts: { name: string; relation: string; phone: string }[];
  blackboxTelemetry: {
    speedHistory: number[];
    brakingForce: string;
    weatherCondition: string;
    roadCondition: string;
  };
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}
