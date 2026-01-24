# LuxeHome - Feature Development Roadmap

## Executive Summary

This document outlines the comprehensive development roadmap for LuxeHome e-commerce platform to transition from the current MVP state to a fully operational online store.

**Current State**: MVP with complete frontend, Stripe payment integration (test mode), and static export deployment on Netlify.

**Target State**: Production-ready e-commerce platform with order management, email notifications, and basic operations support.

---

## 1. Current Status Analysis

### 1.1 Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Product Display | Complete | Multi-category, responsive design |
| Shopping Cart | Complete | localStorage persistence, multi-region |
| Multi-region Support | Complete | AU/NZ/US with currency formatting |
| Stripe Checkout | Complete | Netlify Functions backend, test mode verified |
| Checkout Form | Complete | Full validation, shipping address collection |
| Success/Cancel Pages | Complete | Basic order confirmation display |
| E2E Testing | Complete | 35 Playwright tests, 49 unit tests |
| Static Export | Complete | 80 pages, Netlify deployment |

### 1.2 Critical Gaps for Production

| Gap | Impact | Priority |
|-----|--------|----------|
| No order persistence | Orders lost after payment | P0 - Critical |
| No email notifications | Customers receive no confirmation | P0 - Critical |
| No order management | Cannot track or fulfill orders | P0 - Critical |
| Stripe test mode only | Cannot accept real payments | P0 - Critical |
| No inventory tracking | Risk of overselling | P1 - High |
| No shipping integration | Manual tracking only | P1 - High |
| No user accounts | No order history for customers | P2 - Medium |

---

## 2. Priority Analysis

### 2.1 Must-Have for Launch (P0)

These features are **blocking** for accepting real orders:

1. **Order Data Persistence** - Store order information after payment
2. **Email Notifications** - Send order confirmations to customers
3. **Basic Order Management** - View and manage orders
4. **Stripe Live Mode** - Accept real payments

### 2.2 Should-Have for Operations (P1)

These features significantly improve operations efficiency:

1. **Shipping/Tracking Integration** - Add tracking numbers, notify customers
2. **Basic Inventory Management** - Track stock, prevent overselling
3. **Admin Dashboard** - Centralized order management interface

### 2.3 Nice-to-Have for Growth (P2)

These features enhance customer experience:

1. **User Accounts** - Order history, saved addresses
2. **Advanced Analytics** - Sales reports, customer insights
3. **Webhook Notifications** - Real-time order updates

---

## 3. Technology Recommendations

### 3.1 Database Selection

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Supabase** | PostgreSQL, free tier generous, real-time, Auth built-in | Learning curve for Postgres | **Recommended** |
| Neon | Serverless Postgres, generous free tier | Newer, less ecosystem | Good alternative |
| PlanetScale | MySQL, branching workflows | Free tier limited | Not recommended |
| MongoDB Atlas | Flexible schema, easy start | Less suitable for relational data | Not recommended |

**Decision**: **Supabase** - Best fit because:
- You already have a Supabase account (from earlier project phase)
- PostgreSQL is ideal for e-commerce data (orders, customers, products)
- Built-in Auth if user accounts needed later
- Generous free tier (500MB storage, 2GB bandwidth)
- Real-time subscriptions for order updates
- Edge Functions compatible with Netlify deployment

### 3.2 Email Service Selection

| Option | Free Tier | Cost After | Recommendation |
|--------|-----------|------------|----------------|
| **Resend** | 3,000/month | $20/10k | **Recommended** |
| SendGrid | 100/day | $19.95/40k | Good alternative |
| Postmark | 100/month | $15/10k | Good for transactional |
| AWS SES | 62,000/month (from EC2) | $0.10/1k | Complex setup |

**Decision**: **Resend** - Best fit because:
- Modern API, excellent developer experience
- 3,000 emails/month free (sufficient for early stage)
- React Email integration (matches Next.js stack)
- Simple setup with Netlify Functions
- No sender verification delays

### 3.3 Admin Dashboard Approach

