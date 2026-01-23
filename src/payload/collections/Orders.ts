import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer.email', 'total', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    // Customer Info
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    // Shipping Address
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'line1',
          type: 'text',
          required: true,
        },
        {
          name: 'line2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    // Billing Address
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'line1',
          type: 'text',
        },
        {
          name: 'line2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
      ],
    },
    // Order Items
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    // Totals
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'shipping',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
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
      name: 'region',
      type: 'select',
      options: [
        { label: 'Australia', value: 'au' },
        { label: 'New Zealand', value: 'nz' },
        { label: 'United States', value: 'us' },
      ],
      required: true,
    },
    // Status
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    // Shipping Info
    {
      name: 'trackingNumber',
      type: 'text',
    },
    {
      name: 'shippingCarrier',
      type: 'text',
    },
    // Notes
    {
      name: 'notes',
      type: 'textarea',
    },
    // Payment
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
