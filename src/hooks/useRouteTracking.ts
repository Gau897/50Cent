import { useState, useEffect, useRef, useCallback } from 'react';
import { Route, Coordinates } from '@/types/route';
import { calculateDistanceMeters, calculateBearing, calculateDistanceKm } from '@/lib/distance';

interface UseRouteTrackingProps {
  route: Route;
  isSimulating: boolean;
  simulationSpeedMultiplier?: number;
  onPositionUpdate?: (coords: Coordinates, heading: number, speed: number) => void;
  onArrived?: () => void;
}

export function useRouteTracking({
  route,
  isSimulating,
  simulationSpeedMultiplier = 1.0,
  onPositionUpdate,
  onArrived,
}: UseRouteTrackingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [subStepProgress, setSubStepProgress] = useState(0); // 0 to 1 between waypoints
  const [currentPosition, setCurrentPosition] = useState<Coordinates>({
    lat: route.coordinates[0][0],
    lng: route.coordinates[0][1],
  });
  const [currentHeading, setCurrentHeading] = useState(120);
  const [currentSpeed, setCurrentSpeed] = useState(route.averageSpeedKmh);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(route.distanceKm);
  const [etaMinutes, setEtaMinutes] = useState(route.durationMinutes);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTracking = useCallback(() => {
    setCurrentStepIndex(0);
    setSubStepProgress(0);
    setCurrentPosition({
      lat: route.coordinates[0][0],
      lng: route.coordinates[0][1],
    });
    setDistanceRemainingKm(route.distanceKm);
    setEtaMinutes(route.durationMinutes);
    setIsCompleted(false);
  }, [route]);

  useEffect(() => {
    resetTracking();
  }, [route, resetTracking]);

  useEffect(() => {
    if (!isSimulating || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 1000;
    const waypoints = route.coordinates;

    timerRef.current = setInterval(() => {
      setSubStepProgress((prevProgress) => {
        const nextProgress = prevProgress + 0.15 * simulationSpeedMultiplier;

        if (nextProgress >= 1.0) {
          // Advance to next waypoint
          setCurrentStepIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= waypoints.length - 1) {
              setIsCompleted(true);
              if (onArrived) onArrived();
              return waypoints.length - 1;
            }
            return nextIndex;
          });
          return 0;
        }

        // Interpolate position between waypoints[currentStepIndex] and waypoints[currentStepIndex + 1]
        const p1 = waypoints[currentStepIndex] || waypoints[0];
        const p2 = waypoints[Math.min(currentStepIndex + 1, waypoints.length - 1)];

        const lat = p1[0] + (p2[0] - p1[0]) * nextProgress;
        const lng = p1[1] + (p2[1] - p1[1]) * nextProgress;
        const newCoords: Coordinates = { lat, lng };

        const heading = calculateBearing(p1, p2);
        const dynamicSpeed = Math.round(route.averageSpeedKmh + (Math.sin(Date.now() / 2000) * 8));

        setCurrentPosition(newCoords);
        setCurrentHeading(heading);
        setCurrentSpeed(dynamicSpeed);

        // Calculate remaining distance & ETA
        const remainingRatio = 1 - (currentStepIndex + nextProgress) / waypoints.length;
        const remDist = Math.max(0, +(route.distanceKm * remainingRatio).toFixed(1));
        const remEta = Math.max(1, Math.round(route.durationMinutes * remainingRatio));

        setDistanceRemainingKm(remDist);
        setEtaMinutes(remEta);

        if (onPositionUpdate) {
          onPositionUpdate(newCoords, heading, dynamicSpeed);
        }

        return nextProgress;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, isCompleted, currentStepIndex, route, simulationSpeedMultiplier, onPositionUpdate, onArrived]);

  return {
    currentPosition,
    currentHeading,
    currentSpeed,
    distanceRemainingKm,
    etaMinutes,
    isCompleted,
    currentStepIndex,
    resetTracking,
  };
}
