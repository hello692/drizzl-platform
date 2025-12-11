import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface PartnerProfile {
  id: string;
  partner_code: string;
  qr_code_data: string;
  company_name: string;
  store_name?: string;
  contact_name: string;
  contact_email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status: string;
  account_manager?: {
    id: string;
    name: string;
    email: string;
  };
  total_revenue_cents: number;
  total_orders: number;
  contract_status: string;
  contract_expiry_date?: string;
  license_verified: boolean;
  compliance_status: string;
  risk_level?: string;
  latest_score?: number;
  notes?: string;
  risk_flags: any[];
  created_at: string;
  updated_at: string;
}

export interface PartnerSearchResult {
  id: string;
  partner_code: string;
  company_name: string;
  contact_email: string;
  phone?: string;
  status: string;
  total_orders: number;
  total_revenue_cents: number;
  match_type: string;
  match_field: string;
}

export interface PartnerOrder {
  id: string;
  order_number?: string;
  total_cents: number;
  status: string;
  created_at: string;
  items?: any[];
}

export interface PartnerInvoice {
  id: string;
  invoice_number: string;
  amount_cents: number;
  total_cents: number;
  status: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
}

export interface PartnerDelivery {
  id: string;
  tracking_number?: string;
  status: string;
  driver_name?: string;
  estimated_arrival?: string;
  actual_arrival?: string;
  proof_of_delivery_url?: string;
  created_at: string;
}

export interface PartnerTicket {
  id: string;
  ticket_number: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at?: string;
}

export interface PartnerDocument {
  id: string;
  document_type: string;
  document_name: string;
  status: string;
  expiry_date?: string;
  created_at: string;
}

