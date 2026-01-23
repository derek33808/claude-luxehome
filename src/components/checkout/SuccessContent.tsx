'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SuccessContentProps {
  regionCode: string
}

export function SuccessContent({ regionCode }: SuccessContentProps) {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    setSessionId(searchParams.get('session_id'))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-text-light mb-8">
            Thank you for your order. We&apos;ve received your payment and will process your order shortly.
          </p>

          {/* Order Details */}
          <div className="bg-cream rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-lg mb-4">What&apos;s Next?</h2>
            <ul className="space-y-3 text-text-light">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>You&apos;ll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>Your order will be prepared and shipped within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Track your order status with the tracking number in your email</span>
              </li>
            </ul>
          </div>

          {/* Session ID (for reference) */}
          {sessionId && (
            <div className="text-sm text-text-muted mb-8">
              Order Reference: <span className="font-mono">{sessionId.slice(-12)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${regionCode}`}
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-semibold rounded transition-colors hover:bg-accent/90"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/${regionCode}/contact`}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded transition-colors hover:bg-primary hover:text-white"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-8 text-center text-text-muted">
          <p className="mb-2">Questions about your order?</p>
          <a href="mailto:support@luxehome.com" className="text-accent hover:underline">
            support@luxehome.com
          </a>
        </div>
      </div>
    </div>
  )
}
