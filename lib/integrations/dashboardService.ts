import {
  PRODUCT_NAMES,
  PRODUCT_SKUS,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  generateDateRange,
  randomBetween,
  randomFromArray,
  generateProductionBatches,
  type ProductionBatch,
} from './mockData';

export interface TodayMetrics {
  revenueToday: number;
  ordersPlaced: number;
  activeVisitors: number;
  conversionRate: number;
  averageOrderValue: number;
  cashBalance: number;
  pendingPayables: number;
  manufacturingCapacity: number;
  inventoryAlerts: number;
  b2bPipelineValue: number;
  revenueChange: number;
  ordersChange: number;
  visitorsChange: number;
  conversionChange: number;
}

export interface RevenueTrendPoint {
  date: string;
  d2cRevenue: number;
  b2bRevenue: number;
  totalRevenue: number;
}

export interface ProductionPipelineItem {
  batchId: string;
  productName: string;
  units: number;
  stage: string;
  progress: number;
  status: 'on_track' | 'delayed' | 'at_risk' | 'completed';
  expectedCompletion: string;
}

export interface Alert {
  id: string;
  type: 'inventory' | 'order' | 'payment' | 'production' | 'system';
  severity: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface CriticalAlerts {
  urgent: Alert[];
  warning: Alert[];
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  actions: {
    label: string;
    action: string;
    primary?: boolean;
  }[];
  createdAt: string;
}

export function getTodayMetrics(): TodayMetrics {
  const baseRevenue = 12450 + randomBetween(-1000, 2000);
  const baseOrders = 47 + randomBetween(-5, 10);
  const baseVisitors = 1234 + randomBetween(-100, 200);
  
  return {
    revenueToday: baseRevenue,
    ordersPlaced: baseOrders,
    activeVisitors: baseVisitors,
    conversionRate: 3.8 + (Math.random() * 0.8 - 0.4),
    averageOrderValue: Math.round(baseRevenue / baseOrders),
    cashBalance: 487320 + randomBetween(-10000, 20000),
    pendingPayables: 67890 + randomBetween(-5000, 5000),
    manufacturingCapacity: 78 + randomBetween(-5, 10),
    inventoryAlerts: randomBetween(2, 8),
    b2bPipelineValue: 1245000 + randomBetween(-50000, 100000),
    revenueChange: 12.4 + (Math.random() * 4 - 2),
    ordersChange: 8.2 + (Math.random() * 4 - 2),
    visitorsChange: 15.7 + (Math.random() * 4 - 2),
    conversionChange: 2.1 + (Math.random() * 2 - 1),
  };
}

export function getRevenueTrend(days: number = 30): RevenueTrendPoint[] {
  const dates = generateDateRange(days);
  const trend: RevenueTrendPoint[] = [];
  
  const baseD2C = 8000;
  const baseB2B = 4000;
  const weekendFactor = 0.6;
  const growthRate = 1.002;
  
  dates.forEach((date, index) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const seasonalFactor = 1 + Math.sin((index / days) * Math.PI * 2) * 0.15;
    const randomVariation = 0.85 + Math.random() * 0.3;
    const growth = Math.pow(growthRate, index);
    
    const d2cRevenue = Math.round(
      baseD2C * 
      growth * 
      seasonalFactor * 
      randomVariation * 
      (isWeekend ? weekendFactor : 1)
    );
    
    const b2bRevenue = Math.round(
      baseB2B * 
      growth * 
      seasonalFactor * 
      (Math.random() * 0.4 + 0.8) *
      (isWeekend ? 0.3 : 1)
    );
    
    trend.push({
      date: date.toISOString().split('T')[0],
      d2cRevenue,
      b2bRevenue,
      totalRevenue: d2cRevenue + b2bRevenue,
    });
  });
  
  return trend;
}

export function getProductionPipeline(): ProductionPipelineItem[] {
  const batches = generateProductionBatches();
  
  return batches.slice(0, 10).map(batch => ({
    batchId: batch.batchId,
    productName: batch.productName,
    units: batch.units,
    stage: batch.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    progress: batch.progress,
    status: batch.status,
    expectedCompletion: batch.expectedCompletion,
  }));
}

