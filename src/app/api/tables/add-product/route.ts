import { NextResponse } from 'next/server';
import { addConsumption } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { tableSessionId, productId, quantity } = await request.json();
    
    if (!tableSessionId || !productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await addConsumption(
      process.env.DB as any,
      tableSessionId,
      productId,
      quantity
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
} 