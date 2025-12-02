import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateMockProductionBatches,
  generateMockBurnRates,
  generateMockProductionMetrics,
  generateRestockAlerts,
  ProductionBatch,
  BurnRateData,
  ProductionMetrics,
} from '../../../../lib/inventoryService';

interface FactoryResponse {
  success: boolean;
  data?: {
    batches: ProductionBatch[];
    burnRates: BurnRateData[];
    metrics: ProductionMetrics;
    restockAlerts: { ingredient: string; daysLeft: number; urgency: 'critical' | 'warning' | 'info' }[];
    recentBatches: ProductionBatch[];
    productionGoals: {
      product: string;
      goal: number;
      actual: number;
    }[];
    shifts: {
      name: string;
      status: 'active' | 'upcoming' | 'completed';
      workers: number;
      startTime: string;
      endTime: string;
    }[];
  };
  error?: string;
}

let mockBatches: ProductionBatch[] | null = null;
let mockBurnRates: BurnRateData[] | null = null;
let mockMetrics: ProductionMetrics | null = null;

function initializeMockData() {
  if (!mockBatches) {
    mockBatches = generateMockProductionBatches();
  }
  if (!mockBurnRates) {
    mockBurnRates = generateMockBurnRates();
  }
  if (!mockMetrics) {
    mockMetrics = generateMockProductionMetrics();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FactoryResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }

  initializeMockData();

  const restockAlerts = generateRestockAlerts();

  const recentBatches = [...mockBatches!]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  const products = ['Berry Blast Smoothie', 'Green Power Bowl', 'Tropical Sunrise', 'Chocolate Protein Shake', 'Acai Supreme Bowl'];
  const productionGoals = products.map(product => {
    const goal = Math.floor(Math.random() * 300) + 100;
    const actual = Math.floor(goal * (0.7 + Math.random() * 0.4));
    return { product, goal, actual };
  });

  const now = new Date();
  const shifts = [
    {
      name: 'Morning Shift',
      status: 'completed' as const,
      workers: 12,
      startTime: '6:00 AM',
      endTime: '2:00 PM',
    },
    {
      name: 'Afternoon Shift',
      status: 'active' as const,
      workers: 10,
      startTime: '2:00 PM',
      endTime: '10:00 PM',
    },
    {
      name: 'Night Shift',
      status: 'upcoming' as const,
      workers: 8,
      startTime: '10:00 PM',
      endTime: '6:00 AM',
    },
  ];

  const hour = now.getHours();
  if (hour >= 6 && hour < 14) {
    shifts[0].status = 'active';
    shifts[1].status = 'upcoming';
    shifts[2].status = 'completed';
  } else if (hour >= 14 && hour < 22) {
    shifts[0].status = 'completed';
    shifts[1].status = 'active';
    shifts[2].status = 'upcoming';
  } else {
    shifts[0].status = 'upcoming';
    shifts[1].status = 'completed';
    shifts[2].status = 'active';
  }

  return res.status(200).json({
    success: true,
    data: {
      batches: mockBatches!,
      burnRates: mockBurnRates!,
      metrics: mockMetrics!,
      restockAlerts,
      recentBatches,
      productionGoals,
      shifts,
    },
  });
}
