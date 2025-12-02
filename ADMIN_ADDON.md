# Drizzl Wellness Admin Extension

## Overview

The Drizzl Wellness Admin Extension is a comprehensive suite of advanced administrative modules designed to provide deep business intelligence, operational control, and real-time analytics for the Drizzl Wellness e-commerce platform. Built with a modular architecture, these extensions enhance the core admin dashboard with specialized tools for product intelligence, inventory management, factory operations, order analytics, social media management, and financial insights.

### Key Features
- Real-time business metrics and KPI tracking
- AI-powered business intelligence assistant
- Product cost and margin analysis
- Multi-channel order analytics (D2C & B2B)
- Inventory and production management
- Social media performance tracking
- Banking and cash flow integration (Mercury API)
- Role-based access control with granular permissions

### Modules Included
1. **Command Center** - Central dashboard for key business metrics
2. **AI Command Assistant** - Natural language business intelligence
3. **Product Intelligence** - Cost tracking and margin analysis
4. **Inventory Management** - Ingredients, packaging, and finished goods
5. **Factory Intelligence** - Production tracking and burn rate analysis
6. **Order Intelligence** - D2C and B2B order analytics
7. **Video Manager** - Landing page video management
8. **Social Media Control Center** - Multi-platform social analytics
9. **Banking Intelligence** - Mercury API financial integration

---

## Architecture

### Modular Design Principles

The admin extension follows a modular architecture where each feature is self-contained with its own:
- **Frontend Page** (`pages/admin/*.tsx`) - React component with admin navigation
- **API Endpoint** (`pages/api/admin/*`) - Next.js API routes for data operations
- **Service Layer** (`lib/*Service.ts`) - Business logic and data transformation
- **Database Schema** (`database/admin-extensions-schema.sql`) - Supabase tables with RLS

### File Structure Overview

```
/database
├── admin-extensions-schema.sql    # All admin extension database tables

/lib
├── aiAssistantService.ts          # AI assistant intent parsing and responses
├── commandCenterService.ts        # Command center metrics and calculations
├── inventoryService.ts            # Inventory and production data services
├── mercuryClient.ts               # Mercury Banking API client
├── orderIntelService.ts           # Order analytics and reporting
├── productIntelService.ts         # Product cost and margin calculations
├── socialService.ts               # Social media data services
└── videoManagerService.ts         # Video management utilities

/pages/admin
├── ai-assistant.tsx               # AI Command Assistant interface
├── banking.tsx                    # Banking Intelligence dashboard
├── command-center.tsx             # Central metrics dashboard
├── factory.tsx                    # Factory Intelligence dashboard
├── inventory.tsx                  # Inventory Management dashboard
├── order-intel.tsx                # Order Intelligence dashboard
├── product-intel.tsx              # Product Intelligence dashboard
├── social.tsx                     # Social Media Control Center
└── video-manager.tsx              # Video Manager dashboard

/pages/api/admin
├── ai-assistant/chat.ts           # AI chat endpoint
├── banking/
│   ├── index.ts                   # Banking summary endpoint
│   └── transactions.ts            # Transaction history endpoint
├── command-center/index.ts        # Command center metrics endpoint
├── factory/index.ts               # Factory data endpoint
├── inventory/index.ts             # Inventory data endpoint
├── order-intel/index.ts           # Order analytics endpoint
├── product-intel/
│   ├── index.ts                   # Product list with costs
│   └── [id].ts                    # Individual product details
├── social/
│   ├── index.ts                   # Social accounts and stats
│   └── posts.ts                   # Social post data
└── video-manager/
    ├── index.ts                   # Video list and operations
    └── [id].ts                    # Individual video CRUD
```

### API Route Organization

All admin API endpoints follow a consistent pattern:
- **GET** - Retrieve data with optional filters
- **POST** - Create new records
- **PUT** - Update existing records
- **DELETE** - Remove records

All endpoints require admin authentication and return JSON responses.

---

## Modules

### 1. Command Center

**Purpose**: Provides a unified dashboard displaying real-time business metrics, revenue trends, and key performance indicators across all sales channels.

**Features**:
- Real-time order counts (today, week, month)
- Revenue tracking by channel (D2C vs B2B)
- Top-selling products with revenue data
- Revenue trend visualization
- Conversion funnel metrics
- CSV export functionality

