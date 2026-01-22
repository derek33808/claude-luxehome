import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion, isValidRegion, defaultRegion, RegionCode, validRegions } from '@/lib/regions'

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

  const title = `Luxehome - Premium Smart Home Collection | ${regionConfig.name}`
  const description = `Discover premium smart home essentials at Luxehome. Curated collection of high-quality products for modern families in ${regionConfig.name}. Free shipping available.`

  return {
    title,
    description,
    keywords: ['smart home', 'home essentials', 'premium products', 'family organizer', regionConfig.name],
    openGraph: {
      title,
      description,
      url: `https://luxehome.com/${region}`,
      siteName: 'Luxehome',
      locale: regionConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://luxehome.com/${region}`,
      languages: {
        'en-AU': '/au',
        'en-NZ': '/nz',
        'en-US': '/us',
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { region } = await params
  const regionConfig = getRegion(region)

  const categories = [
    {
      name: 'Kitchen',
      slug: 'kitchen',
      description: 'Smart kitchen essentials',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    },
    {
      name: 'Outdoor',
      slug: 'outdoor',
      description: 'Outdoor living & garden',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    },
    {
      name: 'Tech',
      slug: 'tech',
      description: 'Smart home technology',
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=400&fit=crop',
    },
    {
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'Modern living essentials',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop',
    },
  ]

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Luxehome',
            url: `https://luxehome.com/${region}`,
            logo: 'https://luxehome.com/logo.png',
            description: 'Premium smart home essentials for modern families',
            sameAs: [
              'https://instagram.com/luxehome',
              'https://pinterest.com/luxehome',
              'https://twitter.com/luxehome',
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center bg-cream">
        <div className="container">
          <div className="max-w-2xl">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-display-lg text-primary mb-6">
              Premium Smart Home <em>Essentials</em>
            </h1>
            <p className="text-lg text-text-light mb-8 leading-relaxed">
              Discover our curated collection of high-quality products designed
              to enhance your everyday living. Thoughtfully selected for modern families.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${region}/kitchen`} className="btn-primary">
                Shop Collection
              </Link>
              <Link href={`/${region}/about`} className="btn-secondary">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 right-0 w-1/2 h-full -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-l from-secondary/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4" />
            <h2 className="font-display text-display-md text-primary">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${region}/${category.slug}`}
                className="group relative overflow-hidden aspect-[4/5] bg-cream"
              >
                {/* Image placeholder */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-slow group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-display text-2xl mb-1">{category.name}</h3>
                  <p className="text-sm text-white/70">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="section bg-cream">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="relative aspect-square bg-white shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://m.media-amazon.com/images/I/61CBS64TYsL.jpg)',
                }}
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="gold-line mb-6" />
              <span className="text-sm text-text-muted uppercase tracking-wider">Featured Product</span>
              <h2 className="font-display text-display-md text-primary mt-2 mb-4">
                Smart Digital Calendar
              </h2>
              <p className="text-text-light leading-relaxed mb-6">
                15.6-inch touchscreen wall planner that serves as an all-in-one family organizer.
                Syncs with Google Calendar, iCloud, Outlook, and more. No subscription fees.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-text-light">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  15.6&quot; IPS HD Touchscreen Display
                </li>
                <li className="flex items-center gap-3 text-text-light">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Wi-Fi Sync with Major Calendars
                </li>
                <li className="flex items-center gap-3 text-text-light">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No Subscription Required
                </li>
              </ul>

              <div className="flex items-center gap-6 mb-8">
                <span className="font-display text-3xl text-primary">
                  {regionConfig.currencySymbol}229
                </span>
                <span className="text-text-muted line-through">
                  {regionConfig.currencySymbol}299
                </span>
              </div>

              <Link
                href={`/${region}/p/smart-digital-calendar`}
                className="btn-primary"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4" />
            <h2 className="font-display text-display-md text-primary">
              Best Sellers
            </h2>
            <p className="text-text-light mt-4">Our most popular products loved by customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product 1 */}
            <Link href={`/${region}/p/smart-digital-calendar`} className="group">
              <div className="relative aspect-square bg-cream mb-4 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-slow group-hover:scale-105"
                  style={{ backgroundImage: 'url(https://m.media-amazon.com/images/I/61CBS64TYsL.jpg)' }}
                />
              </div>
              <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">Smart Digital Calendar</h3>
              <p className="text-sm text-text-light mb-2">15.6&quot; Family Organizer</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{regionConfig.currencySymbol}229</span>
                <span className="text-sm text-text-muted line-through">{regionConfig.currencySymbol}299</span>
              </div>
            </Link>

            {/* Product 2 */}
            <Link href={`/${region}/p/smart-thermostat`} className="group">
              <div className="relative aspect-square bg-cream mb-4 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-slow group-hover:scale-105"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop)' }}
                />
              </div>
              <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">Smart Thermostat Pro</h3>
              <p className="text-sm text-text-light mb-2">Energy-Saving Climate Control</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{regionConfig.currencySymbol}189</span>
                <span className="text-sm text-text-muted line-through">{regionConfig.currencySymbol}249</span>
              </div>
            </Link>

            {/* Product 3 */}
            <Link href={`/${region}/p/wireless-security-camera`} className="group">
              <div className="relative aspect-square bg-cream mb-4 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-slow group-hover:scale-105"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop)' }}
                />
              </div>
              <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">Wireless Security Camera</h3>
              <p className="text-sm text-text-light mb-2">4K HD Night Vision</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{regionConfig.currencySymbol}149</span>
                <span className="text-sm text-text-muted line-through">{regionConfig.currencySymbol}199</span>
              </div>
            </Link>

            {/* Product 4 */}
            <Link href={`/${region}/p/smart-doorbell`} className="group">
              <div className="relative aspect-square bg-cream mb-4 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-slow group-hover:scale-105"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop)' }}
                />
              </div>
              <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">Smart Video Doorbell</h3>
              <p className="text-sm text-text-light mb-2">2-Way Audio, Motion Alerts</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{regionConfig.currencySymbol}129</span>
                <span className="text-sm text-text-muted line-through">{regionConfig.currencySymbol}179</span>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link href={`/${region}/products`} className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <h2 className="font-display text-display-md mb-6">
              Curated for Modern Living
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              At Luxehome, we believe in the power of thoughtfully designed products
              to transform everyday moments. Each item in our collection is carefully
              selected for quality, functionality, and timeless appeal.
            </p>
            <Link
              href={`/${region}/about`}
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              Learn More About Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4" />
            <h2 className="font-display text-display-md text-primary">
              Why Choose Luxehome
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-3">Premium Quality</h3>
              <p className="text-text-light">Every product is carefully vetted for quality, durability, and design excellence.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-3">Free Shipping</h3>
              <p className="text-text-light">Enjoy free standard shipping on all orders over {regionConfig.currencySymbol}100.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-3">30-Day Returns</h3>
              <p className="text-text-light">Not satisfied? Return within 30 days for a full refund. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section for GEO */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="gold-line mx-auto mb-4" />
              <h2 className="font-display text-display-md text-primary">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="border-b border-border pb-6">
                <h3 itemProp="name" className="font-semibold text-primary mb-2">
                  Do you ship to {regionConfig.name}?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-text-light">
                    Yes! We offer shipping throughout {regionConfig.name}.
                    Standard shipping typically takes 5-7 business days.
                    Express shipping options are also available at checkout.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="border-b border-border pb-6">
                <h3 itemProp="name" className="font-semibold text-primary mb-2">
                  What is your return policy?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-text-light">
                    We offer a 30-day return policy for all products. Items must be
                    unused and in original packaging. Contact our support team to
                    initiate a return.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="border-b border-border pb-6">
                <h3 itemProp="name" className="font-semibold text-primary mb-2">
                  Are prices shown in {regionConfig.currency}?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-text-light">
                    Yes, all prices on our {regionConfig.name} store are displayed in
                    {' '}{regionConfig.currency}. Prices include {regionConfig.taxName} where applicable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
