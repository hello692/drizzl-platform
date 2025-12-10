# Drizzl Wellness - Production D2C + B2B E-Commerce Platform

## Overview
Drizzl Wellness is a full-stack e-commerce platform for a smoothie and wellness brand, supporting both Direct-to-Consumer (D2C) and Business-to-Business (B2B) operations. The platform aims to provide a comprehensive solution for managing sales, retail partnerships, and internal business intelligence. Key capabilities include a customer-facing e-commerce store, a dedicated B2B portal for wholesale partners, and an enterprise-grade admin dashboard with specialized intelligence modules for advanced business management and analytics. The project's ambition is to streamline operations, enhance decision-making through AI-powered insights, and foster growth in both D2C and B2B markets.

## User Preferences
- I prefer simple language and clear explanations.
- I like iterative development with regular updates.
- Please ask before making major architectural changes or significant code refactoring.
- Ensure all new features have corresponding database schema updates and API endpoints.
- I prioritize robust error handling and data integrity, especially for financial and inventory data.
- For AI features, prioritize practical business applications and actionable insights over experimental functionalities.
- All new UI components should adhere to the established design system for consistency.

## System Architecture

### UI/UX Decisions
- **Admin Portal Aesthetic**: "Apple AI 2500 Dark" theme with deep black backgrounds, mesh gradients, animated elements, glassmorphism cards with subtle glow borders, and gradient text. Accent colors include purple, cyan, pink, and green.
- **D2C Storefront Aesthetic**: Premium dark theme with pure black backgrounds and white text. Features include a refined color palette, Apple-style fully rounded pill buttons, and a Google AI-inspired typography system using the Inter font. Transitions are smooth 0.3s ease, and the layout is centered with a 1100px max-width, fully responsive.
- **Linear-Style Balanced Spacing Philosophy**: The site follows a Linear.app-inspired balanced approach - not too spacious, not too tight. Key design tokens:
  - **Section spacing**: 80-100px between major sections (hero to section: 100-120px)
  - **Subsection spacing**: 60-80px, content blocks: 40-60px
  - **Component spacing**: Card gap 24-32px, card padding 24-32px, icon-to-text 16-20px
  - **Body text line-height**: 1.6-1.7 for optimal readability
  - **Paragraph max-width**: 640-680px, paragraph gap: 24-32px
  - **Container padding**: 80-100px desktop, 60px tablet, 40px mobile
  - **Elevation system**: 4 shadow levels (subtle to overlay) for visual depth
  - **Border system**: Subtle borders (rgba(255,255,255,0.06-0.16)) for structure
  - **Micro-interactions**: All buttons lift on hover (translateY -1px), links have sliding underlines, arrows slide right 6px on hover
  - **Transitions**: Fast (0.15s), normal (0.2s), smooth (0.3s) timing
  - **Responsive scaling**: Spacing reduces ~30% on tablet, ~50% on mobile
  - **Grid system**: 16px base unit for mathematical precision (multiples: 16, 24, 32, 48, 64, 80, 96)

### Technical Implementations
- **Core Stack**: Next.js 15, React 19, Supabase (Auth + Database).
- **Global Navigation**: Persistent global navigation via an `AdminLayout` component.
- **Multi-language Support**: D2C platform supports 12 languages.
- **Address Autocomplete**: Utilizes OpenStreetMap for B2B applications.
- **File Uploads**: Drag-and-drop functionality for business verification documents.
- **Role-Based Access Control (RBAC)**: Implemented with distinct roles (`super_admin`, `factory_manager`, `finance`, `marketing`, `support`, `warehouse`, `b2b_sales`) and a granular permission system.
- **Demo Mode**: Admin modules display realistic mock data for UI testing without full setup.
- **Security Hardening**: Implemented 2FA, session management, audit logging, and brute force protection.

### Feature Specifications
- **D2C E-Commerce**: Standard e-commerce functionalities including product browsing, cart, checkout, user authentication, and order history.
- **B2B Retail Partner Portal**: Features a 4-step application process, dashboard with wholesale catalog, order management, analytics, messaging, POS integration, and AI-powered restocking recommendations. Includes partner scoring, agreement management (via DocuSign integration), unique partner IDs, QR code system, and a comprehensive partner profile modal.
- **Enterprise Admin Dashboard**: Comprises 11 intelligence modules:
    1.  **Command Center**: Real-time business intelligence with key metrics and trend visualization.
    2.  **AI Command Assistant**: ChatGPT-like interface for business queries with contextual responses.
    3.  **Product Intelligence**: SKU management, cost tracking, margin analysis, and AI optimization suggestions.
    4.  **Inventory Management**: Tracking for ingredients, packaging, finished goods, alerts, and lot tracking.
    5.  **Factory Intelligence**: Production monitoring, predictive restocking, and shift tracking.
    6.  **Order Intelligence**: D2C and B2B analytics, including carrier detection, tracking, and proof of delivery.
    7.  **Content Manager**: CMS for managing expert profiles, customer testimonials, and website videos.
    8.  **Social Media Control Center**: Integrates connected accounts for performance metrics and analytics.
    9.  **Banking Intelligence**: Integration for financial overview, income/expenses, burn rate, and cash runway projections.
    10. **Project Management**: Kanban board for task management.
    11. **Settings**: Configurable sections for general settings, notifications, team & roles, integrations, billing, and security.
- **Lead Pipeline / CRM**: Kanban board with 7 pipeline stages, lead cards, activity timeline, and integration with Google Calendar for meeting scheduling.

