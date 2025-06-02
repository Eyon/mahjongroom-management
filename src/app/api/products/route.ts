import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const tenantId = 1; // TODO: 从认证信息中获取
    const products = await getProducts(process.env.DB as any, tenantId);
    return NextResponse.json(products.results);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 