**Key Metrics Displayed**:
| Metric | Description |
|--------|-------------|
| Orders Today | Orders placed in the current day |
| Orders This Week | 7-day rolling order count |
| Orders This Month | 30-day rolling order count |
| D2C Revenue | Direct-to-consumer sales revenue |
| B2B Revenue | Business-to-business sales revenue |
| Total Revenue | Combined revenue across all channels |
| Net Margin | Estimated profit margin (32% default) |
| Average Order Value | Mean order value in cents |
| Conversion Rate | Visit → Cart → Checkout → Purchase |

**API Endpoints**:
- `GET /api/admin/command-center` - Fetch all command center metrics
  - Query params: `filter` (today, 7days, 30days, 90days, year)
  - Query params: `format=csv` for CSV export

**Configuration**:
```typescript
type TimeFilter = 'today' | '7days' | '30days' | '90days' | 'year';
```

---

### 2. AI Command Assistant

**Purpose**: Natural language interface for querying business data. Understands user intent and returns formatted business insights.

**Capabilities**:
- Revenue summary queries
- Top product analysis
- Order trend analysis
- Cash flow analysis
- Profit and margin insights
- Runway calculations

**Example Queries**:
- "Show revenue summary"
- "Top selling products"
- "Order trends this week"
- "Cash flow analysis"
- "What's our profit margin?"
- "How long is our runway?"

**Intent Recognition**:
| Intent | Trigger Words |
|--------|---------------|
| revenue | revenue, sales, earnings, income |
| products | top selling, best sellers, popular products |
| orders | order count, how many orders, order trends |
| financial | cash flow, banking, balance, transactions |
| profit | profit, margin, net income |
| runway | runway, burn rate, months left |
| trends | trend, growth, performance |

**OpenAI Integration (Optional)**:
When `OPENAI_API_KEY` is configured, the assistant uses GPT-4o for enhanced natural language responses. Without the API key, it uses built-in template responses.

```typescript
// Enhanced response with OpenAI
if (openAIKey && openAIKey.startsWith('sk-')) {
  result = await generateOpenAIResponse(message, openAIKey);
} else {
  result = await generateAIResponse(message);
}
```

**API Endpoints**:
- `POST /api/admin/ai-assistant/chat` - Send message and receive response
  - Body: `{ message: string }`
  - Returns: `{ response, data, intent, isAIPowered }`

**Security Notes**:
- Messages limited to 1000 characters
- Empty messages rejected
- API key never exposed to client
- Admin authentication required

---

### 3. Product Intelligence

**Purpose**: Comprehensive product cost tracking, margin analysis, and profitability insights for every SKU.

**Features**:
- Full product listing with cost data
- Margin percentage calculations
- Cost breakdown by component (ingredients, packaging, labor)
- Sortable and filterable product table
- Detailed product drill-down
- AI optimization suggestions

**Cost Tracking Components**:
| Component | Description |
|-----------|-------------|
| Ingredients Cost | Raw material cost per unit |
| Packaging Cost | Packaging materials per unit |
| Labor Cost | Production labor per unit |
| Overhead | 15% of subtotal |

**Margin Analysis**:
```typescript
interface ProductWithCosts {
  cost_per_unit: number;      // Total cost
  margin: number;             // Profit per unit
  margin_percent: number;     // Margin as percentage
  ingredients_cost: number;   // Raw materials
  packaging_cost: number;     // Packaging
  labor_cost: number;         // Labor
}
```

**Product Details Include**:
- Ingredient list with weights and costs
- Nutritional information totals
- D2C vs Wholesale margin comparison
- Break-even unit calculation
- Supplier information

**API Endpoints**:
- `GET /api/admin/product-intel` - List all products with costs
- `GET /api/admin/product-intel/[id]` - Get detailed product analysis

---

### 4. Inventory Management

**Purpose**: Track all inventory including raw ingredients, packaging materials, and finished goods with expiration and lot tracking.

**Ingredients Tracking**:
- Current stock levels
- Minimum threshold alerts
- Expiration date monitoring
- Lot number tracking
- Supplier information
- Status indicators (in_stock, low_stock, out_of_stock, expiring_soon, expired)

**Packaging Management**:
- Packaging item inventory
- Stock level monitoring
- Reorder threshold alerts
- Status tracking

**Finished Goods**:
- Batch tracking
- Production dates
- Expiration dates
- Storage location
- Status (available, reserved, shipped)

