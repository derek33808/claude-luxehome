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
    title: `About Us | Luxehome ${regionConfig.name}`,
    description: 'Learn about Luxehome - your destination for premium smart home essentials and lifestyle products.',
  }
}

export default async function AboutPage({ params }: PageProps) {
  const { region } = await params

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">About Luxehome</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Curating premium products for modern families
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
            <li className="text-primary font-medium">About Us</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-display-md text-primary">Our Story</h2>
            <p className="text-text-light leading-relaxed">
              Luxehome was founded with a simple mission: to bring carefully curated,
              premium products to modern families. We believe that the items you bring
              into your home should enhance your daily life, not complicate it.
            </p>

            <h3 className="font-display text-2xl text-primary mt-8">What We Stand For</h3>

            <div className="grid md:grid-cols-3 gap-8 mt-6 not-prose">
              <div className="text-center p-6 bg-cream rounded-lg">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Quality First</h4>
                <p className="text-sm text-text-light">Every product is thoroughly tested and vetted before we offer it to you.</p>
              </div>
              <div className="text-center p-6 bg-cream rounded-lg">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Family Focused</h4>
                <p className="text-sm text-text-light">We select products that make family life easier and more enjoyable.</p>
              </div>
              <div className="text-center p-6 bg-cream rounded-lg">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌏</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Local Service</h4>
                <p className="text-sm text-text-light">Fast shipping and dedicated support for Australia, New Zealand, and the US.</p>
              </div>
            </div>

            <h3 className="font-display text-2xl text-primary mt-12">Our Promise</h3>
            <p className="text-text-light leading-relaxed">
              We stand behind every product we sell with our 30-day money-back guarantee
              and dedicated customer support. If you&apos;re not completely satisfied,
              we&apos;ll make it right.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-cream">
        <div className="container text-center">
          <h2 className="font-display text-display-md text-primary mb-4">Have Questions?</h2>
          <p className="text-text-light mb-6">We&apos;d love to hear from you</p>
          <Link href={`/${region}/contact`} className="btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  )
}
