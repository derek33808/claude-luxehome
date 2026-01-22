import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion, validRegions } from '@/lib/regions'
import { siteConfig } from '@/lib/config'

interface PageProps {
  params: Promise<{ region: string }>
}

export function generateStaticParams() {
  return validRegions.map((region) => ({ region }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params
  const regionConfig = getRegion(region)
  return {
    title: `Returns & Refunds | Luxehome ${regionConfig.name}`,
    description: 'Learn about our 30-day money-back guarantee and easy return process.',
  }
}

export default async function ReturnsPage({ params }: PageProps) {
  const { region } = await params

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Returns & Refunds</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {siteConfig.returns.guarantee}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-cream py-4">
        <div className="container">
          <ol className="flex items-center gap-2 text-sm text-text-light">
            <li><Link href={`/${region}`} className="hover:text-accent">Home</Link></li>
            <li>/</li>
            <li className="text-primary font-medium">Returns</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Guarantee Banner */}
            <div className="bg-success/10 border border-success/30 rounded-lg p-6 mb-8 text-center">
              <span className="text-3xl mb-2 block">✓</span>
              <h2 className="font-semibold text-primary text-lg">{siteConfig.returns.guarantee}</h2>
              <p className="text-text-light text-sm mt-1">Shop with confidence - we stand behind every product</p>
            </div>

            <h2 className="font-display text-2xl text-primary mb-4">Return Policy</h2>
            <div className="space-y-4 text-text-light mb-8">
              <p>
                We want you to be completely happy with your purchase. If for any reason you&apos;re not satisfied,
                you can return your item within {siteConfig.returns.period} days of delivery for a full refund.
              </p>
            </div>

            <h2 className="font-display text-2xl text-primary mb-4">Return Conditions</h2>
            <ul className="list-none space-y-3 mb-8">
              {[
                'Item must be unused and in original packaging',
                'All accessories and documentation must be included',
                'Return request must be made within 30 days of delivery',
                'Proof of purchase (order number or receipt) required',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-text-light">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="font-display text-2xl text-primary mb-4">How to Return</h2>
            <div className="space-y-4 mb-8">
              {[
                { step: 1, title: 'Contact Us', desc: 'Email support@luxehome.com with your order number and reason for return.' },
                { step: 2, title: 'Get Return Label', desc: 'We\'ll send you a prepaid return shipping label within 24 hours.' },
                { step: 3, title: 'Ship Your Item', desc: 'Pack the item securely and drop it off at your nearest shipping location.' },
                { step: 4, title: 'Receive Refund', desc: 'Once we receive and inspect your return, we\'ll process your refund within 5-7 business days.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{item.title}</h3>
                    <p className="text-text-light text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl text-primary mb-4">Refund Information</h2>
            <div className="space-y-4 text-text-light mb-8">
              <p>
                <strong className="text-primary">Refund Method:</strong> Refunds are issued to the original payment method.
              </p>
              <p>
                <strong className="text-primary">Processing Time:</strong> 5-7 business days after we receive your return.
              </p>
              <p>
                <strong className="text-primary">Shipping Costs:</strong> Original shipping costs are non-refundable unless
                the return is due to our error (wrong item, defect, etc.).
              </p>
            </div>

            <h2 className="font-display text-2xl text-primary mb-4">Exchanges</h2>
            <p className="text-text-light">
              Want to exchange for a different product? Contact us and we&apos;ll help arrange an exchange.
              The easiest way is to return your original item for a refund and place a new order.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-cream">
        <div className="container text-center">
          <h2 className="font-display text-display-md text-primary mb-4">Need to Start a Return?</h2>
          <p className="text-text-light mb-6">Our support team is ready to help</p>
          <Link href={`/${region}/contact`} className="btn-primary">Contact Support</Link>
        </div>
      </section>
    </>
  )
}
