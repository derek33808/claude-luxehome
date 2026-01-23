import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getRegion, validRegions, RegionCode } from '@/lib/regions'
import { getProductBySlug, getAllProducts } from '@/data/products'
import { getReviewsByProductId, getAverageRating, getReviewCount } from '@/data/reviews'
import { ReviewSection } from '@/components/reviews/ReviewSection'
import { ProductActions } from '@/components/product/ProductActions'
import { ProductHeroClient } from '@/components/product/ProductHeroClient'

interface PageProps {
  params: Promise<{ region: string; slug: string }>
}

// Generate static params for all products in all regions
export function generateStaticParams() {
  const allProducts = getAllProducts()
  const params: { region: string; slug: string }[] = []

  validRegions.forEach((region) => {
    allProducts.forEach((product) => {
      params.push({ region, slug: product.slug })
    })
  })

  return params
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, slug } = await params
  const product = getProductBySlug(slug)
  const regionConfig = getRegion(region)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const title = `${product.name} | Luxehome ${regionConfig.name}`
  const description = `${product.shortDescription}. ${product.description.slice(0, 150)}...`

  return {
    title,
    description,
    keywords: [...product.tags, product.brand, regionConfig.name],
    openGraph: {
      title,
      description,
      url: `https://luxehome.com/${region}/p/${slug}`,
      siteName: 'Luxehome',
      images: [
        {
          url: product.images[0].url,
          width: 1200,
          height: 630,
          alt: product.images[0].alt,
        },
      ],
      locale: regionConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0].url],
    },
  }
}


export default async function ProductPage({ params }: PageProps) {
  const { region, slug } = await params
  const product = getProductBySlug(slug)
  const regionConfig = getRegion(region)

  if (!product) {
    notFound()
  }

  const price = product.prices[region as RegionCode]
  const relatedProducts = getAllProducts().filter((p) => p.id !== product.id).slice(0, 4)

  // Get reviews data
  const reviews = getReviewsByProductId(product.id)
  const averageRating = getAverageRating(product.id)
  const reviewCount = getReviewCount(product.id)

  // Product-specific FAQ
  const productFAQ = [
    {
      question: "How easy is it to set up?",
      answer: "Setup takes just minutes! Simply plug in, connect to Wi-Fi, and sync your existing calendars. No technical expertise needed.",
    },
    {
      question: "Does it work with my calendar app?",
      answer: "Yes! It syncs seamlessly with Google Calendar, Apple iCloud, Outlook, Yahoo, and Cozi. All updates appear automatically.",
    },
    {
      question: "Is there a monthly subscription?",
      answer: "No subscription required - ever! It's a one-time purchase with all features included.",
    },
    {
      question: "What's the return policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, return it for a full refund.",
    },
  ]

  return (
    <>
      {/* JSON-LD Structured Data for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images.map((img) => img.url),
            brand: {
              '@type': 'Brand',
              name: product.brand,
            },
            offers: {
              '@type': 'Offer',
              url: `https://luxehome.com/${region}/p/${slug}`,
              priceCurrency: regionConfig.currency,
              price: price.price,
              availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />

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
            <li>
              <Link
                href={`/${region}/${product.category}`}
                className="hover:text-accent transition-colors capitalize"
              >
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary font-medium">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Product Section */}
      <ProductHeroClient
        product={product}
        price={price.price}
        comparePrice={price.comparePrice}
        currencySymbol={regionConfig.currencySymbol}
        saveBadge={
          price.comparePrice ? (
            <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-sm font-semibold rounded z-10">
              SAVE {regionConfig.currencySymbol}{price.comparePrice - price.price}
            </div>
          ) : undefined
        }
      />

      {/* Guarantee Banner */}
      <section className="bg-primary py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white text-center md:text-left">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-semibold">30-Day Money-Back Guarantee</p>
                <p className="text-sm text-white/70">Not satisfied? Full refund, no questions asked</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">2-Year Warranty</p>
                <p className="text-sm text-white/70">Extended protection for peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Visual Grid */}
      <section className="section bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4" />
            <h2 className="font-display text-display-md text-primary">Why Families Love It</h2>
            <p className="text-text-light mt-4 max-w-2xl mx-auto">
              Designed with busy families in mind, every feature serves a purpose
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">
                    {index === 0 && '📅'}
                    {index === 1 && '⚡'}
                    {index === 2 && '✅'}
                    {index === 3 && '🖼️'}
                    {index === 4 && '💰'}
                  </span>
                </div>
                <h3 className="font-semibold text-primary text-lg mb-3">{feature.title}</h3>
                <p className="text-text-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <ReviewSection
        reviews={reviews}
        productId={product.id}
        productName={product.name}
        averageRating={averageRating}
        totalReviews={reviewCount}
      />

      {/* Specifications */}
      <section className="section bg-cream">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="gold-line mx-auto mb-4" />
              <h2 className="font-display text-display-md text-primary">Technical Specifications</h2>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <div
                  key={key}
                  className={`flex ${index !== 0 ? 'border-t border-border' : ''}`}
                >
                  <div className="w-1/3 bg-cream/50 p-4 font-medium text-primary">{key}</div>
                  <div className="w-2/3 p-4 text-text-light">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="gold-line mx-auto mb-4" />
              <h2 className="font-display text-display-md text-primary">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
              {productFAQ.map((faq, index) => (
                <div
                  key={index}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div className="bg-cream/50 p-4">
                    <h3 itemProp="name" className="font-semibold text-primary flex items-center gap-2">
                      <span className="text-accent">Q:</span>
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="p-4"
                  >
                    <p itemProp="text" className="text-text-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-text-light mb-4">Still have questions?</p>
              <Link href={`/${region}/contact`} className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-display text-display-md mb-4">
              Ready to Transform Your Family&apos;s Organization?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Join thousands of families who have simplified their daily routines
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ProductActions
                product={product}
                price={price.price}
                comparePrice={price.comparePrice}
                currencySymbol={regionConfig.currencySymbol}
                                variant="final-cta"
              />
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm">30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section bg-cream">
          <div className="container">
            <div className="text-center mb-12">
              <div className="gold-line mx-auto mb-4" />
              <h2 className="font-display text-display-md text-primary">You May Also Like</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => {
                const relatedPrice = relatedProduct.prices[region as RegionCode]
                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/${region}/p/${relatedProduct.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square bg-white rounded-lg mb-4 overflow-hidden">
                      <Image
                        src={relatedProduct.images[0].url}
                        alt={relatedProduct.images[0].alt}
                        fill
                        className="object-contain p-4 transition-transform duration-slow group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-text-light mb-2">
                      {relatedProduct.shortDescription}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {regionConfig.currencySymbol}{relatedPrice.price}
                      </span>
                      {relatedPrice.comparePrice && (
                        <span className="text-sm text-text-muted line-through">
                          {regionConfig.currencySymbol}{relatedPrice.comparePrice}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
