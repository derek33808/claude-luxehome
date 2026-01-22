import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion, validRegions } from '@/lib/regions'

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
    title: `Terms of Service | Luxehome ${regionConfig.name}`,
    description: 'Read our terms and conditions for using the Luxehome website and services.',
  }
}

export default async function TermsPage({ params }: PageProps) {
  const { region } = await params

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Terms of Service</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Please read these terms carefully
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
            <li className="text-primary font-medium">Terms of Service</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-text-muted text-sm">Last updated: January 2026</p>

            <h2 className="font-display text-2xl text-primary mt-8">1. Acceptance of Terms</h2>
            <p className="text-text-light">
              By accessing and using the Luxehome website and services, you accept and agree to be
              bound by these Terms of Service. If you do not agree to these terms, please do not
              use our services.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">2. Products and Pricing</h2>
            <p className="text-text-light">
              All products are subject to availability. We reserve the right to discontinue any
              product at any time. Prices are displayed in local currency and may vary by region.
              We reserve the right to change prices without notice.
            </p>
            <p className="text-text-light">
              In the event of a pricing error, we reserve the right to cancel any orders placed
              at the incorrect price and will notify you promptly.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">3. Orders and Payment</h2>
            <p className="text-text-light">
              When you place an order, you are making an offer to purchase. We reserve the right
              to accept or decline your order. Payment must be received in full before we ship
              your order.
            </p>
            <p className="text-text-light">
              You agree to provide accurate and complete payment information. You are responsible
              for any fees charged by your payment provider.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">4. Shipping and Delivery</h2>
            <p className="text-text-light">
              Delivery times are estimates and not guaranteed. We are not responsible for delays
              caused by shipping carriers, customs, or other factors beyond our control.
              Risk of loss passes to you upon delivery to the carrier.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">5. Returns and Refunds</h2>
            <p className="text-text-light">
              Please refer to our <Link href={`/${region}/returns`} className="text-accent hover:underline">Returns Policy</Link> for
              information about returns and refunds. All returns must comply with our return conditions.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">6. Intellectual Property</h2>
            <p className="text-text-light">
              All content on this website, including text, images, logos, and software, is the
              property of Luxehome or its licensors and is protected by intellectual property laws.
              You may not use, reproduce, or distribute any content without our written permission.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">7. User Conduct</h2>
            <p className="text-text-light">You agree not to:</p>
            <ul className="text-text-light">
              <li>Use our services for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our website</li>
              <li>Submit false or misleading information</li>
              <li>Violate the rights of others</li>
            </ul>

            <h2 className="font-display text-2xl text-primary mt-8">8. Limitation of Liability</h2>
            <p className="text-text-light">
              To the maximum extent permitted by law, Luxehome shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of our services
              or products.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">9. Indemnification</h2>
            <p className="text-text-light">
              You agree to indemnify and hold harmless Luxehome and its officers, directors, employees,
              and agents from any claims, damages, or expenses arising from your use of our services
              or violation of these terms.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">10. Governing Law</h2>
            <p className="text-text-light">
              These terms shall be governed by and construed in accordance with the laws of
              New Zealand. Any disputes shall be resolved in the courts of New Zealand.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">11. Changes to Terms</h2>
            <p className="text-text-light">
              We may update these Terms of Service from time to time. Continued use of our services
              after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">12. Contact</h2>
            <p className="text-text-light">
              For questions about these Terms of Service, please contact us at legal@luxehome.com.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
