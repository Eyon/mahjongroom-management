import { NextResponse } from 'next/server';
import { getBillingMethods } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const tenantId = 1; // TODO: 从认证信息中获取
    const methods = await getBillingMethods(process.env.DB as any, tenantId);
    return NextResponse.json(methods.results);
  } catch (error) {
    console.error('Error fetching billing methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing methods' },
      { status: 500 }
    );
  }
} 