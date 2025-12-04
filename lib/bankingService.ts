import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const mercuryApiKey = process.env.MERCURY_API_KEY;
const mercuryBaseUrl = 'https://api.mercury.com/api/v1';

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface BankAccount {
  id: string;
  account_id: string;
  account_name: string;
  account_type: string;
  current_balance_cents: number;
  available_balance_cents: number;
  currency: string;
  bank_name: string;
  status: string;
  last_synced_at?: string;
}

export interface BankTransaction {
  id: string;
  account_id: string;
  external_id: string;
  transaction_type: string;
  amount_cents: number;
  running_balance_cents?: number;
  description: string;
  counterparty_name?: string;
  category?: string;
  status: string;
  posted_at: string;
}

export interface FinancialSnapshot {
  id: string;
  snapshot_date: string;
  total_balance_cents: number;
  total_income_cents: number;
  total_expenses_cents: number;
  net_income_cents: number;
  cash_burn_rate_cents: number;
  runway_days?: number;
  income_by_category: Record<string, number>;
  expenses_by_category: Record<string, number>;
}

export interface FinancialOverview {
  totalBalance: number;
  availableBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netIncome: number;
  burnRate: number;
  runwayDays: number;
  accounts: BankAccount[];
  recentTransactions: BankTransaction[];
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

async function fetchFromMercury(endpoint: string): Promise<any> {
  if (!mercuryApiKey) {
    throw new Error('Mercury API key not configured');
  }
  
  const response = await fetch(`${mercuryBaseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${mercuryApiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Mercury API error: ${response.status}`);
  }
  
  return response.json();
}

export async function syncBankAccounts(): Promise<BankAccount[]> {
  if (!supabaseAdmin) return [];
  
  if (mercuryApiKey) {
    try {
      const { accounts } = await fetchFromMercury('/accounts');
      
      for (const account of accounts) {
        await supabaseAdmin
          .from('bank_accounts')
          .upsert({
            account_id: account.id,
            account_name: account.name,
            account_type: account.type,
            routing_number: account.routingNumber,
            account_number_last4: account.accountNumber?.slice(-4),
            current_balance_cents: Math.round(account.currentBalance * 100),
            available_balance_cents: Math.round(account.availableBalance * 100),
            currency: account.currency || 'USD',
            bank_name: 'Mercury',
            status: account.status,
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'account_id' });
      }
    } catch (error) {
      console.error('[Banking] Error syncing from Mercury:', error);
    }
  }
  
  const { data } = await supabaseAdmin
    .from('bank_accounts')
    .select('*')
    .eq('status', 'active')
    .order('account_name');
  
  return data || [];
}

