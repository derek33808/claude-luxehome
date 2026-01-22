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
    title: `Shipping Information | Luxehome ${regionConfig.name}`,
    description: 'Learn about our shipping options, delivery times, and policies.',
  }
}

export default async function ShippingPage({ params }: PageProps) {
  const { region } = await params
  const regionConfig = getRegion(region)

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Shipping Information</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Fast, free shipping to {regionConfig.name}
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
            <li className="text-primary font-medium">Shipping</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Free Shipping Banner */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-8 text-center">
              <span className="text-3xl mb-2 block">🚚</span>
              <h2 className="font-semibold text-primary text-lg">{siteConfig.shipping.freeShippingMessage}</h2>
              <p className="text-text-light text-sm mt-1">No minimum purchase required</p>
            </div>

            <h2 className="font-display text-2xl text-primary mb-4">Delivery Times</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border border-border rounded-lg overflow-hidden">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Region</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Standard Shipping</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Express Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-text-light">New Zealand</td>
                    <td className="px-4 py-3 text-text-light">5-7 business days</td>
                    <td className="px-4 py-3 text-text-light">2-3 business days</td>
                  </tr>
                  <tr className="border-t border-border bg-cream/30">
                    <td className="px-4 py-3 text-text-light">Australia</td>
                    <td className="px-4 py-3 text-text-light">7-10 business days</td>
                    <td className="px-4 py-3 text-text-light">3-5 business days</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-text-light">United States</td>
                    <td className="px-4 py-3 text-text-light">10-14 business days</td>
                    <td className="px-4 py-3 text-text-light">5-7 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-display text-2xl text-primary mb-4">Shipping Policy</h2>
            <div className="space-y-4 text-text-light">
              <p>
                <strong className="text-primary">Processing Time:</strong> Orders are processed within 1-2 business days.
                You&apos;ll receive a confirmation email with tracking information once your order ships.
              </p>
              <p>
                <strong className="text-primary">Tracking:</strong> All orders include tracking. You can track your
                package using the link provided in your shipping confirmation email.
              </p>
              <p>
                <strong className="text-primary">Signature Required:</strong> For orders over $200, a signature may
                be required upon delivery to ensure secure receipt.
              </p>
              <p>
                <strong className="text-primary">P.O. Boxes:</strong> We can ship to P.O. boxes via standard shipping.
                Express shipping requires a physical address.
              </p>
            </div>

            <h2 className="font-display text-2xl text-primary mt-8 mb-4">Shipping Partners</h2>
            <p className="text-text-light mb-4">
              We work with trusted carriers to ensure your package arrives safely:
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-cream rounded-lg text-text-light">DHL</div>
              <div className="px-4 py-2 bg-cream rounded-lg text-text-light">FedEx</div>
              <div className="px-4 py-2 bg-cream rounded-lg text-text-light">Australia Post</div>
              <div className="px-4 py-2 bg-cream rounded-lg text-text-light">NZ Post</div>
              <div className="px-4 py-2 bg-cream rounded-lg text-text-light">USPS</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-cream">
        <div className="container text-center">
          <h2 className="font-display text-display-md text-primary mb-4">Questions About Shipping?</h2>
          <p className="text-text-light mb-6">Our team is here to help</p>
          <Link href={`/${region}/contact`} className="btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  )
}
