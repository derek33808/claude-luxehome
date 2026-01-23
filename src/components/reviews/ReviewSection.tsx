'use client'

import { useState } from 'react'
import { Review, getRatingDistribution } from '@/data/reviews'
import { StarRating, StarRatingInput, RatingBar } from '@/components/common/StarRating'

interface ReviewSectionProps {
  reviews: Review[]
  productId: string
  productName: string
  averageRating: number
  totalReviews: number
}

// Single Review Card
function ReviewCard({ review }: { review: Review }) {
  const [isHelpful, setIsHelpful] = useState(false)

  return (
    <div className="border border-border rounded-lg p-6 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} size="sm" />
            {review.verified && (
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                Verified Purchase
              </span>
            )}
          </div>
          <h4 className="font-semibold text-primary">{review.title}</h4>
        </div>
        <span className="text-xs text-text-muted">
          {new Date(review.date).toLocaleDateString('en-NZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Content */}
      <p className="text-text-light leading-relaxed mb-4">{review.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-text-muted">
          <span className="font-medium text-primary">{review.author}</span>
          {review.location && <span> • {review.location}</span>}
        </div>
        <button
          onClick={() => setIsHelpful(!isHelpful)}
          className={`flex items-center gap-1 transition-colors ${
            isHelpful ? 'text-accent' : 'text-text-muted hover:text-primary'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>Helpful ({review.helpful + (isHelpful ? 1 : 0)})</span>
        </button>
      </div>
    </div>
  )
}

// Review Form
function ReviewForm({ productId, productName }: { productId: string; productName: string }) {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="bg-success/10 border border-success/30 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-primary mb-2">Thank you for your review!</h3>
        <p className="text-text-light">Your feedback helps other customers make informed decisions.</p>
      </div>
    )
  }

  return (
    <form
      name="reviews"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={() => setSubmitted(true)}
      className="bg-cream rounded-lg p-6"
    >
      <input type="hidden" name="form-name" value="reviews" />
      <input type="hidden" name="product-id" value={productId} />
      <input type="hidden" name="product-name" value={productName} />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <h3 className="font-semibold text-primary text-lg mb-4">Write a Review</h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-primary mb-2">Your Rating *</label>
        <StarRatingInput value={rating} onChange={setRating} />
        <input type="hidden" name="rating" value={rating} required />
      </div>

      {/* Name (Optional) */}
      <div className="mb-4">
        <label htmlFor="reviewer-name" className="block text-sm font-medium text-primary mb-2">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="reviewer-name"
          name="reviewer-name"
          placeholder="Anonymous"
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {/* Location (Optional) */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-primary mb-2">
          Location (Optional)
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="e.g., Auckland, NZ"
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {/* Review Title */}
      <div className="mb-4">
        <label htmlFor="review-title" className="block text-sm font-medium text-primary mb-2">
          Review Title *
        </label>
        <input
          type="text"
          id="review-title"
          name="review-title"
          required
          placeholder="Summarize your experience"
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {/* Review Content */}
      <div className="mb-6">
        <label htmlFor="review-content" className="block text-sm font-medium text-primary mb-2">
          Your Review *
        </label>
        <textarea
          id="review-content"
          name="review-content"
          required
          rows={4}
          placeholder="Tell us what you think about this product..."
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={rating === 0}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Review
      </button>

      <p className="text-xs text-text-muted mt-4 text-center">
        By submitting, you agree that your review may be published on our website.
      </p>
    </form>
  )
}

// Main Review Section Component
export function ReviewSection({
  reviews,
  productId,
  productName,
  averageRating,
  totalReviews,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const distribution = getRatingDistribution(productId)

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4" />
            <h2 className="font-display text-display-md text-primary">Customer Reviews</h2>
          </div>

          {/* Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="font-display text-5xl text-primary">{averageRating.toFixed(1)}</span>
                <div>
                  <StarRating rating={averageRating} size="lg" />
                  <p className="text-text-muted mt-1">Based on {totalReviews} reviews</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary"
              >
                {showForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <RatingBar
                  key={rating}
                  rating={rating}
                  count={distribution[rating]}
                  total={totalReviews}
                />
              ))}
            </div>
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="mb-12">
              <ReviewForm productId={productId} productName={productName} />
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No reviews yet. Be the first to review this product!</p>
              <button onClick={() => setShowForm(true)} className="btn-secondary mt-4">
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
