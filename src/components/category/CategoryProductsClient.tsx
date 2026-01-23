'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/data/products'
import { RegionCode, getRegion } from '@/lib/regions'
import { FilterSortBar, SortOption, StockFilter } from './FilterSortBar'

interface CategoryProductsClientProps {
  products: Product[]
  region: RegionCode
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-accent' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function CategoryProductsClient({ products, region }: CategoryProductsClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')

  const regionConfig = getRegion(region)

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // First, filter by stock
    let result = products.filter((product) => {
      if (stockFilter === 'all') return true
      if (stockFilter === 'in-stock') return product.inStock
      if (stockFilter === 'out-of-stock') return !product.inStock
      return true
    })

    // Then sort
    result = [...result].sort((a, b) => {
      const priceA = a.prices[region]?.price || 0
      const priceB = b.prices[region]?.price || 0

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB
        case 'price-desc':
          return priceB - priceA
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          // Default: featured products first (could be based on some property)
          return 0
      }
    })

    return result
  }, [products, region, sortOption, stockFilter])

  return (
    <>
      {/* Filter/Sort Bar */}
      <FilterSortBar
        productCount={filteredAndSortedProducts.length}
        onSortChange={setSortOption}
        onStockFilterChange={setStockFilter}
        currentSort={sortOption}
        currentStockFilter={stockFilter}
      />

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredAndSortedProducts.map((product) => {
            const price = product.prices[region]
            return (
              <Link
                key={product.id}
                href={`/${region}/p/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-square bg-cream rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    fill
                    className="object-contain p-4 transition-transform duration-slow group-hover:scale-105"
                  />
                  {price.comparePrice && (
                    <div className="absolute top-4 left-4 bg-accent text-white px-2 py-1 text-xs font-semibold rounded">
                      SAVE {regionConfig.currencySymbol}{(price.comparePrice - price.price).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-light line-clamp-2">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-sm text-text-muted">
                      ({product.reviewCount.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      {regionConfig.currencySymbol}{price.price.toLocaleString()}
                    </span>
                    {price.comparePrice && (
                      <span className="text-sm text-text-muted line-through">
                        {regionConfig.currencySymbol}{price.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {product.inStock ? (
                    <span className="text-xs text-success font-medium">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 mt-8">
          <svg
            className="w-16 h-16 mx-auto text-border mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="font-display text-2xl text-primary mb-2">No Products Found</h2>
          <p className="text-text-muted mb-6">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setSortOption('default')
              setStockFilter('all')
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  )
}
