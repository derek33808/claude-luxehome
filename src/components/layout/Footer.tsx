import Link from 'next/link'
import { RegionCode, getRegion } from '@/lib/regions'
import { siteConfig } from '@/lib/config'

interface FooterProps {
  region: RegionCode
}

export function Footer({ region }: FooterProps) {
  const currentRegion = getRegion(region)
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    shop: [
      { href: `/${region}/kitchen`, label: 'Kitchen' },
      { href: `/${region}/outdoor`, label: 'Outdoor' },
      { href: `/${region}/tech`, label: 'Tech' },
      { href: `/${region}/lifestyle`, label: 'Lifestyle' },
    ],
    company: [
      { href: `/${region}/about`, label: 'About Us' },
      { href: `/${region}/blog`, label: 'Blog' },
      { href: `/${region}/contact`, label: 'Contact' },
    ],
    support: [
      { href: `/${region}/faq`, label: 'FAQ' },
      { href: `/${region}/shipping`, label: 'Shipping' },
      { href: `/${region}/returns`, label: 'Returns' },
    ],
    legal: [
      { href: `/${region}/privacy`, label: 'Privacy Policy' },
      { href: `/${region}/terms`, label: 'Terms of Service' },
    ],
  }

  return (
    <footer className="text-white">
      {/* Newsletter Section - Using slightly lighter background for visual separation */}
      <div className="bg-[#242424]">
        <div className="container py-24 md:py-36">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl mb-8">Stay Updated</h3>
            <p className="text-white/70 mb-10">
              Subscribe for exclusive offers and new product updates.
            </p>
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="flex gap-2"
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <p className="hidden">
                <label>
                  Don&apos;t fill this out: <input name="bot-field" />
                </label>
              </p>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-primary font-semibold text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Visual Separator - Gold accent line for luxury feel */}
      <div className="bg-primary">
        <div className="container">
          <div className="flex items-center justify-center py-10 md:py-12">
            <div className="flex-1 h-px bg-white/10"></div>
            <div className="mx-6 w-16 h-px bg-accent"></div>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
        </div>
      </div>

      {/* Main Footer - Pure black background */}
      <div className="bg-primary">
        <div className="container pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${region}`} className="font-display text-2xl tracking-wider">
              LUXEHOME
            </Link>
            <p className="mt-4 text-sm text-white/70">
              Premium smart home essentials for modern families.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Pinterest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10 mt-2">
                <a
                  href={`mailto:${siteConfig.support.email}`}
                  className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {siteConfig.support.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary border-t border-white/10">
        <div className="container py-10 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>&copy; {currentYear} Luxehome. All rights reserved.</p>
            <p>
              Shipping to {currentRegion.name} ({currentRegion.currency})
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
