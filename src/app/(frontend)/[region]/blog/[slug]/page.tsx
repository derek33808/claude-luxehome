import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getRegion, validRegions } from '@/lib/regions'
import { getBlogPostBySlug, getRelatedPosts, getAllBlogPosts, BlogPost } from '@/data/blog'

interface PageProps {
  params: Promise<{ region: string; slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  const params: { region: string; slug: string }[] = []

  for (const region of validRegions) {
    for (const post of posts) {
      params.push({ region, slug: post.slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, slug } = await params
  const post = getBlogPostBySlug(slug)
  const regionConfig = getRegion(region)

  if (!post) {
    return {
      title: 'Article Not Found | Luxehome',
    }
  }

  return {
    title: `${post.title} | Luxehome ${regionConfig.name} Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

// Related Article Card
function RelatedArticleCard({ post, region }: { post: BlogPost; region: string }) {
  return (
    <article className="group">
      <Link href={`/${region}/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-cream rounded-lg overflow-hidden mb-3">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-slow group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 text-primary text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-text-muted mt-1">{post.readTime}</p>
      </Link>
    </article>
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { region, slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, 3)

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[40vh] min-h-[300px] bg-primary">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/50" />
        <div className="container relative h-full flex items-end pb-12">
          <div className="text-white max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
              {post.featured && (
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h1 className="font-display text-display-md md:text-display-lg mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-NZ', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
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
              <Link href={`/${region}/blog`} className="hover:text-accent" itemProp="item">
                <span itemProp="name">Blog</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li>/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-primary font-medium line-clamp-1" itemProp="name">{post.title}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </div>
      </nav>

      {/* Article Content */}
      <article className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            <p className="text-lg text-text-light mb-8 font-medium border-l-4 border-accent pl-4">
              {post.excerpt}
            </p>

            {/* Main Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-h2:text-2xl prose-h3:text-xl prose-p:text-text-light prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-ul:text-text-light prose-ol:text-text-light"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h4 className="text-sm font-medium text-text-muted mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cream text-primary text-sm rounded-full hover:bg-accent/10 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-sm font-medium text-text-muted mb-3">Share this article</h4>
              <div className="flex gap-3">
                <button className="p-3 bg-cream rounded-full hover:bg-accent/10 transition-colors" aria-label="Share on Twitter">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="p-3 bg-cream rounded-full hover:bg-accent/10 transition-colors" aria-label="Share on Facebook">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="p-3 bg-cream rounded-full hover:bg-accent/10 transition-colors" aria-label="Share on LinkedIn">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="p-3 bg-cream rounded-full hover:bg-accent/10 transition-colors" aria-label="Copy link">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="section bg-cream">
          <div className="container">
            <h2 className="font-display text-display-md text-primary text-center mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <RelatedArticleCard key={relatedPost.slug} post={relatedPost} region={region} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href={`/${region}/blog`} className="btn-secondary">
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Luxehome",
              "logo": {
                "@type": "ImageObject",
                "url": "https://luxehome.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://luxehome.com/${region}/blog/${post.slug}`
            },
            "articleSection": post.category,
            "keywords": post.tags.join(', ')
          })
        }}
      />
    </>
  )
}

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive list items in ul
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs (lines that don't start with HTML tags)
    .split('\n\n')
    .map(block => {
      if (block.trim().startsWith('<') || !block.trim()) {
        return block
      }
      return `<p>${block}</p>`
    })
    .join('\n')
}
