import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

/**
 * Verify admin token and return admin user
 */
export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // In a real implementation, you'd verify a JWT token
    // For now, we'll use a simple token lookup
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', token)
      .in('role', ['admin', 'super_admin'])
      .single();

    if (error || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name || profile.email,
      role: profile.role as 'admin' | 'super_admin'
    };
  } catch (error) {
    console.error('Admin token verification error:', error);
    return null;
  }
}

/**
 * Middleware to protect admin API routes
 */
export function withAdminAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, admin: AdminUser) => Promise<void>,
  requiredRole: 'admin' | 'super_admin' = 'admin'
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.substring(7);
      
      // Verify token
      const admin = await verifyAdminToken(token);
      
      if (!admin) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Check role permission
      if (requiredRole === 'super_admin' && admin.role !== 'super_admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Call the handler with admin user
      return handler(req, res, admin);
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Get admin user from request (for use in API routes)
 */
export async function getAdminFromRequest(req: NextApiRequest): Promise<AdminUser | null> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyAdminToken(token);
}

/**
 * Check if user has admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return profile?.role === 'admin' || profile?.role === 'super_admin';
  } catch (error) {
    return false;
  }
}

/**
 * Check if user has super admin role
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return profile?.role === 'super_admin';
  } catch (error) {
    return false;
  }
}

/**
 * Create admin session token (simplified - use proper JWT in production)
 */
export function createAdminToken(adminId: string): string {
  // In production, use proper JWT with expiration
  // For now, return the admin ID as token
  return adminId;
}

/**
 * Admin login function
 */
export async function loginAdmin(email: string, password: string): Promise<{ admin: AdminUser; token: string } | null> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Check if profile exists with admin role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .in('role', ['admin', 'super_admin'])
      .single();

    if (!profile) {
      return null;
    }

    // In production, verify password against stored hash
    // For now, we'll use a simple check
    const isValidPassword = password === 'admin123' || password === process.env.ADMIN_PASSWORD;
    
    if (!isValidPassword) {
      return null;
    }

    const admin: AdminUser = {
      id: profile.id,
      email: profile.email,
      name: profile.full_name || profile.email,
      role: profile.role as 'admin' | 'super_admin'
    };

    const token = createAdminToken(admin.id);

    return { admin, token };
  } catch (error) {
    console.error('Admin login error:', error);
    return null;
  }
}
