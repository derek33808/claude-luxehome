'use client'

import { ColorVariant } from '@/data/products'

interface ColorSelectorProps {
  variants: ColorVariant[]
  selectedVariant: ColorVariant
  onSelect: (variant: ColorVariant) => void
}

export function ColorSelector({ variants, selectedVariant, onSelect }: ColorSelectorProps) {
  if (!variants || variants.length <= 1) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-medium text-primary">Color:</span>
        <span className="text-text-light">{selectedVariant.name}</span>
      </div>
      <div className="flex gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariant.id
          const isOutOfStock = !variant.inStock

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              className={`
                relative w-12 h-12 rounded-full border-2 transition-all
                ${isSelected
                  ? 'border-accent ring-2 ring-accent/30 ring-offset-2'
                  : 'border-border hover:border-accent/50'
                }
                ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={`${variant.name}${isOutOfStock ? ' (Out of Stock)' : ''}`}
              aria-label={`Select ${variant.name}`}
            >
              {/* Color circle */}
              <span
                className="absolute inset-1 rounded-full"
                style={{
                  backgroundColor: variant.color,
                  border: variant.color === '#FFFFFF' || variant.color === '#F9FAFB'
                    ? '1px solid #e5e7eb'
                    : 'none'
                }}
              />

              {/* Out of stock indicator */}
              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-0.5 bg-red-500 rotate-45 absolute" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Stock info for selected variant */}
      {selectedVariant.stockCount !== undefined && selectedVariant.stockCount <= 10 && selectedVariant.inStock && (
        <p className="mt-2 text-sm text-amber-600">
          Only {selectedVariant.stockCount} left in stock!
        </p>
      )}
    </div>
  )
}