export function getCriticalAlerts(): CriticalAlerts {
  const now = new Date();
  
  const urgentAlerts: Alert[] = [
    {
      id: 'alert-1',
      type: 'inventory',
      severity: 'urgent',
      title: 'Low Stock: Green Detox',
      message: 'Only 45 units remaining. Reorder point is 200 units. Expected stockout in 2 days.',
      actionLabel: 'Create PO',
      actionUrl: '/admin/inventory?action=reorder&product=SM-GRN-001',
      createdAt: new Date(now.getTime() - 1800000).toISOString(),
      isRead: false,
    },
    {
      id: 'alert-2',
      type: 'payment',
      severity: 'urgent',
      title: 'Payment Overdue: Whole Foods',
      message: 'Invoice #INV-2024-0892 for $24,500 is 5 days overdue.',
      actionLabel: 'Send Reminder',
      actionUrl: '/admin/banking?tab=receivables',
      createdAt: new Date(now.getTime() - 3600000).toISOString(),
      isRead: false,
    },
  ];
  
  const warningAlerts: Alert[] = [
    {
      id: 'alert-3',
      type: 'production',
      severity: 'warning',
      title: 'Production Delay: BATCH-2024003',
      message: 'Berry Blast batch delayed by 2 days due to ingredient sourcing issues.',
      actionLabel: 'View Details',
      actionUrl: '/admin/factory?batch=BATCH-2024003',
      createdAt: new Date(now.getTime() - 7200000).toISOString(),
      isRead: false,
    },
    {
      id: 'alert-4',
      type: 'order',
      severity: 'warning',
      title: 'High Volume Order Pending',
      message: 'Target order #ORD-45892 for 2,500 units awaiting confirmation.',
      actionLabel: 'Review Order',
      actionUrl: '/admin/orders?id=ORD-45892',
      createdAt: new Date(now.getTime() - 10800000).toISOString(),
      isRead: true,
    },
    {
      id: 'alert-5',
      type: 'inventory',
      severity: 'warning',
      title: 'Approaching Reorder Point',
      message: 'Protein Power at 180 units (reorder point: 150). Consider restocking soon.',
      actionLabel: 'Check Inventory',
      actionUrl: '/admin/inventory',
      createdAt: new Date(now.getTime() - 14400000).toISOString(),
      isRead: true,
    },
  ];
  
  return {
    urgent: urgentAlerts,
    warning: warningAlerts,
  };
}

export function getAIInsights(): AIInsight[] {
  const now = new Date();
  
  return [
    {
      id: 'insight-1',
      type: 'opportunity',
      title: 'Upsell Opportunity Detected',
      description: 'Customers who purchase Green Detox have a 68% likelihood of adding Immune Boost to their cart. Consider bundling these products.',
      impact: 'Potential +$12,400/month revenue',
      confidence: 87,
      actions: [
        { label: 'Create Bundle', action: 'create_bundle', primary: true },
        { label: 'View Analysis', action: 'view_analysis' },
      ],
      createdAt: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: 'insight-2',
      type: 'risk',
      title: 'Supply Chain Risk Alert',
      description: 'Primary açaí supplier showing delivery delays. Average lead time increased from 5 to 8 days over the past month.',
      impact: 'Risk of 15% production delay',
      confidence: 92,
      actions: [
        { label: 'Find Alternatives', action: 'find_suppliers', primary: true },
        { label: 'Contact Supplier', action: 'contact_supplier' },
      ],
      createdAt: new Date(now.getTime() - 7200000).toISOString(),
    },
    {
      id: 'insight-3',
      type: 'optimization',
      title: 'Pricing Optimization',
      description: 'Analysis suggests Tropical Paradise is underpriced. A $0.50 increase would optimize margin with minimal volume impact.',
      impact: 'Potential +$8,200/month margin',
      confidence: 78,
      actions: [
        { label: 'Simulate Change', action: 'simulate_pricing', primary: true },
        { label: 'Dismiss', action: 'dismiss' },
      ],
      createdAt: new Date(now.getTime() - 14400000).toISOString(),
    },
    {
      id: 'insight-4',
      type: 'trend',
      title: 'Seasonal Trend Detected',
      description: 'Coffee Mushroom sales increasing 23% week-over-week as weather cools. Consider increasing production allocation.',
      impact: 'Avoid stockout risk',
      confidence: 85,
      actions: [
        { label: 'Adjust Production', action: 'adjust_production', primary: true },
        { label: 'View Trend', action: 'view_trend' },
      ],
      createdAt: new Date(now.getTime() - 21600000).toISOString(),
    },
    {
      id: 'insight-5',
      type: 'opportunity',
      title: 'New Market Expansion',
      description: 'Based on shipping data, Austin TX shows 340% higher per-capita demand than other markets. Consider targeted marketing.',
      impact: 'Potential new market development',
      confidence: 74,
      actions: [
        { label: 'Launch Campaign', action: 'launch_campaign', primary: true },
        { label: 'Research Market', action: 'research_market' },
      ],
      createdAt: new Date(now.getTime() - 43200000).toISOString(),
    },
  ];
}

export interface DashboardSummary {
  metrics: TodayMetrics;
  revenueTrend: RevenueTrendPoint[];
  productionPipeline: ProductionPipelineItem[];
  alerts: CriticalAlerts;
  insights: AIInsight[];
}

export function getDashboardSummary(): DashboardSummary {
  return {
    metrics: getTodayMetrics(),
    revenueTrend: getRevenueTrend(30),
    productionPipeline: getProductionPipeline(),
    alerts: getCriticalAlerts(),
    insights: getAIInsights(),
  };
}

export function getMetricTrend(
  metric: 'revenue' | 'orders' | 'visitors' | 'conversion',
  days: number = 7
): { date: string; value: number }[] {
  const dates = generateDateRange(days);
  const baseValues: Record<string, number> = {
    revenue: 12000,
    orders: 45,
    visitors: 1200,
    conversion: 3.8,
  };
  
  const base = baseValues[metric];
  
  return dates.map((date, index) => {
    const variation = 0.8 + Math.random() * 0.4;
    const growth = 1 + (index / days) * 0.1;
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(base * variation * growth * 100) / 100,
    };
  });
}
