import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion, validRegions, RegionCode } from '@/lib/regions'
import { CheckoutForm } from '@/components/checkout'

interface PageProps {
  params: Promise<{ region: string }>
}

// Generate static params for all regions
export function generateStaticParams() {
  return validRegions.map((region) => ({ region }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params
  const regionConfig = getRegion(region)

  return {
    title: `Checkout | Luxehome ${regionConfig.name}`,
    description: `Complete your purchase at Luxehome. Secure checkout with shipping to ${regionConfig.name}.`,
    robots: {
      index: false, // Don't index checkout pages
      follow: false,
    },
  }
}

export default async function CheckoutPage({ params }: PageProps) {
  const { region } = await params
  const regionConfig = getRegion(region)

  return (
    <>
      {/* Header */}
      <section className="bg-primary py-8">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="font-display text-display-md">Checkout</h1>
            <p className="text-white/70 mt-2">
              Shipping to {regionConfig.name}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-cream py-4">
        <div className="container">
          <ol className="flex items-center gap-2 text-sm text-text-light">
            <li>
              <Link href={`/${region}`} className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary font-medium">Checkout</li>
          </ol>
        </div>
      </nav>

      {/* Checkout Content */}
      <section className="section bg-cream">
        <div className="container">
          <CheckoutForm region={region as RegionCode} />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 bg-white border-t border-border">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm">Secure Payment Processing</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Order Confirmation via Email</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
