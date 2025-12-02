import type { NextApiRequest, NextApiResponse } from 'next';
import { mercuryClient, getMockBankingData, MercuryTransaction } from '../../../../lib/mercuryClient';

const isDevelopment = process.env.NODE_ENV === 'development';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isDevelopment) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    if (!mercuryClient.isConfigured()) {
      const mockData = getMockBankingData();
      return res.status(200).json(mockData);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [accounts, allTransactions] = await Promise.all([
      mercuryClient.getAccounts(),
      mercuryClient.getAllTransactions({
        limit: 100,
        start: thirtyDaysAgo.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0],
      }),
    ]);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    const recentTransactions = allTransactions.slice(0, 50);

    const incomingLast30Days = allTransactions
      .filter((tx: MercuryTransaction) => tx.amount > 0)
      .reduce((sum: number, tx: MercuryTransaction) => sum + tx.amount, 0);

    const outgoingLast30Days = allTransactions
      .filter((tx: MercuryTransaction) => tx.amount < 0)
      .reduce((sum: number, tx: MercuryTransaction) => sum + Math.abs(tx.amount), 0);

    const netProfitLoss = incomingLast30Days - outgoingLast30Days;

    const monthlyBurn = outgoingLast30Days;

    const cashRunway = monthlyBurn > 0 ? Math.round(totalBalance / monthlyBurn) : null;

    return res.status(200).json({
      accounts,
      totalBalance,
      recentTransactions,
      incomingLast30Days,
      outgoingLast30Days,
      netProfitLoss,
      monthlyBurn,
      cashRunway,
      isDemo: false,
    });

  } catch (error) {
    console.error('Banking API error:', error);
    
    const mockData = getMockBankingData();
    return res.status(200).json({
      ...mockData,
      error: 'Failed to fetch live data, showing demo data',
    });
  }
}
