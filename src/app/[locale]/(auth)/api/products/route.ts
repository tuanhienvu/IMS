import  { type NextRequest, NextResponse } from 'next/server';
import { PRODUCTS_DATA } from '@/components/order/data/products.data';

export const GET = async (request: NextRequest) => {
  const slug = request.nextUrl.searchParams.get('slug');
  if (slug) {
    const product = Object.values(PRODUCTS_DATA).find(product => product.slug === slug);
    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ message: 'Product not found' });
    }
  }

  const products = Object.entries(PRODUCTS_DATA);
  return NextResponse.json(products);
};
