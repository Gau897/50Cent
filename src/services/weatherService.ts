import { mockWeatherMap } from '@/mock/mockWeather';
import { WeatherCondition } from '@/types/weather';

export class WeatherService {
  static getForRoute(routeId: string): WeatherCondition {
    return mockWeatherMap[routeId] || mockWeatherMap['route-2'];
  }
}