export async function syncTransactions(accountId: string, startDate?: string, endDate?: string): Promise<BankTransaction[]> {
  if (!supabaseAdmin) return [];
  
  const { data: account } = await supabaseAdmin
    .from('bank_accounts')
    .select('account_id')
    .eq('id', accountId)
    .single();
  
  if (!account) return [];
  
  if (mercuryApiKey && account.account_id) {
    try {
      let url = `/account/${account.account_id}/transactions`;
      const params = new URLSearchParams();
      if (startDate) params.append('start', startDate);
      if (endDate) params.append('end', endDate);
      if (params.toString()) url += `?${params.toString()}`;
      
      const { transactions } = await fetchFromMercury(url);
      
      for (const tx of transactions) {
        await supabaseAdmin
          .from('bank_transactions')
          .upsert({
            account_id: accountId,
            external_id: tx.id,
            transaction_type: tx.amount > 0 ? 'credit' : 'debit',
            amount_cents: Math.round(Math.abs(tx.amount) * 100),
            running_balance_cents: tx.runningBalance ? Math.round(tx.runningBalance * 100) : null,
            description: tx.bankDescription || tx.externalMemo,
            counterparty_name: tx.counterpartyName,
            counterparty_id: tx.counterpartyId,
            category: categorizeTransaction(tx.bankDescription, tx.amount > 0),
            status: tx.status,
            posted_at: tx.postedAt
          }, { onConflict: 'external_id' });
      }
    } catch (error) {
      console.error('[Banking] Error syncing transactions:', error);
    }
  }
  
  let query = supabaseAdmin
    .from('bank_transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('posted_at', { ascending: false })
    .limit(100);
  
  if (startDate) query = query.gte('posted_at', startDate);
  if (endDate) query = query.lte('posted_at', endDate);
  
  const { data } = await query;
  return data || [];
}

function categorizeTransaction(description: string, isCredit: boolean): string {
  const desc = (description || '').toLowerCase();
  
  if (isCredit) {
    if (desc.includes('stripe') || desc.includes('payment')) return 'Sales';
    if (desc.includes('refund')) return 'Refunds';
    if (desc.includes('transfer')) return 'Transfers';
    if (desc.includes('interest')) return 'Interest';
    return 'Other Income';
  } else {
    if (desc.includes('payroll') || desc.includes('salary')) return 'Payroll';
    if (desc.includes('aws') || desc.includes('azure') || desc.includes('google cloud')) return 'Infrastructure';
    if (desc.includes('shopify') || desc.includes('stripe fee')) return 'Platform Fees';
    if (desc.includes('shipping') || desc.includes('usps') || desc.includes('ups') || desc.includes('fedex')) return 'Shipping';
    if (desc.includes('marketing') || desc.includes('facebook') || desc.includes('google ads')) return 'Marketing';
    if (desc.includes('rent') || desc.includes('lease')) return 'Rent';
    if (desc.includes('insurance')) return 'Insurance';
    if (desc.includes('supplies') || desc.includes('packaging')) return 'Supplies';
    if (desc.includes('ingredient') || desc.includes('wholesale')) return 'Inventory';
    return 'Other Expenses';
  }
}

export async function getFinancialOverview(startDate?: string, endDate?: string): Promise<FinancialOverview> {
  const defaultOverview: FinancialOverview = {
    totalBalance: 0,
    availableBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netIncome: 0,
    burnRate: 0,
    runwayDays: 0,
    accounts: [],
    recentTransactions: [],
    incomeByCategory: {},
    expensesByCategory: {}
  };
  
  if (!supabaseAdmin) return defaultOverview;
  
  const accounts = await syncBankAccounts();
  
  if (accounts.length === 0) {
    return getDemoFinancialOverview();
  }
  
  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance_cents, 0);
  const availableBalance = accounts.reduce((sum, a) => sum + a.available_balance_cents, 0);
  
  const now = new Date();
  const monthStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = endDate || now.toISOString();
  
  let allTransactions: BankTransaction[] = [];
  for (const account of accounts) {
    const txs = await syncTransactions(account.id, monthStart, monthEnd);
    allTransactions = allTransactions.concat(txs);
  }
  
  const incomeByCategory: Record<string, number> = {};
  const expensesByCategory: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpenses = 0;
  
  for (const tx of allTransactions) {
    const category = tx.category || 'Uncategorized';
    if (tx.transaction_type === 'credit') {
      totalIncome += tx.amount_cents;
      incomeByCategory[category] = (incomeByCategory[category] || 0) + tx.amount_cents;
    } else {
      totalExpenses += tx.amount_cents;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + tx.amount_cents;
    }
  }
  
  const netIncome = totalIncome - totalExpenses;
  const burnRate = totalExpenses > 0 ? Math.round(totalExpenses / 30) : 0;
  const runwayDays = burnRate > 0 ? Math.round(totalBalance / burnRate) : 999;
  
  return {
    totalBalance,
    availableBalance,
    monthlyIncome: totalIncome,
    monthlyExpenses: totalExpenses,
    netIncome,
    burnRate,
    runwayDays,
    accounts,
    recentTransactions: allTransactions.slice(0, 20),
    incomeByCategory,
    expensesByCategory
  };
}