| Approach | Effort | Pros | Cons |
|----------|--------|------|------|
| **Supabase Dashboard** | Low | Built-in, no code | Limited customization |
| **Custom Admin Pages** | Medium | Full control, branded | Development time |
| Retool/Appsmith | Low-Medium | Powerful, visual builder | Another service |
| Forest Admin | Medium | Auto-generates from DB | Subscription cost |

**Decision**: **Phased approach**
1. **Phase 1**: Use Supabase Dashboard directly (immediate)
2. **Phase 2**: Build custom admin pages in Next.js (as needed)

---

## 4. Development Phases

### Phase 1: Order Persistence & Stripe Webhook (Week 1)
**Goal**: Capture and store order data when payment succeeds

#### 4.1.1 Database Setup
```
Tasks:
1. Create Supabase project (or reconnect existing)
2. Design database schema:
   - orders table
   - order_items table
   - customers table (optional, can be embedded)
3. Set up Row Level Security (RLS) policies
4. Create database functions for order creation
```

**Database Schema**:
```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),

  -- Customer info (embedded for simplicity)
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),

  -- Shipping address
  shipping_address JSONB NOT NULL,

  -- Order details
  region VARCHAR(5) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  subtotal INTEGER NOT NULL, -- in cents
  shipping INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER NOT NULL,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',

  -- Shipping info
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(100),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(255),
  color_variant VARCHAR(100),

  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL, -- in cents
  total_price INTEGER NOT NULL,

  image_url VARCHAR(500),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

#### 4.1.2 Stripe Webhook Implementation
```
Tasks:
1. Create webhook endpoint: netlify/functions/stripe-webhook.ts
2. Handle checkout.session.completed event
3. Extract customer info and line items from session
4. Create order record in Supabase
5. Generate unique order number
6. Configure webhook in Stripe Dashboard
```

**Files to Create/Modify**:
- `netlify/functions/stripe-webhook.ts` (new)
- `netlify/functions/create-checkout-session.ts` (modify - add metadata)
- `.env` - Add Supabase and webhook secret

#### 4.1.3 Order Confirmation Page Enhancement
```
Tasks:
1. Fetch order details from database using session_id
2. Display order number and items
3. Show shipping address
4. Clear cart after successful order display
```

**Estimated Effort**: 3-4 days

---

### Phase 2: Email Notifications (Week 1-2)
**Goal**: Send order confirmation emails to customers

#### 4.2.1 Email Service Setup
```
Tasks:
1. Create Resend account
2. Verify sending domain (or use resend.dev for testing)
3. Create API key
4. Add to Netlify environment variables
```

#### 4.2.2 Email Templates
```
Templates to create:
1. Order Confirmation - Sent immediately after payment
2. Order Shipped - Sent when tracking number added
3. Delivery Confirmation - Sent when marked delivered (optional)
```

**Email Template Structure** (using React Email):
```typescript
// emails/order-confirmation.tsx
- Order number and date
- Items ordered with images
- Shipping address
- Order total breakdown
- Expected delivery timeframe
- Contact information
```

#### 4.2.3 Integration Points
```
Tasks:
1. Send confirmation email in webhook handler after order creation
2. Create function for shipping notification
3. Add error handling and retry logic
```

**Files to Create**:
- `netlify/functions/send-email.ts`
- `src/emails/order-confirmation.tsx` (if using React Email)
- `src/emails/order-shipped.tsx`

**Estimated Effort**: 2-3 days

---

### Phase 3: Order Management (Week 2)
**Goal**: Enable basic order management for operations

#### 4.3.1 Admin Access Setup
```
Options (choose one):
A. Use Supabase Dashboard directly (fastest)
B. Create protected admin routes in Next.js

