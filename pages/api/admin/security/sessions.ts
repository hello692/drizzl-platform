import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveSessions, terminateSession, terminateAllSessions } from '../../../../lib/securityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  const { userId, sessionId } = req.query;

  if (req.method === 'GET') {
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID required' });
    }

    try {
      const sessions = await getActiveSessions(userId);
      return res.status(200).json({ sessions });
    } catch (error: any) {
      console.error('[Sessions API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }

  if (req.method === 'DELETE') {
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID required' });
    }

    try {
      if (sessionId && typeof sessionId === 'string') {
        const success = await terminateSession(sessionId, userId);
        return res.status(200).json({ success });
      } else {
        const { exceptCurrent } = req.body || {};
        const success = await terminateAllSessions(userId, exceptCurrent);
        return res.status(200).json({ success, message: 'All sessions terminated' });
      }
    } catch (error: any) {
      console.error('[Sessions API] Error:', error);
      return res.status(500).json({ error: 'Failed to terminate session(s)' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
