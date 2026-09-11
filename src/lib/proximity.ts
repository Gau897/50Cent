import { Coordinates } from '@/types/route';
import { RiskZone } from '@/types/riskZone';
import { ProximityAlert } from '@/types/navigation';
import { calculateDistanceMeters } from './distance';

export function detectProximityAlerts(
  userPos: Coordinates,
  zones: RiskZone[],
  alertThresholdMeters: number = 350
): ProximityAlert[] {
  const alerts: ProximityAlert[] = [];

  for (const zone of zones) {
    const distance = calculateDistanceMeters(userPos, zone.center);
    if (distance <= alertThresholdMeters + zone.radiusMeters) {
      let level: ProximityAlert['level'] = 'approaching';
      let advice = `Approaching ${zone.name}. Reduce speed to ${zone.recommendedSpeedKmh} km/h.`;

      if (distance <= zone.radiusMeters) {
        level = 'inside';
        advice = `CAUTION: Inside ${zone.title}! Maintain ${zone.recommendedSpeedKmh} km/h and stay alert.`;
      } else if (distance <= 150) {
        level = 'imminent';
        advice = `DANGER AHEAD (${distance}m): ${zone.reason}. Slow down now!`;
      }

      alerts.push({
        zone,
        distanceMeters: Math.max(0, distance - zone.radiusMeters),
        isTriggered: true,
        level,
        advice,
      });
    }
  }

  return alerts.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
