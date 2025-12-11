import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const docusignApiKey = process.env.DOCUSIGN_API_KEY;
const docusignAccountId = process.env.DOCUSIGN_ACCOUNT_ID;
const docusignBaseUrl = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi';

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface AgreementTemplate {
  id: string;
  name: string;
  description?: string;
  document_base64?: string;
  template_id?: string;
}

export interface Agreement {
  id: string;
  partner_id: string;
  agreement_type: string;
  envelope_id?: string;
  envelope_status?: string;
  signer_email: string;
  signer_name: string;
  sent_at?: string;
  viewed_at?: string;
  signed_at?: string;
  declined_at?: string;
  decline_reason?: string;
  document_url?: string;
  completed_document_url?: string;
  created_at: string;
}

export type EnvelopeStatus = 
  | 'created' 
  | 'sent' 
  | 'delivered' 
  | 'signed' 
  | 'completed' 
  | 'declined' 
  | 'voided';

const DEFAULT_AGREEMENT_TEMPLATE = `
DRIZZL WELLNESS RETAIL PARTNER AGREEMENT

This Retail Partner Agreement ("Agreement") is entered into as of {{date}} between:

Drizzl Wellness Plantonica Inc. ("Company")
and
{{partner_name}} ("Partner")

1. APPOINTMENT
Company hereby appoints Partner as a non-exclusive retail partner to sell Company's products within the territory specified.

2. TERMS AND CONDITIONS
- Partner agrees to maintain product quality and brand standards
- Partner will provide monthly sales reports
- Partner agrees to minimum order quantities as specified
- Partner will not modify or rebrand Company products

3. PRICING AND PAYMENT
- Wholesale pricing as specified in the current price list
- Net 30 payment terms
- Late payments subject to 1.5% monthly interest

4. TERM
This Agreement shall be effective for one (1) year from the date of execution and shall automatically renew for successive one-year terms unless terminated by either party with 30 days written notice.

5. CONFIDENTIALITY
Partner agrees to maintain confidentiality of all pricing, business practices, and proprietary information.

SIGNATURES:

Partner: _______________________ Date: _________
Company: ______________________ Date: _________
`;

function generateEnvelopeId(): string {
  return `ENV-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function sendAgreement(
  partnerId: string,
  agreementType: string,
  signerEmail: string,
  signerName: string,
  customFields?: Record<string, string>
): Promise<{ success: boolean; agreementId?: string; envelopeId?: string; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const envelopeId = generateEnvelopeId();
    
    const { data: agreement, error: insertError } = await supabaseAdmin
      .from('partner_agreements')
      .insert({
        partner_id: partnerId,
        agreement_type: agreementType,
        envelope_id: envelopeId,
        envelope_status: 'sent',
        signer_email: signerEmail,
        signer_name: signerName,
        sent_at: new Date().toISOString(),
        status: 'sent'
      })
      .select()
      .single();

    if (insertError) {
      console.error('[DocuSign] Error creating agreement:', insertError);
      return { success: false, error: 'Failed to create agreement record' };
    }

    if (docusignApiKey && docusignAccountId) {
      try {
        const result = await sendToDocuSign(envelopeId, signerEmail, signerName, agreementType, customFields);
        if (result.realEnvelopeId) {
          await supabaseAdmin
            .from('partner_agreements')
            .update({ envelope_id: result.realEnvelopeId })
            .eq('id', agreement.id);
        }
      } catch (docuError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[DocuSign] API not configured, using demo mode');
        }
      }
    }

    await logDocuSignEvent(envelopeId, 'envelope_sent', {
      partner_id: partnerId,
      signer_email: signerEmail,
      agreement_type: agreementType
    });

    return { 
      success: true, 
      agreementId: agreement.id, 
      envelopeId 
    };
  } catch (error: any) {
    console.error('[DocuSign] Error sending agreement:', error);
    return { success: false, error: error.message };
  }
}

async function sendToDocuSign(
  envelopeId: string,
  signerEmail: string,
  signerName: string,
  agreementType: string,
  customFields?: Record<string, string>
): Promise<{ realEnvelopeId?: string }> {
  const document = DEFAULT_AGREEMENT_TEMPLATE
    .replace('{{date}}', new Date().toLocaleDateString())
    .replace('{{partner_name}}', signerName);

  const documentBase64 = Buffer.from(document).toString('base64');

  const envelopeDefinition = {
    emailSubject: `Drizzl Wellness Partner Agreement - ${agreementType}`,
    documents: [{
      documentBase64,
      name: `${agreementType}_agreement.txt`,
      fileExtension: 'txt',
      documentId: '1'
    }],
    recipients: {
      signers: [{
        email: signerEmail,
        name: signerName,
        recipientId: '1',
        routingOrder: '1',
        tabs: {
          signHereTabs: [{
            documentId: '1',
            pageNumber: '1',
            xPosition: '100',
            yPosition: '700'
          }],
          dateSignedTabs: [{
            documentId: '1',
            pageNumber: '1',
            xPosition: '300',
            yPosition: '700'
          }]
        }
      }]
    },
    status: 'sent'
  };

  const response = await fetch(
    `${docusignBaseUrl}/v2.1/accounts/${docusignAccountId}/envelopes`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${docusignApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelopeDefinition)
    }
  );

  if (!response.ok) {
    throw new Error(`DocuSign API error: ${response.status}`);
  }

  const result = await response.json();
  return { realEnvelopeId: result.envelopeId };
}

export async function getAgreementStatus(envelopeId: string): Promise<Agreement | null> {
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from('partner_agreements')
    .select('*')
    .eq('envelope_id', envelopeId)
    .single();

  return data;
}

export async function getPartnerAgreements(partnerId: string): Promise<Agreement[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from('partner_agreements')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function processWebhook(
  envelopeId: string,
  eventType: string,
  eventData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    await logDocuSignEvent(envelopeId, eventType, eventData);

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    switch (eventType) {
      case 'envelope-sent':
        updates.envelope_status = 'sent';
        updates.sent_at = new Date().toISOString();
        break;
      
      case 'envelope-delivered':
        updates.envelope_status = 'delivered';
        updates.viewed_at = new Date().toISOString();
        break;
      
      case 'envelope-completed':
      case 'recipient-completed':
        updates.envelope_status = 'completed';
        updates.signed_at = new Date().toISOString();
        updates.status = 'signed';
        if (eventData.completed_document_url) {
          updates.completed_document_url = eventData.completed_document_url;
        }
        await triggerOnboarding(envelopeId);
        break;
      
      case 'envelope-declined':
      case 'recipient-declined':
        updates.envelope_status = 'declined';
        updates.declined_at = new Date().toISOString();
        updates.status = 'declined';
        updates.decline_reason = eventData.decline_reason || 'No reason provided';
        break;
      
      case 'envelope-voided':
        updates.envelope_status = 'voided';
        updates.voided_at = new Date().toISOString();
        updates.void_reason = eventData.void_reason;
        updates.status = 'voided';
        break;
    }

    const { error } = await supabaseAdmin
      .from('partner_agreements')
      .update(updates)
      .eq('envelope_id', envelopeId);

    if (error) {
      console.error('[DocuSign] Error updating agreement:', error);
      return { success: false, error: 'Failed to update agreement' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[DocuSign] Webhook processing error:', error);
    return { success: false, error: error.message };
  }
}

async function triggerOnboarding(envelopeId: string): Promise<void> {
  if (!supabaseAdmin) return;

  const { data: agreement } = await supabaseAdmin
    .from('partner_agreements')
    .select('partner_id')
    .eq('envelope_id', envelopeId)
    .single();

  if (!agreement) return;

  await supabaseAdmin
    .from('retail_partners')
    .update({
      agreement_status: 'signed',
      is_onboarded: true,
      onboarded_at: new Date().toISOString(),
      status: 'approved',
      updated_at: new Date().toISOString()
    })
    .eq('id', agreement.partner_id);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DocuSign] Partner ${agreement.partner_id} onboarding triggered`);
  }
}

