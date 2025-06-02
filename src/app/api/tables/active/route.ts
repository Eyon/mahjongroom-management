import { NextResponse } from 'next/server';
import { getActiveTables } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const tenantId = 1; // TODO: 从认证信息中获取
    // @ts-ignore
    const tables = await getActiveTables(process.env.DB, tenantId);
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching active tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active tables' },
      { status: 500 }
    );
  }
} 