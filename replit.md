# Drizzl Wellness - Production D2C + B2B E-Commerce Platform

## Project Overview
**Purpose**: Full-stack Direct-to-Consumer + B2B smoothie and wellness brand platform
**Status**: Phase 2.5 Complete - D2C, B2B Portal, Enterprise Admin Dashboard with 9 Intelligence Modules
**Stack**: Next.js 15 + React 19, Supabase (Auth + DB), AI Command Assistant

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

### Enterprise Admin Dashboard (9 Intelligence Modules)

#### 1. Command Center (`/admin/command-center`)
- Real-time business intelligence dashboard
- Orders today/week/month metrics
- Total revenue and net margin
- D2C vs B2B order breakdown
- Average order value tracking
- Revenue trend visualization (30 days)
- Channel distribution chart
- Conversion funnel metrics
- Time filtering (Today, 7 Days, 30 Days, 90 Days, Year)
- CSV export functionality

#### 2. AI Command Assistant (`/admin/ai-assistant`)
- ChatGPT-like interface for business queries
- Example prompts: revenue summary, top products, order trends, cash flow
- Intent recognition for: revenue, products, orders, financial, profit, runway queries
- OpenAI GPT integration (optional - works with pattern matching fallback)
- Contextual business data responses

#### 3. Product Intelligence (`/admin/product-intel`)
- Enhanced SKU management with cost tracking
- Cost breakdown: ingredients, packaging, labor
- Margin analysis with color-coded indicators
- Expandable rows with nutrition data
- AI optimization suggestions
- Category filtering and search
- Sort by margin, cost, price

#### 4. Inventory Management (`/admin/inventory`)
- Three tabs: Ingredients, Packaging, Finished Goods
- Stock level progress bars
- Low stock alerts (red badge)
- Expiration warnings (yellow badge, 30 days)
- Lot number and supplier tracking
- Storage location management
- Add/Edit item modals

#### 5. Factory Intelligence (`/admin/factory`)
- Production monitoring dashboard
- Today's batches with status
- Production efficiency percentage
- Active batches vs QA hold
- Production goals vs actual chart
- Predictive restocking alerts
- Ingredient burn rate analysis
- Shift tracking (Morning/Afternoon/Night)
- Recent batch history

#### 6. Order Intelligence (`/admin/order-intel`)
- D2C analytics section:
  - Total revenue with trends
  - Average order value
  - Refund rate tracking
  - Customer satisfaction score
  - Orders by location (top cities)
  - Shipping performance (on-time %, avg delivery days)
  - New vs returning customers
- B2B analytics section:
  - Total B2B revenue
  - Active wholesale accounts
  - Top B2B customers by volume
  - PO tracking summary
  - Credit terms overview
  - Predicted reorders

#### 7. Video Manager (`/admin/video-manager`)
- Landing page video CMS
- Grid layout with thumbnails
- Drag-and-drop reordering
- Arrow buttons for positioning
- Autoplay/Loop toggles
- Platform targeting (Desktop/Mobile/Both)
- Active/Inactive status
- Add/Edit/Delete modals
- Video preview overlay

#### 8. Social Media Control Center (`/admin/social`)
- Connected accounts (Instagram, TikTok, Facebook)
- Platform badges (IG, TT, FB)
- Total followers and engagement metrics
- Overview tab with stats cards
- Posts tab with performance table
- Analytics tab with engagement trends
- Social wall with recent posts
- Schedule post placeholder
- Connect account placeholder

#### 9. Banking Intelligence (`/admin/banking`)
- Mercury API integration
- Total cash balance across accounts
- Income/Expenses (30-day rolling)
- Net Profit/Loss calculation
- Monthly burn rate
- Cash runway projection (months)
- Account balances table
- Recent transactions list
- Demo data when API not configured

### Legacy Admin Pages
- `/admin` - Overview dashboard with quick actions
- `/admin/products` - Full product CRUD
- `/admin/orders` - Order management
- `/admin/partners` - Retail partner management
- `/admin/analytics` - Event logs and reporting
- `/admin/ai` - AI content generation tool

## Database Architecture (Supabase)

### Core Tables
- **profiles** - User profiles with roles (customer/partner/admin)
- **products** - Product catalog with D2C + wholesale pricing
- **orders** - D2C and B2B orders with status tracking
- **order_items** - Line items with historical pricing
- **retail_partners** - B2B partner company information
- **analytics_events** - Event tracking for analytics
- **cart_items** - Real-time shopping cart

### Admin Extension Tables (11 new tables)
- **role_permissions** - RBAC permission arrays per role
- **user_role_assignments** - Map users to roles
- **product_costs** - Extended product costing (ingredients, packaging, labor)
- **product_ingredients** - Ingredients per SKU with nutrition data
- **inventory_items** - Ingredient/packaging/finished goods tracking
- **manufacturing_batches** - Production batch tracking
- **media_assets** - Video/image management for CMS
- **social_accounts** - Connected social media accounts
- **social_posts** - Social post tracking with engagement
- **ai_insights** - AI-generated insights log
- **command_center_snapshots** - Daily analytics snapshots