**Low Stock Alerts**:
```typescript
function checkLowStock<T extends { quantity: number; minThreshold: number }>(
  items: T[]
): T[]
```

**Status Calculation**:
```typescript
// Automatic status based on quantity and expiration
if (quantity === 0) return 'out_of_stock';
if (expirationDate < now) return 'expired';
if (expirationDate <= thirtyDaysFromNow) return 'expiring_soon';
if (quantity <= minThreshold) return 'low_stock';
return 'in_stock';
```

**API Endpoints**:
- `GET /api/admin/inventory` - Get all inventory data
  - Returns: `{ ingredients, packaging, finishedGoods }`

---

### 5. Factory Intelligence

**Purpose**: Monitor production operations, track manufacturing batches, and analyze ingredient burn rates.

**Production Tracking**:
- Real-time batch status monitoring
- Production efficiency metrics
- Daily goal vs actual tracking
- Shift management overview

**Batch Management**:
```typescript
interface ProductionBatch {
  id: string;
  batchNumber: string;
  productName: string;
  targetQuantity: number;
  actualQuantity: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'qa_hold';
  startTime: string;
  endTime: string | null;
  shift: string;
}
```

**Burn Rate Analysis**:
```typescript
interface BurnRateData {
  ingredientId: string;
  ingredientName: string;
  dailyUsage: number;
  weeklyUsage: number;
  currentStock: number;
  daysUntilRestock: number;
  predictedRestockDate: string;
}
```

**Production Metrics**:
| Metric | Description |
|--------|-------------|
| Total Batches | Number of batches scheduled today |
| Completed | Successfully completed batches |
| In Progress | Currently running batches |
| QA Hold | Batches awaiting quality approval |
| Efficiency | Actual vs goal percentage |

**API Endpoints**:
- `GET /api/admin/factory` - Get all factory data
  - Returns: `{ batches, burnRates, metrics, restockAlerts, shifts }`

---

### 6. Order Intelligence

**Purpose**: Deep analytics for both D2C and B2B order channels with geographic insights and shipping performance.

**D2C Analytics**:
- Total orders and revenue
- Average order value with trend
- Refund rate tracking
- Customer breakdown (new vs returning)
- Satisfaction score

**B2B Analytics**:
- Total B2B orders and revenue
- Active account count
- Top accounts by volume
- Purchase order status summary
- Predicted reorders

**Location Data**:
```typescript
interface LocationData {
  state: string;
  city: string;
  orderCount: number;
  revenue: number;
}
```

**Shipping Performance**:
```typescript
interface ShippingPerformance {
  onTimePercentage: number;
  avgDeliveryDays: number;
  totalShipped: number;
  lateDeliveries: number;
}
```

**API Endpoints**:
- `GET /api/admin/order-intel` - Get order analytics
  - Query params: `timeRange` (7d, 30d, 90d)
  - Returns: `{ d2c, b2b, timeRange, demoMode }`

---

### 7. Video Manager

**Purpose**: Manage landing page videos with drag-and-drop ordering, platform targeting, and playback settings.

**Features**:
- Add, edit, and delete videos
- Drag-and-drop reordering
- Toggle active/inactive status
- Preview videos in modal
- Platform targeting (desktop, mobile, both)

