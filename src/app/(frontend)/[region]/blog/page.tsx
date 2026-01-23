import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getRegion, validRegions } from '@/lib/regions'
import { getAllBlogPosts, getFeaturedPost, categories, BlogPost } from '@/data/blog'

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
    title: `Blog - Home Organization Tips & Smart Home Guides | Luxehome ${regionConfig.name}`,
    description: 'Discover expert tips on family organization, smart home technology, meal planning, and creating a happier home. Read our latest guides and how-to articles.',
    keywords: 'family organization, smart home guide, meal planning tips, chore charts, digital calendar, home organization 2026',
    openGraph: {
      title: `Blog - Home Organization Tips & Smart Home Guides | Luxehome`,
      description: 'Expert tips on family organization, smart home technology, and creating a happier home.',
      type: 'website',
    },
  }
}

// Article Card Component
function ArticleCard({ post, region, featured = false }: { post: BlogPost; region: string; featured?: boolean }) {
  return (
    <article className={`group ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <Link href={`/${region}/blog/${post.slug}`} className="block">
        <div className={`relative ${featured ? 'aspect-[21/9]' : 'aspect-[16/10]'} bg-cream rounded-lg overflow-hidden mb-4`}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-slow group-hover:scale-105"
            priority={featured}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 text-primary text-xs font-medium rounded-full">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h2 className={`font-semibold ${featured ? 'text-xl md:text-2xl' : 'text-lg'} text-primary group-hover:text-accent transition-colors`}>
            {post.title}
          </h2>

          <p className={`text-text-light ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>{post.excerpt}</p>

          <div className="flex items-center gap-4 pt-2">
            <span className="inline-flex items-center text-accent text-sm font-medium">
              Read More
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            {post.tags && post.tags.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-text-muted bg-cream px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

// Category Badge Component
function CategoryBadge({ category, count, isActive }: { category: string; count: number; isActive: boolean }) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? 'bg-accent text-white'
          : 'bg-cream text-primary hover:bg-accent/10'
      }`}
    >
      {category} ({count})
    </button>
  )
}

export default async function BlogPage({ params }: PageProps) {
  const { region } = await params
  const allPosts = getAllBlogPosts()
  const featuredPost = getFeaturedPost()
  const otherPosts = allPosts.filter(post => !post.featured)

  // Count posts by category
  const categoryCounts = allPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Blog & Resources</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Expert tips, guides, and inspiration for organizing your home and family life
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb with Schema */}
      <nav className="bg-cream py-4" aria-label="Breadcrumb">
        <div className="container">
          <ol
            className="flex items-center gap-2 text-sm text-text-light"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/${region}`} className="hover:text-accent" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li>/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-primary font-medium" itemProp="name">Blog</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      {/* Categories Filter */}
      <section className="py-6 bg-white border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-text-muted mr-2">Browse by topic:</span>
            <CategoryBadge category="All" count={allPosts.length} isActive={true} />
            {categories.map((category) => (
              <CategoryBadge
                key={category}
                category={category}
                count={categoryCounts[category] || 0}
                isActive={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="section bg-cream">
          <div className="container">
            <div className="flex items-center gap-2 mb-8">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h2 className="font-display text-xl text-primary">Featured Article</h2>
            </div>
            <ArticleCard post={featuredPost} region={region} featured={true} />
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-display-md text-primary">Latest Articles</h2>
            <span className="text-sm text-text-muted">{otherPosts.length} articles</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} region={region} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="section bg-cream">
        <div className="container">
          <h2 className="font-display text-display-md text-primary text-center mb-8">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Family Organization', icon: '📅', description: 'Tips for keeping your busy household running smoothly', count: categoryCounts['Organization'] || 0 },
              { title: 'Smart Home', icon: '🏠', description: 'Technology to simplify and enhance your daily life', count: categoryCounts['Smart Home'] || 0 },
              { title: 'Gift Guides', icon: '🎁', description: 'Find the perfect gift for any occasion', count: categoryCounts['Gift Guide'] || 0 },
              { title: 'Family Life', icon: '👨‍👩‍👧‍👦', description: 'Creating quality time and lasting memories', count: categoryCounts['Family Life'] || 0 },
            ].map((topic) => (
              <div key={topic.title} className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{topic.icon}</span>
                <h3 className="font-semibold text-primary mb-2">{topic.title}</h3>
                <p className="text-sm text-text-muted mb-3">{topic.description}</p>
                <span className="text-xs text-accent">{topic.count} articles</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section bg-primary">
        <div className="container">
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="font-display text-display-md mb-4">Stay Updated</h2>
            <p className="text-white/70 mb-6">
              Subscribe to our newsletter for the latest articles, organization tips, and exclusive offers delivered straight to your inbox.
            </p>
            <form
              name="blog-newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="flex flex-col sm:flex-row gap-3"
            >
              <input type="hidden" name="form-name" value="blog-newsletter" />
              <p className="hidden"><label>Don&apos;t fill this out: <input name="bot-field" /></label></p>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
            <p className="text-xs text-white/50 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Rich Snippets - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Luxehome Blog",
            "description": "Expert tips on family organization, smart home technology, and creating a happier home.",
            "url": `https://luxehome.com/${region}/blog`,
            "blogPost": allPosts.slice(0, 5).map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "datePublished": post.date,
              "author": {
                "@type": "Organization",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Luxehome"
              }
            }))
          })
        }}
      />
    </>
  )
}
