'use client'

import { ReactNode } from 'react'
import { CartProvider } from './CartProvider'
import { CartDrawer } from './CartDrawer'
import { RegionCode } from '@/lib/regions'

interface CartWrapperProps {
  children: ReactNode
  region: RegionCode
}

export function CartWrapper({ children, region }: CartWrapperProps) {
  return (
    <CartProvider region={region}>
      {children}
      <CartDrawer region={region} />
    </CartProvider>
  )
}
