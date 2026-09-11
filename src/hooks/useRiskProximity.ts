import { useState, useEffect, useRef } from 'react';
import { Coordinates } from '@/types/route';
import { RiskZone } from '@/types/riskZone';
import { ProximityAlert } from '@/types/navigation';
import { detectProximityAlerts } from '@/lib/proximity';
import { soundManager } from '@/lib/audioAlerts';

interface UseRiskProximityProps {
  userPosition: Coordinates;
  riskZones: RiskZone[];
  enableSound?: boolean;
  enableSpeech?: boolean;
  enableVibration?: boolean;
}

export function useRiskProximity({
  userPosition,
  riskZones,
  enableSound = true,
  enableSpeech = true,
  enableVibration = true,
}: UseRiskProximityProps) {
  const [activeAlert, setActiveAlert] = useState<ProximityAlert | null>(null);
  const [alertHistory, setAlertHistory] = useState<ProximityAlert[]>([]);
  const alertedZoneIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userPosition || !riskZones || riskZones.length === 0) return;

    const detected = detectProximityAlerts(userPosition, riskZones, 400);

    if (detected.length > 0) {
      const topAlert = detected[0];
      setActiveAlert(topAlert);

      const zoneId = topAlert.zone.id;
      if (!alertedZoneIdsRef.current.has(zoneId)) {
        alertedZoneIdsRef.current.add(zoneId);
        setAlertHistory((prev) => [topAlert, ...prev]);

        if (enableSound) {
          soundManager.playWarningBeep(topAlert.zone.level === 'critical' || topAlert.zone.level === 'high');
        }
        if (enableVibration) {
          soundManager.vibrate([200, 100, 250]);
        }
        if (enableSpeech) {
          soundManager.speakWarning(topAlert.advice);
        }
      }
    } else {
      setActiveAlert(null);
    }
  }, [userPosition, riskZones, enableSound, enableSpeech, enableVibration]);

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  return {
    activeAlert,
    alertHistory,
    dismissAlert,
  };
}
