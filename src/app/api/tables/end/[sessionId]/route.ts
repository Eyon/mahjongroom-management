import { NextResponse } from 'next/server';
import { endTableSession } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId);
    
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const bill = await endTableSession(
      process.env.DB as any,
      sessionId
    );

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error ending table session:', error);
    return NextResponse.json(
      { error: 'Failed to end table session' },
      { status: 500 }
    );
  }
} 