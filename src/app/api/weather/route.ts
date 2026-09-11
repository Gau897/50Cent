import { NextResponse } from 'next/server';
import { mockWeatherMap } from '@/mock/mockWeather';
import { WeatherCondition } from '@/types/weather';

function mapWmoToCondition(code: number): { condition: WeatherCondition['condition']; road: WeatherCondition['roadCondition']; warningLevel: 'none' | 'moderate' | 'severe'; warningMessage?: string } {
  if (code === 0) {
    return { condition: 'Sunny', road: 'Dry', warningLevel: 'none', warningMessage: 'Clear skies with dry pavement and excellent traction.' };
  }
  if (code <= 3) {
    return { condition: 'Cloudy', road: 'Dry', warningLevel: 'none', warningMessage: 'Overcast conditions with normal pavement grip.' };
  }
  if (code >= 45 && code <= 48) {
    return { condition: 'Foggy', road: 'Wet', warningLevel: 'moderate', warningMessage: 'Low-lying mist or fog. Reduce cruising speed by 20% and use low beams.' };
  }
  if (code >= 51 && code <= 67) {
    return { condition: 'Rainy', road: 'Wet', warningLevel: 'moderate', warningMessage: 'Active rainfall detected. Increase following distance and beware of hydroplaning.' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Rainy', road: 'Waterlogged', warningLevel: 'severe', warningMessage: 'Heavy downpour with standing surface water. High hydroplaning hazard.' };
  }
  if (code >= 95) {
    return { condition: 'Thunderstorm', road: 'Hazardous', warningLevel: 'severe', warningMessage: 'Severe electrical storm & high wind gusts. Exercise extreme caution.' };
  }
  return { condition: 'Sunny', road: 'Dry', warningLevel: 'none' };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const routeId = searchParams.get('routeId');
  const lat = parseFloat(searchParams.get('lat') || '18.5204');
  const lng = parseFloat(searchParams.get('lng') || '73.8567');

  // 1. Try Live Open-Meteo Weather API (Free, Real-Time, No Key Required)
  try {
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
    const res = await fetch(meteoUrl, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      const cur = data.current;
      const code = cur.weather_code ?? 0;
      const { condition, road, warningLevel, warningMessage } = mapWmoToCondition(code);

      const liveWeather: WeatherCondition = {
        routeId: routeId || 'live-route',
        condition,
        temperatureC: Math.round(cur.temperature_2m ?? 26),
        precipitationPercent: cur.precipitation > 0 ? Math.min(100, Math.round(cur.precipitation * 20)) : (code >= 50 ? 65 : 10),
        visibilityKm: condition === 'Foggy' ? 1.8 : condition === 'Rainy' ? 4.5 : 9.5,
        windSpeedKmh: Math.round(cur.wind_speed_10m ?? 12),
        humidityPercent: Math.round(cur.relative_humidity_2m ?? 60),
        roadCondition: road,
        warningLevel,
        warningMessage,
      };

      return NextResponse.json({
        source: 'live-open-meteo',
        weather: liveWeather,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Live weather API fetch fallback:', err);
  }

  // 2. Fallback to route-specific pre-configured conditions
  if (routeId && mockWeatherMap[routeId]) {
    return NextResponse.json({ source: 'route-telemetry', weather: mockWeatherMap[routeId] });
  }

  return NextResponse.json({ source: 'all-telemetry', allWeather: mockWeatherMap });
}
