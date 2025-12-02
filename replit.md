# Drizzl Platform - Production D2C Store

## Project Overview
**Purpose**: Full-stack Direct-to-Consumer (D2C) e-commerce platform with Next.js, Supabase, and Stripe.

**Status**: Phase 1 - Core Store (Auth, Products, Cart)

**Tech Stack**:
- Frontend: Next.js 15 + React 19
- Backend: Next.js API Routes
- Database: Supabase PostgreSQL with RLS
- Auth: Supabase Auth (email/password + magic links)
- Payments: Stripe (Phase 2)
- AI: Coming Phase 3

---

## Database Architecture

### Tables
1. **users** - Extended Supabase auth with profiles
   - Roles: admin, customer
   - RLS: Users see own profile, admins see all

2. **products** - Product catalog
   - Fields: name, description, price, inventory, image_url, category, sku
   - RLS: Public read for active products, admin-only write

3. **cart_items** - Shopping cart
   - user_id → users
   - product_id → products
   - RLS: Users manage only their own cart

4. **orders** - Order records
   - user_id → users
   - status: pending, processing, shipped, delivered, cancelled
   - stripe_payment_id, shipping/billing addresses (JSONB)
   - RLS: Users see own orders only

5. **order_items** - Order line items
   - order_id → orders
   - product_id → products (snapshot of product data at purchase)
   - price_at_purchase (fixed price at time of order)

### Security
- Row-Level Security (RLS) enforced on all tables
- Auth policies: Users can only access their data
- Admin policies: Admins have full access

---

## Auth Strategy

### Roles
- **admin**: Full platform access, product management, order management
- **customer**: Browse products, manage own cart/orders

### Auth Methods
1. **Email/Password**: Traditional login
2. **Magic Links**: Passwordless login via email
3. **Session Management**: Supabase handles JWT tokens

### Flow
```
Sign Up → Email Verification → Create User Profile (customer role)
Sign In → JWT Token → Check User Role → Redirect
Magic Link → Email Click → Auto Login → Redirect
```

---

## Phase 1: D2C Store Implementation

### Pages
- `/` - Homepage
- `/auth` - Login/Signup/Magic Link (client-side only)
- `/products` - Product listing
- `/cart` - Shopping cart
- `/checkout-success` - Order confirmation

### Components
- **Navbar** - Navigation with auth status
- **AuthForm** - Dynamic auth form (client-side)

### Hooks
- **useAuth()** - Get current user
- **useRequireAuth()** - Protect routes
- **useCart()** - Cart management

### API Routes
- `GET /api/products` - List active products
- `GET /api/orders` - User's orders
- `POST /api/orders` - Create order
- `POST /api/checkout` - Stripe checkout (Phase 2)

---

## Files Structure
```
/lib
  - supabaseClient.ts - Supabase config
  - auth.ts - Auth utilities
/hooks
  - useAuth.ts - Auth hook
  - useCart.ts - Cart hook
/components
  - Navbar.tsx - Navigation
  - AuthForm.tsx - Auth form
/pages
  - index.tsx - Homepage
  - products.tsx - Product listing
  - cart.tsx - Shopping cart
  - checkout-success.tsx - Order confirmation
  - auth.tsx - Auth page
  - /api/products.ts
  - /api/orders.ts
  - /api/checkout.ts
/database
  - schema.sql - Database schema
```

---

## Next Steps
1. **Phase 2**: Stripe integration (checkout, webhooks)
2. **Phase 3**: AI features (product recommendations, search)
3. **Phase 4**: Admin dashboard (order management, analytics)
4. **Phase 5**: Mobile app

---

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=your-stripe-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public
```

---

## Deployment
- Production: Replit Deploy
- Database: Supabase managed PostgreSQL
- Storage: Supabase Storage for product images
- Payments: Stripe production mode
