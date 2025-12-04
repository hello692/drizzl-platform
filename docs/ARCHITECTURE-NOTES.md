# Drizzl Wellness Platform - Architecture Documentation

## Overview
Drizzl Wellness is a full-stack e-commerce platform built with Next.js 15, React 19, and Supabase. It supports three user types:
- **D2C Customers** - Regular shoppers on the public storefront
- **B2B Retail Partners** - Wholesale customers with dedicated portal
- **Admins** - Platform operators with enterprise dashboard

## Tech Stack
- **Frontend**: Next.js 15 (Pages Router), React 19, TypeScript
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Styling**: Inline styles with CSS-in-JS patterns

## Database Schema

### Core Tables

#### `profiles`
Stores user profile information and roles.
```sql
- id (UUID, PK) - matches auth.users.id
- email (VARCHAR)
- full_name (VARCHAR)
- phone (VARCHAR)
- role ('customer' | 'partner' | 'admin')
- account_type ('customer' | 'b2b')
- b2b_status ('none' | 'pending' | 'approved' | 'rejected')
- email_notifications (BOOLEAN)
- sms_notifications (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)
```

#### `products`
Product catalog for both D2C and B2B sales.
```sql
- id (UUID, PK)
- name, slug, description, category
- price_cents (INTEGER) - D2C price
- wholesale_price_cents (INTEGER) - B2B price
- hero_image_url (TEXT)
- is_active (BOOLEAN)
- stock_quantity (INTEGER)
- product_type ('d2c' | 'b2b' | 'both')
- created_at, updated_at
```

#### `orders`
Order records for all channels.
```sql
- id (UUID, PK)
- user_id (UUID)
- order_type ('d2c' | 'b2b')
- status ('pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled')
- total_cents (INTEGER)
- shipping_address, billing_address (JSONB)
- notes (TEXT)
- created_at, updated_at
```

#### `order_items`
Individual items within orders.
```sql
- id (UUID, PK)
- order_id (UUID, FK → orders)
- product_id (UUID, FK → products)
- quantity (INTEGER)
- unit_price_cents (INTEGER)
- created_at
```

#### `retail_partners`
B2B partner applications and accounts.
```sql
- id (UUID, PK)
- user_id (UUID)
- company_name, contact_name, email, phone
- status ('pending' | 'approved' | 'rejected')
- application_data (JSONB) - Full application details
- reviewed_by (UUID), reviewed_at, admin_notes, rejection_reason
- created_at, updated_at
```

## Authentication & Authorization

### Auth Flow
1. **Signup**: User creates account via `/auth`
   - Profile is created with `role: 'customer'` and `account_type: 'customer'`
2. **B2B Application**: User applies at `/retail/apply`
   - Creates `retail_partners` record with `status: 'pending'`
   - Updates profile with `account_type: 'b2b'` and `b2b_status: 'pending'`
3. **Admin Approval**: Admin reviews at `/admin/partners`
   - Approval sets `profiles.role: 'partner'` and `b2b_status: 'approved'`
   - Rejection sets `b2b_status: 'rejected'`

### Role-Based Access
- `useAuth()` - Basic authentication state
- `useRole()` - Fetches role from profiles table
- `useRequireAdmin()` - Protects admin routes
- `useRequirePartner()` - Protects B2B partner routes

## Route Structure

### Public Storefront
- `/` - Homepage
- `/products/*` - Product catalog
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/auth` - Sign in/Sign up

### Customer Area
- `/dashboard` - Customer order history
- `/account` - Account settings
- `/orders` - Order list
- `/orders/[id]` - Order details

### B2B Portal
- `/retail` - B2B login/status page
- `/retail/apply` - Partner application form
- `/retail-partner/dashboard` - Wholesale portal (after approval)

### Admin Dashboard
- `/admin` - Main dashboard with stats and module cards
- `/admin/orders` - Order management
- `/admin/products` - Product catalog CRUD
- `/admin/partners` - B2B application management
- `/admin/inventory` - Stock tracking
- `/admin/factory` - Production monitoring
- `/admin/banking` - Financial overview
- `/admin/analytics` - Business analytics
- `/admin/ai-assistant` - AI business queries
- `/admin/command-center` - Real-time intelligence
- `/admin/product-intel` - SKU costing analysis
- `/admin/order-intel` - Order analytics
- `/admin/video-manager` - Video CMS
- `/admin/social` - Social media management

## Key Files

### Hooks
- `hooks/useAuth.ts` - Authentication state
- `hooks/useRole.ts` - Role checking and route protection
- `hooks/useCart.ts` - Shopping cart state

### Libraries
- `lib/supabaseClient.ts` - Supabase client and types
- `lib/db.ts` - Database query functions
- `lib/auth.ts` - Auth helper functions
- `lib/notificationService.ts` - Email notifications (Resend)

### Components
- `components/Navbar.tsx` - Site navigation
- `components/Footer.tsx` - Site footer
- `components/AdminLayout.tsx` - Admin dashboard wrapper

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key

### Optional (Recommended for Production)
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations bypassing RLS
- `RESEND_API_KEY` - For email notifications

## RLS Policies

### Products
- Public read access (everyone can browse)
- Admin write access

### Orders
- Users can view/create their own orders
- Admins can view all orders

### Retail Partners
- Users can view/create their own applications
- Admins can view/update all applications

### Profiles
- Users can view/update their own profile
- Admins can view all profiles

## Testing the Platform

### Create Admin User
1. Sign up at `/auth`
2. In Supabase dashboard, update `profiles` table:
   - Set `role = 'admin'`

### Test D2C Flow
1. Browse products on homepage
2. Add items to cart
3. Complete checkout
4. View order in `/dashboard`

### Test B2B Flow
1. Sign up at `/auth`
2. Go to `/retail/apply`
3. Complete 4-step application
4. Admin approves at `/admin/partners`
5. User accesses `/retail-partner/dashboard`

## Recent Changes (December 2024)
- Created `products`, `orders`, `order_items` tables with RLS
- Fixed auth signup to create profiles with proper roles
- Added customer dashboard with order history
- Fixed B2B application and approval flow
- Updated admin APIs to work with RLS policies
- Added email notification system (Resend integration)
