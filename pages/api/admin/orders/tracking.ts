import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminRequest } from '../../../../lib/adminAuth';
import { 
  getOrderTracking, 
  updateOrderTracking, 
  addTrackingEvent,
  recordDeliveryProof,
  detectCarrier,
  getCarriers,
  getOrderStats,
  getRecentOrders
} from '../../../../lib/orderTrackingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  const { authorized, error } = await verifyAdminRequest(req);
  if (!authorized) {
    return res.status(401).json({ error: error || 'Unauthorized' });
  }
  
  const { orderId, action } = req.query;

  if (req.method === 'GET') {
    try {
      if (action === 'carriers') {
        const carriers = await getCarriers();
        return res.status(200).json({ carriers });
      }

      if (action === 'stats') {
        const { startDate, endDate, orderType } = req.query;
        const stats = await getOrderStats({
          startDate: startDate as string,
          endDate: endDate as string,
          orderType: orderType as 'd2c' | 'b2b'
        });
        return res.status(200).json(stats);
      }

      if (action === 'recent') {
        const { limit, orderType } = req.query;
        const orders = await getRecentOrders(
          limit ? parseInt(limit as string) : 20,
          orderType as 'd2c' | 'b2b'
        );
        return res.status(200).json({ orders });
      }

      if (action === 'detect-carrier') {
        const { trackingNumber } = req.query;
        if (!trackingNumber || typeof trackingNumber !== 'string') {
          return res.status(400).json({ error: 'Tracking number required' });
        }
        const carrier = detectCarrier(trackingNumber);
        return res.status(200).json({ carrier });
      }

      if (orderId && typeof orderId === 'string') {
        const tracking = await getOrderTracking(orderId);
        if (!tracking) {
          return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json({ tracking });
      }

      return res.status(400).json({ error: 'Order ID or action required' });
    } catch (error: any) {
      console.error('[Tracking API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch tracking info' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (!orderId || typeof orderId !== 'string') {
        return res.status(400).json({ error: 'Order ID required' });
      }

      if (action === 'update-tracking') {
        const { tracking_number, carrier, carrier_service, estimated_delivery } = req.body;
        
        if (!tracking_number) {
          return res.status(400).json({ error: 'Tracking number required' });
        }

        const detectedCarrier = carrier || detectCarrier(tracking_number);
        
        const success = await updateOrderTracking(orderId, {
          tracking_number,
          carrier: detectedCarrier || 'unknown',
          carrier_service,
          estimated_delivery
        });
        
        return res.status(200).json({ success });
      }

      if (action === 'add-event') {
        const { event_type, status, location, description, timestamp } = req.body;
        
        if (!event_type || !status) {
          return res.status(400).json({ error: 'Event type and status required' });
        }

        const success = await addTrackingEvent(orderId, {
          event_type,
          status,
          location,
          description,
          timestamp: timestamp || new Date().toISOString()
        });
        
        return res.status(200).json({ success });
      }

      if (action === 'record-delivery') {
        const { proof_type, signature_image_url, photo_urls, recipient_name, delivery_notes, gps_coordinates, driver_name } = req.body;
        
        if (!proof_type) {
          return res.status(400).json({ error: 'Proof type required' });
        }

        const success = await recordDeliveryProof(orderId, {
          proof_type,
          signature_image_url,
          photo_urls: photo_urls || [],
          recipient_name,
          delivery_notes,
          gps_coordinates,
          driver_name
        });
        
        return res.status(200).json({ success });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[Tracking API] Error:', error);
      return res.status(500).json({ error: 'Action failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
