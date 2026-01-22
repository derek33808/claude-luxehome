export interface Review {
  id: string
  productId: string
  author: string
  location?: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  images?: string[]
}

// Mock reviews data - can be updated manually or via form submissions
export const reviews: Review[] = [
  // Smart Digital Calendar Reviews
  {
    id: 'review-sdc-1',
    productId: 'smart-digital-calendar',
    author: 'Sarah M.',
    location: 'Auckland, NZ',
    rating: 5,
    title: 'Game changer for our busy family!',
    content: 'This has completely transformed how our family organizes. No more missed appointments or forgotten activities! The kids actually check it every morning to see their tasks. The photo frame feature is a lovely bonus - we have it cycling through family photos when not in use.',
    date: '2026-01-15',
    verified: true,
    helpful: 24,
  },
  {
    id: 'review-sdc-2',
    productId: 'smart-digital-calendar',
    author: 'Michael T.',
    location: 'Wellington, NZ',
    rating: 5,
    title: 'Finally, a calendar the whole family uses',
    content: 'Working from home with kids was chaos until we got this. Now everyone knows who needs to be where and when. The sync with Google Calendar is seamless - I update from my phone and it appears instantly. Worth every dollar!',
    date: '2026-01-10',
    verified: true,
    helpful: 18,
  },
  {
    id: 'review-sdc-3',
    productId: 'smart-digital-calendar',
    author: 'Jennifer L.',
    location: 'Sydney, AU',
    rating: 5,
    title: 'No subscription is a huge plus',
    content: "I was hesitant about the price, but the fact that there's no monthly subscription sold me. Setup was easier than expected - maybe 10 minutes? The meal planning feature is surprisingly useful. We use it every Sunday to plan our week.",
    date: '2026-01-05',
    verified: true,
    helpful: 31,
  },
  {
    id: 'review-sdc-4',
    productId: 'smart-digital-calendar',
    author: 'David K.',
    location: 'Brisbane, AU',
    rating: 4,
    title: 'Great product, minor learning curve',
    content: "Love the concept and execution. Took a day or two to get everyone used to checking it, but now it's become the command center of our home. Only minor complaint is the screen could be a bit brighter in direct sunlight.",
    date: '2025-12-28',
    verified: true,
    helpful: 12,
  },
  {
    id: 'review-sdc-5',
    productId: 'smart-digital-calendar',
    author: 'Emma W.',
    location: 'Christchurch, NZ',
    rating: 5,
    title: 'Perfect gift for parents',
    content: "Bought this for my parents who were struggling to keep track of grandkid activities. They absolutely love it! My mum said it's the best gift she's ever received. The touchscreen is responsive and the interface is simple enough for seniors.",
    date: '2025-12-20',
    verified: true,
    helpful: 45,
  },
  {
    id: 'review-sdc-6',
    productId: 'smart-digital-calendar',
    author: 'Anonymous',
    location: 'Melbourne, AU',
    rating: 5,
    title: 'Exceeded expectations',
    content: 'Was skeptical at first but this calendar has genuinely improved our household organization. The chore chart feature keeps the kids accountable. Highly recommend for any family with busy schedules.',
    date: '2025-12-15',
    verified: false,
    helpful: 8,
  },

  // Mini Arcade Machine Reviews
  {
    id: 'review-mam-1',
    productId: 'mini-arcade-machine',
    author: 'Tom H.',
    location: 'Auckland, NZ',
    rating: 5,
    title: 'Pure nostalgia in a tiny package!',
    content: "Bought this for my desk at work and it's become a conversation starter. The games are exactly like I remember from the 80s. Perfect size, great build quality for the price. My kids love it too!",
    date: '2026-01-18',
    verified: true,
    helpful: 15,
  },
  {
    id: 'review-mam-2',
    productId: 'mini-arcade-machine',
    author: 'Rachel S.',
    location: 'Perth, AU',
    rating: 4,
    title: 'Great gift for retro gaming fans',
    content: "Bought this as a Christmas gift for my husband. He spent hours playing it! The joystick feels authentic and the screen is surprisingly good. Only wish it had a few more games, but 240 is still a lot.",
    date: '2026-01-08',
    verified: true,
    helpful: 22,
  },
  {
    id: 'review-mam-3',
    productId: 'mini-arcade-machine',
    author: 'James P.',
    location: 'Dunedin, NZ',
    rating: 5,
    title: 'Best desk gadget ever',
    content: "This little arcade machine sits proudly on my desk. When I need a break, I play a quick game. The build quality is much better than expected at this price point. Batteries last a surprisingly long time too.",
    date: '2025-12-30',
    verified: true,
    helpful: 19,
  },
  {
    id: 'review-mam-4',
    productId: 'mini-arcade-machine',
    author: 'Lisa M.',
    location: 'Gold Coast, AU',
    rating: 5,
    title: 'My teenagers actually put down their phones!',
    content: "Got this thinking it would be a novelty, but my kids are obsessed. They've been competing for high scores and it's become a family activity. Great alternative to screen time... well, different screen time at least!",
    date: '2025-12-22',
    verified: true,
    helpful: 34,
  },
  {
    id: 'review-mam-5',
    productId: 'mini-arcade-machine',
    author: 'Anonymous',
    location: 'Hamilton, NZ',
    rating: 4,
    title: 'Fun little gadget',
    content: 'Does exactly what it says. Lots of classic style games to play. The joystick is a bit small for adult hands but perfectly fine for casual gaming. Good value for money.',
    date: '2025-12-18',
    verified: false,
    helpful: 7,
  },
]

// Helper functions
export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getAverageRating(productId: string): number {
  const productReviews = getReviewsByProductId(productId)
  if (productReviews.length === 0) return 0
  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / productReviews.length) * 10) / 10
}

export function getReviewCount(productId: string): number {
  return getReviewsByProductId(productId).length
}

export function getRatingDistribution(productId: string): Record<number, number> {
  const productReviews = getReviewsByProductId(productId)
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  productReviews.forEach((r) => {
    distribution[r.rating]++
  })
  return distribution
}
