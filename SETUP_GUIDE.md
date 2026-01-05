# Drizzl Wellness Platform - Complete Setup Guide

## Overview

This guide will help you fix and deploy the Drizzl Wellness platform. The platform is built with Next.js and includes both D2C (Direct-to-Consumer) and B2B (Business-to-Business) e-commerce functionality.

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account
- Git installed

## Step 1: Database Setup (CRITICAL)

### 1.1 Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your Drizzl Wellness project
3. Click on "SQL Editor" in the left sidebar

### 1.2 Run Database Migrations

Run these migrations **in order**:

1. **Existing migrations** (if not already run):
   - `001_retail_partners.sql`
   - `002_profiles_auto_create.sql`
   - `003_experts_testimonials.sql`
   - `004_b2b_pipeline.sql`
   - `005_security_and_partner_intel.sql`
   - `006_phase2_orders_banking_leads.sql`

2. **NEW migrations** (run these now):
   - `007_core_ecommerce_tables.sql` - Creates products, customers, cart, D2C orders
   - `008_b2b_orders.sql` - Creates B2B orders and quotes system
   - `009_helper_functions.sql` - Creates utility functions

### 1.3 Verify Tables Created

In Supabase SQL Editor, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- `products`
- `customers`
- `customer_addresses`
- `customer_payment_methods`
- `cart_items`
- `d2c_orders`
- `d2c_order_items`
- `b2b_orders`
- `b2b_order_items`
- `b2b_cart_items`
- `b2b_quotes`
- `subscriptions`
- `loyalty_transactions`
- `retail_partners`
- `profiles`
- And others...

## Step 2: Environment Variables

### 2.1 Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 Get Stripe Credentials

1. Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

3. Set up webhook:
   - Go to **Developers > Webhooks**
   - Click "Add endpoint"
   - URL: `https://your-domain.com/api/checkout/webhook`
   - Events: Select `checkout.session.completed`, `checkout.session.expired`
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 2.3 Create Environment File

Create `.env.local` in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Fill in all required values in `.env.local`.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Create Admin User

### 4.1 Run in Supabase SQL Editor:

```sql
-- Create an admin profile
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'admin@drizzlwellness.com',
  'Admin User',
  'super_admin'
);
```

### 4.2 Set Admin Password

In your `.env.local`:
```
ADMIN_PASSWORD=your-secure-password-here
```

## Step 5: Seed Initial Data (Optional)

### 5.1 Add Sample Products

Run in Supabase SQL Editor:

```sql
INSERT INTO products (name, slug, description, category, price_cents, wholesale_price_cents, hero_image_url, is_active, stock_quantity)
VALUES
  ('Pink Pitaya Smoothie Mix', 'pink-pitaya-smoothie', 'Delicious dragon fruit smoothie blend', 'smoothies', 2499, 1899, '/products/pink-pitaya.jpg', true, 100),
  ('Green Wellness Blend', 'green-wellness-blend', 'Nutrient-packed green smoothie', 'smoothies', 2699, 2099, '/products/green-wellness.jpg', true, 150),
  ('Berry Blast Mix', 'berry-blast-mix', 'Mixed berry superfood blend', 'smoothies', 2399, 1799, '/products/berry-blast.jpg', true, 120),
  ('Tropical Paradise', 'tropical-paradise', 'Exotic tropical fruit blend', 'smoothies', 2599, 1999, '/products/tropical.jpg', true, 80),
  ('Chocolate Protein Boost', 'chocolate-protein-boost', 'Rich chocolate protein smoothie', 'protein', 2999, 2399, '/products/chocolate-protein.jpg', true, 90);
```

## Step 6: Test Locally

### 6.1 Start Development Server

```bash
npm run dev
```

The app should start on `http://localhost:5000`

### 6.2 Test Key Functionality

1. **Homepage**: Visit `http://localhost:5000`
2. **Products**: Visit `http://localhost:5000/products`
3. **Sign Up**: Go to `/account/signup` and create a test account
4. **Login**: Go to `/account/login` and log in
5. **Add to Cart**: Add products to cart
6. **Checkout**: Test checkout flow (use Stripe test cards)
7. **Admin Login**: Go to `/admin/auth` and login with admin credentials