export async function voidEnvelope(
  envelopeId: string,
  voidReason: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    if (docusignApiKey && docusignAccountId) {
      const response = await fetch(
        `${docusignBaseUrl}/v2.1/accounts/${docusignAccountId}/envelopes/${envelopeId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${docusignApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'voided',
            voidedReason: voidReason
          })
        }
      );

      if (!response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[DocuSign] API void failed, updating local record only');
        }
      }
    }

    await supabaseAdmin
      .from('partner_agreements')
      .update({
        envelope_status: 'voided',
        voided_at: new Date().toISOString(),
        void_reason: voidReason,
        status: 'voided',
        updated_at: new Date().toISOString()
      })
      .eq('envelope_id', envelopeId);

    await logDocuSignEvent(envelopeId, 'envelope-voided', { void_reason: voidReason });

    return { success: true };
  } catch (error: any) {
    console.error('[DocuSign] Error voiding envelope:', error);
    return { success: false, error: error.message };
  }
}

export async function resendEnvelope(envelopeId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { data: agreement } = await supabaseAdmin
      .from('partner_agreements')
      .select('*')
      .eq('envelope_id', envelopeId)
      .single();

    if (!agreement) {
      return { success: false, error: 'Agreement not found' };
    }

    if (docusignApiKey && docusignAccountId) {
      await fetch(
        `${docusignBaseUrl}/v2.1/accounts/${docusignAccountId}/envelopes/${envelopeId}?resend_envelope=true`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${docusignApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    await supabaseAdmin
      .from('partner_agreements')
      .update({
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('envelope_id', envelopeId);

    await logDocuSignEvent(envelopeId, 'envelope-resent', {});

    return { success: true };
  } catch (error: any) {
    console.error('[DocuSign] Error resending envelope:', error);
    return { success: false, error: error.message };
  }
}

async function logDocuSignEvent(
  envelopeId: string,
  eventType: string,
  eventData: Record<string, any>
): Promise<void> {
  if (!supabaseAdmin) return;

  await supabaseAdmin
    .from('docusign_events')
    .insert({
      envelope_id: envelopeId,
      event_type: eventType,
      event_data: eventData
    });
}

export async function simulateSignature(envelopeId: string): Promise<{ success: boolean; error?: string }> {
  return processWebhook(envelopeId, 'envelope-completed', {
    simulated: true,
    signed_at: new Date().toISOString()
  });
}

export async function simulateDecline(envelopeId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  return processWebhook(envelopeId, 'envelope-declined', {
    simulated: true,
    decline_reason: reason
  });
}
