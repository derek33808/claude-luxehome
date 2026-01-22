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
    title: `Privacy Policy | Luxehome ${regionConfig.name}`,
    description: 'Learn how Luxehome collects, uses, and protects your personal information.',
  }
}

export default async function PrivacyPage({ params }: PageProps) {
  const { region } = await params

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Privacy Policy</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Your privacy is important to us
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
            <li className="text-primary font-medium">Privacy Policy</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-text-muted text-sm">Last updated: January 2026</p>

            <h2 className="font-display text-2xl text-primary mt-8">1. Information We Collect</h2>
            <p className="text-text-light">
              We collect information you provide directly to us, such as when you create an account,
              make a purchase, subscribe to our newsletter, or contact us for support.
            </p>
            <p className="text-text-light">This information may include:</p>
            <ul className="text-text-light">
              <li>Name and contact information (email, phone, address)</li>
              <li>Payment information (processed securely through our payment provider)</li>
              <li>Order history and preferences</li>
              <li>Communications with our support team</li>
            </ul>

            <h2 className="font-display text-2xl text-primary mt-8">2. How We Use Your Information</h2>
            <p className="text-text-light">We use the information we collect to:</p>
            <ul className="text-text-light">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your questions and requests</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h2 className="font-display text-2xl text-primary mt-8">3. Information Sharing</h2>
            <p className="text-text-light">
              We do not sell, trade, or rent your personal information to third parties.
              We may share your information with:
            </p>
            <ul className="text-text-light">
              <li>Service providers who assist in our operations (shipping, payment processing)</li>
              <li>Professional advisors (lawyers, accountants) when necessary</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h2 className="font-display text-2xl text-primary mt-8">4. Data Security</h2>
            <p className="text-text-light">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
              All payment transactions are encrypted using SSL technology.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">5. Cookies</h2>
            <p className="text-text-light">
              We use cookies and similar technologies to enhance your browsing experience,
              analyze site traffic, and personalize content. You can control cookie preferences
              through your browser settings.
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">6. Your Rights</h2>
            <p className="text-text-light">You have the right to:</p>
            <ul className="text-text-light">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>

            <h2 className="font-display text-2xl text-primary mt-8">7. Contact Us</h2>
            <p className="text-text-light">
              If you have questions about this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <p className="text-text-light">
              <strong>Email:</strong> privacy@luxehome.com<br />
              <strong>Address:</strong> Luxehome Privacy Team
            </p>

            <h2 className="font-display text-2xl text-primary mt-8">8. Changes to This Policy</h2>
            <p className="text-text-light">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
