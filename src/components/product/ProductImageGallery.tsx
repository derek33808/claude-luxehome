'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  url: string
  alt: string
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  saveBadge?: React.ReactNode
}

export function ProductImageGallery({ images, productName, saveBadge }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-cream rounded-lg overflow-hidden">
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt}
          fill
          className="object-contain p-4"
          priority
        />
        {saveBadge}
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {images.slice(0, 8).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square bg-cream rounded overflow-hidden cursor-pointer border-2 transition-colors ${
              index === selectedIndex
                ? 'border-accent'
                : 'border-transparent hover:border-accent/50'
            }`}
            aria-label={`View ${productName} image ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <p className="text-center text-sm text-text-muted">
          {selectedIndex + 1} / {images.length}
        </p>
      )}
    </div>
  )
}
