import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  getPartnerAgreements, 
  getAgreementStatus, 
  voidEnvelope, 
  resendEnvelope,
  simulateSignature,
  simulateDecline
} from '../../../../lib/docusignService';
import { logAuditEvent } from '../../../../lib/securityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  const { partnerId, envelopeId, action } = req.query;

  if (req.method === 'GET') {
    try {
      if (envelopeId && typeof envelopeId === 'string') {
        const agreement = await getAgreementStatus(envelopeId);
        if (!agreement) {
          return res.status(404).json({ error: 'Agreement not found' });
        }
        return res.status(200).json({ agreement });
      }

      if (partnerId && typeof partnerId === 'string') {
        const agreements = await getPartnerAgreements(partnerId);
        return res.status(200).json({ agreements });
      }

      return res.status(400).json({ error: 'Partner ID or Envelope ID required' });
    } catch (error: any) {
      console.error('[Agreements API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch agreements' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (!envelopeId || typeof envelopeId !== 'string') {
        return res.status(400).json({ error: 'Envelope ID required' });
      }

      if (action === 'void') {
        const { reason } = req.body;
        const result = await voidEnvelope(envelopeId, reason || 'Voided by admin');
        
        if (result.success) {
          await logAuditEvent('admin_action', {
            resourceType: 'agreement',
            resourceId: envelopeId,
            details: { action: 'void', reason }
          });
        }
        
        return res.status(200).json(result);
      }

      if (action === 'resend') {
        const result = await resendEnvelope(envelopeId);
        
        if (result.success) {
          await logAuditEvent('agreement_sent', {
            resourceType: 'agreement',
            resourceId: envelopeId,
            details: { action: 'resend' }
          });
        }
        
        return res.status(200).json(result);
      }

      if (action === 'simulate-sign') {
        const result = await simulateSignature(envelopeId);
        return res.status(200).json(result);
      }

      if (action === 'simulate-decline') {
        const { reason } = req.body;
        const result = await simulateDecline(envelopeId, reason || 'Declined in demo');
        return res.status(200).json(result);
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[Agreements API] Error:', error);
      return res.status(500).json({ error: 'Action failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
