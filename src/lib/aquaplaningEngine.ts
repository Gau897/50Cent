export interface AquaplaningAssessment {
  precipitationMmPerHour: number;
  waterFilmDepthMm: number;
  criticalAquaplaningSpeedKmh: number;
  currentVehicleSpeedKmh: number;
  isAquaplaningImminent: boolean;
  aquaplaningRiskPercentage: number;
  brakingDistanceIncreasePercentage: number;
  safeSpeedCapKmh: number;
  advisoryLevel: 'dry' | 'caution' | 'warning' | 'critical';
  recommendations: string[];
}

/**
 * NASA / Horne Hydroplaning Formula approximation:
 * Critical Speed V_p = 6.35 * sqrt(Tire Pressure in PSI)
 * Adjusted for water film depth (h) and tire tread depth (t):
 * V_critical = V_base * (1 - (h / (h + t * 2)))
 */
export function calculateAquaplaningRisk(
  precipitationMmPerHour: number,
  vehicleSpeedKmh: number,
  tirePressurePsi: number = 32,
  treadDepthMm: number = 4.0
): AquaplaningAssessment {
  if (precipitationMmPerHour <= 0.5) {
    return {
      precipitationMmPerHour: 0,
      waterFilmDepthMm: 0,
      criticalAquaplaningSpeedKmh: 110,
      currentVehicleSpeedKmh: vehicleSpeedKmh,
      isAquaplaningImminent: false,
      aquaplaningRiskPercentage: 5,
      brakingDistanceIncreasePercentage: 0,
      safeSpeedCapKmh: 80,
      advisoryLevel: 'dry',
      recommendations: ['Tire-asphalt friction is optimal.', 'Maintain standard speed limits.'],
    };
  }

  // Estimated water film thickness based on rain intensity (mm/hr)
  const waterFilmDepthMm = Number((0.4 + (precipitationMmPerHour * 0.12)).toFixed(2));

  // Base Horne dynamic speed in km/h
  const baseHorneSpeed = 6.35 * Math.sqrt(tirePressurePsi) * 1.852; // convert knots to km/h approx ~65-75 km/h

  // Degradation based on water film depth vs tire grooves
  const waterRatio = waterFilmDepthMm / (waterFilmDepthMm + treadDepthMm);
  const criticalAquaplaningSpeedKmh = Math.round(baseHorneSpeed * (1 - (waterRatio * 0.45)));

  // Risk percentage
  const speedRatio = vehicleSpeedKmh / Math.max(20, criticalAquaplaningSpeedKmh);
  const aquaplaningRiskPercentage = Math.min(100, Math.round(speedRatio * speedRatio * 65));

  const brakingDistanceIncreasePercentage = Math.round(precipitationMmPerHour * 2.8 + (waterFilmDepthMm * 12));
  const isAquaplaningImminent = vehicleSpeedKmh >= criticalAquaplaningSpeedKmh;

  const safeSpeedCapKmh = Math.max(30, criticalAquaplaningSpeedKmh - 15);

  let advisoryLevel: 'dry' | 'caution' | 'warning' | 'critical' = 'caution';
  if (aquaplaningRiskPercentage > 75 || isAquaplaningImminent) {
    advisoryLevel = 'critical';
  } else if (aquaplaningRiskPercentage > 45) {
    advisoryLevel = 'warning';
  }

  const recommendations: string[] = [];
  if (advisoryLevel === 'critical') {
    recommendations.push(`CRITICAL: Hydroplaning threshold (${criticalAquaplaningSpeedKmh} km/h) reached!`);
    recommendations.push(`Reduce speed immediately below ${safeSpeedCapKmh} km/h to regain steering contact.`);
    recommendations.push(`Wet braking distance is expanded by +${brakingDistanceIncreasePercentage}%. Avoid sudden panic braking.`);
  } else if (advisoryLevel === 'warning') {
    recommendations.push(`Water film depth ~${waterFilmDepthMm}mm on asphalt. Tires may glide on surface water.`);
    recommendations.push(`Dynamic Safe Speed Cap: ${safeSpeedCapKmh} km/h.`);
    recommendations.push('Do not use cruise control in active standing water.');
  } else {
    recommendations.push('Light precipitation detected. Maintain extra 15m following distance.');
  }

  return {
    precipitationMmPerHour,
    waterFilmDepthMm,
    criticalAquaplaningSpeedKmh,
    currentVehicleSpeedKmh: vehicleSpeedKmh,
    isAquaplaningImminent,
    aquaplaningRiskPercentage,
    brakingDistanceIncreasePercentage,
    safeSpeedCapKmh,
    advisoryLevel,
    recommendations,
  };
}