### System Design Choices
- **Database**: Supabase for authentication and database.
- **Core Tables**: `profiles`, `products`, `orders`, `order_items`, `retail_partners`, `analytics_events`, `cart_items`, `user_sessions`, `user_2fa`, `audit_logs`, `login_attempts`, `shipment_events`, `delivery_proofs`, `carriers`, `leads`, `lead_activities`, `lead_meetings`, `lead_documents`, `partner_documents`, `partner_tickets`, `partner_invoices`, `partner_deliveries`.
- **Row Level Security (RLS)**: Implemented across all tables for data access control based on user roles.

## External Dependencies
- **Supabase**: Backend-as-a-Service for database and authentication.
- **OpenStreetMap**: Address autocomplete.
- **OpenAI GPT**: AI Command Assistant.
- **Mercury API**: Banking Intelligence module.
- **POS Integrations**: Square, Clover, Toast, Lightspeed, Shopify.
- **DocuSign**: Agreement management for B2B partners.
- **Google Calendar**: Meeting scheduling in the CRM.
- **Social Media APIs**: (Future integration) Instagram, TikTok, Facebook.
- **Stripe**: (Future integration) Payment processing.
- **Resend**: Email notifications.

## Recent Changes (December 2025)
- **Design System Unification**: All D2C pages now use identical dark luxury minimal design:
  - Same Navbar component on every page (Menu | Search | DRIZZL logo | Wholesale | User | Cart)
  - Same Footer component on every page
  - Black backgrounds (#000000, #0a0a0a)
  - White text with opacity variants (rgba(255,255,255,0.6))
  - Minimal borders (rgba(255,255,255,0.06))
  - Inter font, light/regular weights
- **Navigation Sync (December 10, 2025)**: Navbar and Footer now share identical section structure:
  - **Shop**: Smoothies, Protein Power-Ups, Fan Favorites, Fresh Drops, Smoothie Kits, Gifts
  - **Discover**: Our Story, About Us, Blog & Recipes, Store Locator, Sustainability, Ingredients
  - **Wholesale & Partnerships**: Wholesale Overview, Wholesale Pricing, Apply for Wholesale, Partner Sign In
  - **Membership & Community**: Wellness Club, Referral Program, Ambassadors, Student Perks
  - **Careers**: Join the team
  - **Support**: FAQs, Contact Us, Shipping & Returns
  - **The Fine Print**: Privacy Policy, Terms of Service
- **Wholesale Section Reorganization (December 10, 2025)**: Separate pages with distinct purposes and sticky navigation bar:
  - `/wholesale` - Landing page with benefits overview, 6 benefit cards, CTAs, and contact info
  - `/wholesale/pricing` - Pricing tiers (Starter 30%, Growth 35%, Enterprise 40%) with requirements
  - `/wholesale/apply` - Multi-step application form (4 steps: Account, Business Info, Details, Review)
  - `/wholesale/signin` - Partner login page for existing partners
  - `/wholesale/dashboard` - Partner dashboard with Place Orders, View Invoices, Track Orders, Marketing Assets
  - **Sticky Nav Bar**: Wholesale | Overview | Pricing | Apply (green CTA) | Sign In
  - **User Journeys**: New partners: Learn → Price → Apply → Approved → Sign In → Dashboard; Existing partners: Sign In → Dashboard
- **Pages Fixed/Created**:
  - `/about` - Rebuilt to match dark design system with identical header
  - `/sustainability` - "Coming Soon" page with dark design
  - `/locations` - Store locator with OpenStreetMap integration, search by zip/city
  - `/ingredients` - Ingredient philosophy with 12 ingredients
  - `/membership` - Wellness club with monthly/annual plans, FAQ
  - `/ambassadors` - Ambassador/affiliate program with application form
  - `/store-locator` - Redirects to /locations
  - `/our-story` - Rebuilt with dark design, story content
  - `/blog` - Blog grid with dark design, article cards
  - `/careers` - Open positions listing with values section
  - `/contact` - Contact form with dark design
  - `/faq` - Accordion FAQ with categories
  - `/privacy` - Privacy policy with dark design
  - `/refer` - Referral program with 3-step process
  - `/shipping` - Shipping options and returns policy
  - `/student-discount` - Student perks with verification
- **Navigation**: ONE header, ONE footer across entire site - no variations
- **Admin Command Center Phase 1 (December 10, 2025)**: Enterprise-grade admin dashboard with:
  - `/admin/command-center` - Dashboard with 6 sections: Today's Metrics (10 KPIs), 30-Day Revenue Trend Chart, Production Pipeline, Critical Alerts (Urgent + Warning), AI Insights & Recommendations, Quick Actions
  - `/admin/banking` - Finance Tab with Mercury Banking integration: 3 accounts overview, Recent Transactions, 90-Day Cash Flow Forecast, Accounts Payable/Receivable, P&L Summary, Quick Actions
  - `/admin/b2b-pipeline` - B2B Sales Pipeline with Kanban-style columns: Pipeline Overview (5 metrics), Visual Pipeline Stages (5 stages), Hot Deals, Contact Database, Deal Details View, Target Accounts, Sales Analytics
  - **Design System**: Black background (#000000), neon green accent (#00FF85), glassmorphism cards (rgba(255,255,255,0.03) bg, rgba(255,255,255,0.08) border, 16px radius)
  - **Mock Data Services**: `lib/integrations/` contains dashboardService.ts, mercuryService.ts, b2bService.ts, mockData.ts for demo mode
  - **Demo Mode**: All admin tabs use deterministic mock data, ready for real API integration later