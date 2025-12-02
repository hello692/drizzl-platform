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

  const { 
    limit = '50', 
    offset = '0', 
    type, 
    startDate, 
    endDate 
  } = req.query;

  const limitNum = parseInt(limit as string, 10);
  const offsetNum = parseInt(offset as string, 10);

  try {
    if (!mercuryClient.isConfigured()) {
      const mockData = getMockBankingData();
      let transactions = mockData.recentTransactions;

      if (type === 'credit') {
        transactions = transactions.filter(tx => tx.amount > 0);
      } else if (type === 'debit') {
        transactions = transactions.filter(tx => tx.amount < 0);
      }

      if (startDate) {
        const start = new Date(startDate as string);
        transactions = transactions.filter(tx => new Date(tx.createdAt) >= start);
      }

      if (endDate) {
        const end = new Date(endDate as string);
        transactions = transactions.filter(tx => new Date(tx.createdAt) <= end);
      }

      const paginatedTransactions = transactions.slice(offsetNum, offsetNum + limitNum);

      return res.status(200).json({
        transactions: paginatedTransactions,
        total: transactions.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < transactions.length,
        isDemo: true,
      });
    }

    const params: {
      limit: number;
      offset: number;
      start?: string;
      end?: string;
    } = {
      limit: limitNum,
      offset: offsetNum,
    };

    if (startDate) {
      params.start = startDate as string;
    }

    if (endDate) {
      params.end = endDate as string;
    }

    let transactions = await mercuryClient.getAllTransactions(params);

    if (type === 'credit') {
      transactions = transactions.filter((tx: MercuryTransaction) => tx.amount > 0);
    } else if (type === 'debit') {
      transactions = transactions.filter((tx: MercuryTransaction) => tx.amount < 0);
    }

    const paginatedTransactions = transactions.slice(offsetNum, offsetNum + limitNum);

    return res.status(200).json({
      transactions: paginatedTransactions,
      total: transactions.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < transactions.length,
      isDemo: false,
    });

  } catch (error) {
    console.error('Transactions API error:', error);
    
    const mockData = getMockBankingData();
    return res.status(200).json({
      transactions: mockData.recentTransactions.slice(offsetNum, offsetNum + limitNum),
      total: mockData.recentTransactions.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: false,
      isDemo: true,
      error: 'Failed to fetch live data, showing demo data',
    });
  }
}
