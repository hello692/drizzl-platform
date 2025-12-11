import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export type PipelineStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export const PIPELINE_STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Leads', color: '#6366f1' },
  { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
  { id: 'qualified', label: 'Qualified', color: '#06b6d4' },
  { id: 'proposal', label: 'Proposal Sent', color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'closed_won', label: 'Closed Won', color: '#22c55e' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef4444' }
];

export interface Lead {
  id: string;
  lead_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  company_type?: string;
  website?: string;
  source?: string;
  status: string;
  pipeline_stage: PipelineStage;
  assigned_to?: string;
  assigned_user?: { id: string; name: string; email: string };
  score: number;
  tags: string[];
  notes?: string;
  last_contacted_at?: string;
  converted_at?: string;
  converted_to_partner_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  subject?: string;
  description?: string;
  outcome?: string;
  performed_by?: string;
  performer?: { id: string; name: string };
  scheduled_at?: string;
  completed_at?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface LeadMeeting {
  id: string;
  lead_id: string;
  calendar_event_id?: string;
  meeting_type: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  meeting_link?: string;
  location?: string;
  attendees: { email: string; name?: string; status?: string }[];
  status: string;
  outcome?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export async function getLeads(options: {
  stage?: PipelineStage;
  assignedTo?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ leads: Lead[]; total: number }> {
  if (!supabaseAdmin) return { leads: [], total: 0 };
  
  let query = supabaseAdmin
    .from('leads')
    .select(`
      *,
      assigned_user:assigned_to (id, name, email)
    `, { count: 'exact' });
  
  if (options.stage) query = query.eq('pipeline_stage', options.stage);
  if (options.assignedTo) query = query.eq('assigned_to', options.assignedTo);
  if (options.search) {
    query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%,company_name.ilike.%${options.search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  
  const { data, count, error } = await query;
  
  if (error) {
    console.error('[LeadService] Error fetching leads:', error);
    return { leads: [], total: 0 };
  }
  
  return { leads: data || [], total: count || 0 };
}

export async function getLead(leadId: string): Promise<Lead | null> {
  if (!supabaseAdmin) return null;
  
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select(`
      *,
      assigned_user:assigned_to (id, name, email)
    `)
    .eq('id', leadId)
    .single();
  
  if (error) {
    console.error('[LeadService] Error fetching lead:', error);
    return null;
  }
  
  return data;
}

export async function createLead(lead: Partial<Lead>): Promise<Lead | null> {
  if (!supabaseAdmin) return null;
  
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      company_name: lead.company_name,
      company_type: lead.company_type,
      website: lead.website,
      source: lead.source || 'manual',
      status: 'active',
      pipeline_stage: 'new',
      assigned_to: lead.assigned_to,
      score: lead.score || 0,
      tags: lead.tags || [],
      notes: lead.notes,
      metadata: lead.metadata || {}
    })
    .select()
    .single();
  
  if (error) {
    console.error('[LeadService] Error creating lead:', error);
    return null;
  }
  
  return data;
}

export async function updateLead(leadId: string, updates: Partial<Lead>): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { error } = await supabaseAdmin
    .from('leads')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId);
  
  if (error) {
    console.error('[LeadService] Error updating lead:', error);
    return false;
  }
  
  return true;
}

export async function updateLeadStage(leadId: string, stage: PipelineStage): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const updates: any = {
    pipeline_stage: stage,
    updated_at: new Date().toISOString()
  };
  
  if (stage === 'closed_won' || stage === 'closed_lost') {
    updates.status = stage === 'closed_won' ? 'converted' : 'lost';
    if (stage === 'closed_won') {
      updates.converted_at = new Date().toISOString();
    }
  }
  
  const { error } = await supabaseAdmin
    .from('leads')
    .update(updates)
    .eq('id', leadId);
  
  if (error) {
    console.error('[LeadService] Error updating stage:', error);
    return false;
  }
  
  await addLeadActivity(leadId, {
    activity_type: 'stage_change',
    subject: `Stage changed to ${stage}`,
    description: `Lead moved to ${PIPELINE_STAGES.find(s => s.id === stage)?.label}`
  });
  
  return true;
}

export async function addLeadActivity(
  leadId: string,
  activity: Partial<LeadActivity>
): Promise<LeadActivity | null> {
  if (!supabaseAdmin) return null;
  
  const { data, error } = await supabaseAdmin
    .from('lead_activities')
    .insert({
      lead_id: leadId,
      activity_type: activity.activity_type,
      subject: activity.subject,
      description: activity.description,
      outcome: activity.outcome,
      performed_by: activity.performed_by,
      scheduled_at: activity.scheduled_at,
      completed_at: activity.completed_at,
      metadata: activity.metadata || {}
    })
    .select()
    .single();
  
  if (error) {
    console.error('[LeadService] Error adding activity:', error);
    return null;
  }
  
  await supabaseAdmin
    .from('leads')
    .update({ last_contacted_at: new Date().toISOString() })
    .eq('id', leadId);
  
  return data;
}

export async function getLeadActivities(leadId: string, limit: number = 50): Promise<LeadActivity[]> {
  if (!supabaseAdmin) return [];
  
  const { data } = await supabaseAdmin
    .from('lead_activities')
    .select(`
      *,
      performer:performed_by (id, name)
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return data || [];
}

export async function scheduleMeeting(
  leadId: string,
  meeting: Partial<LeadMeeting>
): Promise<LeadMeeting | null> {
  if (!supabaseAdmin) return null;
  
  const { data, error } = await supabaseAdmin
    .from('lead_meetings')
    .insert({
      lead_id: leadId,
      meeting_type: meeting.meeting_type || 'discovery',
      title: meeting.title,
      description: meeting.description,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      timezone: meeting.timezone || 'America/New_York',
      meeting_link: meeting.meeting_link,
      location: meeting.location,
      attendees: meeting.attendees || [],
      status: 'scheduled',
      created_by: meeting.created_by
    })
    .select()
    .single();
  
  if (error) {
    console.error('[LeadService] Error scheduling meeting:', error);
    return null;
  }
  
  await addLeadActivity(leadId, {
    activity_type: 'meeting_scheduled',
    subject: `Meeting scheduled: ${meeting.title}`,
    description: `${meeting.meeting_type} meeting on ${new Date(meeting.start_time!).toLocaleDateString()}`
  });
  
  return data;
}

export async function getLeadMeetings(leadId: string): Promise<LeadMeeting[]> {
  if (!supabaseAdmin) return [];
  
  const { data } = await supabaseAdmin
    .from('lead_meetings')
    .select('*')
    .eq('lead_id', leadId)
    .order('start_time', { ascending: true });
  
  return data || [];
}

export async function getUpcomingMeetings(limit: number = 10): Promise<LeadMeeting[]> {
  if (!supabaseAdmin) return [];
  
  const { data } = await supabaseAdmin
    .from('lead_meetings')
    .select(`
      *,
      lead:lead_id (id, first_name, last_name, company_name)
    `)
    .eq('status', 'scheduled')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(limit);
  
  return data || [];
}

export async function convertLeadToPartner(leadId: string): Promise<{ success: boolean; partnerId?: string; error?: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Database not configured' };
  
  const lead = await getLead(leadId);
  if (!lead) return { success: false, error: 'Lead not found' };
  
  if (lead.pipeline_stage === 'closed_won' && lead.converted_to_partner_id) {
    return { success: true, partnerId: lead.converted_to_partner_id };
  }
  
  const { data: partner, error: partnerError } = await supabaseAdmin
    .from('retail_partners')
    .insert({
      company_name: lead.company_name,
      contact_name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
      email: lead.email,
      phone: lead.phone,
      status: 'pending',
      application_data: {
        converted_from_lead: leadId,
        lead_number: lead.lead_number,
        source: lead.source,
        ...lead.metadata
      }
    })
    .select()
    .single();
  
  if (partnerError) {
    console.error('[LeadService] Error creating partner:', partnerError);
    return { success: false, error: 'Failed to create partner' };
  }
  
  await supabaseAdmin
    .from('leads')
    .update({
      pipeline_stage: 'closed_won',
      status: 'converted',
      converted_at: new Date().toISOString(),
      converted_to_partner_id: partner.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId);
  
  await addLeadActivity(leadId, {
    activity_type: 'converted',
    subject: 'Lead converted to partner',
    description: `Created partner account: ${partner.company_name}`
  });
  
  return { success: true, partnerId: partner.id };
}

export async function getPipelineStats(): Promise<Record<PipelineStage, { count: number; value: number }>> {
  if (!supabaseAdmin) {
    return PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage.id] = { count: 0, value: 0 };
      return acc;
    }, {} as Record<PipelineStage, { count: number; value: number }>);
  }
  
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('pipeline_stage, score')
    .neq('status', 'archived');
  
  const stats: Record<PipelineStage, { count: number; value: number }> = {} as any;
  
  for (const stage of PIPELINE_STAGES) {
    stats[stage.id] = { count: 0, value: 0 };
  }
  
  for (const lead of leads || []) {
    const stage = lead.pipeline_stage as PipelineStage;
    if (stats[stage]) {
      stats[stage].count++;
      stats[stage].value += lead.score || 0;
    }
  }
  
  return stats;
}

export async function getLeadsByStage(): Promise<Record<PipelineStage, Lead[]>> {
  if (!supabaseAdmin) {
    return PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage.id] = [];
      return acc;
    }, {} as Record<PipelineStage, Lead[]>);
  }
  
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select(`
      *,
      assigned_user:assigned_to (id, name, email)
    `)
    .neq('status', 'archived')
    .order('created_at', { ascending: false });
  
  const byStage: Record<PipelineStage, Lead[]> = {} as any;
  
  for (const stage of PIPELINE_STAGES) {
    byStage[stage.id] = [];
  }
  
  for (const lead of leads || []) {
    const stage = lead.pipeline_stage as PipelineStage;
    if (byStage[stage]) {
      byStage[stage].push(lead);
    }
  }
  
  return byStage;
}
