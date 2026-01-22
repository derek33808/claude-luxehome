import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
    title: `Blog | Luxehome ${regionConfig.name}`,
    description: 'Tips, guides, and inspiration for your home and family life.',
  }
}

// Sample blog posts (in production, these would come from a CMS or data file)
const blogPosts = [
  {
    slug: 'family-organization-tips',
    title: '10 Tips for Better Family Organization',
    excerpt: 'Discover simple strategies to keep your busy household running smoothly.',
    image: '/images/products/smart-digital-calendar/main.jpg',
    category: 'Organization',
    date: '2026-01-15',
    readTime: '5 min read',
  },
  {
    slug: 'smart-home-beginners-guide',
    title: 'Smart Home Essentials: A Beginner\'s Guide',
    excerpt: 'Everything you need to know to start building your smart home.',
    image: '/images/products/smart-digital-calendar/calendar-view.jpg',
    category: 'Smart Home',
    date: '2026-01-10',
    readTime: '7 min read',
  },
  {
    slug: 'gift-ideas-for-families',
    title: 'Unique Gift Ideas for Families',
    excerpt: 'Find the perfect gift that the whole family can enjoy together.',
    image: '/images/products/mini-arcade-machine/main.jpg',
    category: 'Gift Guide',
    date: '2026-01-05',
    readTime: '4 min read',
  },
]

export default async function BlogPage({ params }: PageProps) {
  const { region } = await params

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Blog</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Tips, guides, and inspiration for your home
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
            <li className="text-primary font-medium">Blog</li>
          </ol>
        </div>
      </nav>

      {/* Blog Posts */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/${region}/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] bg-cream rounded-lg overflow-hidden mb-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-slow group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 text-primary text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <time>{new Date(post.date).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="font-semibold text-lg text-primary group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-text-light line-clamp-2">{post.excerpt}</p>

                    <span className="inline-flex items-center text-accent text-sm font-medium">
                      Read More
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="mt-12 text-center">
            <p className="text-text-muted">More articles coming soon!</p>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section bg-cream">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-display-md text-primary mb-4">Stay Updated</h2>
            <p className="text-text-light mb-6">
              Subscribe to our newsletter for the latest articles, tips, and exclusive offers.
            </p>
            <form
              name="blog-newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="flex gap-2"
            >
              <input type="hidden" name="form-name" value="blog-newsletter" />
              <p className="hidden"><label>Don&apos;t fill this out: <input name="bot-field" /></label></p>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
