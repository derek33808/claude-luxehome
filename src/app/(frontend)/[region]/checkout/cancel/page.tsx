import { Metadata } from 'next'
import Link from 'next/link'
import { RegionCode, getRegion, validRegions } from '@/lib/regions'

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
    title: `Payment Cancelled - ${region.name} | Luxehome`,
    description: 'Your payment was cancelled.',
  }
}

export default async function CheckoutCancelPage({ params }: PageProps) {
  const { region: regionCode } = await params
  // const region = getRegion(regionCode as RegionCode)

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-text-light mb-8">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          {/* Information */}
          <div className="bg-cream rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-lg mb-4">What Happened?</h2>
            <p className="text-text-light mb-4">
              You cancelled the payment process or closed the payment window. Your cart items are still saved.
            </p>
            <p className="text-text-light">
              If you experienced any issues during checkout, please don&apos;t hesitate to contact our support team.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${regionCode}/checkout`}
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-semibold rounded transition-colors hover:bg-accent/90"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Return to Checkout
            </Link>
            <Link
              href={`/${regionCode}`}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded transition-colors hover:bg-primary hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-8 text-center text-text-muted">
          <p className="mb-2">Need help with your order?</p>
          <div className="space-y-2">
            <div>
              <a href="mailto:support@luxehome.com" className="text-accent hover:underline">
                support@luxehome.com
              </a>
            </div>
            <div>
              <Link href={`/${regionCode}/faq`} className="text-accent hover:underline">
                Visit our FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
