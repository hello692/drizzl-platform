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
- **Linear-Style Balanced Spacing Philosophy**: Inspired by Linear.app, with specific design tokens for spacing, typography, and interactive elements.

### Technical Implementations
- **Core Stack**: Next.js 15, React 19, Supabase (Auth + Database).
- **Multi-language Support**: D2C platform supports 12 languages.
- **Address Autocomplete**: Utilizes OpenStreetMap for B2B.
- **File Uploads**: Drag-and-drop for business verification documents.
- **Role-Based Access Control (RBAC)**: Granular permissions for various user roles.
- **Security Hardening**: Includes 2FA, session management, audit logging, and brute force protection.

### Feature Specifications
- **D2C Customer Portal** (`/account/*`): Comprehensive account management including orders, subscriptions, addresses, payments, rewards, and settings.
- **B2B Partner Portal** (`/partner/*`): Wholesale portal featuring order management, invoicing, detailed pricing, sales analytics, marketing assets, financing options, integrations, and real-time order tracking.
- **Sales Rep Portal** (`/sales/*`): Mobile-first CRM for field sales with lead management, activity tracking, and commission overview.
- **Enterprise Admin Dashboard**: 11 intelligence modules including a Command Center, AI Assistant, Product Intelligence, Inventory Management, Factory Intelligence, Order Intelligence, Content Manager, Social Media Control Center, Banking Intelligence, Project Management, and Settings.
- **Lead Pipeline / CRM**: Full-featured CRM for managing leads from capture to conversion, with visual pipeline and activity logging.

### System Design Choices
- **Database**: Supabase for authentication and database.
- **Core Tables**: Comprehensive set of tables including `profiles`, `products`, `orders`, `retail_partners`, `analytics_events`, `cart_items`, `user_sessions`, `audit_logs`, `leads`, `partner_documents`, and others.
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
- **Stripe**: Payment processing via Stripe Checkout Sessions.