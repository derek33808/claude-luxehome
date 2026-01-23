import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    // Brand
    {
      name: 'brand',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Luxehome',
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Premium Smart Home Collection',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // Contact
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },

    // Social Media
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'pinterest',
          type: 'text',
        },
        {
          name: 'youtube',
          type: 'text',
        },
        {
          name: 'tiktok',
          type: 'text',
        },
      ],
    },

    // SEO Defaults
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
          defaultValue: 'Luxehome - Premium Smart Home Collection',
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          defaultValue: 'Discover premium smart home essentials at Luxehome. Curated collection of high-quality products for modern families.',
        },
        {
          name: 'defaultImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // Region Settings
    {
      name: 'regions',
      type: 'array',
      fields: [
        {
          name: 'code',
          type: 'select',
          options: [
            { label: 'Australia', value: 'au' },
            { label: 'New Zealand', value: 'nz' },
            { label: 'United States', value: 'us' },
          ],
          required: true,
        },
        {
          name: 'currency',
          type: 'select',
          options: [
            { label: 'AUD', value: 'AUD' },
            { label: 'NZD', value: 'NZD' },
            { label: 'USD', value: 'USD' },
          ],
          required: true,
        },
        {
          name: 'currencySymbol',
          type: 'text',
          defaultValue: '$',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },

    // Analytics
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          admin: {
            description: 'Google Analytics 4 Measurement ID (G-XXXXXXXXXX)',
          },
        },
        {
          name: 'facebookPixelId',
          type: 'text',
        },
      ],
    },

    // Newsletter
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Stay Updated',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Subscribe for exclusive offers and new product updates.',
        },
      ],
    },
  ],
}
