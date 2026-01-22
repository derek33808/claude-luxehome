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

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: Category
  brand: string
  images: ProductImage[]
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
    shortDescription: '15.6" Family Organizer & Wall Planner',
    description: 'Bring order to your busy household with this 15.6" touchscreen calendar. View schedules, chores, to-dos, and reminders in one central hub. Color-code and assign tasks to each family member for clarity and collaboration.',
    category: 'tech',
    brand: 'LOCVMIKY',
    images: [
      {
        url: '/images/products/smart-digital-calendar/main.jpg',
        alt: 'Smart Digital Calendar - Main View',
      },
      {
        url: '/images/products/smart-digital-calendar/calendar-view.jpg',
        alt: 'Smart Digital Calendar - Calendar View',
      },
      {
        url: '/images/products/smart-digital-calendar/family-use.jpg',
        alt: 'Smart Digital Calendar - Family Use',
      },
      {
        url: '/images/products/smart-digital-calendar/features.jpg',
        alt: 'Smart Digital Calendar - Features',
      },
    ],
    features: [
      {
        title: 'All-in-One Smart Family Organizer',
        description: 'View schedules, chores, to-dos, and reminders in one central hub. Color-code and assign tasks to each family member for clarity and collaboration.',
      },
      {
        title: 'Easy Setup & Calendar Sync',
        description: 'Plug in, connect to Wi-Fi, and import your existing calendars in minutes. Compatible with Google, iCloud, Outlook, Yahoo, and Cozi — all updates stay in sync across devices.',
      },
      {
        title: 'Interactive Chore Chart & Meal Planner',
        description: 'Use the built-in chore chart to assign responsibilities like tidying, pet care, or homework. Plan weekly meals and build a shared shopping list — a visual system that encourages accountability.',
      },
      {
        title: 'Digital Photo Frame When Idle',
        description: 'When not in use, the device transforms into a beautiful 1080p photo frame, automatically syncing family photos from your phone. Create a warm, personal touch in your kitchen, hallway, or family command center.',
      },
      {
        title: 'No Subscription Required',
        description: 'Receive timezone-aware alerts for school, work, or extracurriculars. Manage all reminders from the Zical mobile app, with no subscription fees ever — just a one-time setup for lasting simplicity.',
      },
    ],
    specifications: {
      'Display Size': '15.6 inches',
      'Display Type': 'IPS HD Touchscreen (1080p)',
      'Connectivity': 'Wi-Fi (2.4GHz & 5GHz)',
      'Calendar Sync': 'Google, iCloud, Outlook, Yahoo, Cozi',
      'Frame Color': 'White',
      'Power': 'AC Adapter (included)',
      'Dimensions': '15.6" x 10.2" x 0.8"',
      'Mobile App': 'Zical (iOS & Android)',
      'Subscription': 'None Required',
    },
    prices: {
      au: { price: 369, comparePrice: 449 },
      nz: { price: 429, comparePrice: 499 },
      us: { price: 249, comparePrice: 299 },
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 2,
    tags: ['family organizer', 'calendar', 'smart home', 'touchscreen', 'no subscription'],
  },
  {
    id: 'mini-arcade-machine',
    slug: 'mini-arcade-machine',
    name: 'Mini Arcade Machine',
    shortDescription: '240 Built-In Retro Games Console',
    description: 'Relive the golden age of arcade gaming with this miniature arcade cabinet. Packed with 240 retro 8-bit games, featuring an authentic 8-way joystick and 2.5" full colour screen. Perfect as a desk gadget or nostalgic gift.',
    category: 'lifestyle',
    brand: 'Orb Gaming by ThumbsUp',
    images: [
      {
        url: '/images/products/mini-arcade-machine/main.jpg',
        alt: 'Mini Arcade Machine - Front View',
      },
      {
        url: '/images/products/mini-arcade-machine/angle.jpg',
        alt: 'Mini Arcade Machine - Angle View',
      },
      {
        url: '/images/products/mini-arcade-machine/side.jpg',
        alt: 'Mini Arcade Machine - Side View',
      },
      {
        url: '/images/products/mini-arcade-machine/in-use.jpg',
        alt: 'Mini Arcade Machine - In Use',
      },
    ],
    features: [
      {
        title: 'Hours of Entertainment',
        description: 'Packed with 240 retro arcade games, this mini arcade delivers hours of non-stop entertainment. From classic shooters to puzzle games, there\'s something for everyone.',
      },
      {
        title: 'Nostalgic Gameplay',
        description: 'Featuring an authentic 8-way joystick and 2.5" colour screen, relive the nostalgia of your favourite retro arcade games with this mini arcade machine.',
      },
      {
        title: 'Upgrade Your Space',
        description: 'This retro arcade machine doubles as a fun desk gadget, bringing both style and entertainment to your setup. Perfect for home offices, bedrooms, or game rooms.',
      },
      {
        title: 'Classic Experience',
        description: 'Loaded with remakes of your favourite arcade games, this retro handheld game console brings you the classic gameplay you know and love.',
      },
      {
        title: 'Perfect Gaming Gift',
        description: 'The perfect gamer gift for men, women, and kids. This mini arcade game console is ideal for birthdays, Christmas, or any occasion.',
      },
    ],
    specifications: {
      'Screen Size': '2.5 inches',
      'Screen Type': 'Full Colour LCD',
      'Built-in Games': '240 8-bit games',
      'Control': '8-Way Joystick + Buttons',
      'Players': '1 Player',
      'Power': '3x AA Batteries (not included)',
      'Dimensions': '9cm x 12cm x 8.5cm',
      'Theme': 'Retro Arcade',
      'Brand': 'Orb Gaming by ThumbsUp',
    },
    prices: {
      au: { price: 59, comparePrice: 79 },
      nz: { price: 69, comparePrice: 89 },
      us: { price: 39, comparePrice: 49 },
    },
    inStock: true,
    rating: 4.4,
    reviewCount: 2485,
    tags: ['retro gaming', 'arcade', 'handheld', 'gift', '8-bit games'],
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
