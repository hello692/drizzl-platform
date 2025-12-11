import {
  COMPANY_NAMES,
  formatCurrency,
  formatDate,
  generateDateRange,
  randomBetween,
  randomFromArray,
} from './mockData';

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'treasury';
  accountNumber: string;
  routingNumber: string;
  currentBalance: number;
  availableBalance: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  counterparty: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  memo?: string;
}

export interface CashFlowProjection {
  date: string;
  projectedBalance: number;
  inflows: number;
  outflows: number;
  confidence: number;
}

export interface AccountsSummary {
  totalBalance: number;
  totalAvailable: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  netCashFlow: number;
  accounts: BankAccount[];
}

const TRANSACTION_CATEGORIES = {
  income: ['Sales Revenue', 'B2B Payment', 'Subscription Revenue', 'Refund Received', 'Investment Income'],
  expense: ['Payroll', 'Supplier Payment', 'Marketing', 'Software & SaaS', 'Rent', 'Utilities', 'Insurance', 'Shipping', 'Legal & Professional', 'Equipment'],
} as const;

const PAYMENT_PROCESSORS = ['Stripe Payments', 'Shopify Payouts', 'Square Payments', 'PayPal Business'];
const SUPPLIERS = ['Fresh Farms Co', 'Organic Produce Direct', 'Berry Supply Inc', 'Natural Ingredients Co', 'Premium Packaging Ltd'];
const SOFTWARE_VENDORS = ['AWS', 'Notion Labs', 'Figma', 'Slack Technologies', 'Vercel Inc', 'GitHub', 'Google Workspace'];

export function getAccounts(): BankAccount[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'acct-checking-main',
      name: 'Operating Account',
      type: 'checking',
      accountNumber: '****4521',
      routingNumber: '121000358',
      currentBalance: 247832.50,
      availableBalance: 245000.00,
      status: 'active',
      lastUpdated: now,
    },
    {
      id: 'acct-savings-reserve',
      name: 'Cash Reserve',
      type: 'savings',
      accountNumber: '****4522',
      routingNumber: '121000358',
      currentBalance: 125000.00,
      availableBalance: 125000.00,
      status: 'active',
      lastUpdated: now,
    },
    {
      id: 'acct-treasury',
      name: 'Treasury Account',
      type: 'treasury',
      accountNumber: '****4523',
      routingNumber: '121000358',
      currentBalance: 75000.00,
      availableBalance: 75000.00,
      status: 'active',
      lastUpdated: now,
    },
  ];
}

