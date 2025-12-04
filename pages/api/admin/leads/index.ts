import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  getLeads,
  getLead,
  createLead,
  updateLead,
  updateLeadStage,
  addLeadActivity,
  getLeadActivities,
  scheduleMeeting,
  getLeadMeetings,
  getUpcomingMeetings,
  convertLeadToPartner,
  getPipelineStats,
  getLeadsByStage,
  PIPELINE_STAGES,
  PipelineStage
} from '../../../../lib/leadService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  const { action, leadId } = req.query;

  if (req.method === 'GET') {
    try {
      if (action === 'stages') {
        return res.status(200).json({ stages: PIPELINE_STAGES });
      }

      if (action === 'stats') {
        const stats = await getPipelineStats();
        return res.status(200).json({ stats });
      }

      if (action === 'pipeline') {
        const leadsByStage = await getLeadsByStage();
        return res.status(200).json({ pipeline: leadsByStage });
      }

      if (action === 'upcoming-meetings') {
        const { limit } = req.query;
        const meetings = await getUpcomingMeetings(limit ? parseInt(limit as string) : 10);
        return res.status(200).json({ meetings });
      }

      if (leadId && typeof leadId === 'string') {
        if (action === 'activities') {
          const activities = await getLeadActivities(leadId);
          return res.status(200).json({ activities });
        }

        if (action === 'meetings') {
          const meetings = await getLeadMeetings(leadId);
          return res.status(200).json({ meetings });
        }

        const lead = await getLead(leadId);
        if (!lead) {
          return res.status(404).json({ error: 'Lead not found' });
        }
        return res.status(200).json({ lead });
      }

      const { stage, assignedTo, search, limit, offset } = req.query;
      const result = await getLeads({
        stage: stage as PipelineStage,
        assignedTo: assignedTo as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('[Leads API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (leadId && typeof leadId === 'string') {
        if (action === 'update-stage') {
          const { stage } = req.body;
          if (!stage) {
            return res.status(400).json({ error: 'Stage required' });
          }
          const success = await updateLeadStage(leadId, stage as PipelineStage);
          return res.status(200).json({ success });
        }

        if (action === 'add-activity') {
          const activity = await addLeadActivity(leadId, req.body);
          return res.status(200).json({ activity });
        }

        if (action === 'schedule-meeting') {
          const meeting = await scheduleMeeting(leadId, req.body);
          return res.status(200).json({ meeting });
        }

        if (action === 'convert') {
          const result = await convertLeadToPartner(leadId);
          return res.status(200).json(result);
        }

        const success = await updateLead(leadId, req.body);
        return res.status(200).json({ success });
      }

      const lead = await createLead(req.body);
      if (!lead) {
        return res.status(500).json({ error: 'Failed to create lead' });
      }
      return res.status(201).json({ lead });
    } catch (error: any) {
      console.error('[Leads API] Error:', error);
      return res.status(500).json({ error: 'Action failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
