# PROJECT MAP - Drizzl Wellness
Generated: December 26, 2025
Confidence: 95%

## 1. Tech Stack
- **Framework:** Next.js (Pages Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Email:** Resend
- **Styling:** TailwindCSS + Custom CSS
- **Animations:** Framer Motion, GSAP

## 2. Frontend Routes

### Public Routes
| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| `/` | index.tsx | No | FOUND |
| `/products` | products.tsx | No | FOUND |
| `/products/[id]` | products/[id].tsx | No | FOUND |
| `/shop-all` | shop-all.tsx | No | FOUND |
| `/smoothies` | smoothies.tsx | No | FOUND |
| `/wellness` | wellness.tsx | No | FOUND |
| `/juices` | juices.tsx | No | FOUND |
| `/cart` | cart.tsx | No | FOUND |
| `/our-story` | our-story.tsx | No | FOUND |
| `/contact` | contact.tsx | No | FOUND |
| `/locations` | locations.tsx | No | FOUND |
| `/faq` | faq.tsx | No | FOUND |
| `/blog` | blog.tsx | No | FOUND |
| `/careers` | careers.tsx | No | FOUND |
| `/sustainability` | sustainability.tsx | No | FOUND |
| `/ingredients` | ingredients.tsx | No | FOUND |
| `/membership` | membership.tsx | No | FOUND |
| `/refer` | refer.tsx | No | FOUND |
| `/ambassadors` | ambassadors.tsx | No | FOUND |
| `/student-discount` | student-discount.tsx | No | FOUND |
| `/privacy` | privacy.tsx | No | FOUND |
| `/terms` | terms.tsx | No | FOUND |
| `/shipping` | shipping.tsx | No | FOUND |
| `/returns` | returns.tsx | No | FOUND |

### Auth Routes
| Route | Component | Status |
|-------|-----------|--------|
| `/auth` | auth.tsx | FOUND |
| `/account/login` | account/login.tsx | FOUND |
| `/account/signup` | account/signup.tsx | FOUND |
| `/account/forgot-password` | account/forgot-password.tsx | FOUND |
| `/account/reset-password` | account/reset-password.tsx | FOUND |

### Protected Customer Routes
| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| `/checkout` | checkout.tsx | Yes | FOUND |
| `/checkout-success` | checkout-success.tsx | Yes | FOUND |
| `/order-confirmation` | order-confirmation.tsx | Yes | FOUND |
| `/account` | account/index.tsx | Yes | FOUND |
| `/account/dashboard` | account/dashboard.tsx | Yes | FOUND |
| `/account/orders` | account/orders.tsx | Yes | FOUND |
| `/account/addresses` | account/addresses.tsx | Yes | FOUND |
| `/account/payment` | account/payment.tsx | Yes | FOUND |
| `/account/settings` | account/settings.tsx | Yes | FOUND |
| `/account/wishlist` | account/wishlist.tsx | Yes | FOUND |
| `/account/rewards` | account/rewards.tsx | Yes | FOUND |
| `/account/subscriptions` | account/subscriptions.tsx | Yes | FOUND |

### Wholesale/B2B Routes
| Route | Component | Status |
|-------|-----------|--------|
| `/wholesale` | wholesale/index.tsx | FOUND |
| `/wholesale/apply` | wholesale/apply.tsx | FOUND |
| `/wholesale/signin` | wholesale/signin.tsx | FOUND |
| `/wholesale/pricing` | wholesale/pricing.tsx | FOUND |
| `/wholesale/dashboard` | wholesale/dashboard.tsx | FOUND |
| `/retail` | retail.tsx | FOUND |
| `/retail/apply` | retail/apply.tsx | FOUND |

### Partner Portal Routes
| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| `/partner/login` | partner/login.tsx | No | FOUND |
| `/partner/apply` | partner/apply.tsx | No | FOUND |
| `/partner/forgot-password` | partner/forgot-password.tsx | No | FOUND |
| `/partner/dashboard` | partner/dashboard.tsx | Yes | FOUND |
| `/partner/orders/new` | partner/orders/new.tsx | Yes | FOUND |
| `/partner/orders` | partner/orders/index.tsx | Yes | FOUND |
| `/partner/account` | partner/account.tsx | Yes | FOUND |
| `/partner/invoices` | partner/invoices.tsx | Yes | FOUND |
| `/partner/pricing` | partner/pricing.tsx | Yes | FOUND |
| `/partner/marketing-hub` | partner/marketing-hub.tsx | Yes | FOUND |
| `/partner/support` | partner/support.tsx | Yes | FOUND |

### Sales Portal Routes
| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| `/sales/login` | sales/login.tsx | No | FOUND |
| `/sales/forgot-password` | sales/forgot-password.tsx | No | FOUND |
| `/sales/dashboard` | sales/dashboard.tsx | Yes | FOUND |
| `/sales/leads` | sales/leads.tsx | Yes | FOUND |
| `/sales/leads/[id]` | sales/leads/[id].tsx | Yes | FOUND |
| `/sales/commission` | sales/commission.tsx | Yes | FOUND |
| `/sales/messages` | sales/messages.tsx | Yes | FOUND |
| `/sales/profile` | sales/profile.tsx | Yes | FOUND |
| `/sales/activity` | sales/activity.tsx | Yes | FOUND |

### Admin Routes
| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| `/admin` | admin/index.tsx | Yes (admin) | FOUND |
| `/admin/auth` | admin/auth.tsx | No | FOUND |
| `/admin/products` | admin/products/index.tsx | Yes (admin) | FOUND |
| `/admin/products/new` | admin/products/new.tsx | Yes (admin) | FOUND |
| `/admin/products/[id]/edit` | admin/products/[id]/edit.tsx | Yes (admin) | FOUND |
| `/admin/command-center` | admin/command-center/index.tsx | Yes (admin) | FOUND |
| `/admin/command-center/leads` | admin/command-center/leads.tsx | Yes (admin) | FOUND |
| `/admin/command-center/analytics` | admin/command-center/analytics.tsx | Yes (admin) | FOUND |
| `/admin/command-center/finance` | admin/command-center/finance.tsx | Yes (admin) | FOUND |
| `/admin/command-center/b2b-pipeline` | admin/command-center/b2b-pipeline.tsx | Yes (admin) | FOUND |
| `/admin/command-center/production` | admin/command-center/production.tsx | Yes (admin) | FOUND |
| `/admin/command-center/marketing` | admin/command-center/marketing.tsx | Yes (admin) | FOUND |
| `/admin/command-center/supply-chain` | admin/command-center/supply-chain.tsx | Yes (admin) | FOUND |
| `/admin/command-center/messages` | admin/command-center/messages.tsx | Yes (admin) | FOUND |
| `/admin/command-center/tasks` | admin/command-center/tasks.tsx | Yes (admin) | FOUND |
| `/admin/command-center/ai-assistant` | admin/command-center/ai-assistant.tsx | Yes (admin) | FOUND |
| `/admin/command-center/profile` | admin/command-center/profile.tsx | Yes (admin) | FOUND |
| `/admin/command-center/settings` | admin/command-center/settings.tsx | Yes (admin) | FOUND |

## 3. Backend API Endpoints

### Core APIs
| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| POST | /api/checkout | checkout.ts | FOUND |
| GET/POST | /api/orders | orders.ts | FOUND |
| GET/POST | /api/products | products.ts | FOUND |
| POST | /api/download-code | download-code.ts | FOUND |

### Stripe APIs
| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| POST | /api/stripe/checkout | stripe/checkout.ts | FOUND |
| GET | /api/stripe/publishable-key | stripe/publishable-key.ts | FOUND |
| POST | /api/stripe/webhook | stripe/webhook/* | FOUND |
| GET | /api/stripe/session/* | stripe/session/* | FOUND |

### Email APIs
| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| POST | /api/email/send-order-confirmation | email/send-order-confirmation.ts | FOUND |
| POST | /api/email/send-welcome | email/send-welcome.ts | FOUND |
| POST | /api/email/send-password-reset | email/send-password-reset.ts | FOUND |
| POST | /api/email/send-shipping-update | email/send-shipping-update.ts | FOUND |

### Admin APIs
| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| GET | /api/admin/stats | admin/stats.ts | FOUND |
| GET | /api/admin/analytics | admin/analytics.ts | FOUND |
| GET/POST | /api/admin/orders | admin/orders.ts | FOUND |
| GET/POST | /api/admin/products | admin/products.ts | FOUND |
| GET/POST | /api/admin/partners | admin/partners.ts | FOUND |
| GET/POST | /api/admin/leads | admin/leads/index.ts | FOUND |
| GET/POST | /api/admin/experts | admin/experts.ts | FOUND |
| POST | /api/admin/reset-admin | admin/reset-admin.ts | FOUND |

## 4. Database Tables (Expected Schema)

| Table | Used In | RLS Expected | Status |
|-------|---------|-------------|--------|
| products | lib/api/products.ts | Yes | SCHEMA DEFINED |
| customers | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| customer_addresses | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| customer_payment_methods | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| d2c_orders | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| d2c_order_items | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| subscriptions | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| loyalty_transactions | lib/api/customers.ts | Yes | SCHEMA DEFINED |
| partners | lib/api/partners.ts | Yes | SCHEMA DEFINED |
| partner_addresses | lib/api/partners.ts | Yes | SCHEMA DEFINED |
| b2b_orders | lib/api/partners.ts | Yes | SCHEMA DEFINED |
| b2b_order_items | lib/api/partners.ts | Yes | SCHEMA DEFINED |
| invoices | lib/api/partners.ts | Yes | SCHEMA DEFINED |
| admin_users | types/database.ts | Yes | SCHEMA DEFINED |
| password_reset_tokens | types/database.ts | Yes | SCHEMA DEFINED |
| profiles | hooks/useRole.ts | Yes | REFERENCED |
| cart_items | hooks/useCart.ts | Yes | REFERENCED |
| wishlist_items | pages/account/wishlist.tsx | Yes | REFERENCED |
| certificates | pages/retail/apply.tsx | Yes | REFERENCED |
| partner_agreements | lib/docusignService.ts | Yes | REFERENCED |
| retail_partners | lib/docusignService.ts | Yes | REFERENCED |
| docusign_events | lib/docusignService.ts | Yes | REFERENCED |

## 5. Environment Variables

| Variable | Used In | Set In Secrets | Status |
|----------|---------|----------------|--------|
| NEXT_PUBLIC_SUPABASE_URL | lib/supabase.ts | Yes | PRESENT |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | lib/supabase.ts | Yes | PRESENT |
| SUPABASE_URL | lib/supabaseClient.ts | Yes | PRESENT |
| SUPABASE_ANON_KEY | - | Yes | PRESENT |
| SUPABASE_SERVICE_ROLE_KEY | lib/supabase.ts | Yes | PRESENT |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | - | Yes | PRESENT |
| STRIPE_SECRET_KEY | lib/stripeClient.ts | Yes | PRESENT |
| RESEND_API_KEY | lib/resendClient.ts | Yes | PRESENT |
| SESSION_SECRET | - | Yes | PRESENT |
| DATABASE_URL | - | Yes | PRESENT |

## 6. Key Lib/Service Files

| File | Purpose | Status |
|------|---------|--------|
| lib/supabase.ts | Supabase client with types | FOUND |
| lib/supabaseClient.ts | Supabase client (legacy) | FOUND |
| lib/auth.ts | Auth utilities | FOUND |
| lib/adminAuth.ts | Admin auth | FOUND |
| lib/stripeClient.ts | Stripe client | FOUND |
| lib/resendClient.ts | Resend email client | FOUND |
| lib/api/products.ts | Product API helpers | FOUND |
| lib/api/customers.ts | Customer API helpers | FOUND |
| lib/api/partners.ts | Partner API helpers | FOUND |
| hooks/useAuth.ts | Auth hook | FOUND |
| hooks/useCart.ts | Cart hook | FOUND |
| hooks/useRole.ts | Role-based auth | FOUND |

## 7. Components Structure

### Layouts
- components/PageLayout.tsx
- components/customer/CustomerLayout.tsx
- components/partner/PartnerLayout.tsx
- components/sales/SalesLayout.tsx
- components/admin/CommandCenterLayout.tsx

### Core Components
- components/Navbar.tsx
- components/Footer.tsx
- components/AuthForm.tsx
- components/SmoothieCard.tsx
- components/HomeHero.tsx

### UI Components
- components/ui/infinite-slider.tsx
- components/ui/morphing-text-reveal.tsx
- components/ui/3d-carousel.tsx
- components/ui/scroll-hero-section.tsx

## 8. User Portals

1. **D2C Customer Portal** - /account/*
2. **B2B Partner Portal** - /partner/*
3. **Wholesale Portal** - /wholesale/*
4. **Sales Rep Portal** - /sales/*
5. **Admin Command Center** - /admin/command-center/*

---

## Phase 0 Status: PASS
All major components identified. Project is a Next.js e-commerce platform with multi-tenant portals (D2C, B2B, Wholesale, Sales, Admin).
