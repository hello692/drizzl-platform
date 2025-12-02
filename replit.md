# Drizzl Wellness - Production D2C + B2B E-Commerce Platform

## Overview
Drizzl Wellness is a full-stack e-commerce platform for a smoothie and wellness brand, supporting both Direct-to-Consumer (D2C) and Business-to-Business (B2B) operations. The platform aims to provide a comprehensive solution for managing sales, retail partnerships, and internal business intelligence. Key capabilities include a customer-facing e-commerce store, a dedicated B2B portal for wholesale partners, and an enterprise-grade admin dashboard with 11 specialized intelligence modules for advanced business management and analytics. The project's ambition is to streamline operations, enhance decision-making through AI-powered insights, and foster growth in both D2C and B2B markets.

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
- **Admin Portal Aesthetic**: "Apple AI 2500 Dark" theme featuring deep black backgrounds, mesh gradient overlays, animated floating orbs, glassmorphism cards with subtle glow borders, and gradient text. Accent colors include purple, cyan, pink, and green. Custom gradient SVG icons and subtle animations (float, pulse, glow, shimmer) are used.
- **D2C Storefront Aesthetic**: "Apple 3000 Minimal" theme with a clean, modern design. Uses DM Sans for headings and Inter for body text. Features a black, white, and gray color palette, white background cards with subtle borders, glass/blur surfaces, and hover effects. Layout is centered with a 1280px max-width.

### Technical Implementations
- **Core Stack**: Next.js 15, React 19, Supabase (Auth + Database).
- **Global Navigation**: Persistent global navigation across all admin pages via an `AdminLayout` component, featuring DRIZZL branding, live time display, and exit functionality.
- **Multi-language Support**: D2C platform supports 12 languages.
- **Address Autocomplete**: Utilizes OpenStreetMap for B2B application.
- **File Uploads**: Drag-and-drop functionality for business verification documents in B2B applications.
- **Role-Based Access Control (RBAC)**: Implemented with distinct roles (`super_admin`, `factory_manager`, `finance`, `marketing`, `support`, `warehouse`, `b2b_sales`) and a permission system using `role_permissions` and `user_role_assignments` tables.
- **Demo Mode**: Admin modules display realistic mock data when database tables are not configured or API keys are unset, enabling full UI testing without complete setup.

### Feature Specifications
- **D2C E-Commerce**: Product browsing, filtering, shopping cart, two-step checkout, user authentication, order history.
- **B2B Retail Partner Portal**:
    - **Application Process**: 4-step application including business info, verification, contact details, and logistics preferences.
    - **Dashboard**: Overview, wholesale catalog with partner pricing, order management, analytics, messaging, POS integration, and AI-powered restocking recommendations.
- **Enterprise Admin Dashboard**: Comprises 11 intelligence modules:
    1.  **Command Center**: Real-time business intelligence with key metrics (revenue, orders, AOV), trend visualization, channel distribution, conversion funnel, time filtering, and CSV export.
    2.  **AI Command Assistant**: ChatGPT-like interface for business queries with intent recognition (revenue, products, orders, financial, profit, runway) and contextual business data responses.
    3.  **Product Intelligence**: SKU management with cost tracking (ingredients, packaging, labor), margin analysis, and AI optimization suggestions.
    4.  **Inventory Management**: Tracking for ingredients, packaging, and finished goods; low stock/expiration alerts, lot/supplier tracking, storage location management.
    5.  **Factory Intelligence**: Production monitoring (batches, efficiency, goals), predictive restocking, ingredient burn rate, shift tracking.
    6.  **Order Intelligence**: D2C analytics (revenue, AOV, refund rate, customer satisfaction, shipping performance) and B2B analytics (revenue, accounts, top customers, PO tracking).
    7.  **Video Manager**: CMS for landing page videos with drag-and-drop reordering, autoplay/loop toggles, platform targeting, and status management.
    8.  **Social Media Control Center**: Integrates connected accounts (Instagram, TikTok, Facebook) with follower/engagement metrics, post performance, and analytics trends.
    9.  **Banking Intelligence**: Integration for cash balance, income/expenses, net profit/loss, burn rate, and cash runway projections.
    10. **Project Management**: Kanban board with drag-and-drop tasks, department filters, priority badges, assignee avatars, and due dates.
    11. **Settings**: Configurable sections for general settings, notifications, team & roles, integrations, billing, and security.

### System Design Choices
- **Database**: Supabase is used for both authentication and database management.
- **Core Tables**: `profiles`, `products`, `orders`, `order_items`, `retail_partners`, `analytics_events`, `cart_items`.
- **Admin Extension Tables**: `role_permissions`, `user_role_assignments`, `product_costs`, `product_ingredients`, `inventory_items`, `manufacturing_batches`, `media_assets`, `social_accounts`, `social_posts`, `ai_insights`, `command_center_snapshots`.
- **Row Level Security (RLS)**: Implemented across all tables to ensure data access control based on user roles (customer, partner, admin).

## External Dependencies
- **Supabase**: Backend-as-a-Service for database and authentication.
- **OpenStreetMap**: Used for address autocomplete in the B2B application.
- **OpenAI GPT**: (Optional) Integrated for AI Command Assistant functionality.
- **Mercury API**: Used for Banking Intelligence module to fetch financial data.
- **POS Integrations**: Connects with Square, Clover, Toast, Lightspeed, Shopify for B2B portal.
- **Social Media APIs**: (Placeholder, future integration) Instagram, TikTok, Facebook for Social Media Control Center.
- **Stripe**: (Future integration) For payment processing.