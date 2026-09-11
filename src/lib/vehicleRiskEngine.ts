import { VehicleType, VEHICLE_PROFILES, VehicleProfile } from '@/types/vehicle';
import { Route } from '@/types/route';

export interface VehicleAdjustedRisk {
  vehicleProfile: VehicleProfile;
  baseRiskScore: number;
  adjustedRiskScore: number;
  safetyScore: number;
  recommendedMaxSpeedKmh: number;
  brakingDistanceFactor: number;
  specificWarnings: string[];
}

export function calculateVehicleRisk(
  route: Route,
  vehicleType: VehicleType,
  currentRainMmPerHour: number = 0
): VehicleAdjustedRisk {
  const profile = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.car;
  let riskScore = route.riskScore + profile.dynamicRiskModifier;

  // Add wet road penalty specific to vehicle
  if (currentRainMmPerHour > 5) {
    riskScore += Math.round(profile.wetRoadSlipVulnerability * 8);
  }

  // Cap between 5 and 99
  const adjustedRiskScore = Math.min(99, Math.max(5, riskScore));
  const safetyScore = Math.max(1, 100 - adjustedRiskScore);

  // Determine dynamic speed cap
  let speedCap = route.averageSpeedKmh;
  if (vehicleType === 'heavy_truck') {
    speedCap = Math.min(speedCap, 40);
  } else if (vehicleType === 'two_wheeler' && currentRainMmPerHour > 5) {
    speedCap = Math.min(speedCap, 35);
  } else if (vehicleType === 'suv') {
    speedCap = Math.min(speedCap, 55);
  }

  const specificWarnings: string[] = [];

  if (vehicleType === 'two_wheeler') {
    specificWarnings.push('High slip hazard on metal expansion joints and wet road paint.');
    if (currentRainMmPerHour > 0) {
      specificWarnings.push('Reduced tire contact patch: Keep speed under 35 km/h.');
    }
  } else if (vehicleType === 'heavy_truck') {
    specificWarnings.push('Wide turn radius & blind spots near flyover ramps.');
    specificWarnings.push('Stopping distance is 2.1x longer than passenger cars.');
  } else if (vehicleType === 'ev') {
    specificWarnings.push('Caution: Instant torque may cause wheelspin on wet tarmac.');
    specificWarnings.push(`Max water wading clearance is ${profile.maxSafeWaterDepthMm}mm.`);
  } else if (vehicleType === 'suv') {
    specificWarnings.push('Elevated rollover risk: Decelerate before sharp cloverleaf loops.');
  }

  return {
    vehicleProfile: profile,
    baseRiskScore: route.riskScore,
    adjustedRiskScore,
    safetyScore,
    recommendedMaxSpeedKmh: speedCap,
    brakingDistanceFactor: profile.baseBrakingDistanceMultiplier,
    specificWarnings,
  };
}
