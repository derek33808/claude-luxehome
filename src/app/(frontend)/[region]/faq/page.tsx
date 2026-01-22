import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion, validRegions } from '@/lib/regions'
import { siteConfig } from '@/lib/config'
import { FAQAccordion } from '@/components/faq/FAQAccordion'

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
    title: `FAQ | Luxehome ${regionConfig.name}`,
    description: 'Find answers to frequently asked questions about orders, shipping, returns, and more.',
  }
}

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 5-10 business days within Australia and New Zealand, and 7-14 business days to the US. Express shipping options are available at checkout.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders. No minimum purchase required.',
      },
      {
        q: 'Can I track my order?',
        a: 'Absolutely. Once your order ships, you\'ll receive an email with tracking information. You can track your package directly from the carrier\'s website.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we ship to Australia, New Zealand, and the United States. We\'re working on expanding to more countries soon.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day money-back guarantee on all products. If you\'re not satisfied, simply contact us to initiate a return.',
      },
      {
        q: 'How do I return an item?',
        a: 'Email us at support@luxehome.com with your order number and reason for return. We\'ll provide you with a prepaid return label and instructions.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.',
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes, we offer exchanges within 30 days of purchase. Contact our support team to arrange an exchange.',
      },
    ],
  },
  {
    category: 'Products & Warranty',
    questions: [
      {
        q: 'Do your products come with a warranty?',
        a: 'Yes, all products come with a minimum 2-year manufacturer warranty. Some products offer extended warranty options.',
      },
      {
        q: 'Are your products genuine?',
        a: 'Absolutely. We only sell 100% authentic products sourced directly from manufacturers or authorized distributors.',
      },
      {
        q: 'What if my product arrives damaged?',
        a: 'Contact us immediately with photos of the damage. We\'ll arrange a replacement or full refund at no cost to you.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details.',
      },
      {
        q: 'Can I pay in installments?',
        a: 'We\'re working on adding buy-now-pay-later options. Stay tuned for updates!',
      },
    ],
  },
]

export default async function FAQPage({ params }: PageProps) {
  const { region } = await params

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <h1 className="font-display text-display-lg mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Find answers to common questions
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
            <li className="text-primary font-medium">FAQ</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-cream">
        <div className="container text-center">
          <h2 className="font-display text-display-md text-primary mb-4">Still Have Questions?</h2>
          <p className="text-text-light mb-6">Our support team is happy to help</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${region}/contact`} className="btn-primary">Contact Us</Link>
            <a href={`mailto:${siteConfig.support.email}`} className="btn-secondary">
              Email Support
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
