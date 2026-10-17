import { NextRequest, NextResponse } from 'next/server'
import {
  BRAND_CONFIG,
  StoreBrand,
  ProductCategory,
  getAllStoreProducts,
  getFilteredStoreProducts,
} from '@/lib/storeCatalog'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const brand = (searchParams.get('brand') || 'All') as StoreBrand | 'All'
  const category = (searchParams.get('category') || 'All') as ProductCategory
  const search = searchParams.get('search') || ''

  const products = getFilteredStoreProducts({
    brand: brand === 'All' ? undefined : (brand as StoreBrand),
    category: category === 'All' ? undefined : category,
    search,
  })

  return NextResponse.json({
    brands: BRAND_CONFIG,
    brand,
    category,
    total: products.length,
    products,
  })
}
