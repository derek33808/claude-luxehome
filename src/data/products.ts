import { RegionCode } from '@/lib/regions'
import productsData from './json/products.json'

// Category types and info
export type Category = 'tech' | 'lifestyle' | 'kitchen' | 'outdoor'

export interface CategoryInfo {
  name: string
  description: string
  icon: string
}

export const categories: Record<Category, CategoryInfo> = productsData.categories as Record<Category, CategoryInfo>

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductFeature {
  icon?: string
  title: string
  description: string
}

export interface ColorVariant {
  id: string
  name: string
  color: string // hex or color name for UI
  images: ProductImage[]
  inStock: boolean
  stockCount?: number
}

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: Category
  brand: string
  images: ProductImage[]
  colorVariants?: ColorVariant[]
  features: ProductFeature[]
  specifications: Record<string, string>
  prices: Record<RegionCode, { price: number; comparePrice?: number }>
  inStock: boolean
  rating: number
  reviewCount: number
  tags: string[]
}

// Load products from JSON and cast to correct types
// Using `as unknown as` for JSON import type conversion
export const products: Product[] = productsData.products as unknown as Product[]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category)
}

export function getAllProducts(): Product[] {
  return products
}
