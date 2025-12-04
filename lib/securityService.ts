import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
  };
  ip_address: string;
  user_agent: string;
  location?: string;
  is_active: boolean;
  last_activity_at: string;
  expires_at: string;
  created_at: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure' | 'warning';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export type AuditActionType = 
  | 'login' | 'logout' | 'login_failed'
  | '2fa_enabled' | '2fa_disabled' | '2fa_verified' | '2fa_failed'
  | 'session_created' | 'session_terminated' | 'session_expired'
  | 'password_changed' | 'password_reset_requested'
  | 'partner_approved' | 'partner_rejected' | 'partner_updated'
  | 'agreement_sent' | 'agreement_signed' | 'agreement_declined'
  | 'product_created' | 'product_updated' | 'product_deleted'
  | 'order_created' | 'order_updated' | 'order_cancelled'
  | 'admin_action' | 'permission_changed' | 'role_assigned'
  | 'data_export' | 'bulk_operation' | 'api_access';

function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
}

function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.substring(0, 4)}-${code.substring(4, 8)}`);
  }
  return codes;
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function getTOTPCode(secret: string, timeStep: number = 30): string {
  const time = Math.floor(Date.now() / 1000 / timeStep);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(time));
  
  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
  hmac.update(buffer);
  const hash = hmac.digest();
  
  const offset = hash[hash.length - 1] & 0x0f;
  const code = ((hash[offset] & 0x7f) << 24) |
               ((hash[offset + 1] & 0xff) << 16) |
               ((hash[offset + 2] & 0xff) << 8) |
               (hash[offset + 3] & 0xff);
  
  return String(code % 1000000).padStart(6, '0');
}

export function verifyTOTP(secret: string, code: string, window: number = 1): boolean {
  const timeStep = 30;
  for (let i = -window; i <= window; i++) {
    const time = Math.floor(Date.now() / 1000 / timeStep) + i;
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(time));
    
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
    hmac.update(buffer);
    const hash = hmac.digest();
    
    const offset = hash[hash.length - 1] & 0x0f;
    const otp = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
    
    if (String(otp % 1000000).padStart(6, '0') === code) {
      return true;
    }
  }
  return false;
}

export async function setup2FA(userId: string, email: string): Promise<TwoFactorSetup | null> {
  if (!supabaseAdmin) return null;
  
  const secret = generateTOTPSecret();
  const backupCodes = generateBackupCodes();
  
  const hashedBackupCodes = backupCodes.map(code => 
    crypto.createHash('sha256').update(code).digest('hex')
  );
  
  const { error } = await supabaseAdmin
    .from('user_2fa')
    .upsert({
      user_id: userId,
      secret_key: secret,
      backup_codes: hashedBackupCodes,
      is_enabled: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  
  if (error) {
    console.error('[Security] Error setting up 2FA:', error);
    return null;
  }
  
  const issuer = 'Drizzl%20Wellness';
  const qrCodeUrl = `otpauth://totp/${issuer}:${encodeURIComponent(email)}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  
  return { secret, qrCodeUrl, backupCodes };
}

