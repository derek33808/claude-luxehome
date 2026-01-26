'use client'

import { useState, useCallback } from 'react'
import { RegionCode, getRegion, formatPrice } from '@/lib/regions'
import { useCartContext } from '@/components/cart/CartProvider'

interface FormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
}

interface FormErrors {
  email?: string
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  phone?: string
}

interface CheckoutFormProps {
  region: RegionCode
}

export function CheckoutForm({ region }: CheckoutFormProps) {
  const regionConfig = getRegion(region)
  const { cart, subtotal, savings, isLoaded } = useCartContext()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation rules
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return undefined
  }

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} is required`
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required'
    const phoneRegex = /^[\d\s\-+()]{8,}$/
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number'
    return undefined
  }

  const validatePostalCode = (code: string, region: RegionCode): string | undefined => {
    if (!code.trim()) return 'Postal code is required'

    const patterns: Record<RegionCode, { regex: RegExp; message: string }> = {
      au: { regex: /^\d{4}$/, message: 'Australian postcode must be 4 digits' },
      nz: { regex: /^\d{4}$/, message: 'NZ postcode must be 4 digits' },
      us: { regex: /^\d{5}(-\d{4})?$/, message: 'US ZIP code must be 5 or 9 digits' },
    }

    const pattern = patterns[region]
    if (!pattern.regex.test(code.trim())) return pattern.message
    return undefined
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      firstName: validateRequired(formData.firstName, 'First name'),
      lastName: validateRequired(formData.lastName, 'Last name'),
      address: validateRequired(formData.address, 'Address'),
      city: validateRequired(formData.city, 'City'),
      state: validateRequired(formData.state, region === 'us' ? 'State' : 'State/Region'),
      postalCode: validatePostalCode(formData.postalCode, region),
      phone: validatePhone(formData.phone),
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== undefined)
  }, [formData, region])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Prepare cart items for Stripe
      const items = cart.items.map(item => ({
        id: item.productId,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))

      // Create checkout session via Netlify Function
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          region,
          currency: regionConfig.currency,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionUrl } = await response.json()

      // Redirect to Stripe Checkout URL
      if (sessionUrl) {
        window.location.href = sessionUrl
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'There was an error processing your order. Please try again.')
      setIsSubmitting(false)
    }
    // Note: Don't set isSubmitting to false here if successful, as we're redirecting to Stripe
  }, [validateForm, cart.items, region, regionConfig.currency])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }


  if (cart.items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <svg className="w-16 h-16 mx-auto text-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="font-display text-2xl text-primary mb-4">Your Cart is Empty</h2>
        <p className="text-text-muted mb-6">
          Add some products to your cart before checking out.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="checkout"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="grid lg:grid-cols-3 gap-8"
    >
      {/* Hidden fields for Netlify Forms */}
      <input type="hidden" name="form-name" value="checkout" />
      <input type="hidden" name="bot-field" />

      {/* Contact & Shipping Info */}
      <div className="lg:col-span-2 space-y-8">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg border border-border">
          <h2 className="font-display text-xl text-primary mb-6">Contact Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="your@email.com"
              />
              <p className="mt-1 text-xs text-secondary">
                Please ensure your email is correct. We&apos;ll send order confirmation, shipping updates, and important notifications to this address.
              </p>
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                  errors.phone ? 'border-error' : 'border-border'
                }`}
                placeholder={region === 'us' ? '(555) 123-4567' : '04XX XXX XXX'}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-error">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-lg border border-border">
          <h2 className="font-display text-xl text-primary mb-6">Shipping Address</h2>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                    errors.firstName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-error">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                    errors.lastName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-error">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-primary mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                  errors.address ? 'border-error' : 'border-border'
                }`}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-error">{errors.address}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-primary mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                    errors.city ? 'border-error' : 'border-border'
                  }`}
                  placeholder={region === 'nz' ? 'Auckland' : region === 'au' ? 'Sydney' : 'New York'}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-error">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-primary mb-1">
                  {region === 'us' ? 'State' : 'State/Region'} *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                    errors.state ? 'border-error' : 'border-border'
                  }`}
                  placeholder={region === 'nz' ? 'Auckland' : region === 'au' ? 'NSW' : 'NY'}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-error">{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-primary mb-1">
                  {region === 'us' ? 'ZIP Code' : 'Postcode'} *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                    errors.postalCode ? 'border-error' : 'border-border'
                  }`}
                  placeholder={region === 'us' ? '10001' : '2000'}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-error">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Notice */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">Payment Information</p>
              <p className="text-sm text-amber-700 mt-1">
                After submitting your order, our team will contact you to arrange secure payment via bank transfer or credit card.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg border border-border sticky top-24">
          <h2 className="font-display text-xl text-primary mb-6">Order Summary</h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item.cartItemId} className="flex gap-3">
                <div className="w-16 h-16 bg-cream rounded flex-shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain p-1"
                  />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary line-clamp-2">{item.productName}</p>
                  <p className="text-sm text-text-muted">{formatPrice(item.price * item.quantity, regionConfig)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal, regionConfig)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Savings</span>
                <span>-{formatPrice(savings, regionConfig)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Shipping</span>
              <span className="text-text-muted">Calculated after confirmation</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-semibold text-primary">Total</span>
              <span className="font-display text-xl text-primary">{formatPrice(subtotal, regionConfig)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Place Order'
            )}
          </button>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-text-muted">
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
