import { NextResponse } from 'next/server';
import { mockRiskZones } from '@/mock/mockRiskZones';

export async function GET() {
  return NextResponse.json({
    riskZones: mockRiskZones,
    count: mockRiskZones.length,
    timestamp: new Date().toISOString(),
  });
}
