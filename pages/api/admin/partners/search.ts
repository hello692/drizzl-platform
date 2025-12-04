import type { NextApiRequest, NextApiResponse } from 'next';
import { searchPartners, decodeQRCode } from '../../../../lib/partnerIntelService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, qr, status, limit } = req.query;

    if (qr && typeof qr === 'string') {
      const decoded = await decodeQRCode(qr);
      if (decoded.valid && decoded.partnerId) {
        const results = await searchPartners(decoded.partnerCode || decoded.partnerId, { limit: 1 });
        return res.status(200).json({ 
          results,
          decoded: { partnerId: decoded.partnerId, partnerCode: decoded.partnerCode }
        });
      }
      return res.status(400).json({ error: 'Invalid QR code' });
    }

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await searchPartners(q, {
      status: status as string,
      limit: limit ? parseInt(limit as string) : 20
    });

    return res.status(200).json({ results });
  } catch (error: any) {
    console.error('[Partner Search API] Error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}