function generateQRCodeData(partnerId: string, partnerCode: string): string {
  const data = {
    type: 'drizzl_partner',
    id: partnerId,
    code: partnerCode,
    v: 1
  };
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function generatePartnerCode(): string {
  const prefix = 'DW';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

export async function ensurePartnerCode(partnerId: string): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const { data: partner } = await supabaseAdmin
    .from('retail_partners')
    .select('partner_code, qr_code_data')
    .eq('id', partnerId)
    .single();

  if (partner?.partner_code) {
    if (!partner.qr_code_data) {
      const qrData = generateQRCodeData(partnerId, partner.partner_code);
      await supabaseAdmin
        .from('retail_partners')
        .update({ qr_code_data: qrData })
        .eq('id', partnerId);
    }
    return partner.partner_code;
  }

  const newCode = generatePartnerCode();
  const qrData = generateQRCodeData(partnerId, newCode);

  const { error } = await supabaseAdmin
    .from('retail_partners')
    .update({ 
      partner_code: newCode,
      qr_code_data: qrData
    })
    .eq('id', partnerId);

  if (error) {
    console.error('[PartnerIntel] Error setting partner code:', error);
    return null;
  }

  return newCode;
}

export async function searchPartners(
  query: string,
  options: {
    limit?: number;
    status?: string;
  } = {}
): Promise<PartnerSearchResult[]> {
  if (!supabaseAdmin || !query.trim()) return [];

  const searchTerm = query.trim().toLowerCase();
  const limit = options.limit || 20;

  try {
    let results: PartnerSearchResult[] = [];

    if (searchTerm.startsWith('dw-')) {
      const { data: codeMatch } = await supabaseAdmin
        .from('retail_partners')
        .select('id, partner_code, company_name, email, phone, status, total_orders, total_revenue_cents')
        .ilike('partner_code', `%${searchTerm}%`)
        .limit(limit);

      if (codeMatch) {
        results = codeMatch.map(p => ({
          ...p,
          contact_email: p.email || '',
          match_type: 'exact',
          match_field: 'partner_code'
        }));
      }
    }

    if (results.length < limit) {
      const { data: nameMatch } = await supabaseAdmin
        .from('retail_partners')
        .select('id, partner_code, company_name, email, phone, status, total_orders, total_revenue_cents')
        .or(`company_name.ilike.%${searchTerm}%,store_name.ilike.%${searchTerm}%,contact_name.ilike.%${searchTerm}%`)
        .limit(limit - results.length);

      if (nameMatch) {
        const existing = new Set(results.map(r => r.id));
        nameMatch.forEach(p => {
          if (!existing.has(p.id)) {
            results.push({
              ...p,
              contact_email: p.email || '',
              match_type: 'partial',
              match_field: 'name'
            });
          }
        });
      }
    }

    if (results.length < limit) {
      const { data: emailMatch } = await supabaseAdmin
        .from('retail_partners')
        .select('id, partner_code, company_name, email, phone, status, total_orders, total_revenue_cents')
        .ilike('email', `%${searchTerm}%`)
        .limit(limit - results.length);

      if (emailMatch) {
        const existing = new Set(results.map(r => r.id));
        emailMatch.forEach(p => {
          if (!existing.has(p.id)) {
            results.push({
              ...p,
              contact_email: p.email || '',
              match_type: 'partial',
              match_field: 'email'
            });
          }
        });
      }
    }

    if (results.length < limit && /^\d+$/.test(searchTerm.replace(/[-\s]/g, ''))) {
      const { data: phoneMatch } = await supabaseAdmin
        .from('retail_partners')
        .select('id, partner_code, company_name, email, phone, status, total_orders, total_revenue_cents')
        .ilike('phone', `%${searchTerm.replace(/[-\s]/g, '')}%`)
        .limit(limit - results.length);

      if (phoneMatch) {
        const existing = new Set(results.map(r => r.id));
        phoneMatch.forEach(p => {
          if (!existing.has(p.id)) {
            results.push({
              ...p,
              contact_email: p.email || '',
              match_type: 'partial',
              match_field: 'phone'
            });
          }
        });
      }
    }

    if (options.status) {
      results = results.filter(r => r.status === options.status);
    }

    return results;
  } catch (error) {
    console.error('[PartnerIntel] Search error:', error);
    return [];
  }
}

export async function getFullPartnerProfile(partnerId: string): Promise<PartnerProfile | null> {
  if (!supabaseAdmin) return null;

  try {
    const { data: partner, error } = await supabaseAdmin
      .from('retail_partners')
      .select(`
        *,
        account_manager:account_manager_id (id, name, email)
      `)
      .eq('id', partnerId)
      .single();

    if (error || !partner) {
      console.error('[PartnerIntel] Error fetching partner:', error);
      return null;
    }

    if (!partner.partner_code) {
      await ensurePartnerCode(partnerId);
      const { data: updated } = await supabaseAdmin
        .from('retail_partners')
        .select('partner_code, qr_code_data')
        .eq('id', partnerId)
        .single();
      if (updated) {
        partner.partner_code = updated.partner_code;
        partner.qr_code_data = updated.qr_code_data;
      }
    }

    return {
      id: partner.id,
      partner_code: partner.partner_code || '',
      qr_code_data: partner.qr_code_data || '',
      company_name: partner.company_name || '',
      store_name: partner.store_name,
      contact_name: partner.contact_name || '',
      contact_email: partner.email || partner.contact_email || '',
      phone: partner.phone,
      address: partner.address,
      city: partner.city,
      state: partner.state,
      zip: partner.zip,
      country: partner.country,
      status: partner.status || 'pending',
      account_manager: partner.account_manager,
      total_revenue_cents: partner.total_revenue_cents || 0,
      total_orders: partner.total_orders || 0,
      contract_status: partner.contract_status || 'pending',
      contract_expiry_date: partner.contract_expiry_date,
      license_verified: partner.license_verified || false,
      compliance_status: partner.compliance_status || 'pending',
      risk_level: partner.risk_level,
      latest_score: partner.latest_score,
      notes: partner.notes,
      risk_flags: partner.risk_flags || [],
      created_at: partner.created_at,
      updated_at: partner.updated_at
    };
  } catch (error) {
    console.error('[PartnerIntel] Error:', error);
    return null;
  }
}

export async function getPartnerOrders(partnerId: string, limit: number = 50): Promise<PartnerOrder[]> {
  if (!supabaseAdmin) return [];

  const { data: partner } = await supabaseAdmin
    .from('retail_partners')
    .select('user_id')
    .eq('id', partnerId)
    .single();

  if (!partner?.user_id) return [];

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, total_cents, status, created_at')
    .eq('user_id', partner.user_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  return orders || [];
}

export async function getPartnerInvoices(partnerId: string, limit: number = 50): Promise<PartnerInvoice[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from('partner_invoices')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getPartnerDeliveries(partnerId: string, limit: number = 50): Promise<PartnerDelivery[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from('partner_deliveries')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getPartnerTickets(partnerId: string, limit: number = 50): Promise<PartnerTicket[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from('partner_tickets')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getPartnerDocuments(partnerId: string): Promise<PartnerDocument[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from('partner_documents')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function updatePartnerNotes(partnerId: string, notes: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { error } = await supabaseAdmin
    .from('retail_partners')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', partnerId);

  return !error;
}

export async function addRiskFlag(partnerId: string, flag: { type: string; description: string; severity: string }): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { data: partner } = await supabaseAdmin
    .from('retail_partners')
    .select('risk_flags')
    .eq('id', partnerId)
    .single();

  const flags = partner?.risk_flags || [];
  flags.push({
    ...flag,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  });

  const { error } = await supabaseAdmin
    .from('retail_partners')
    .update({ 
      risk_flags: flags,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  return !error;
}

export async function removeRiskFlag(partnerId: string, flagId: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { data: partner } = await supabaseAdmin
    .from('retail_partners')
    .select('risk_flags')
    .eq('id', partnerId)
    .single();

  const flags = (partner?.risk_flags || []).filter((f: any) => f.id !== flagId);

  const { error } = await supabaseAdmin
    .from('retail_partners')
    .update({ 
      risk_flags: flags,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  return !error;
}

export async function assignAccountManager(partnerId: string, managerId: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { error } = await supabaseAdmin
    .from('retail_partners')
    .update({ 
      account_manager_id: managerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  return !error;
}

export async function getPartnerStats(partnerId: string): Promise<{
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  openTickets: number;
  pendingInvoices: number;
  upcomingDeliveries: number;
}> {
  if (!supabaseAdmin) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      openTickets: 0,
      pendingInvoices: 0,
      upcomingDeliveries: 0
    };
  }

  const [orders, tickets, invoices, deliveries] = await Promise.all([
    getPartnerOrders(partnerId, 1000),
    supabaseAdmin
      .from('partner_tickets')
      .select('id')
      .eq('partner_id', partnerId)
      .in('status', ['open', 'in_progress']),
    supabaseAdmin
      .from('partner_invoices')
      .select('id')
      .eq('partner_id', partnerId)
      .eq('status', 'pending'),
    supabaseAdmin
      .from('partner_deliveries')
      .select('id')
      .eq('partner_id', partnerId)
      .in('status', ['pending', 'in_transit'])
  ]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    openTickets: tickets.data?.length || 0,
    pendingInvoices: invoices.data?.length || 0,
    upcomingDeliveries: deliveries.data?.length || 0
  };
}

export async function decodeQRCode(qrData: string): Promise<{ partnerId?: string; partnerCode?: string; valid: boolean }> {
  try {
    const decoded = JSON.parse(Buffer.from(qrData, 'base64').toString());
    if (decoded.type === 'drizzl_partner' && decoded.id && decoded.code) {
      return {
        partnerId: decoded.id,
        partnerCode: decoded.code,
        valid: true
      };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}
