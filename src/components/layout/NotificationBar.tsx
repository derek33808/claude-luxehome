'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RegionCode, getRegion } from '@/lib/regions'

interface NotificationBarProps {
  region: RegionCode
  onVisibilityChange?: (isVisible: boolean) => void
}

// Height of the notification bar for layout calculations
export const NOTIFICATION_BAR_HEIGHT = 40 // px

export function NotificationBar({ region, onVisibilityChange }: NotificationBarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const regionConfig = getRegion(region)

  useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

  if (!isVisible) return null

  return (
    <div
      className="bg-primary text-white py-2 relative z-50"
      style={{ height: NOTIFICATION_BAR_HEIGHT }}
    >
      <div className="container h-full">
        <div className="flex items-center justify-center gap-4 text-sm h-full">
          <span className="hidden sm:inline">Free Shipping</span>
          <p className="text-center">
            <span className="font-semibold sm:hidden">Free Shipping</span>
            <span className="hidden sm:inline">on orders over {regionConfig.currencySymbol}100 to {regionConfig.name}</span>
            <span className="sm:hidden"> over {regionConfig.currencySymbol}100</span>
            <span className="mx-2 hidden sm:inline">|</span>
            <Link href={`/${region}/tech`} className="underline hover:text-accent transition-colors ml-2 sm:ml-0">
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
