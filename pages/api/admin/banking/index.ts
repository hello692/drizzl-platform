import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  getFinancialOverview,
  syncBankAccounts,
  syncTransactions,
  saveFinancialSnapshot,
  getHistoricalSnapshots
} from '../../../../lib/bankingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  const { action, accountId } = req.query;

  if (req.method === 'GET') {
    try {
      if (action === 'overview') {
        const { startDate, endDate } = req.query;
        const overview = await getFinancialOverview(
          startDate as string,
          endDate as string
        );
        return res.status(200).json(overview);
      }

      if (action === 'accounts') {
        const accounts = await syncBankAccounts();
        return res.status(200).json({ accounts });
      }

      if (action === 'transactions') {
        if (!accountId || typeof accountId !== 'string') {
          return res.status(400).json({ error: 'Account ID required' });
        }
        const { startDate, endDate } = req.query;
        const transactions = await syncTransactions(
          accountId,
          startDate as string,
          endDate as string
        );
        return res.status(200).json({ transactions });
      }

      if (action === 'history') {
        const { days } = req.query;
        const snapshots = await getHistoricalSnapshots(
          days ? parseInt(days as string) : 30
        );
        return res.status(200).json({ snapshots });
      }

      const overview = await getFinancialOverview();
      return res.status(200).json({
        accounts: overview.accounts,
        totalBalance: overview.totalBalance / 100,
        recentTransactions: overview.recentTransactions.map(tx => ({
          ...tx,
          amount: tx.amount_cents / 100
        })),
        incomingLast30Days: overview.monthlyIncome / 100,
        outgoingLast30Days: overview.monthlyExpenses / 100,
        netProfitLoss: overview.netIncome / 100,
        monthlyBurn: overview.burnRate / 100,
        cashRunway: overview.runwayDays,
        isDemo: overview.accounts.length === 0 || overview.accounts[0]?.account_id?.startsWith('demo'),
        incomeByCategory: overview.incomeByCategory,
        expensesByCategory: overview.expensesByCategory
      });
    } catch (error: any) {
      console.error('[Banking API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch banking data' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (action === 'sync') {
        const accounts = await syncBankAccounts();
        return res.status(200).json({ success: true, accounts });
      }

      if (action === 'snapshot') {
        const success = await saveFinancialSnapshot();
        return res.status(200).json({ success });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[Banking API] Error:', error);
      return res.status(500).json({ error: 'Action failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
