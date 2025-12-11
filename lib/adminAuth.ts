import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export async function verifyAdminRequest(
  req: NextApiRequest
): Promise<{ authorized: boolean; user?: AdminUser; error?: string }> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    const sessionCookie = req.cookies['sb-access-token'] || req.cookies['supabase-auth-token'];
    
    if (!sessionCookie) {
      if (process.env.NODE_ENV === 'development') {
        return {
          authorized: true,
          user: {
            id: 'demo-admin-user',
            email: 'admin@drizzlwellness.com',
            role: 'super_admin'
          }
        };
      }
      return { authorized: false, error: 'No authentication token provided' };
    }
  }

  if (!supabaseAdmin) {
    if (process.env.NODE_ENV === 'development') {
      return {
        authorized: true,
        user: {
          id: 'demo-admin-user',
          email: 'admin@drizzlwellness.com',
          role: 'super_admin'
        }
      };
    }
    return { authorized: false, error: 'Server configuration error' };
  }

  const token = authHeader?.replace('Bearer ', '') || req.cookies['sb-access-token'];
  
  if (!token) {
    return { authorized: false, error: 'Invalid token' };
  }

  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return { authorized: false, error: 'Invalid or expired token' };
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { authorized: false, error: 'User profile not found' };
    }

    const adminRoles = ['admin', 'super_admin', 'factory_manager', 'finance', 'marketing', 'support', 'warehouse', 'b2b_sales'];
    
    if (!adminRoles.includes(profile.role)) {
      return { authorized: false, error: 'Insufficient permissions' };
    }

    return {
      authorized: true,
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role
      }
    };
  } catch (error) {
    console.error('[AdminAuth] Error verifying token:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

export function withAdminAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: AdminUser) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { authorized, user, error } = await verifyAdminRequest(req);

    if (!authorized || !user) {
      return res.status(401).json({ error: error || 'Unauthorized' });
    }

    return handler(req, res, user);
  };
}

export function requireRole(allowedRoles: string[]) {
  return (
    handler: (req: NextApiRequest, res: NextApiResponse, user: AdminUser) => Promise<void>
  ) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const { authorized, user, error } = await verifyAdminRequest(req);

      if (!authorized || !user) {
        return res.status(401).json({ error: error || 'Unauthorized' });
      }

      if (!allowedRoles.includes(user.role) && user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Insufficient permissions for this action' });
      }

      return handler(req, res, user);
    };
  };
}