function getDemoFinancialOverview(): FinancialOverview {
  return {
    totalBalance: 28547623,
    availableBalance: 28547623,
    monthlyIncome: 8234500,
    monthlyExpenses: 5123400,
    netIncome: 3111100,
    burnRate: 170780,
    runwayDays: 167,
    accounts: [
      {
        id: 'demo-checking',
        account_id: 'demo-checking',
        account_name: 'Operating Account',
        account_type: 'checking',
        current_balance_cents: 23547623,
        available_balance_cents: 23547623,
        currency: 'USD',
        bank_name: 'Mercury',
        status: 'active',
        last_synced_at: new Date().toISOString()
      },
      {
        id: 'demo-savings',
        account_id: 'demo-savings',
        account_name: 'Reserve Account',
        account_type: 'savings',
        current_balance_cents: 5000000,
        available_balance_cents: 5000000,
        currency: 'USD',
        bank_name: 'Mercury',
        status: 'active',
        last_synced_at: new Date().toISOString()
      }
    ],
    recentTransactions: [
      { id: '1', account_id: 'demo-checking', external_id: 'tx1', transaction_type: 'credit', amount_cents: 234500, description: 'Stripe Payout', counterparty_name: 'Stripe', category: 'Sales', status: 'posted', posted_at: new Date(Date.now() - 86400000).toISOString() },
      { id: '2', account_id: 'demo-checking', external_id: 'tx2', transaction_type: 'debit', amount_cents: 45000, description: 'AWS Infrastructure', counterparty_name: 'Amazon Web Services', category: 'Infrastructure', status: 'posted', posted_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: '3', account_id: 'demo-checking', external_id: 'tx3', transaction_type: 'credit', amount_cents: 189000, description: 'Stripe Payout', counterparty_name: 'Stripe', category: 'Sales', status: 'posted', posted_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: '4', account_id: 'demo-checking', external_id: 'tx4', transaction_type: 'debit', amount_cents: 125000, description: 'Payroll', counterparty_name: 'Gusto', category: 'Payroll', status: 'posted', posted_at: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: '5', account_id: 'demo-checking', external_id: 'tx5', transaction_type: 'debit', amount_cents: 35000, description: 'Shipping - UPS', counterparty_name: 'UPS', category: 'Shipping', status: 'posted', posted_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
    incomeByCategory: {
      'Sales': 7834500,
      'Refunds': -150000,
      'Interest': 50000,
      'Other Income': 500000
    },
    expensesByCategory: {
      'Payroll': 2500000,
      'Infrastructure': 350000,
      'Shipping': 450000,
      'Marketing': 800000,
      'Inventory': 600000,
      'Platform Fees': 250000,
      'Other Expenses': 173400
    }
  };
}

export async function saveFinancialSnapshot(): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const overview = await getFinancialOverview();
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabaseAdmin
    .from('financial_snapshots')
    .upsert({
      snapshot_date: today,
      total_balance_cents: overview.totalBalance,
      total_income_cents: overview.monthlyIncome,
      total_expenses_cents: overview.monthlyExpenses,
      net_income_cents: overview.netIncome,
      cash_burn_rate_cents: overview.burnRate,
      runway_days: overview.runwayDays,
      income_by_category: overview.incomeByCategory,
      expenses_by_category: overview.expensesByCategory
    }, { onConflict: 'snapshot_date' });
  
  return !error;
}

export async function getHistoricalSnapshots(days: number = 30): Promise<FinancialSnapshot[]> {
  if (!supabaseAdmin) return [];
  
  const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  
  const { data } = await supabaseAdmin
    .from('financial_snapshots')
    .select('*')
    .gte('snapshot_date', startDate)
    .order('snapshot_date', { ascending: true });
  
  return data || [];
}