**Video Properties**:
```typescript
interface Video {
  id: string;
  url: string;
  caption: string;
  position: number;
  autoplay: boolean;
  loop: boolean;
  platform: 'desktop' | 'mobile' | 'both';
  isActive: boolean;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Ordering System**:
- Videos sorted by position (1-based)
- Arrow buttons for manual reordering
- Drag-and-drop for bulk reordering
- "Save Order" button persists changes
- Positions automatically recalculated

**API Endpoints**:
- `GET /api/admin/video-manager` - List all videos
- `POST /api/admin/video-manager` - Add new video
- `PUT /api/admin/video-manager` - Update order (bulk)
- `PUT /api/admin/video-manager/[id]` - Update single video
- `DELETE /api/admin/video-manager/[id]` - Delete video

---

### 8. Social Media Control Center

**Purpose**: Monitor social media performance across Instagram, TikTok, and Facebook with engagement tracking.

**Platform Integrations**:
| Platform | Badge | Color Scheme |
|----------|-------|--------------|
| Instagram | IG | Pink (#fce7f3) |
| TikTok | TT | Black (#111) |
| Facebook | FB | Blue (#dbeafe) |

**Post Tracking**:
```typescript
interface SocialPost {
  id: string;
  accountId: string;
  platform: Platform;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'carousel';
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
}
```

**Engagement Metrics**:
- Views per post
- Likes, comments, shares, saves
- Engagement rate calculation
- 30-day engagement totals
- Follower growth tracking

**Features**:
- Overview tab with connected accounts
- Posts tab with performance table
- Analytics tab with platform comparison
- Platform filtering
- Coming soon: Post scheduling, Account connection

**API Endpoints**:
- `GET /api/admin/social` - Get all social data
- `GET /api/admin/social/posts` - Get post performance

---

### 9. Banking Intelligence

**Purpose**: Integrate with Mercury Banking API for real-time financial visibility.

**Mercury API Integration**:
```typescript
class MercuryClient {
  async getAccounts(): Promise<MercuryAccount[]>;
  async getTransactions(accountId: string, params: TransactionParams): Promise<MercuryTransactionsResponse>;
  async getAllTransactions(params: TransactionParams): Promise<MercuryTransaction[]>;
  async getTreasury(): Promise<MercuryTreasury[]>;
  async getRecipients(): Promise<MercuryRecipient[]>;
}
```

**Financial Metrics**:
| Metric | Description |
|--------|-------------|
| Total Balance | Sum of all account balances |
| Incoming (30d) | Total deposits last 30 days |
| Outgoing (30d) | Total withdrawals last 30 days |
| Net Profit/Loss | Incoming minus outgoing |
| Monthly Burn | Average monthly expenses |
| Cash Runway | Months of operation remaining |

**Cash Runway Calculation**:
```typescript
const cashRunway = monthlyBurn > 0 ? Math.round(totalBalance / monthlyBurn) : null;
```

**API Endpoints**:
- `GET /api/admin/banking` - Get banking summary
- `GET /api/admin/banking/transactions` - Get recent transactions

**Demo Mode**: When `MERCURY_API_KEY` is not configured, displays realistic mock data.

---

## Role-Based Access Control

### Available Roles

| Role | Description |
|------|-------------|
| super_admin | Full access to all features |
| factory_manager | Factory and inventory access |
| finance | Banking and financial reports |
| marketing | Social media and content |
| support | Order management and customer data |
| warehouse | Inventory and shipping |
| b2b_sales | B2B partner management |

### Permission Mapping

Permissions are stored as JSONB arrays in the `role_permissions` table:

```sql
-- Example permission structure
permissions = [
  "products:read",
  "products:write",
  "orders:manage",
  "inventory:view"
]
```

### How to Assign Roles

1. Insert into `role_permissions` table:
```sql
INSERT INTO role_permissions (role_name, permissions)
VALUES ('factory_manager', '["inventory:read", "inventory:write", "factory:manage"]');
```

2. Assign role to user:
```sql
INSERT INTO user_role_assignments (user_id, role_name)
VALUES ('user-uuid-here', 'factory_manager');
```

### Permission Check Function

```sql
-- Check if user has permission
SELECT has_permission(auth.uid(), 'products:write');

-- Get all user permissions
SELECT get_user_permissions(auth.uid());
```

---

## Database Schema

### New Tables Added

| Table | Purpose |
|-------|---------|
| role_permissions | Stores role definitions with permission arrays |
| user_role_assignments | Maps users to their assigned roles |
| product_costs | Extended cost breakdown per product |
| product_ingredients | Ingredient details with nutrition data |
| inventory_items | Raw materials, packaging, finished goods |
| manufacturing_batches | Production batch tracking |
| media_assets | Video and image management |
| social_accounts | Connected social platform accounts |
| social_posts | Social media post performance data |
| ai_insights | AI-generated business recommendations |
| command_center_snapshots | Daily metrics snapshots |

### Relationships

```
profiles (users)
    └── user_role_assignments ─── role_permissions
    
products
    ├── product_costs
    └── product_ingredients
    
manufacturing_batches ─── products

social_accounts
    └── social_posts
```

### RLS Policies

All tables have Row Level Security enabled with admin-only access:

```sql
-- Example policy
CREATE POLICY "Admins can manage product costs" ON product_costs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

**Exception**: `media_assets` has a public read policy for active assets:
```sql
CREATE POLICY "Anyone can view active media assets" ON media_assets 
FOR SELECT USING (is_active = true);
```

