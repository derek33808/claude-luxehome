import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRegion, validRegions, RegionCode } from '@/lib/regions'
import { getProductsByCategory, categories, Category } from '@/data/products'
import { CategoryProductsClient } from '@/components/category'

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

export default async function CategoryPage({ params }: PageProps) {
  const { region, category } = await params

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

      {/* Products Grid with Filter/Sort */}
      <section className="section bg-white">
        <div className="container">
          {products.length > 0 ? (
            <CategoryProductsClient
              products={products}
              region={region as RegionCode}
            />
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
