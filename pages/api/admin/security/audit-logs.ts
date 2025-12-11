import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuditLogs, logAuditEvent, AuditActionType } from '../../../../lib/securityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { 
        userId, 
        actionType, 
        riskLevel, 
        startDate, 
        endDate, 
        limit, 
        offset 
      } = req.query;

      const result = await getAuditLogs({
        userId: userId as string,
        actionType: actionType as string,
        riskLevel: riskLevel as string,
        startDate: startDate as string,
        endDate: endDate as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('[AuditLogs API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { actionType, userId, resourceType, resourceId, details, status, riskLevel } = req.body;

      if (!actionType) {
        return res.status(400).json({ error: 'Action type required' });
      }

      const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const success = await logAuditEvent(actionType as AuditActionType, {
        userId,
        resourceType,
        resourceId,
        details,
        ipAddress,
        userAgent,
        status,
        riskLevel
      });

      return res.status(200).json({ success });
    } catch (error: any) {
      console.error('[AuditLogs API] Error:', error);
      return res.status(500).json({ error: 'Failed to log event' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
