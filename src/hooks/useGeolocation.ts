import { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinates } from '@/types/route';
import { LiveLocation } from '@/types/navigation';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  simulated?: boolean;
  initialCoords?: Coordinates;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 2000,
    simulated = false,
    initialCoords = { lat: 18.5913, lng: 73.7389 }, // Hinjewadi Phase 1
  } = options;

  const [location, setLocation] = useState<LiveLocation>({
    position: initialCoords,
    heading: 120,
    speed: 48,
    accuracy: 10,
    timestamp: Date.now(),
  });
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const watchIdRef = useRef<number | null>(null);

  const updateSimulatedPosition = useCallback((coords: Coordinates, heading: number = 120, speed: number = 45) => {
    setLocation({
      position: coords,
      heading,
      speed,
      accuracy: 5,
      timestamp: Date.now(),
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (simulated) {
      setIsLoading(false);
      return;
    }

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      setLocation({
        position: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        },
        heading: pos.coords.heading || 0,
        speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 40,
        accuracy: Math.round(pos.coords.accuracy),
        timestamp: pos.timestamp,
      });
      setError(null);
      setIsLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
      setIsLoading(false);
    };

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [enableHighAccuracy, timeout, maximumAge, simulated]);

  return {
    location,
    error,
    permissionState,
    isLoading,
    updateSimulatedPosition,
  };
}