---

## Environment Variables

### Required Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key (server-side) |

### Optional Variables

| Variable | Description | Module |
|----------|-------------|--------|
| OPENAI_API_KEY | OpenAI API key for enhanced AI assistant | AI Assistant |
| MERCURY_API_KEY | Mercury Banking API key | Banking Intelligence |

---

## Setup Instructions

### 1. Database Migration

Run the admin extensions schema in Supabase SQL Editor:

```bash
# 1. Open Supabase Dashboard
# 2. Navigate to SQL Editor
# 3. Copy contents of database/admin-extensions-schema.sql
# 4. Run the SQL
```

**Important**: Run this AFTER the main schema (`database/supabase-schema.sql`).

### 2. Environment Configuration

Add required environment variables to your `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional - Enhanced AI
OPENAI_API_KEY=sk-your-openai-key

# Optional - Banking Integration
MERCURY_API_KEY=your-mercury-api-key
```

### 3. Role Assignment

1. Ensure user has admin role in profiles table:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

2. Optionally assign granular permissions:
```sql
INSERT INTO user_role_assignments (user_id, role_name)
SELECT id, 'super_admin' FROM profiles WHERE email = 'admin@example.com';
```

---

## Demo Mode

### How Demo Mode Works

When external APIs are not configured or database tables are empty, modules automatically switch to demo mode with realistic mock data.

**Detection Logic**:
```typescript
// Banking - checks for API key
const isDemo = !process.env.MERCURY_API_KEY;

// Command Center - checks for order data
if (orders.length === 0) {
  return generateMockData(filter);
}

// AI Assistant - falls back to template responses
if (!openAIKey) {
  return generateAIResponse(message);
}
```

### Mock Data Behavior

| Module | Demo Trigger | Mock Data Provided |
|--------|--------------|-------------------|
| Banking | No MERCURY_API_KEY | Sample accounts, transactions |
| Command Center | No orders in DB | Realistic metrics, trends |
| AI Assistant | No OPENAI_API_KEY | Template-based responses |
| Inventory | No inventory items | Sample ingredients, packaging |
| Order Intel | No orders in DB | Sample D2C/B2B analytics |
| Social | No connected accounts | Mock accounts, posts |
| Video Manager | No videos in DB | Sample video entries |

**Indicator**: Most dashboards display an "isDemo" flag that can show a banner to users.

---

## Security Considerations

### Admin-Only Access

All admin pages use the `useRequireAdmin` hook:

```typescript
const { loading, authorized } = useRequireAdmin();

if (!authorized) {
  return <p>Checking authorization...</p>;
}
```

### API Key Handling

- API keys stored in environment variables only
- Never exposed to client-side code
- Keys validated server-side before use
- Service role key used for admin operations

### Data Protection

1. **Row Level Security**: All admin tables enforce admin-only access
2. **Input Validation**: Message length limits, type checking
3. **Error Handling**: Generic error messages to clients
4. **Audit Logging**: AI insights table preserves context data

---

## Future Enhancements

### Planned Features

1. **Real Social Media Integration**
   - OAuth connections for Instagram, TikTok, Facebook
   - Post scheduling and publishing
   - Comment management

2. **Advanced Inventory**
   - Barcode scanning support
   - Multi-warehouse management
   - Automated reorder triggers

3. **Enhanced AI Assistant**
   - Voice input support
   - Chart generation
   - Predictive analytics

4. **Reporting Suite**
   - Scheduled email reports
   - Custom dashboard builder
   - Export to PDF/Excel

### Extension Points

**Adding a New Module**:

1. Create service file: `lib/newModuleService.ts`
2. Create API route: `pages/api/admin/new-module/index.ts`
3. Create admin page: `pages/admin/new-module.tsx`
4. Add database tables if needed
5. Update navigation in all admin pages

**Adding New Permissions**:

1. Define permission string (e.g., `newmodule:read`)
2. Add to relevant role in `role_permissions` table
3. Check permission in API routes:
```typescript
const hasAccess = await supabase.rpc('has_permission', {
  user_uuid: userId,
  permission_check: 'newmodule:read'
});
```

---

## Support

For questions or issues with the admin extension:

1. Check the existing documentation in `replit.md`
2. Review the database schema comments in `database/admin-extensions-schema.sql`
3. Examine service files for business logic details

---

*Last Updated: December 2025*
