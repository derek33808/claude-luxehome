import { RegionCode } from '@/lib/regions'

// Category types and info
export type Category = 'tech' | 'lifestyle' | 'kitchen' | 'outdoor'

export interface CategoryInfo {
  name: string
  description: string
  icon: string
}

export const categories: Record<Category, CategoryInfo> = {
  tech: {
    name: 'Tech & Smart Home',
    description: 'Smart devices and technology to simplify your daily life',
    icon: '💻',
  },
  lifestyle: {
    name: 'Lifestyle & Gifts',
    description: 'Unique finds and thoughtful gifts for every occasion',
    icon: '🎁',
  },
  kitchen: {
    name: 'Kitchen Essentials',
    description: 'Premium tools and gadgets for the modern kitchen',
    icon: '🍳',
  },
  outdoor: {
    name: 'Outdoor & Garden',
    description: 'Quality gear for outdoor living and garden enthusiasts',
    icon: '🌿',
  },
}

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductFeature {
  icon?: string
  title: string
  description: string
}

export interface ColorVariant {
  id: string
  name: string
  color: string // hex or color name for UI
  images: ProductImage[]
  inStock: boolean
  stockCount?: number
}

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: Category
  brand: string
  images: ProductImage[]
  colorVariants?: ColorVariant[]
  features: ProductFeature[]
  specifications: Record<string, string>
  prices: Record<RegionCode, { price: number; comparePrice?: number }>
  inStock: boolean
  rating: number
  reviewCount: number
  tags: string[]
}