export function getRecentTransactions(limit: number = 50): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  const txData: { 
    days: number; 
    description: string; 
    counterparty: string; 
    category: string; 
    amount: number; 
    type: 'credit' | 'debit';
    memo?: string;
  }[] = [
    { days: 0, description: 'Shopify Payout', counterparty: 'Shopify Payouts', category: 'Sales Revenue', amount: 18420.50, type: 'credit', memo: 'Weekly payout - Orders #45001-45089' },
    { days: 1, description: 'Stripe Transfer', counterparty: 'Stripe Payments', category: 'Sales Revenue', amount: 12340.00, type: 'credit', memo: 'D2C orders batch' },
    { days: 1, description: 'Payroll - Bi-weekly', counterparty: 'Gusto Payroll', category: 'Payroll', amount: 28500.00, type: 'debit', memo: 'Pay period 11/15-11/30' },
    { days: 2, description: 'B2B Payment Received', counterparty: 'Whole Foods Market', category: 'B2B Payment', amount: 24500.00, type: 'credit', memo: 'Invoice #INV-2024-0845' },
    { days: 2, description: 'Supplier Invoice', counterparty: 'Fresh Farms Co', category: 'Supplier Payment', amount: 8750.00, type: 'debit', memo: 'PO #FF-2024-0312' },
    { days: 3, description: 'AWS Services', counterparty: 'Amazon Web Services', category: 'Software & SaaS', amount: 1847.23, type: 'debit', memo: 'November infrastructure' },
    { days: 3, description: 'B2B Wire Transfer', counterparty: 'Sprouts Farmers Market', category: 'B2B Payment', amount: 15800.00, type: 'credit', memo: 'Order #SPR-2024-0567' },
    { days: 4, description: 'Shopify Payout', counterparty: 'Shopify Payouts', category: 'Sales Revenue', amount: 15230.75, type: 'credit', memo: 'Weekly payout' },
    { days: 4, description: 'Office Rent', counterparty: 'WeWork', category: 'Rent', amount: 4500.00, type: 'debit', memo: 'December rent' },
    { days: 5, description: 'Marketing Spend', counterparty: 'Meta Platforms', category: 'Marketing', amount: 3200.00, type: 'debit', memo: 'Facebook/Instagram ads' },
    { days: 5, description: 'Shipping Labels', counterparty: 'ShipStation', category: 'Shipping', amount: 2340.50, type: 'debit', memo: 'Weekly shipping batch' },
    { days: 6, description: 'B2B Payment', counterparty: 'Target Corporation', category: 'B2B Payment', amount: 32500.00, type: 'credit', memo: 'Invoice #INV-2024-0838' },
    { days: 6, description: 'Ingredient Supplier', counterparty: 'Organic Produce Direct', category: 'Supplier Payment', amount: 12400.00, type: 'debit', memo: 'Bulk açaí order' },
    { days: 7, description: 'Stripe Transfer', counterparty: 'Stripe Payments', category: 'Sales Revenue', amount: 9870.25, type: 'credit' },
    { days: 7, description: 'Software Subscriptions', counterparty: 'Notion Labs', category: 'Software & SaaS', amount: 890.00, type: 'debit', memo: 'Team plan - annual' },
    { days: 8, description: 'B2B Wire', counterparty: 'Costco Wholesale', category: 'B2B Payment', amount: 45000.00, type: 'credit', memo: 'Q4 order batch 1' },
    { days: 8, description: 'Insurance Premium', counterparty: 'Hartford Insurance', category: 'Insurance', amount: 2100.00, type: 'debit', memo: 'Monthly premium' },
    { days: 9, description: 'Packaging Supplier', counterparty: 'Premium Packaging Ltd', category: 'Supplier Payment', amount: 6500.00, type: 'debit', memo: 'Custom bottles order' },
    { days: 10, description: 'Shopify Payout', counterparty: 'Shopify Payouts', category: 'Sales Revenue', amount: 14560.00, type: 'credit' },
    { days: 10, description: 'Google Workspace', counterparty: 'Google', category: 'Software & SaaS', amount: 432.00, type: 'debit', memo: 'Monthly subscription' },
    { days: 11, description: 'B2B Payment', counterparty: "Trader Joe's", category: 'B2B Payment', amount: 18900.00, type: 'credit' },
    { days: 12, description: 'Payroll - Bi-weekly', counterparty: 'Gusto Payroll', category: 'Payroll', amount: 28500.00, type: 'debit' },
    { days: 12, description: 'Legal Services', counterparty: 'Wilson & Associates', category: 'Legal & Professional', amount: 3500.00, type: 'debit', memo: 'Contract review' },
    { days: 13, description: 'Stripe Transfer', counterparty: 'Stripe Payments', category: 'Sales Revenue', amount: 11230.50, type: 'credit' },
    { days: 14, description: 'Equipment Purchase', counterparty: 'Industrial Blenders Co', category: 'Equipment', amount: 8900.00, type: 'debit', memo: 'Commercial blender' },
  ];
  
  txData.slice(0, limit).forEach((tx, index) => {
    const txDate = new Date(now);
    txDate.setDate(txDate.getDate() - tx.days);
    
    transactions.push({
      id: `tx-${Date.now()}-${index}`,
      accountId: 'acct-checking-main',
      date: txDate.toISOString(),
      description: tx.description,
      counterparty: tx.counterparty,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      status: tx.days === 0 ? 'pending' : 'completed',
      reference: `REF-${randomBetween(100000, 999999)}`,
      memo: tx.memo,
    });
  });
  
  return transactions;
}

