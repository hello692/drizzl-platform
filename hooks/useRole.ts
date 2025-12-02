import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { supabase, UserRole } from '../lib/supabaseClient';

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setRole(data?.role as UserRole);
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole('customer');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchRole();
    }
  }, [user, authLoading]);

  return { user, role, loading: authLoading || loading };
}

export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, role, loading } = useRole();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!role || !roles.includes(role)) {
      router.push('/');
      return;
    }

    setAuthorized(true);
  }, [user, role, loading, requiredRole, router]);

  return { user, role, loading, authorized };
}

export function useRequireAdmin() {
  return useRequireRole('admin');
}

export function useRequirePartner() {
  return useRequireRole(['partner', 'admin']);
}
