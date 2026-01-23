import { Metadata } from 'next'
import { Suspense } from 'react'
import { RegionCode, getRegion, validRegions } from '@/lib/regions'
import { SuccessContent } from '@/components/checkout/SuccessContent'

interface PageProps {
  params: Promise<{ region: string }>
}

export function generateStaticParams() {
  return validRegions.map((region) => ({ region }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionCode } = await params
  const region = getRegion(regionCode as RegionCode)
  return {
    title: `Payment Successful - ${region.name} | Luxehome`,
    description: 'Your payment was successful. Thank you for your order!',
  }
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
  const { region: regionCode } = await params
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-text-light">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent regionCode={regionCode} />
    </Suspense>
  )
}