Recommended: Start with Supabase Dashboard, add custom pages later
```

#### 4.3.2 Core Management Features
```
Required capabilities:
1. View all orders (list with filters)
2. View order details
3. Update order status (pending -> processing -> shipped -> delivered)
4. Add tracking number
5. Mark as fulfilled
```

#### 4.3.3 If Building Custom Admin (Optional)
```
Pages to create:
- /admin/login - Simple password protection
- /admin/orders - Order list with filters
- /admin/orders/[id] - Order detail view
- /admin/orders/[id]/edit - Update order status
```

**Files to Create** (if custom admin):
- `src/app/(admin)/` directory structure
- `netlify/functions/admin-orders.ts` - CRUD operations
- Authentication middleware

**Estimated Effort**: 3-5 days (depending on approach)

---

### Phase 4: Stripe Live Mode (Week 2-3)
**Goal**: Enable real payment processing

#### 4.4.1 Pre-Launch Checklist
```
Stripe Requirements:
1. Complete Stripe account verification
2. Add bank account for payouts
3. Set up tax settings (if applicable)
4. Configure receipt emails in Stripe
5. Review refund policy settings
```

#### 4.4.2 Configuration Updates
```
Tasks:
1. Generate live API keys
2. Update Netlify environment variables:
   - STRIPE_SECRET_KEY (live key)
   - STRIPE_WEBHOOK_SECRET (live webhook)
3. Configure live webhook endpoint in Stripe Dashboard
4. Test end-to-end with real card (small amount)
```

#### 4.4.3 Production Safeguards
```
Tasks:
1. Add error alerting (email/Slack on failures)
2. Set up Stripe Dashboard notifications
3. Configure fraud prevention rules
4. Document refund procedures
```

**Estimated Effort**: 1-2 days

---

### Phase 5: Shipping Integration (Week 3)
**Goal**: Track shipments and notify customers

#### 5.1 Manual Tracking Workflow
```
Workflow:
1. Receive order notification
2. Ship package, get tracking number
3. Update order in Supabase with tracking info
4. Trigger shipping notification email
5. Customer can check tracking via carrier website
```

#### 5.2 Tracking Display (Optional Enhancement)
```
Options:
A. Link to carrier tracking page (simplest)
B. Embed tracking widget (if carrier provides)
C. API integration for status updates (complex)

Recommended: Start with option A (links)
```

#### 5.3 Implementation
```
Tasks:
1. Add tracking number field to order form
2. Create "Mark as Shipped" action
3. Send shipping notification email with tracking link
4. Display tracking info on success page (if order lookup enabled)
```

**Estimated Effort**: 2-3 days

---

### Phase 6: Inventory Management (Week 3-4)
**Goal**: Prevent overselling and track stock levels

#### 6.1 Basic Inventory Tracking
```
Tasks:
1. Add inventory table to Supabase
2. Sync with product data
3. Deduct stock on successful order
4. Display stock status on product page
```

**Database Addition**:
```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  color_variant VARCHAR(100),

  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6.2 Stock Validation
```
Tasks:
1. Check stock before checkout
2. Reserve stock during checkout session (optional)
3. Deduct stock in webhook after payment
4. Handle race conditions with database locks
```

#### 6.3 Alerts and Notifications
```
Tasks:
1. Email alert when stock below threshold
2. Auto-update product display (Out of Stock badge)
3. Prevent add-to-cart for out-of-stock items
```

**Estimated Effort**: 3-4 days

---

## 5. Development Timeline Summary

```
Week 1:
├── Phase 1: Order Persistence (3-4 days)
│   ├── Day 1-2: Database setup and schema
│   ├── Day 3: Stripe webhook implementation
│   └── Day 4: Testing and success page enhancement
│
└── Phase 2: Email Notifications (2-3 days)
    ├── Day 5: Resend setup and templates
    └── Day 6-7: Integration and testing

Week 2:
├── Phase 3: Order Management (3-5 days)
│   ├── Day 8-9: Admin access and basic views
│   └── Day 10-12: Order actions and status updates
│
└── Phase 4: Stripe Live Mode (1-2 days)
    └── Day 13-14: Configuration and testing

Week 3:
├── Phase 5: Shipping Integration (2-3 days)
│   └── Day 15-17: Tracking workflow and notifications
│
└── Phase 6: Inventory Management (3-4 days)
    └── Day 18-21: Stock tracking and validation

Buffer: 2-3 days for issues and refinements
```

**Total Estimated Timeline**: 3-4 weeks

---

## 6. Technical Implementation Details

### 6.1 Environment Variables Required

```bash
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Live)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Resend
RESEND_API_KEY=re_xxx

# Site
SITE_URL=https://your-domain.com
```

