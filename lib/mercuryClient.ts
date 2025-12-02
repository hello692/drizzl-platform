const MERCURY_BASE_URL = 'https://api.mercury.com/api/v1';

export interface MercuryAccount {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  type: 'checking' | 'savings' | 'treasury';
  status: 'active' | 'inactive' | 'closed';
  currentBalance: number;
  availableBalance: number;
  createdAt: string;
}

export interface MercuryTransaction {
  id: string;
  accountId: string;
  amount: number;
  bankDescription: string;
  counterpartyName: string;
  counterpartyNickname: string | null;
  createdAt: string;
  dashboardLink: string;
  details: {
    domesticWireRoutingInfo?: {
      bankName: string;
      address?: {
        address1: string;
        city: string;
        state: string;
        postalCode: string;
      };
    };
    electronicRoutingInfo?: {
      accountNumber: string;
      routingNumber: string;
    };
  } | null;
  estimatedDeliveryDate: string | null;
  failedAt: string | null;
  kind: 'externalTransfer' | 'internalTransfer' | 'outgoingPayment' | 'incomingPayment' | 'fee' | 'cardTransaction';
  note: string | null;
  externalMemo: string | null;
  postedAt: string | null;
  status: 'pending' | 'sent' | 'cancelled' | 'failed' | 'completed';
}

export interface MercuryTreasury {
  id: string;
  accountId: string;
  balance: number;
  apy: number;
  status: 'active' | 'inactive';
}

export interface MercuryRecipient {
  id: string;
  name: string;
  nickname: string | null;
  emails: string[];
  paymentMethod: 'ach' | 'domesticWire' | 'internationalWire' | 'check';
  status: 'active' | 'inactive';
  electronicRoutingInfo?: {
    accountNumber: string;
    routingNumber: string;
    bankName?: string;
  };
}

export interface MercuryAccountsResponse {
  accounts: MercuryAccount[];
}

export interface MercuryTransactionsResponse {
  transactions: MercuryTransaction[];
  total: number;
}

export interface MercuryTreasuryResponse {
  treasuryAccounts: MercuryTreasury[];
}

export interface MercuryRecipientsResponse {
  recipients: MercuryRecipient[];
}

export interface TransactionParams {
  limit?: number;
  offset?: number;
  status?: 'pending' | 'sent' | 'cancelled' | 'failed' | 'completed';
  start?: string;
  end?: string;
}

class MercuryClient {
  private apiKey: string | null;

  constructor() {
    this.apiKey = process.env.MERCURY_API_KEY || null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('MERCURY_API_KEY not configured');
    }

    const response = await fetch(`${MERCURY_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mercury API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async getAccounts(): Promise<MercuryAccount[]> {
    const data = await this.request<MercuryAccountsResponse>('/accounts');
    return data.accounts || [];
  }

  async getTransactions(accountId: string, params: TransactionParams = {}): Promise<MercuryTransactionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.start) queryParams.append('start', params.start);
    if (params.end) queryParams.append('end', params.end);

    const queryString = queryParams.toString();
    const endpoint = `/account/${accountId}/transactions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<MercuryTransactionsResponse>(endpoint);
  }

  async getAllTransactions(params: TransactionParams = {}): Promise<MercuryTransaction[]> {
    const accounts = await this.getAccounts();
    const allTransactions: MercuryTransaction[] = [];

    for (const account of accounts) {
      try {
        const response = await this.getTransactions(account.id, params);
        allTransactions.push(...response.transactions);
      } catch (error) {
        console.error(`Error fetching transactions for account ${account.id}:`, error);
      }
    }

    return allTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTreasury(): Promise<MercuryTreasury[]> {
    const data = await this.request<MercuryTreasuryResponse>('/treasury');
    return data.treasuryAccounts || [];
  }

  async getRecipients(): Promise<MercuryRecipient[]> {
    const data = await this.request<MercuryRecipientsResponse>('/recipients');
    return data.recipients || [];
  }
}

export const mercuryClient = new MercuryClient();

export function getMockBankingData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const mockAccounts: MercuryAccount[] = [
    {
      id: 'demo-checking-1',
      name: 'Operating Account',
      accountNumber: '****4521',
      routingNumber: '****0001',
      type: 'checking',
      status: 'active',
      currentBalance: 247832.50,
      availableBalance: 245000.00,
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'demo-savings-1',
      name: 'Reserve Account',
      accountNumber: '****4522',
      routingNumber: '****0001',
      type: 'savings',
      status: 'active',
      currentBalance: 125000.00,
      availableBalance: 125000.00,
      createdAt: '2024-01-15T00:00:00Z',
    },
  ];

