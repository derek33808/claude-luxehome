'use client'

import Link from 'next/link'
import { useState } from 'react'
import { RegionCode, regions, getRegion } from '@/lib/regions'

interface HeaderProps {
  region: RegionCode
}

export function Header({ region }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const currentRegion = getRegion(region)

  const navLinks = [
    { href: `/${region}`, label: 'Home' },
    { href: `/${region}/kitchen`, label: 'Kitchen' },
    { href: `/${region}/outdoor`, label: 'Outdoor' },
    { href: `/${region}/tech`, label: 'Tech' },
    { href: `/${region}/lifestyle`, label: 'Lifestyle' },
    { href: `/${region}/blog`, label: 'Blog' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="container">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href={`/${region}`}
            className="font-display text-2xl tracking-wider text-primary"
          >
            LUXEHOME
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium tracking-wide uppercase text-text-light hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Region Selector */}
            <div className="relative">
              <button
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors"
              >
                <span>{currentRegion.flag}</span>
                <span className="hidden sm:inline">{currentRegion.code.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isRegionOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-md shadow-md py-2 min-w-[150px]">
                  {Object.values(regions).map((r) => (
                    <Link
                      key={r.code}
                      href={`/${r.code}`}
                      onClick={() => setIsRegionOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-cream transition-colors ${
                        r.code === region ? 'text-primary font-medium' : 'text-text-light'
                      }`}
                    >
                      <span>{r.flag}</span>
                      <span>{r.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <button
              className="p-2 text-text-light hover:text-primary transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              className="p-2 text-text-light hover:text-primary transition-colors relative"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Cart count badge */}
              {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">0</span> */}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 md:hidden text-text-light hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-medium tracking-wide uppercase text-text-light hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
