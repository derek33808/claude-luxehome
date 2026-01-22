'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RegionCode, getRegion } from '@/lib/regions'

interface NotificationBarProps {
  region: RegionCode
}

export function NotificationBar({ region }: NotificationBarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const regionConfig = getRegion(region)

  if (!isVisible) return null

  return (
    <div className="bg-primary text-white py-2 relative">
      <div className="container">
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="hidden sm:inline">🎉</span>
          <p className="text-center">
            <span className="font-semibold">Free Shipping</span> on orders over {regionConfig.currencySymbol}100 to {regionConfig.name}
            <span className="mx-2">|</span>
            <Link href={`/${region}/products`} className="underline hover:text-accent transition-colors">
              Shop Now
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-accent transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
