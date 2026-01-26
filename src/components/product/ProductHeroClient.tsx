'use client'

import { useState } from 'react'
import { Product, ColorVariant, ProductImage } from '@/data/products'
import { ProductImageGallery } from './ProductImageGallery'
import { ProductActions } from './ProductActions'
import { ColorSelector } from './ColorSelector'
import { StarRating } from '@/components/common/StarRating'
import { StockStatus } from './StockStatus'

interface ProductHeroClientProps {
  product: Product
  price: number
  comparePrice?: number
  currencySymbol: string
  saveBadge?: React.ReactNode
}

// Calendar Sync Icons
function CalendarSyncIcons() {
  const calendars = [
    { name: 'Google Calendar', icon: '📅', color: 'bg-blue-100' },
    { name: 'Apple iCloud', icon: '🍎', color: 'bg-gray-100' },
    { name: 'Outlook', icon: '📧', color: 'bg-blue-50' },
    { name: 'Yahoo', icon: '📨', color: 'bg-purple-50' },
    { name: 'Cozi', icon: '👨‍👩‍👧‍👦', color: 'bg-green-50' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {calendars.map((cal) => (
        <div
          key={cal.name}
          className={`${cal.color} px-3 py-2 rounded-lg flex items-center gap-2 text-sm`}
        >
          <span>{cal.icon}</span>
          <span className="text-text-light">{cal.name}</span>
        </div>
      ))}
    </div>
  )
}

export function ProductHeroClient({
  product,
  price,
  comparePrice,
  currencySymbol,
  saveBadge,
}: ProductHeroClientProps) {
  // Initialize with first color variant if available, otherwise null
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(
    product.colorVariants?.[0] || null
  )

  // Get images based on selected variant
  const currentImages: ProductImage[] = selectedVariant?.images?.length
    ? selectedVariant.images
    : product.images

  // Handle color selection
  const handleColorSelect = (variant: ColorVariant) => {
    setSelectedVariant(variant)
  }

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="lg:sticky lg:top-24">
            <ProductImageGallery
              images={currentImages}
              productName={product.name}
              saveBadge={saveBadge}
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="gold-line mb-4" />
            <span className="text-sm text-text-muted uppercase tracking-wider">
              {product.brand}
            </span>
            <h1 className="font-display text-display-md text-primary mt-2 mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-text-light mb-4">{product.shortDescription}</p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} />
              <span className="text-sm text-text-light">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
              <span className="text-sm text-accent font-medium">Verified Buyers</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-4xl text-primary">
                {currencySymbol}{price}
              </span>
              {comparePrice && (
                <span className="text-xl text-text-muted line-through">
                  {currencySymbol}{comparePrice}
                </span>
              )}
            </div>

            {/* Color Selector */}
            {product.colorVariants && product.colorVariants.length > 1 && selectedVariant && (
              <ColorSelector
                variants={product.colorVariants}
                selectedVariant={selectedVariant}
                onSelect={handleColorSelect}
              />
            )}

            {/* Stock Status - Dynamic from inventory system */}
            <StockStatus productId={product.id} className="mb-6" />

            {/* Description */}
            <p className="text-text-light leading-relaxed mb-8">{product.description}</p>

            {/* CTA Buttons */}
            <ProductActions
              product={product}
              price={price}
              comparePrice={comparePrice}
              currencySymbol={currencySymbol}
              selectedColor={selectedVariant || undefined}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-b border-border">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-cream rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <span className="text-xs text-text-light font-medium">Free Shipping</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-cream rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-text-light font-medium">Secure Payment</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-cream rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-xs text-text-light font-medium">30-Day Returns</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-cream rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs text-text-light font-medium">Lifetime Support</span>
              </div>
            </div>

            {/* Calendar Sync - For Smart Calendar Product */}
            {product.slug === 'smart-digital-calendar' && (
              <div className="mt-6">
                <h3 className="font-semibold text-primary mb-3">Syncs with your favorite calendars:</h3>
                <CalendarSyncIcons />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
