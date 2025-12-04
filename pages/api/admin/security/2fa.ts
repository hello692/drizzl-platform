import type { NextApiRequest, NextApiResponse } from 'next';
import { setup2FA, verify2FASetup, verify2FACode, disable2FA, get2FAStatus, logAuditEvent } from '../../../../lib/securityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  const { userId, email } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (req.method === 'GET') {
    try {
      const status = await get2FAStatus(userId);
      return res.status(200).json(status || { enabled: false });
    } catch (error: any) {
      console.error('[2FA API] Error:', error);
      return res.status(500).json({ error: 'Failed to get 2FA status' });
    }
  }

  if (req.method === 'POST') {
    const { action, code } = req.body;

    try {
      if (action === 'setup') {
        if (!email || typeof email !== 'string') {
          return res.status(400).json({ error: 'Email required for setup' });
        }
        
        const setup = await setup2FA(userId, email);
        if (!setup) {
          return res.status(500).json({ error: 'Failed to setup 2FA' });
        }
        
        return res.status(200).json({
          qrCodeUrl: setup.qrCodeUrl,
          backupCodes: setup.backupCodes,
          message: 'Scan QR code with authenticator app, then verify with a code'
        });
      }

      if (action === 'verify-setup') {
        if (!code) {
          return res.status(400).json({ error: 'Verification code required' });
        }
        
        const success = await verify2FASetup(userId, code);
        if (success) {
          await logAuditEvent('2fa_enabled', {
            userId,
            details: { method: 'totp' }
          });
          return res.status(200).json({ success: true, message: '2FA enabled successfully' });
        }
        
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      if (action === 'verify') {
        if (!code) {
          return res.status(400).json({ error: 'Verification code required' });
        }
        
        const success = await verify2FACode(userId, code);
        if (success) {
          await logAuditEvent('2fa_verified', { userId });
          return res.status(200).json({ success: true });
        }
        
        await logAuditEvent('2fa_failed', { userId, status: 'failure' });
        return res.status(400).json({ error: 'Invalid code' });
      }

      if (action === 'disable') {
        if (!code) {
          return res.status(400).json({ error: 'Current code required to disable 2FA' });
        }
        
        const verified = await verify2FACode(userId, code);
        if (!verified) {
          return res.status(400).json({ error: 'Invalid verification code' });
        }
        
        const success = await disable2FA(userId);
        if (success) {
          await logAuditEvent('2fa_disabled', { userId });
          return res.status(200).json({ success: true, message: '2FA disabled' });
        }
        
        return res.status(500).json({ error: 'Failed to disable 2FA' });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[2FA API] Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
