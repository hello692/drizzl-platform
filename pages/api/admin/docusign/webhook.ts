import type { NextApiRequest, NextApiResponse } from 'next';
import { processWebhook } from '../../../../lib/docusignService';
import crypto from 'crypto';

const DOCUSIGN_HMAC_KEY = process.env.DOCUSIGN_HMAC_KEY;

function verifyHMAC(payload: string, signature: string): boolean {
  if (!DOCUSIGN_HMAC_KEY) return true;
  
  const computedSignature = crypto
    .createHmac('sha256', DOCUSIGN_HMAC_KEY)
    .update(payload)
    .digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-docusign-signature-1'] as string;
    const rawBody = JSON.stringify(req.body);

    if (DOCUSIGN_HMAC_KEY && signature) {
      if (!verifyHMAC(rawBody, signature)) {
        console.error('[DocuSign Webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { event, data } = req.body;

    if (!event) {
      const envelopeStatus = req.body.envelopeStatus || req.body.EnvelopeStatus;
      const envelopeId = req.body.envelopeId || req.body.EnvelopeId;
      
      if (envelopeStatus && envelopeId) {
        const eventType = `envelope-${envelopeStatus.toLowerCase()}`;
        const result = await processWebhook(envelopeId, eventType, req.body);
        return res.status(200).json(result);
      }
      
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const envelopeId = data?.envelopeId || data?.EnvelopeId;
    if (!envelopeId) {
      return res.status(400).json({ error: 'Missing envelope ID' });
    }

    const result = await processWebhook(envelopeId, event, data);
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[DocuSign Webhook] Error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