### 6.3 Stripe Test Cards

Use these for testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date, any CVC

## Step 7: Fix Frontend Components

### 7.1 Update Login Component

The login page at `pages/account/login.tsx` needs to use the new API:

Replace the `authenticateCustomer` import:
```typescript
import { authenticateCustomer } from '../../lib/api/customersFixed';
```

### 7.2 Update Cart Hook

The cart hook at `hooks/useCart.ts` needs to use new API endpoints.

Key changes needed:
- Use `/api/cart/get` to fetch cart
- Use `/api/cart/add` to add items
- Use `/api/cart/update` to update quantities
- Use `/api/cart/remove` to remove items
- Use `/api/cart/clear` to clear cart

### 7.3 Update Checkout

Update `pages/checkout.tsx` to use `/api/checkout/create-session`

## Step 8: Deploy to Production

### Option A: Deploy to Replit

1. Push code to GitHub
2. In Replit, import from GitHub
3. Add environment variables in Replit Secrets:
   - Add all variables from `.env.local`
4. Click "Run"
5. Get deployment URL from Replit
6. Update `NEXT_PUBLIC_APP_URL` in Replit Secrets
7. Update Stripe webhook URL with Replit domain

### Option B: Deploy to Render.com

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables in Render dashboard
6. Deploy
7. Update `NEXT_PUBLIC_APP_URL` with Render URL
8. Update Stripe webhook URL with Render domain

### Option C: Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables
6. Deploy
7. Update `NEXT_PUBLIC_APP_URL` with Vercel URL
8. Update Stripe webhook URL with Vercel domain

## Step 9: Post-Deployment

### 9.1 Test Production

1. Visit your production URL
2. Test signup/login
3. Test adding to cart
4. Complete a test purchase
5. Check order in admin panel
6. Verify email notifications

### 9.2 Update Stripe Webhook

1. Go to Stripe Dashboard > Webhooks
2. Update endpoint URL to production domain
3. Test webhook with Stripe CLI:
   ```bash
   stripe trigger checkout.session.completed
   ```

### 9.3 Monitor Logs

Check logs for errors:
- Replit: Check console
- Render: View logs in dashboard
- Vercel: View function logs

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure all three Supabase variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Issue: "Table does not exist"

**Solution**: Run all database migrations in Supabase SQL Editor

### Issue: "Stripe error: Invalid API key"

**Solution**: Check that `STRIPE_SECRET_KEY` is set correctly and starts with `sk_`

### Issue: "Cannot add to cart"

**Solution**: 
1. Check database migrations are applied
2. Verify `cart_items` table exists
3. Check browser console for errors
4. Verify API endpoint is being called

### Issue: "Checkout not working"

**Solution**:
1. Verify Stripe keys are correct
2. Check `NEXT_PUBLIC_APP_URL` is set
3. Verify webhook is configured
4. Check Stripe dashboard for errors

### Issue: "Admin login fails"

**Solution**:
1. Verify admin profile exists in `profiles` table
2. Check `ADMIN_PASSWORD` environment variable
3. Use correct admin email

## Security Checklist

Before going live:

- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Use production Stripe keys (not test keys)
- [ ] Enable HTTPS on your domain
- [ ] Set up proper CORS policies
- [ ] Review Row Level Security policies in Supabase
- [ ] Enable rate limiting on API routes
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy for database
- [ ] Review and update privacy policy
- [ ] Set up SSL certificate

## Support

For issues:
1. Check logs in your deployment platform
2. Check Supabase logs
3. Check Stripe dashboard for payment errors
4. Review browser console for frontend errors

## Next Steps

After deployment:
1. Add more products
2. Configure email templates
3. Set up analytics
4. Configure shipping rates
5. Add tax calculation logic
6. Set up inventory alerts
7. Configure B2B partner approval workflow
8. Test B2B ordering flow
9. Set up automated backups
10. Configure monitoring and alerts
