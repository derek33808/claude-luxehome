import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Luxehome - Premium Smart Home Collection',
    template: '%s | Luxehome',
  },
  description: 'Discover premium smart home essentials at Luxehome. Curated collection of high-quality products for modern families.',
  keywords: ['smart home', 'home essentials', 'premium products', 'family organizer'],
  authors: [{ name: 'Luxehome' }],
  creator: 'Luxehome',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Luxehome',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@luxehome',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
