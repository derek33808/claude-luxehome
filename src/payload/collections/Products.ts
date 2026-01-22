import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'status', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // Basic Info
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "smart-digital-calendar")',
      },
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'brand',
      type: 'text',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Brief description for product cards (max 160 chars)',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },

    // Media
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },

    // Category & Tags
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },

    // Pricing (Multi-currency)
    {
      name: 'prices',
      type: 'group',
      fields: [
        {
          name: 'AUD',
          type: 'number',
          required: true,
          admin: {
            description: 'Price in Australian Dollars',
          },
        },
        {
          name: 'NZD',
          type: 'number',
          admin: {
            description: 'Price in New Zealand Dollars',
          },
        },
        {
          name: 'USD',
          type: 'number',
          admin: {
            description: 'Price in US Dollars',
          },
        },
      ],
    },
    {
      name: 'compareAtPrices',
      type: 'group',
      admin: {
        description: 'Original prices for showing discounts',
      },
      fields: [
        {
          name: 'AUD',
          type: 'number',
        },
        {
          name: 'NZD',
          type: 'number',
        },
        {
          name: 'USD',
          type: 'number',
        },
      ],
    },

    // Inventory
    {
      name: 'stockStatus',
      type: 'select',
      options: [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Low Stock', value: 'low_stock' },
        { label: 'Out of Stock', value: 'out_of_stock' },
      ],
      defaultValue: 'in_stock',
      required: true,
    },
    {
      name: 'stockQuantity',
      type: 'number',
    },

    // Product Variants (e.g., colors)
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'priceAdjustment',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },

    // Specifications
    {
      name: 'specifications',
      type: 'array',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },

    // Features (for product page)
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon name or class',
          },
        },
      ],
    },

    // FAQ (for GEO/SEO)
    {
      name: 'faq',
      type: 'array',
      admin: {
        description: 'FAQ items for SEO and AI search optimization',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },

    // SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Meta title (defaults to product name if empty)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description (max 160 chars)',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
      ],
    },

    // Status
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },

    // External links
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'External purchase link (e.g., Amazon)',
      },
    },

    // Rating
    {
      name: 'rating',
      type: 'group',
      fields: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 5,
        },
        {
          name: 'count',
          type: 'number',
        },
      ],
    },
  ],
}
