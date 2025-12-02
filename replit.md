# Drizzl Wellness - Production D2C + B2B E-Commerce Platform

## Project Overview
**Purpose**: Full-stack Direct-to-Consumer + B2B smoothie and wellness brand platform
**Status**: Phase 2 Complete - D2C, B2B Portal, Admin Dashboard, AI Tools
**Stack**: Next.js 15 + React 19, Supabase (Auth + DB), AI Content Helper

## Platform Features

### D2C E-Commerce (Customer-Facing)
- Product browsing & filtering by category
- Shopping cart (add/remove/update quantities)
- Two-step checkout with order saving to database
- User authentication (email, password, magic links)
- Order history and account management
- Multi-language support (12 languages)

### B2B Retail Partner Portal
- `/retail` - Partner login page
- `/retail/apply` - 4-step wholesale partner application:
  - Step 1: Business Information with address autocomplete (OpenStreetMap)
  - Step 2: Business Verification with drag-drop file upload for certificates
  - Step 3: Decision Maker contact details
  - Step 4: Order & Logistics preferences with terms agreement
- `/retail-partner/dashboard` - Full wholesale portal
  - Wholesale product catalog with discounted pricing
  - B2B cart and order placement
  - Order history tracking
  - Partner-specific pricing display

### Master Admin Dashboard (Shopify-Style)
- `/admin` - Overview with revenue, orders, D2C/B2B stats
- `/admin/products` - Full product CRUD (create, edit, delete, images)
- `/admin/orders` - Order management with status updates
- `/admin/partners` - Retail partner management (create accounts, view info)
- `/admin/analytics` - Revenue tracking, top products, event logs
- `/admin/ai` - AI content generation tool

### AI Content Helper
- `/api/ai/content` - Content generation API
- Supports hero, product, email, and social content types
- Ready for OpenAI integration (placeholder responses for now)
- Add OPENAI_API_KEY to enable real AI generation

### Banking Intelligence (Mercury Integration)
- `/admin/banking` - Financial dashboard
- Features:
  - Total cash balance across all accounts
  - Income/Expenses tracking (30-day rolling)
  - Net Profit/Loss calculation
  - Monthly burn rate
  - Cash runway projection
  - Account balances table
  - Recent transactions list
  - AI insights (coming soon)
- Connects to Mercury Banking API
- Shows demo data when MERCURY_API_KEY not configured

## Database Architecture (Supabase)

### Tables
- **profiles** - User profiles with roles (customer/partner/admin)
- **products** - Product catalog with D2C + wholesale pricing
- **orders** - D2C and B2B orders with status tracking
- **order_items** - Line items with historical pricing
- **retail_partners** - B2B partner company information
- **analytics_events** - Event tracking for analytics
- **cart_items** - Real-time shopping cart

### Row Level Security (RLS)
All tables protected with RLS policies for:
- Users can only access their own data
- Partners can access B2B features
- Admins have full access

Schema files:
- `/database/supabase-schema.sql` - Complete database schema
- `/database/retail-partners-migration.sql` - Migration for retail partners table

## User Roles
1. **customer** - Standard D2C customer (default)
2. **partner** - B2B retail partner with wholesale access
3. **admin** - Full admin dashboard access

## File Structure
```
/lib
  - supabaseClient.ts - Supabase config + TypeScript types
  - db.ts - Database operations (CRUD for all tables)
  - analytics.ts - Event tracking + reporting functions
  - auth.ts - Authentication functions
/hooks
  - useAuth.ts - User authentication hook
  - useRole.ts - Role-based access guards
  - useCart.ts - Shopping cart management
/pages
  - /admin/* - Admin dashboard pages
  - /retail-partner/* - B2B partner portal
  - /retail - Partner login
  - All D2C pages (products, checkout, etc.)
/pages/api
  - /admin/stats.ts - Dashboard statistics API
  - /admin/products.ts - Product CRUD operations API
  - /admin/orders.ts - Order management API
  - /admin/partners.ts - Partner listing API
  - /admin/analytics.ts - Analytics data API
  - /admin/partners/[id].ts - Partner status update API
  - /ai/content.ts - AI content generation endpoint
/database
  - supabase-schema.sql - Complete database schema
```

## Design System
- **Typography**: DM Sans (headings), Inter (body)
- **Colors**: Black (#000), white (#fff), grays (#f9f9f9, #e8e8e8)
- **Style**: Apple 3000 minimal aesthetic, Shopify-inspired admin
- **Layout**: 1280px centered max-width

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key (for admin API routes to bypass RLS)
MERCURY_API_KEY=your-key (for Banking Intelligence dashboard)
OPENAI_API_KEY=your-key (optional - for AI features)
STRIPE_SECRET_KEY=your-key (Phase 3)
NEXT_PUBLIC_STRIPE_KEY=your-key (Phase 3)
```

## Admin Portal
The admin portal uses server-side API routes that bypass Row Level Security (RLS) policies using the Supabase service role key. In development mode, access is allowed without authentication for testing. In production, users must have `role = 'admin'` in the profiles table.

## Setup Instructions

### 1. Database Setup
Run the SQL in `/database/supabase-schema.sql` in your Supabase SQL Editor.

### 2. Create Admin User
After creating an account, update the role in Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 3. Create Partner User
Use the admin dashboard `/admin/partners` to create retail partner accounts.

## Access Points
- **Customer Site**: `/` (homepage)
- **Retail Partner Login**: `/retail`
- **Admin Dashboard**: `/admin`

## Internationalization (i18n)
Supported: English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, Russian

Translation files: `/messages/{locale}.json`

## Development
- `npm run dev` - Start dev server (port 5000)
- TypeScript enabled
- ESLint configured
- Hot reload enabled

## Next Steps (Phase 3)
1. Stripe payment integration
2. Email confirmations (order receipts)
3. Order tracking with notifications
4. Real OpenAI integration for AI content
5. Image upload for product management
6. Subscription/recurring orders