export const products: Product[] = [
  {
    id: 'smart-digital-calendar',
    slug: 'smart-digital-calendar',
    name: 'Smart Digital Calendar',
    shortDescription: '15.6" Family Organizer & Wall Planner with Touchscreen',
    description: 'Bring order to your busy household with this 15.6" touchscreen calendar. View schedules, chores, to-dos, and reminders in one central hub. Color-code and assign tasks to each family member for clarity and collaboration. When not in use, it transforms into a beautiful 1080p digital photo frame.',
    category: 'tech',
    brand: 'LOCVMIKY',
    images: [
      {
        url: '/images/products/smart-digital-calendar/white/main.jpg',
        alt: 'Smart Digital Calendar - White Frame Main View',
      },
      {
        url: '/images/products/smart-digital-calendar/white/angle.jpg',
        alt: 'Smart Digital Calendar - Angle View',
      },
      {
        url: '/images/products/smart-digital-calendar/white/side.jpg',
        alt: 'Smart Digital Calendar - Side View',
      },
      {
        url: '/images/products/smart-digital-calendar/white/back.jpg',
        alt: 'Smart Digital Calendar - Back View',
      },
      {
        url: '/images/products/smart-digital-calendar/white/detail.jpg',
        alt: 'Smart Digital Calendar - Detail View',
      },
      {
        url: '/images/products/smart-digital-calendar/white/screen.jpg',
        alt: 'Smart Digital Calendar - Screen Interface',
      },
      {
        url: '/images/products/smart-digital-calendar/white/in-use.jpg',
        alt: 'Smart Digital Calendar - In Use',
      },
      {
        url: '/images/products/smart-digital-calendar/white/banner-features.jpg',
        alt: 'Smart Digital Calendar - Features Overview',
      },
    ],
    colorVariants: [
      {
        id: 'white',
        name: 'White Frame',
        color: '#FFFFFF',
        images: [
          { url: '/images/products/smart-digital-calendar/white/main.jpg', alt: 'White Frame - Main' },
          { url: '/images/products/smart-digital-calendar/white/angle.jpg', alt: 'White Frame - Angle' },
          { url: '/images/products/smart-digital-calendar/white/side.jpg', alt: 'White Frame - Side' },
          { url: '/images/products/smart-digital-calendar/white/back.jpg', alt: 'White Frame - Back' },
          { url: '/images/products/smart-digital-calendar/white/detail.jpg', alt: 'White Frame - Detail' },
          { url: '/images/products/smart-digital-calendar/white/screen.jpg', alt: 'White Frame - Screen' },
          { url: '/images/products/smart-digital-calendar/white/in-use.jpg', alt: 'White Frame - In Use' },
          { url: '/images/products/smart-digital-calendar/white/banner-features.jpg', alt: 'White Frame - Features' },
        ],
        inStock: true,
        stockCount: 12,
      },
      {
        id: 'grey',
        name: 'Grey Frame',
        color: '#6B7280',
        images: [
          { url: '/images/products/smart-digital-calendar/grey/main-new.jpg', alt: 'Grey Frame - Main' },
        ],
        inStock: true,
        stockCount: 14,
      },
      {
        id: 'snow-white',
        name: 'Snow White Frame',
        color: '#F9FAFB',
        images: [
          { url: '/images/products/smart-digital-calendar/snow-white/main-new.jpg', alt: 'Snow White Frame - Main' },
        ],
        inStock: true,
        stockCount: 5,
      },
    ],
    features: [
      {
        icon: '📅',
        title: 'All-in-One Smart Family Organizer',
        description: 'View schedules, chores, to-dos, and reminders in one central hub. Color-code and assign tasks to each family member for clarity and collaboration.',
      },
      {
        icon: '🔄',
        title: 'Easy Setup & Calendar Sync',
        description: 'Plug in, connect to Wi-Fi, and import your existing calendars in minutes. Compatible with Google, iCloud, Outlook, Yahoo, and Cozi — all updates stay in sync across devices.',
      },
      {
        icon: '✅',
        title: 'Interactive Chore Chart & Meal Planner',
        description: 'Use the built-in chore chart to assign responsibilities like tidying, pet care, or homework. Plan weekly meals and build a shared shopping list — a visual system that encourages accountability and reduces daily decision stress.',
      },
      {
        icon: '🖼️',
        title: 'Digital Photo Frame When Idle',
        description: 'When not in use, the device transforms into a beautiful 1080p photo frame, automatically syncing family photos from your phone. Create a warm, personal touch in your kitchen, hallway, or family command center.',
      },
      {
        icon: '🔔',
        title: 'Reminders & Class Schedules',
        description: 'Receive timezone-aware alerts for school, work, or extracurriculars. Manage all reminders from the Zical mobile app, with no subscription fees ever — just a one-time setup for lasting simplicity.',
      },
      {
        icon: '💰',
        title: 'No Subscription Required',
        description: 'Unlike other smart calendars, there are no monthly fees or hidden costs. Pay once and enjoy all features forever with free app updates.',
      },
    ],
    specifications: {
      'Display Size': '15.6 inches',
      'Display Type': 'IPS HD Touchscreen (1080p)',
      'Resolution': '1920 x 1080 Full HD',
      'Connectivity': 'Wi-Fi (2.4GHz & 5GHz)',
      'Calendar Sync': 'Google, iCloud, Outlook, Yahoo, Cozi',
      'Frame Colors': 'White, Grey, Snow White',
      'Cover Material': 'Polycarbonate (PC)',
      'Power': 'AC Adapter (included)',
      'Package Dimensions': '14.96 x 8.66 x 1.97 inches',
      'Item Weight': '1.76 pounds (0.8 kg)',
      'Mobile App': 'Zical (iOS & Android)',
      'Subscription': 'None Required - Lifetime Free',
      'Model Number': 'DGL-07',
      'ASIN': 'B0FYDC2WFG',
      'Date First Available': 'October 30, 2025',
    },
    prices: {
      au: { price: 369, comparePrice: 449 },
      nz: { price: 429, comparePrice: 499 },
      us: { price: 249, comparePrice: 299 },
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 2,
    tags: ['family organizer', 'calendar', 'smart home', 'touchscreen', 'no subscription', 'photo frame', 'chore chart', 'meal planner'],
  },
  {
    id: 'mini-arcade-machine',
    slug: 'mini-arcade-machine',
    name: 'Mini Arcade Machine',
    shortDescription: '240 Built-In Retro Games Console',
    description: 'Relive the golden age of arcade gaming with this miniature arcade cabinet. Packed with 240 retro 8-bit games, featuring an authentic 8-way joystick and 2.5" full colour screen. Perfect as a desk gadget or nostalgic gift. Amazon\'s Choice for retro arcade machines with over 2,400 reviews.',
    category: 'lifestyle',
    brand: 'Orb Gaming by ThumbsUp',
    images: [
      {
        url: '/images/products/mini-arcade-machine/main.jpg',
        alt: 'Mini Arcade Machine - Front View',
      },
      {
        url: '/images/products/mini-arcade-machine/in-use.jpg',
        alt: 'Mini Arcade Machine - In Use Playing Racing Game',
      },
      {
        url: '/images/products/mini-arcade-machine/packaging.jpg',
        alt: 'Mini Arcade Machine - Product Packaging',
      },
      {
        url: '/images/products/mini-arcade-machine/angle.jpg',
        alt: 'Mini Arcade Machine - Angle View',
      },
      {
        url: '/images/products/mini-arcade-machine/detail.jpg',
        alt: 'Mini Arcade Machine - Control Detail',
      },
      {
        url: '/images/products/mini-arcade-machine/lifestyle.jpg',
        alt: 'Mini Arcade Machine - Lifestyle Shot',
      },
      {
        url: '/images/products/mini-arcade-machine/screen-view.jpg',
        alt: 'Mini Arcade Machine - Screen View',
      },
      {
        url: '/images/products/mini-arcade-machine/controls.jpg',
        alt: 'Mini Arcade Machine - Controls Close-up',
      },
    ],
    features: [
      {
        icon: '🎮',
        title: 'Hours of Entertainment',
        description: 'Packed with 240 retro arcade games, this mini arcade delivers hours of non-stop entertainment. From classic shooters to puzzle games, there\'s something for everyone.',
      },
      {
        icon: '🕹️',
        title: 'Nostalgic Gameplay',
        description: 'Featuring an authentic 8-way joystick and 2.5" colour screen, relive the nostalgia of your favourite retro arcade games with this mini arcade machine.',
      },
      {
        icon: '🖥️',
        title: 'Upgrade Your Space',
        description: 'This retro arcade machine doubles as a fun desk gadget, bringing both style and entertainment to your setup. Perfect for home offices, bedrooms, or game rooms.',
      },
      {
        icon: '👾',
        title: 'Classic Experience',
        description: 'Loaded with remakes of your favourite arcade games, this retro handheld game console brings you the classic gameplay you know and love.',
      },
      {
        icon: '🎁',
        title: 'Perfect Gaming Gift',
        description: 'The perfect gamer gift for men, women, and kids. This mini arcade game console is ideal for birthdays, Christmas, or any occasion.',
      },
      {
        icon: '🔋',
        title: 'Portable & Battery Powered',
        description: 'Take your gaming anywhere with battery-powered operation. Up to 5 hours of gameplay on 3 AA batteries (not included). No cords, no hassle.',
      },
    ],
    specifications: {
      'Screen Size': '2.5 inches',
      'Screen Type': 'Full Colour LCD',
      'Built-in Games': '240 8-bit games',
      'Control': '8-Way Joystick + Buttons',
      'Players': '1 Player',
      'Power': '3x AA Batteries (not included)',
      'Battery Life': 'Up to 5 hours',
      'Dimensions': '8.8cm x 9cm x 15cm (L x W x H)',
      'Weight': '140g (0.14 kg)',
      'Material': 'Plastic',
      'Theme': 'Retro Arcade',
      'Age Range': '8 years and up',
      'Brand': 'Orb Gaming by ThumbsUp',
      'ASIN': 'B01KA5K57C',
    },
    prices: {
      au: { price: 59, comparePrice: 79 },
      nz: { price: 69, comparePrice: 89 },
      us: { price: 39, comparePrice: 49 },
    },
    inStock: true,
    rating: 4.3,
    reviewCount: 2486,
    tags: ['retro gaming', 'arcade', 'handheld', 'gift', '8-bit games', 'desk gadget', 'portable', 'nostalgic', 'mini cabinet', 'classic games'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category)
}

export function getAllProducts(): Product[] {
  return products
}
