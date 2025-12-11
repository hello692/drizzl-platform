import type { NextApiRequest, NextApiResponse } from 'next';
import { sendAgreement } from '../../../../lib/docusignService';
import { logAuditEvent } from '../../../../lib/securityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { partnerId, agreementType, signerEmail, signerName, customFields } = req.body;

    if (!partnerId || !signerEmail || !signerName) {
      return res.status(400).json({ error: 'Missing required fields: partnerId, signerEmail, signerName' });
    }

    const result = await sendAgreement(
      partnerId,
      agreementType || 'retail_partner',
      signerEmail,
      signerName,
      customFields
    );

    if (result.success) {
      await logAuditEvent('agreement_sent', {
        resourceType: 'agreement',
        resourceId: result.agreementId,
        details: {
          partner_id: partnerId,
          envelope_id: result.envelopeId,
          signer_email: signerEmail,
          agreement_type: agreementType
        }
      });
    }

    return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    console.error('[DocuSign Send API] Error:', error);
    return res.status(500).json({ error: 'Failed to send agreement' });
  }
}
