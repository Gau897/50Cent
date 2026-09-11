import { Coordinates } from '@/types/route';

export function calculateDistanceMeters(coord1: Coordinates | [number, number], coord2: Coordinates | [number, number]): number {
  const lat1 = Array.isArray(coord1) ? coord1[0] : coord1.lat;
  const lon1 = Array.isArray(coord1) ? coord1[1] : coord1.lng;
  const lat2 = Array.isArray(coord2) ? coord2[0] : coord2.lat;
  const lon2 = Array.isArray(coord2) ? coord2[1] : coord2.lng;

  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function calculateDistanceKm(coord1: Coordinates | [number, number], coord2: Coordinates | [number, number]): number {
  return calculateDistanceMeters(coord1, coord2) / 1000;
}

export function calculateBearing(start: Coordinates | [number, number], end: Coordinates | [number, number]): number {
  const lat1 = (Array.isArray(start) ? start[0] : start.lat) * (Math.PI / 180);
  const lon1 = (Array.isArray(start) ? start[1] : start.lng) * (Math.PI / 180);
  const lat2 = (Array.isArray(end) ? end[0] : end.lat) * (Math.PI / 180);
  const lon2 = (Array.isArray(end) ? end[1] : end.lng) * (Math.PI / 180);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const theta = Math.atan2(y, x);
  const bearing = (theta * (180 / Math.PI) + 360) % 360;

  return Math.round(bearing);
}
