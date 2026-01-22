'use client'

import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-cream/50 transition-colors text-left"
      >
        <span className="font-medium text-primary pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-cream/30 border-t border-border">
          <p className="text-text-light">{answer}</p>
        </div>
      )}
    </div>
  )
}

interface FAQCategory {
  category: string
  questions: { q: string; a: string }[]
}

interface FAQAccordionProps {
  faqs: FAQCategory[]
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((category, index) => (
        <div key={index} className="mb-10">
          <h2 className="font-display text-xl text-primary mb-4">{category.category}</h2>
          <div className="space-y-3">
            {category.questions.map((faq, faqIndex) => (
              <FAQItem key={faqIndex} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