### Row Level Security (RLS)
All tables protected with RLS policies for:
- Users can only access their own data
- Partners can access B2B features
- Admins have full access

Schema files:
- `/database/supabase-schema.sql` - Core database schema
- `/database/retail-partners-migration.sql` - Retail partners table
- `/database/admin-extensions-schema.sql` - Admin extension tables (11 new)

## Role-Based Access Control

### Available Roles
1. **super_admin** - Full access to all modules
2. **factory_manager** - Factory, Inventory modules
3. **finance** - Banking, Order Intel, Command Center
4. **marketing** - Social Media, Video Manager, AI Assistant
5. **support** - Orders, Partners
6. **warehouse** - Inventory, Factory
7. **b2b_sales** - Partners, Order Intel (B2B section)

### Permission System
- Roles stored in `role_permissions` table with JSONB permissions array
- User assignments in `user_role_assignments` table
- Helper functions: `has_permission()`, `get_user_permissions()`

## File Structure
```
/lib
  - supabaseClient.ts - Supabase config + TypeScript types
  - db.ts - Database operations (CRUD for all tables)
  - analytics.ts - Event tracking + reporting functions
  - auth.ts - Authentication functions
  - mercuryClient.ts - Mercury Banking API client
  - commandCenterService.ts - Command Center analytics
  - aiAssistantService.ts - AI intent parsing and responses
  - productIntelService.ts - Product costing logic
  - inventoryService.ts - Inventory management
  - orderIntelService.ts - Order analytics
  - videoManagerService.ts - Video CMS logic
  - socialService.ts - Social media integration
/hooks
  - useAuth.ts - User authentication hook
  - useRole.ts - Role-based access guards
  - useCart.ts - Shopping cart management
/pages
  - /admin/* - Admin dashboard pages (15 pages)
  - /retail-partner/* - B2B partner portal
  - /retail - Partner login
  - All D2C pages (products, checkout, etc.)
/pages/api
  - /admin/command-center/* - Command Center API
  - /admin/ai-assistant/* - AI Assistant API
  - /admin/product-intel/* - Product Intelligence API
  - /admin/inventory/* - Inventory API
  - /admin/factory/* - Factory API
  - /admin/order-intel/* - Order Intelligence API
  - /admin/video-manager/* - Video Manager API
  - /admin/social/* - Social Media API
  - /admin/banking/* - Banking API
  - Plus all legacy admin APIs
/database
  - supabase-schema.sql - Core schema
  - retail-partners-migration.sql - Partners migration
  - admin-extensions-schema.sql - Admin extension tables
```

## Design System

### Admin Portal (Apple AI 2500 Dark Aesthetic)
- **Background**: Deep black (#050505) with mesh gradient overlays
- **Floating Orbs**: 4 animated gradient orbs per page (purple, pink, green, cyan)
- **Cards**: Glassmorphism with backdrop-blur(20px), rgba(255,255,255,0.03) background
- **Borders**: Subtle glow borders (rgba(255,255,255,0.06))
- **Accent Colors**: 
  - Purple: #667eea, #a855f7
  - Cyan: #22d3ee, #4facfe
  - Pink: #f093fb, #f472b6
  - Green: #43e97b, #22c55e
- **Typography**: Clean thin weights, gradient text for titles
- **Icons**: Custom gradient SVG icons (no emojis)
- **Animations**: Float, pulse, glow, shimmer effects
- **Stats Cards**: Colored accent bars on left side with hover glow

### D2C Storefront
- **Typography**: DM Sans (headings), Inter (body)
- **Colors**: Black (#000), white (#fff), grays (#f9f9f9, #e8e8e8)
- **Style**: Apple 3000 minimal aesthetic
- **Cards**: White background, subtle borders, 16-20px radius
- **Effects**: Glass/blur surfaces, hover transforms, shadow expansion
- **Layout**: 1280px centered max-width

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key (for admin APIs to bypass RLS)
MERCURY_API_KEY=your-key (for Banking Intelligence)
OPENAI_API_KEY=your-key (optional - for AI features)
STRIPE_SECRET_KEY=your-key (Phase 3)
NEXT_PUBLIC_STRIPE_KEY=your-key (Phase 3)
```

## Demo Mode
All admin modules show realistic mock data when:
- Database tables not configured
- API keys not set
- Allows full UI testing without setup

## Documentation
- `ADMIN_ADDON.md` - Comprehensive admin extension documentation (816 lines)
- Covers all 9 modules, APIs, database schema, RBAC, setup instructions

## Setup Instructions

### 1. Database Setup
Run SQL files in order in Supabase SQL Editor:
1. `/database/supabase-schema.sql` - Core schema
2. `/database/retail-partners-migration.sql` - Partners table
3. `/database/admin-extensions-schema.sql` - Admin extension tables

### 2. Create Admin User
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 3. Configure Environment Variables
Add required secrets in Replit Secrets tab.

## Access Points
- **Customer Site**: `/` (homepage)
- **Retail Partner Login**: `/retail`
- **Admin Dashboard**: `/admin`
- **Command Center**: `/admin/command-center`
- **AI Assistant**: `/admin/ai-assistant`

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
7. Real social media API connections
8. Mobile app (React Native)
