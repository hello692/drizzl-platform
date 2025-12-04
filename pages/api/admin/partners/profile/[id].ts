import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  getFullPartnerProfile, 
  getPartnerOrders,
  getPartnerInvoices,
  getPartnerDeliveries,
  getPartnerTickets,
  getPartnerDocuments,
  getPartnerStats,
  updatePartnerNotes,
  addRiskFlag,
  removeRiskFlag,
  assignAccountManager,
  ensurePartnerCode
} from '../../../../../lib/partnerIntelService';
import { getPartnerAgreements } from '../../../../../lib/docusignService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  const { id, include } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Partner ID required' });
  }

  if (req.method === 'GET') {
    try {
      const profile = await getFullPartnerProfile(id);
      if (!profile) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      const includeItems = (include as string)?.split(',') || [];
      
      const [orders, invoices, deliveries, tickets, documents, agreements, stats] = await Promise.all([
        includeItems.includes('orders') ? getPartnerOrders(id) : Promise.resolve([]),
        includeItems.includes('invoices') ? getPartnerInvoices(id) : Promise.resolve([]),
        includeItems.includes('deliveries') ? getPartnerDeliveries(id) : Promise.resolve([]),
        includeItems.includes('tickets') ? getPartnerTickets(id) : Promise.resolve([]),
        includeItems.includes('documents') ? getPartnerDocuments(id) : Promise.resolve([]),
        includeItems.includes('agreements') ? getPartnerAgreements(id) : Promise.resolve([]),
        includeItems.includes('stats') ? getPartnerStats(id) : Promise.resolve(null)
      ]);

      return res.status(200).json({
        profile,
        orders: includeItems.includes('orders') ? orders : undefined,
        invoices: includeItems.includes('invoices') ? invoices : undefined,
        deliveries: includeItems.includes('deliveries') ? deliveries : undefined,
        tickets: includeItems.includes('tickets') ? tickets : undefined,
        documents: includeItems.includes('documents') ? documents : undefined,
        agreements: includeItems.includes('agreements') ? agreements : undefined,
        stats: includeItems.includes('stats') ? stats : undefined
      });
    } catch (error: any) {
      console.error('[Partner Profile API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch partner profile' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { action, ...data } = req.body;

      if (action === 'update-notes') {
        const success = await updatePartnerNotes(id, data.notes);
        return res.status(200).json({ success });
      }

      if (action === 'add-risk-flag') {
        const success = await addRiskFlag(id, data.flag);
        return res.status(200).json({ success });
      }

      if (action === 'remove-risk-flag') {
        const success = await removeRiskFlag(id, data.flagId);
        return res.status(200).json({ success });
      }

      if (action === 'assign-manager') {
        const success = await assignAccountManager(id, data.managerId);
        return res.status(200).json({ success });
      }

      if (action === 'generate-code') {
        const code = await ensurePartnerCode(id);
        return res.status(200).json({ success: !!code, partnerCode: code });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[Partner Profile API] Error:', error);
      return res.status(500).json({ error: 'Update failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
