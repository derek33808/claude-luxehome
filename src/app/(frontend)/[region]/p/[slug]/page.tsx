import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getRegion, validRegions, RegionCode } from '@/lib/regions'
import { getProductBySlug, getAllProducts } from '@/data/products'

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

      {/* Product Detail Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-cream overflow-hidden">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square bg-cream overflow-hidden cursor-pointer border-2 ${
                      index === 0 ? 'border-accent' : 'border-transparent hover:border-accent/50'
                    } transition-colors`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="gold-line mb-4" />
              <span className="text-sm text-text-muted uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="font-display text-display-md text-primary mt-2 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-text-light mb-4">{product.shortDescription}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-accent' : 'text-border'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-text-light">
                  {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-4xl text-primary">
                  {regionConfig.currencySymbol}{price.price}
                </span>
                {price.comparePrice && (
                  <span className="text-xl text-text-muted line-through">
                    {regionConfig.currencySymbol}{price.comparePrice}
                  </span>
                )}
                {price.comparePrice && (
                  <span className="bg-accent text-white text-sm px-3 py-1 font-semibold">
                    SAVE {regionConfig.currencySymbol}{price.comparePrice - price.price}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`w-3 h-3 rounded-full ${
                    product.inStock ? 'bg-success' : 'bg-red-500'
                  }`}
                />
                <span className={product.inStock ? 'text-success' : 'text-red-500'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-text-light leading-relaxed mb-8">{product.description}</p>

              {/* Add to Cart */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="btn-primary flex-1 min-w-[200px]">
                  Add to Cart
                </button>
                <button className="btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
                <div className="text-center">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span className="text-xs text-text-light">Free Shipping</span>
                </div>
                <div className="text-center">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-xs text-text-light">Secure Payment</span>
                </div>
                <div className="text-center">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-xs text-text-light">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="section bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4" />
            <h2 className="font-display text-display-md text-primary">Key Features</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="gold-line mx-auto mb-4" />
              <h2 className="font-display text-display-md text-primary">Specifications</h2>
            </div>

            <div className="border border-border">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <div
                  key={key}
                  className={`flex ${index !== 0 ? 'border-t border-border' : ''}`}
                >
                  <div className="w-1/3 bg-cream p-4 font-medium text-primary">{key}</div>
                  <div className="w-2/3 p-4 text-text-light">{value}</div>
                </div>
              ))}
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
                    <div className="relative aspect-square bg-white mb-4 overflow-hidden">
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
