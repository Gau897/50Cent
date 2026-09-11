import { NextResponse } from 'next/server';
import { mockAccidents } from '@/mock/mockAccidents';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get('zoneId');

  let accidents = mockAccidents;
  if (zoneId) {
    accidents = mockAccidents.filter((a) => a.riskZoneId === zoneId);
  }

  return NextResponse.json({
    accidents,
    count: accidents.length,
    timestamp: new Date().toISOString(),
  });
}
