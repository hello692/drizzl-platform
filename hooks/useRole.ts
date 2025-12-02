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
  const { user, role, loading } = useRole();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null);
  const [checkingPartner, setCheckingPartner] = useState(true);

  useEffect(() => {
    async function checkPartnerStatus() {
      if (loading) return;

      if (!user) {
        router.push('/auth');
        return;
      }

      if (role === 'admin') {
        setAuthorized(true);
        setPartnerStatus('approved');
        setCheckingPartner(false);
        return;
      }

      if (role !== 'partner') {
        router.push('/retail');
        return;
      }

      try {
        const response = await fetch(`/api/retail/status?userId=${user.id}`);
        const data = await response.json();

        if (!data.hasApplication) {
          router.push('/retail/apply');
          return;
        }

        setPartnerStatus(data.status);

        if (data.status === 'approved') {
          setAuthorized(true);
        } else {
          router.push('/retail');
        }
      } catch (error) {
        console.error('Error checking partner status:', error);
        router.push('/retail');
      } finally {
        setCheckingPartner(false);
      }
    }

    checkPartnerStatus();
  }, [user, role, loading, router]);

  return { 
    user, 
    role, 
    loading: loading || checkingPartner, 
    authorized,
    partnerStatus 
  };
}

export function usePartnerStatus() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      if (!user) {
        setStatus(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/retail/status?userId=${user.id}`);
        const data = await response.json();
        setStatus(data.hasApplication ? data.status : null);
      } catch (error) {
        console.error('Error fetching partner status:', error);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchStatus();
    }
  }, [user, authLoading]);

  return { status, loading: authLoading || loading };
}
