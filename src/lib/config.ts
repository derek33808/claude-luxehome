// Site Configuration
export const siteConfig = {
  name: 'Luxehome',
  description: 'Premium Smart Home Essentials for Modern Families',
  url: 'https://claude-luxehome.netlify.app',

  // Customer Service
  support: {
    email: 'support@luxehome.com',
    responseTime: '24-48 hours',
  },

  // Social Media
  social: {
    instagram: 'https://instagram.com/luxehome',
    pinterest: 'https://pinterest.com/luxehome',
    twitter: 'https://twitter.com/luxehome',
  },

  // Shipping
  shipping: {
    freeShippingThreshold: 100,
    estimatedDays: '5-7 business days',
    expressAvailable: true,
    freeShippingMessage: 'Free Shipping on All Orders',
  },

  // Returns
  returns: {
    days: 30,
    period: 30,
    policy: 'Full refund, no questions asked',
    guarantee: '30-Day Money-Back Guarantee',
  },

  // Warranty
  warranty: {
    years: 2,
    description: 'Extended protection for peace of mind',
  },
}

export type SiteConfig = typeof siteConfig
