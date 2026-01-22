import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getRegion, validRegions, RegionCode } from '@/lib/regions'
import { getProductsByCategory, categories, Category } from '@/data/products'

interface PageProps {
  params: Promise<{ region: string; category: string }>
}

// Valid category slugs
const validCategories = ['kitchen', 'outdoor', 'tech', 'lifestyle']

// Generate static params for all categories in all regions
export function generateStaticParams() {
  const params: { region: string; category: string }[] = []

  validRegions.forEach((region) => {
    validCategories.forEach((category) => {
      params.push({ region, category })
    })
  })

  return params
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, category } = await params
  const regionConfig = getRegion(region)

  if (!validCategories.includes(category)) {
    return { title: 'Category Not Found' }
  }

  const categoryInfo = categories[category as Category]
  const title = `${categoryInfo?.name || category} | Luxehome ${regionConfig.name}`
  const description = categoryInfo?.description || `Browse our ${category} collection`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://luxehome.com/${region}/${category}`,
      siteName: 'Luxehome',
      locale: regionConfig.locale,
      type: 'website',
    },
  }
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-accent' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default async function CategoryPage({ params }: PageProps) {
  const { region, category } = await params
  const regionConfig = getRegion(region)

  // Check if category is valid
  if (!validCategories.includes(category)) {
    notFound()
  }

  const categoryInfo = categories[category as Category]
  const products = getProductsByCategory(category as Category)

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">{categoryInfo?.name || category}</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {categoryInfo?.description || `Discover our curated collection of ${category} products`}
            </p>
          </div>
        </div>
      </section>

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
            <li className="text-primary font-medium capitalize">{categoryInfo?.name || category}</li>
          </ol>
        </div>
      </nav>

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container">
          {products.length > 0 ? (
            <>
              <p className="text-text-muted mb-8">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const price = product.prices[region as RegionCode]
                  return (
                    <Link
                      key={product.id}
                      href={`/${region}/p/${product.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-square bg-cream rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          fill
                          className="object-contain p-4 transition-transform duration-slow group-hover:scale-105"
                        />
                        {price.comparePrice && (
                          <div className="absolute top-4 left-4 bg-accent text-white px-2 py-1 text-xs font-semibold rounded">
                            SAVE {regionConfig.currencySymbol}{price.comparePrice - price.price}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-text-muted uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-text-light line-clamp-2">
                          {product.shortDescription}
                        </p>

                        <div className="flex items-center gap-2">
                          <StarRating rating={product.rating} />
                          <span className="text-sm text-text-muted">
                            ({product.reviewCount})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            {regionConfig.currencySymbol}{price.price}
                          </span>
                          {price.comparePrice && (
                            <span className="text-sm text-text-muted line-through">
                              {regionConfig.currencySymbol}{price.comparePrice}
                            </span>
                          )}
                        </div>

                        {product.inStock ? (
                          <span className="text-xs text-success font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-border mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h2 className="font-display text-2xl text-primary mb-2">No Products Yet</h2>
              <p className="text-text-muted mb-6">
                We&apos;re working on adding products to this category. Check back soon!
              </p>
              <Link href={`/${region}`} className="btn-primary">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-cream">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-display-md text-primary mb-4">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-text-light mb-6">
              We&apos;re always adding new products. Let us know what you&apos;d like to see!
            </p>
            <Link href={`/${region}/contact`} className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
