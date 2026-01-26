'use client'

import { useState, useEffect } from 'react'

interface StockStatusProps {
  productId: string
  className?: string
}

interface InventoryData {
  productId: string
  isTracked: boolean
  isAvailable: boolean
  availableQuantity: number
  isLowStock?: boolean
  lowStockThreshold?: number
}

export function StockStatus({ productId, className = '' }: StockStatusProps) {
  const [inventory, setInventory] = useState<InventoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch(`/.netlify/functions/check-inventory?productId=${productId}`)
        if (response.ok) {
          const data = await response.json()
          setInventory(data)
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [productId])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">Checking availability...</span>
      </div>
    )
  }

  // Not tracked - show default in stock
  if (!inventory?.isTracked) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-green-600">In Stock</span>
        <span className="text-sm text-gray-500">- Ready to Ship</span>
      </div>
    )
  }

  // Out of stock
  if (!inventory.isAvailable || inventory.availableQuantity <= 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm font-medium text-red-600">Out of Stock</span>
      </div>
    )
  }

  // Low stock warning
  if (inventory.isLowStock) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-amber-600">
          Only {inventory.availableQuantity} left
        </span>
        <span className="text-sm text-gray-500">- Order soon!</span>
      </div>
    )
  }

  // In stock
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm font-medium text-green-600">In Stock</span>
      <span className="text-sm text-gray-500">- Ready to Ship</span>
    </div>
  )
}

// Hook for components that need inventory data
export function useInventory(productId: string) {
  const [inventory, setInventory] = useState<InventoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch(`/.netlify/functions/check-inventory?productId=${productId}`)
        if (response.ok) {
          const data = await response.json()
          setInventory(data)
        } else {
          setError('Failed to check inventory')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check inventory')
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [productId])

  return { inventory, loading, error }
}

// Hook for checking cart inventory
export function useCartInventory() {
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkCartInventory = async (items: Array<{ productId: string; quantity: number }>) => {
    setChecking(true)
    setError(null)

    try {
      const response = await fetch('/.netlify/functions/check-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        throw new Error('Failed to check inventory')
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check inventory'
      setError(errorMessage)
      throw err
    } finally {
      setChecking(false)
    }
  }

  return { checkCartInventory, checking, error }
}
