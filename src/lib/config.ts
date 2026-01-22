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

  // Shipping & Returns
  shipping: {
    freeShippingThreshold: 100,
    estimatedDays: '5-7 business days',
    expressAvailable: true,
  },

  returns: {
    days: 30,
    policy: 'Full refund, no questions asked',
  },

  warranty: {
    years: 2,
    description: 'Extended protection for peace of mind',
  },
}

export type SiteConfig = typeof siteConfig