export async function verify2FASetup(userId: string, code: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { data: twoFA } = await supabaseAdmin
    .from('user_2fa')
    .select('secret_key')
    .eq('user_id', userId)
    .single();
  
  if (!twoFA) return false;
  
  if (verifyTOTP(twoFA.secret_key, code)) {
    await supabaseAdmin
      .from('user_2fa')
      .update({
        is_enabled: true,
        setup_completed_at: new Date().toISOString(),
        last_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    return true;
  }
  
  return false;
}

export async function verify2FACode(userId: string, code: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { data: twoFA } = await supabaseAdmin
    .from('user_2fa')
    .select('secret_key, backup_codes, is_enabled')
    .eq('user_id', userId)
    .single();
  
  if (!twoFA || !twoFA.is_enabled) return false;
  
  if (verifyTOTP(twoFA.secret_key, code)) {
    await supabaseAdmin
      .from('user_2fa')
      .update({ last_verified_at: new Date().toISOString() })
      .eq('user_id', userId);
    return true;
  }
  
  const codeHash = crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
  const backupIndex = twoFA.backup_codes.indexOf(codeHash);
  
  if (backupIndex !== -1) {
    const newBackupCodes = [...twoFA.backup_codes];
    newBackupCodes.splice(backupIndex, 1);
    
    await supabaseAdmin
      .from('user_2fa')
      .update({ 
        backup_codes: newBackupCodes,
        last_verified_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    return true;
  }
  
  return false;
}

export async function disable2FA(userId: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { error } = await supabaseAdmin
    .from('user_2fa')
    .delete()
    .eq('user_id', userId);
  
  return !error;
}

export async function get2FAStatus(userId: string): Promise<{ enabled: boolean; setupAt?: string } | null> {
  if (!supabaseAdmin) return null;
  
  const { data } = await supabaseAdmin
    .from('user_2fa')
    .select('is_enabled, setup_completed_at')
    .eq('user_id', userId)
    .single();
  
  if (!data) return { enabled: false };
  
  return {
    enabled: data.is_enabled,
    setupAt: data.setup_completed_at
  };
}

export async function createSession(
  userId: string,
  ipAddress: string,
  userAgent: string,
  expiresInHours: number = 24
): Promise<Session | null> {
  if (!supabaseAdmin) return null;
  
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  
  const deviceInfo = parseUserAgent(userAgent);
  
  const { data, error } = await supabaseAdmin
    .from('user_sessions')
    .insert({
      user_id: userId,
      session_token: sessionToken,
      device_info: deviceInfo,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('[Security] Error creating session:', error);
    return null;
  }
  
  return data;
}

export async function getActiveSessions(userId: string): Promise<Session[]> {
  if (!supabaseAdmin) return [];
  
  const { data } = await supabaseAdmin
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('last_activity_at', { ascending: false });
  
  return data || [];
}

export async function terminateSession(sessionId: string, userId?: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  let query = supabaseAdmin
    .from('user_sessions')
    .update({ is_active: false })
    .eq('id', sessionId);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { error } = await query;
  return !error;
}

export async function terminateAllSessions(userId: string, exceptSessionId?: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  let query = supabaseAdmin
    .from('user_sessions')
    .update({ is_active: false })
    .eq('user_id', userId);
  
  if (exceptSessionId) {
    query = query.neq('id', exceptSessionId);
  }
  
  const { error } = await query;
  return !error;
}

export async function updateSessionActivity(sessionToken: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { error } = await supabaseAdmin
    .from('user_sessions')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('session_token', sessionToken)
    .eq('is_active', true);
  
  return !error;
}

export async function logAuditEvent(
  actionType: AuditActionType,
  options: {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    status?: 'success' | 'failure' | 'warning';
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  } = {}
): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { error } = await supabaseAdmin
    .from('audit_logs')
    .insert({
      user_id: options.userId || null,
      action_type: actionType,
      resource_type: options.resourceType,
      resource_id: options.resourceId,
      details: options.details || {},
      ip_address: options.ipAddress,
      user_agent: options.userAgent,
      status: options.status || 'success',
      risk_level: options.riskLevel || 'low'
    });
  
  if (error) {
    console.error('[Security] Error logging audit event:', error);
    return false;
  }
  
  return true;
}

export async function getAuditLogs(options: {
  userId?: string;
  actionType?: string;
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ logs: AuditLog[]; total: number }> {
  if (!supabaseAdmin) return { logs: [], total: 0 };
  
  let query = supabaseAdmin
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
  
  if (options.userId) query = query.eq('user_id', options.userId);
  if (options.actionType) query = query.eq('action_type', options.actionType);
  if (options.riskLevel) query = query.eq('risk_level', options.riskLevel);
  if (options.startDate) query = query.gte('created_at', options.startDate);
  if (options.endDate) query = query.lte('created_at', options.endDate);
  
  query = query.range(
    options.offset || 0, 
    (options.offset || 0) + (options.limit || 50) - 1
  );
  
  const { data, count, error } = await query;
  
  if (error) {
    console.error('[Security] Error fetching audit logs:', error);
    return { logs: [], total: 0 };
  }
  
  return { logs: data || [], total: count || 0 };
}

export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  failureReason?: string
): Promise<void> {
  if (!supabaseAdmin) return;
  
  await supabaseAdmin
    .from('login_attempts')
    .insert({
      email,
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      failure_reason: failureReason
    });
}

export async function checkBruteForce(
  email: string,
  ipAddress: string,
  windowMinutes: number = 15,
  maxAttempts: number = 5
): Promise<{ blocked: boolean; remainingAttempts: number; blockedUntil?: Date }> {
  if (!supabaseAdmin) return { blocked: false, remainingAttempts: maxAttempts };
  
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
  
  const { data } = await supabaseAdmin
    .from('login_attempts')
    .select('id')
    .eq('email', email)
    .eq('success', false)
    .gte('created_at', windowStart.toISOString());
  
  const failedAttempts = data?.length || 0;
  const remainingAttempts = Math.max(0, maxAttempts - failedAttempts);
  const blocked = failedAttempts >= maxAttempts;
  
  return {
    blocked,
    remainingAttempts,
    blockedUntil: blocked ? new Date(Date.now() + windowMinutes * 60 * 1000) : undefined
  };
}

function parseUserAgent(userAgent: string): { browser?: string; os?: string; device?: string } {
  const result: { browser?: string; os?: string; device?: string } = {};
  
  if (userAgent.includes('Chrome')) result.browser = 'Chrome';
  else if (userAgent.includes('Firefox')) result.browser = 'Firefox';
  else if (userAgent.includes('Safari')) result.browser = 'Safari';
  else if (userAgent.includes('Edge')) result.browser = 'Edge';
  else result.browser = 'Unknown';
  
  if (userAgent.includes('Windows')) result.os = 'Windows';
  else if (userAgent.includes('Mac')) result.os = 'macOS';
  else if (userAgent.includes('Linux')) result.os = 'Linux';
  else if (userAgent.includes('Android')) result.os = 'Android';
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) result.os = 'iOS';
  else result.os = 'Unknown';
  
  if (userAgent.includes('Mobile')) result.device = 'Mobile';
  else if (userAgent.includes('Tablet')) result.device = 'Tablet';
  else result.device = 'Desktop';
  
  return result;
}