### 6.2 Netlify Functions Architecture

```
netlify/functions/
├── create-checkout-session.ts  # Existing - modify to add metadata
├── stripe-webhook.ts           # New - handle payment events
├── send-email.ts               # New - email dispatch
├── get-order.ts                # New - order lookup
└── admin/                      # New - admin operations
    ├── orders.ts               # CRUD for orders
    └── inventory.ts            # Stock management
```

### 6.3 Static Export Compatibility

All new features must remain compatible with Next.js static export:

| Feature | Implementation | Static Compatible |
|---------|---------------|-------------------|
| Order creation | Netlify Function | Yes |
| Order lookup | Client-side fetch | Yes |
| Email sending | Netlify Function | Yes |
| Admin pages | Client-side with auth | Yes |
| Inventory check | Client-side fetch | Yes |

---

## 7. Cost Estimation

### Monthly Operating Costs (Estimated)

| Service | Free Tier | Estimated Monthly | Notes |
|---------|-----------|-------------------|-------|
| Netlify | 100GB bandwidth | $0 | Static hosting |
| Netlify Functions | 125k invocations | $0 | Webhook + API |
| Supabase | 500MB, 2GB bandwidth | $0 | Database |
| Resend | 3,000 emails | $0 | Notifications |
| Stripe | - | 2.9% + 30c/txn | Payment processing |

**Total fixed costs**: $0/month (within free tiers)
**Variable costs**: Stripe fees only (2.9% + 30c per transaction)

### Scaling Considerations

When you exceed free tiers:
- Supabase Pro: $25/month (8GB storage, higher limits)
- Resend Pro: $20/month (50k emails)
- Netlify Pro: $19/month (higher bandwidth)

---

## 8. Risk Mitigation

### 8.1 Technical Risks

| Risk | Mitigation |
|------|------------|
| Webhook failures | Implement retry logic, monitor in Stripe Dashboard |
| Database downtime | Supabase has 99.9% SLA, implement error handling |
| Email delivery issues | Use reputable service, monitor bounce rates |
| Payment disputes | Clear refund policy, good customer communication |

### 8.2 Operational Risks

| Risk | Mitigation |
|------|------------|
| Order not captured | Webhook verification, manual fallback |
| Overselling | Inventory validation before checkout |
| Lost tracking | Standard operating procedure, training |
| Customer support | Clear contact info, FAQ section |

---

## 9. Success Criteria

### 9.1 Launch Readiness Checklist

**Must complete before accepting real orders**:

- [ ] Orders persist to database after payment
- [ ] Order confirmation emails sent successfully
- [ ] Can view orders in admin interface
- [ ] Can update order status
- [ ] Can add tracking numbers
- [ ] Shipping notification emails work
- [ ] Stripe live mode tested with real card
- [ ] Error handling and alerting in place
- [ ] Refund procedure documented

### 9.2 Performance Targets

| Metric | Target |
|--------|--------|
| Webhook response time | < 3 seconds |
| Email delivery rate | > 98% |
| Order capture rate | 100% |
| Admin page load time | < 2 seconds |

---

## 10. Future Enhancements (Post-Launch)

### Phase 7: User Accounts (P2)
- Customer registration/login
- Order history page
- Saved addresses
- Wishlist functionality

### Phase 8: Advanced Features (P3)
- Discount codes
- Product reviews
- Inventory forecasting
- Multi-warehouse support

### Phase 9: Analytics & Growth (P3)
- Sales dashboard
- Customer segmentation
- Email marketing integration
- A/B testing framework

---

## 11. Next Steps

### Immediate Actions

1. **Review and approve this roadmap**
2. **Confirm technology choices** (Supabase + Resend)
3. **Set up development environment**
   - Create/reconnect Supabase project
   - Create Resend account
4. **Begin Phase 1 development**

### Questions to Answer

1. Do you want to use the existing Supabase project or create a new one?
2. Do you have a domain for email sending (e.g., luxehome.com)?
3. What is your target launch date?
4. Do you need help with any Stripe account setup?

---

*Document created: 2026-01-24*
*Last updated: 2026-01-24*
*Author: Product Orchestrator*
