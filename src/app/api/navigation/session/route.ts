import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const sessionData = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Navigation session logged successfully',
      sessionId: sessionData.id || `sess-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 });
  }
}