export function getCashFlowForecast(days: number = 90): CashFlowProjection[] {
  const projections: CashFlowProjection[] = [];
  const startDate = new Date();
  let runningBalance = 447832.50;
  
  const weeklyInflows = [45000, 52000, 48000, 55000, 50000, 47000, 53000, 49000, 51000, 54000, 48000, 52000, 56000];
  const weeklyOutflows = [32000, 35000, 38000, 33000, 36000, 34000, 37000, 35000, 39000, 36000, 34000, 38000, 35000];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const weekIndex = Math.floor(i / 7) % weeklyInflows.length;
    const dayOfWeek = date.getDay();
    
    let dailyInflow = 0;
    let dailyOutflow = 0;
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      dailyInflow = (weeklyInflows[weekIndex] / 5) * (0.8 + Math.random() * 0.4);
      dailyOutflow = (weeklyOutflows[weekIndex] / 5) * (0.8 + Math.random() * 0.4);
    } else {
      dailyInflow = (weeklyInflows[weekIndex] / 5) * 0.2 * (0.5 + Math.random() * 0.5);
      dailyOutflow = (weeklyOutflows[weekIndex] / 5) * 0.1;
    }
    
    if (date.getDate() === 1 || date.getDate() === 15) {
      dailyOutflow += 28500;
    }
    
    if (date.getDate() === 1) {
      dailyOutflow += 4500 + 2100;
    }
    
    runningBalance = runningBalance + dailyInflow - dailyOutflow;
    
    const daysOut = i;
    const confidence = Math.max(50, 95 - (daysOut * 0.5));
    
    projections.push({
      date: date.toISOString().split('T')[0],
      projectedBalance: Math.round(runningBalance * 100) / 100,
      inflows: Math.round(dailyInflow * 100) / 100,
      outflows: Math.round(dailyOutflow * 100) / 100,
      confidence: Math.round(confidence),
    });
  }
  
  return projections;
}

export function getAccountsSummary(): AccountsSummary {
  const accounts = getAccounts();
  const transactions = getRecentTransactions(30);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTransactions = transactions.filter(
    tx => new Date(tx.date) >= thirtyDaysAgo
  );
  
  const monthlyInflow = recentTransactions
    .filter(tx => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const monthlyOutflow = recentTransactions
    .filter(tx => tx.type === 'debit')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    totalBalance: accounts.reduce((sum, acc) => sum + acc.currentBalance, 0),
    totalAvailable: accounts.reduce((sum, acc) => sum + acc.availableBalance, 0),
    monthlyInflow,
    monthlyOutflow,
    netCashFlow: monthlyInflow - monthlyOutflow,
    accounts,
  };
}

export interface CashFlowSummary {
  currentBalance: number;
  projectedBalance30Days: number;
  projectedBalance60Days: number;
  projectedBalance90Days: number;
  avgDailyInflow: number;
  avgDailyOutflow: number;
  runwayMonths: number;
  burnRate: number;
}

export function getCashFlowSummary(): CashFlowSummary {
  const forecast = getCashFlowForecast(90);
  const accounts = getAccountsSummary();
  
  const last30Days = forecast.slice(0, 30);
  const avgDailyInflow = last30Days.reduce((sum, d) => sum + d.inflows, 0) / 30;
  const avgDailyOutflow = last30Days.reduce((sum, d) => sum + d.outflows, 0) / 30;
  const burnRate = avgDailyOutflow * 30;
  const runwayMonths = accounts.totalBalance / burnRate;
  
  return {
    currentBalance: accounts.totalBalance,
    projectedBalance30Days: forecast[29]?.projectedBalance || 0,
    projectedBalance60Days: forecast[59]?.projectedBalance || 0,
    projectedBalance90Days: forecast[89]?.projectedBalance || 0,
    avgDailyInflow: Math.round(avgDailyInflow),
    avgDailyOutflow: Math.round(avgDailyOutflow),
    runwayMonths: Math.round(runwayMonths * 10) / 10,
    burnRate: Math.round(burnRate),
  };
}

export interface TransactionsByCategory {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export function getTransactionsByCategory(
  type: 'credit' | 'debit' = 'debit'
): TransactionsByCategory[] {
  const transactions = getRecentTransactions(50);
  const filtered = transactions.filter(tx => tx.type === type);
  
  const byCategory: Record<string, { total: number; count: number }> = {};
  
  filtered.forEach(tx => {
    if (!byCategory[tx.category]) {
      byCategory[tx.category] = { total: 0, count: 0 };
    }
    byCategory[tx.category].total += tx.amount;
    byCategory[tx.category].count += 1;
  });
  
  const grandTotal = Object.values(byCategory).reduce((sum, cat) => sum + cat.total, 0);
  
  return Object.entries(byCategory)
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: Math.round((data.total / grandTotal) * 1000) / 10,
    }))
    .sort((a, b) => b.total - a.total);
}
