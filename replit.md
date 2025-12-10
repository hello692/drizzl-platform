# Drizzl Wellness - Production D2C + B2B E-Commerce Platform

## Overview
Drizzl Wellness is a full-stack e-commerce platform for a smoothie and wellness brand. It supports both Direct-to-Consumer (D2C) and Business-to-Business (B2B) operations, aiming to streamline sales, manage retail partnerships, and provide internal business intelligence. The platform includes a customer-facing e-commerce store, a dedicated B2B portal for wholesale partners, and an enterprise-grade admin dashboard with specialized intelligence modules. The project's ambition is to optimize operations, enhance decision-making through AI-powered insights, and drive growth in both D2C and B2B markets.

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
- **D2C Storefront Aesthetic**: Premium dark theme with pure black backgrounds and white text, refined color palette, Apple-style fully rounded pill buttons, and Google AI-inspired typography using the Inter font. Features smooth transitions, a centered layout with a 1100px max-width, and full responsiveness.
- **Linear-Style Balanced Spacing Philosophy**: Inspired by Linear.app, with specific design tokens for section, subsection, and component spacing, body text line-height, paragraph max-width, container padding, elevation system, border system, micro-interactions (buttons, links, arrows), transition timings, responsive scaling, and a 16px base grid system.

### Technical Implementations
- **Core Stack**: Next.js 15, React 19, Supabase (Auth + Database).
- **Global Navigation**: Implemented via an `AdminLayout` component.
- **Multi-language Support**: D2C platform supports 12 languages.
- **Address Autocomplete**: Utilizes OpenStreetMap for B2B.
- **File Uploads**: Drag-and-drop for business verification documents.
- **Role-Based Access Control (RBAC)**: Granular permissions for roles like `super_admin`, `factory_manager`, `finance`, `marketing`, `support`, `warehouse`, `b2b_sales`.
- **Demo Mode**: Admin modules display realistic mock data for UI testing.
- **Security Hardening**: Includes 2FA, session management, audit logging, and brute force protection.

### Feature Specifications
- **D2C Customer Portal** (`/account/*`): Complete customer account management with sidebar navigation:
    - Login/Signup: Email/password auth with social login buttons (demo mode)
    - Dashboard: Welcome message, 4 stat cards (orders, points, subscriptions, saved items)
    - Orders: Card-based order history with search/filter, tracking, reorder
    - Subscriptions: Manage recurring orders with pause/skip/cancel
    - Addresses: CRUD for saved shipping addresses with default selection
    - Payment: Mock credit card management with visual card display
    - Rewards: Loyalty points (1,240 pts = $12.40), tier progress, redeemable rewards
    - Settings: Personal info, password change, notification preferences
- **B2B Partner Portal** (`/partner/*`): Complete wholesale partner portal with horizontal navigation:
    - Login: Partner authentication (demo: any email + password "partner123")
    - Dashboard: Welcome, tier/credit info, outstanding balance, recent orders, quick actions
    - Orders: Order history table with view/reorder, status filtering
    - New Order: Product catalog with wholesale pricing, cart, checkout flow
    - Invoices: Invoice management with pay now functionality, status badges
    - Pricing: Wholesale price list with tier discounts and volume discounts
    - Account: Business info, contact info, shipping addresses, payment methods
    - Support: Contact account manager, submit tickets, FAQ accordion
- **Enterprise Admin Dashboard**: Comprises 11 intelligence modules:
    - **Admin Command Center** (`/admin/command-center`): Claude.ai-style sidebar navigation with 9 fully functional tabs:
        - Dashboard: Master summary with KPIs, alerts, AI recommendations, revenue chart, production pipeline
        - Finance: Mercury banking integration, transactions, cash flow forecast, AR/AP, P&L summary
        - Production: Factory operations, active production lines, QC dashboard, equipment status
        - Supply Chain: Inventory management (ingredients/packaging), purchase orders, suppliers, lot tracking
        - AI Assistant: Chat interface with conversation history, quick insights, usage stats
        - Analytics: Revenue analytics, customer insights, product performance, geographic distribution
        - Marketing: Campaign management, channel performance, email marketing, social media
        - B2B Pipeline: Kanban sales funnel, hot deals, contact database, activity timeline
        - Tasks: Kanban board with 4 columns, team workload, upcoming deadlines
    - **AI Command Assistant**: ChatGPT-like interface for business queries.
    - **Product Intelligence**: SKU management, cost tracking, AI optimization.
    - **Inventory Management**: Tracking for ingredients, packaging, finished goods, alerts, lot tracking.
    - **Factory Intelligence**: Production monitoring, predictive restocking, shift tracking.
    - **Order Intelligence**: D2C/B2B analytics, carrier detection, tracking, proof of delivery.
    - **Content Manager**: CMS for expert profiles, testimonials, videos.
    - **Social Media Control Center**: Integrates accounts for metrics.
    - **Banking Intelligence**: Financial overview, income/expenses, burn rate, cash runway.
    - **Project Management**: Kanban board for tasks.
    - **Settings**: General settings, notifications, team & roles, integrations, billing, security.
- **Lead Pipeline / CRM**: Kanban board with 7 stages, lead cards, activity timeline, and Google Calendar integration.

### System Design Choices
- **Database**: Supabase for authentication and database.
- **Core Tables**: Key tables include `profiles`, `products`, `orders`, `retail_partners`, `analytics_events`, `cart_items`, `user_sessions`, `audit_logs`, `leads`, `partner_documents`, and others for comprehensive platform functionality.
- **Row Level Security (RLS)**: Implemented across all tables for data access control.

## External Dependencies
- **Supabase**: Backend-as-a-Service for database and authentication.
- **OpenStreetMap**: Address autocomplete.
- **OpenAI GPT**: AI Command Assistant.
- **Mercury API**: Banking Intelligence module.
- **POS Integrations**: Square, Clover, Toast, Lightspeed, Shopify.
- **DocuSign**: Agreement management for B2B partners.
- **Google Calendar**: Meeting scheduling in the CRM.
- **Resend**: Email notifications.