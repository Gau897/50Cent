export interface WeatherCondition {
  routeId: string;
  condition: 'Sunny' | 'Rainy' | 'Foggy' | 'Thunderstorm' | 'Cloudy' | 'Windy';
  temperatureC: number;
  precipitationPercent: number;
  visibilityKm: number;
  windSpeedKmh: number;
  humidityPercent: number;
  roadCondition: 'Dry' | 'Wet' | 'Waterlogged' | 'Slippery' | 'Hazardous';
  warningMessage?: string;
  warningLevel?: 'none' | 'moderate' | 'severe';
}
