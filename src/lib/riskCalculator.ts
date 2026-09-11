import { RouteRiskFactor } from '@/types/route';

export interface CalculatedRiskSummary {
  overallRiskScore: number;
  overallSafetyScore: number;
  riskRating: 'Very Safe' | 'Moderate Risk' | 'High Hazard' | 'Severe Hazard';
  riskColor: string;
  dominantHazard: string;
}

export function computeRouteRisk(factors: RouteRiskFactor[]): CalculatedRiskSummary {
  if (!factors || factors.length === 0) {
    return {
      overallRiskScore: 10,
      overallSafetyScore: 90,
      riskRating: 'Very Safe',
      riskColor: '#10B981',
      dominantHazard: 'Optimal conditions',
    };
  }

  const weights: Record<string, number> = {
    accidents: 0.30,
    road: 0.25,
    weather: 0.20,
    traffic: 0.15,
    visibility: 0.10,
  };

  let totalWeightedScore = 0;
  let highestFactor = factors[0];

  for (const f of factors) {
    const weight = weights[f.category] || 0.2;
    totalWeightedScore += f.score * weight;
    if (f.score > highestFactor.score) {
      highestFactor = f;
    }
  }

  const score = Math.round(Math.min(100, Math.max(0, totalWeightedScore)));
  const safety = 100 - score;

  let riskRating: CalculatedRiskSummary['riskRating'] = 'Very Safe';
  let riskColor = '#10B981';

  if (score > 65) {
    riskRating = 'Severe Hazard';
    riskColor = '#EF4444';
  } else if (score > 40) {
    riskRating = 'High Hazard';
    riskColor = '#F97316';
  } else if (score > 20) {
    riskRating = 'Moderate Risk';
    riskColor = '#F59E0B';
  }

  return {
    overallRiskScore: score,
    overallSafetyScore: safety,
    riskRating,
    riskColor,
    dominantHazard: `${highestFactor.label} (${highestFactor.impact.toUpperCase()})`,
  };
}
