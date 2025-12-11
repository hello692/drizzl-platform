import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { AuthUser, getCurrentUser } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Auth setup error:', err);
          setUser(null);
          setLoading(false);
        }
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN') {
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } catch (err) {
            console.error('Error getting user on sign in:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  return { user, loading };
}
