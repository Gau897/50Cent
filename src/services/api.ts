import { Route } from '@/types/route';
import { RiskZone } from '@/types/riskZone';
import { Accident } from '@/types/accident';
import { WeatherCondition } from '@/types/weather';
import { NavigationSession } from '@/types/navigation';
import { mockRoutes } from '@/mock/mockRoutes';
import { mockRiskZones } from '@/mock/mockRiskZones';
import { mockAccidents } from '@/mock/mockAccidents';
import { mockWeatherMap } from '@/mock/mockWeather';
import { mockTripHistory } from '@/mock/mockHistory';

export const apiClient = {
  async getRoutes(from?: string, to?: string): Promise<Route[]> {
    try {
      const res = await fetch(`/api/routes?from=${encodeURIComponent(from || '')}&to=${encodeURIComponent(to || '')}`);
      if (res.ok) {
        const data = await res.json();
        return data.routes || mockRoutes;
      }
    } catch {}
    return mockRoutes;
  },

  async getRiskZones(): Promise<RiskZone[]> {
    try {
      const res = await fetch('/api/risk-zones');
      if (res.ok) {
        const data = await res.json();
        return data.riskZones || mockRiskZones;
      }
    } catch {}
    return mockRiskZones;
  },

  async getAccidents(zoneId?: string): Promise<Accident[]> {
    try {
      const url = zoneId ? `/api/accidents?zoneId=${encodeURIComponent(zoneId)}` : '/api/accidents';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.accidents || mockAccidents;
      }
    } catch {}
    if (zoneId) {
      return mockAccidents.filter(a => a.riskZoneId === zoneId);
    }
    return mockAccidents;
  },

  async getWeather(routeId?: string): Promise<WeatherCondition | null> {
    try {
      const url = routeId ? `/api/weather?routeId=${encodeURIComponent(routeId)}` : '/api/weather';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.weather || (routeId ? mockWeatherMap[routeId] : mockWeatherMap['route-2']);
      }
    } catch {}
    return routeId ? (mockWeatherMap[routeId] || mockWeatherMap['route-2']) : mockWeatherMap['route-2'];
  },

  async logNavigationSession(session: Partial<NavigationSession>): Promise<boolean> {
    try {
      const res = await fetch('/api/navigation/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getTripHistory(): Promise<NavigationSession[]> {
    return mockTripHistory;
  }
};
