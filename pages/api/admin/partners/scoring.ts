import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { 
  calculatePartnerScore, 
  calculatePartnerScoreWithAI,
  PartnerApplicationData,
  ScoringResult 
} from '../../../../lib/partnerScoringService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Scoring API] Missing required environment variables');
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseAdmin) {
    console.error('[Scoring API] Supabase client not configured - missing service role key');
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }

  const { id, useAI } = req.query;

  if (req.method === 'GET') {
    try {
      if (id && typeof id === 'string') {
        const { data: scoring, error } = await supabaseAdmin
          .from('partner_scoring')
          .select('*')
          .eq('partner_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('[Scoring API] Error fetching score:', error);
        }

        return res.status(200).json({ scoring: scoring || null });
      }

      const { data: allScores, error } = await supabaseAdmin
        .from('partner_scoring')
        .select(`
          *,
          partner:retail_partners(id, company_name, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Scoring API] Error fetching all scores:', error);
        return res.status(200).json({ scores: [] });
      }

      return res.status(200).json({ scores: allScores || [] });

    } catch (error) {
      console.error('[Scoring API] Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { partnerId, forceRecalculate } = req.body;

      if (!partnerId) {
        return res.status(400).json({ error: 'Partner ID is required' });
      }

      const { data: partner, error: partnerError } = await supabaseAdmin
        .from('retail_partners')
        .select('id, application_data, company_name, email')
        .eq('id', partnerId)
        .single();

      if (partnerError || !partner) {
        console.error('[Scoring API] Partner not found:', partnerError);
        return res.status(404).json({ error: 'Partner not found' });
      }

      if (!forceRecalculate) {
        const { data: existingScore } = await supabaseAdmin
          .from('partner_scoring')
          .select('*')
          .eq('partner_id', partnerId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (existingScore) {
          return res.status(200).json({ 
            scoring: existingScore, 
            cached: true 
          });
        }
      }

      const applicationData: PartnerApplicationData = partner.application_data || {};
      
      let result: ScoringResult;
      if (useAI === 'true' && process.env.OPENAI_API_KEY) {
        result = await calculatePartnerScoreWithAI(applicationData);
      } else {
        result = calculatePartnerScore(applicationData);
      }

      const { data: newScoring, error: insertError } = await supabaseAdmin
        .from('partner_scoring')
        .insert({
          partner_id: partnerId,
          score: result.score,
          risk_level: result.riskLevel,
          scoring_factors: result.scoringFactors,
          explanation: result.explanation,
          scored_by: useAI === 'true' ? 'ai' : 'rules',
        })
        .select()
        .single();

      // Always try to update retail_partners with latest score, even if scoring table insert fails
      let partnerUpdateSuccess = false;
      try {
        const { error: updateError } = await supabaseAdmin
          .from('retail_partners')
          .update({
            latest_score: result.score,
            risk_level: result.riskLevel,
            updated_at: new Date().toISOString(),
          })
          .eq('id', partnerId);
        
        partnerUpdateSuccess = !updateError;
        if (updateError) {
          console.log('[Scoring API] Could not update partner with score:', updateError.message);
        }
      } catch (e) {
        console.log('[Scoring API] Partner update failed:', e);
      }

      if (insertError) {
        console.error('[Scoring API] Error saving score to partner_scoring:', insertError);
        // Return the calculated score even if we couldn't persist it to partner_scoring
        return res.status(200).json({ 
          scoring: {
            id: null,
            partner_id: partnerId,
            score: result.score,
            risk_level: result.riskLevel,
            scoring_factors: result.scoringFactors,
            explanation: result.explanation,
            created_at: new Date().toISOString(),
          },
          saved: false,
          partnerUpdated: partnerUpdateSuccess,
          warning: 'Score calculated but could not be saved to history'
        });
      }

      return res.status(200).json({ 
        scoring: newScoring, 
        saved: true,
        partnerUpdated: partnerUpdateSuccess
      });

    } catch (error) {
      console.error('[Scoring API] Error calculating score:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST' && req.url?.includes('batch')) {
    try {
      const { data: pendingPartners, error } = await supabaseAdmin
        .from('retail_partners')
        .select('id, application_data')
        .eq('status', 'pending');

      if (error || !pendingPartners) {
        return res.status(500).json({ error: 'Could not fetch pending partners' });
      }

      const results = [];
      for (const partner of pendingPartners) {
        const applicationData: PartnerApplicationData = partner.application_data || {};
        const result = calculatePartnerScore(applicationData);
        
        await supabaseAdmin
          .from('partner_scoring')
          .insert({
            partner_id: partner.id,
            score: result.score,
            risk_level: result.riskLevel,
            scoring_factors: result.scoringFactors,
            explanation: result.explanation,
            scored_by: 'batch',
          });

        await supabaseAdmin
          .from('retail_partners')
          .update({
            latest_score: result.score,
            risk_level: result.riskLevel,
          })
          .eq('id', partner.id);

        results.push({ partnerId: partner.id, score: result.score });
      }

      return res.status(200).json({ 
        processed: results.length, 
        results 
      });

    } catch (error) {
      console.error('[Scoring API] Batch error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