  const mockTransactions: MercuryTransaction[] = [
    {
      id: 'demo-tx-1',
      accountId: 'demo-checking-1',
      amount: 15420.00,
      bankDescription: 'Shopify Payout',
      counterpartyName: 'Shopify Inc',
      counterpartyNickname: 'Shopify',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'incomingPayment',
      note: null,
      externalMemo: 'Weekly payout',
      postedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-2',
      accountId: 'demo-checking-1',
      amount: -3250.00,
      bankDescription: 'Gusto Payroll',
      counterpartyName: 'Gusto',
      counterpartyNickname: 'Payroll',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'outgoingPayment',
      note: null,
      externalMemo: 'Bi-weekly payroll',
      postedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-3',
      accountId: 'demo-checking-1',
      amount: 8750.00,
      bankDescription: 'Wire Transfer',
      counterpartyName: 'Whole Foods Market',
      counterpartyNickname: 'WFM',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'incomingPayment',
      note: null,
      externalMemo: 'B2B Order #1247',
      postedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-4',
      accountId: 'demo-checking-1',
      amount: -1850.00,
      bankDescription: 'AWS Services',
      counterpartyName: 'Amazon Web Services',
      counterpartyNickname: 'AWS',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'outgoingPayment',
      note: null,
      externalMemo: 'Monthly infrastructure',
      postedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-5',
      accountId: 'demo-checking-1',
      amount: 12340.00,
      bankDescription: 'Stripe Payout',
      counterpartyName: 'Stripe Payments',
      counterpartyNickname: 'Stripe',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'incomingPayment',
      note: null,
      externalMemo: 'Weekly payout',
      postedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-6',
      accountId: 'demo-checking-1',
      amount: -5400.00,
      bankDescription: 'Supplier Payment',
      counterpartyName: 'Fresh Farms Co',
      counterpartyNickname: 'Fresh Farms',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'outgoingPayment',
      note: null,
      externalMemo: 'Invoice #FF-2024-089',
      postedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-7',
      accountId: 'demo-checking-1',
      amount: 6250.00,
      bankDescription: 'Partner Payment',
      counterpartyName: 'Sprouts Farmers Market',
      counterpartyNickname: 'Sprouts',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'incomingPayment',
      note: null,
      externalMemo: 'B2B Order #1198',
      postedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-tx-8',
      accountId: 'demo-checking-1',
      amount: -890.00,
      bankDescription: 'Software Subscription',
      counterpartyName: 'Notion Labs',
      counterpartyNickname: 'Notion',
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      dashboardLink: '#',
      details: null,
      estimatedDeliveryDate: null,
      failedAt: null,
      kind: 'outgoingPayment',
      note: null,
      externalMemo: 'Annual subscription',
      postedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
  ];

  const incomingLast30Days = mockTransactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const outgoingLast30Days = mockTransactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  const monthlyBurn = outgoingLast30Days;
  const cashRunway = monthlyBurn > 0 ? Math.round(totalBalance / monthlyBurn) : null;

  return {
    accounts: mockAccounts,
    totalBalance,
    recentTransactions: mockTransactions,
    incomingLast30Days,
    outgoingLast30Days,
    netProfitLoss: incomingLast30Days - outgoingLast30Days,
    monthlyBurn,
    cashRunway,
    isDemo: true,
  };
}
