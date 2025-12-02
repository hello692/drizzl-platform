import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateMockSocialData,
  SocialData,
} from '../../../../lib/socialService';

interface SocialResponse {
  success: boolean;
  data?: SocialData;
  error?: string;
}

let cachedData: SocialData | null = null;

function initializeMockData(): SocialData {
  if (!cachedData) {
    cachedData = generateMockSocialData();
  }
  return cachedData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SocialResponse>
) {
  if (req.method === 'GET') {
    try {
      const data = initializeMockData();
      
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error fetching social data:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch social data',
      });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}
