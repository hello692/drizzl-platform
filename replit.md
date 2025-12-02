# Drizzl Wellness - Production D2C E-Commerce Platform

## Project Overview
**Purpose**: Production-ready Direct-to-Consumer smoothie and wellness brand platform
**Status**: Phase 1 Complete - Full Site Structure Built
**Stack**: Next.js 15 + React 19, Supabase, Stripe (Phase 2), AI (Phase 3)

## Database Architecture
- **users** - Customer profiles with role-based access (admin/customer)
- **products** - Complete product catalog with category, pricing, inventory
- **cart_items** - Real-time shopping cart management
- **orders** - Order records with status tracking
- **order_items** - Line items with historical pricing

All tables have RLS (Row-Level Security) policies for data protection.

## Website Structure (Daily Harvest-Inspired)

### Main Pages
- `/` - Homepage with hero, category grid, featured products
- `/shop-all` - Complete product catalog
- `/checkout` - Two-step checkout (shipping + payment)
- `/order-confirmation` - Order success page

### Product Collections
- `/collections/smoothies` - Regular smoothies
- `/collections/high-protein` - Protein smoothies
- `/collections/breakfast-bowls` - Breakfast bowls
- `/collections/bites` - Snack bites
- `/collections/protein-shop` - Protein powders
- `/collections/best-sellers` - Top products
- `/collections/new-arrivals` - Latest releases
- `/collections/smoothie-boxes` - Curated boxes
- `/collections/gift-guide` - Gift collections

### User Account Pages
- `/auth` - Login/signup/magic link
- `/account` - Account dashboard
- `/orders` - Order history
- `/cart` - Shopping cart

### Info & Support Pages
- `/contact` - Contact form
- `/faq` - Frequently asked questions
- `/our-story` - Brand story
- `/blog` - Blog & recipes
- `/careers` - Job openings
- `/refer` - Referral program
- `/student-discount` - Student program
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Product Pages
- `/product/[id]` - Individual product detail page

## Design System
- **Typography**: DM Sans (headings), Inter (body)
- **Colors**: Black (#000), white (#fff), grays (#f9f9f9, #e8e8e8)
- **Layout**: 1280px centered max-width, clean minimal aesthetic
- **Style**: Editorial wellness brand inspired by Daily Harvest

## Authentication & Security
- Email/Password signup
- Magic link passwordless login
- Supabase Auth with JWT tokens
- Role-based access control (admin/customer)
- User profile creation on signup

## Core Features (Phase 1)
✅ Product browsing & filtering by category
✅ Shopping cart (add/remove/update quantities)
✅ User authentication (email, password, magic links)
✅ Order management structure
✅ Complete site navigation
✅ Footer with organized links
✅ Responsive design

## Upcoming (Phase 2-3)
- Stripe payment integration
- Email confirmations
- Order tracking
- AI product recommendations
- Admin dashboard
- Subscription management
- Analytics & reporting

## File Structure
```
/lib - Core utilities
  - auth.ts - Authentication functions
  - supabaseClient.ts - Supabase config
/hooks - Custom React hooks
  - useAuth.ts - User authentication
  - useCart.ts - Shopping cart management
/components - Reusable components
  - Navbar.tsx - Main navigation
  - Footer.tsx - Footer with links
  - AuthForm.tsx - Auth form
/pages - Next.js pages (all routes above)
/styles - Global CSS
/database - Schema
```

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
STRIPE_SECRET_KEY=your-key (Phase 2)
NEXT_PUBLIC_STRIPE_KEY=your-key (Phase 2)
```

## Development
- `npm run dev` - Start dev server (port 5000)
- TypeScript enabled
- ESLint configured
- Hot reload enabled

## Deployment
- Replit Deploy (autoscale)
- Supabase managed database
- Stripe for payments
- Email via Supabase

## Team Instructions
1. Build Phase 2: Stripe integration with checkout flow
2. Create admin dashboard for product management
3. Implement email confirmations and order tracking
4. Add AI features (search, recommendations, personalization)
5. Set up analytics and reporting
