import { NextResponse } from 'next/server';
import { startTableSession } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { tableId, billingMethodId } = await request.json();
    
    if (!tableId || !billingMethodId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await startTableSession(
      process.env.DB as any,
      tableId,
      billingMethodId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error starting table session:', error);
    return NextResponse.json(
      { error: 'Failed to start table session' },
      { status: 500 }
    );
  }
} 