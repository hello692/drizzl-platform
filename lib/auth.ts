import { supabase } from './supabaseClient';

export type UserRole = 'admin' | 'customer' | 'partner';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // Profile doesn't exist - try to create one
    if (error.code === 'PGRST116') {
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: userName,
          full_name: userName,
          role: 'customer',
        })
        .select()
        .single();

      if (!insertError && newProfile) {
        return {
          id: newProfile.id,
          email: newProfile.email || user.email || '',
          name: newProfile.name,
          role: newProfile.role as UserRole,
        };
      }
    }
    
    // Fallback if profile creation fails
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || '',
      role: 'customer',
    };
  }

  return {
    id: profile.id,
    email: profile.email || user.email || '',
    name: profile.name || profile.full_name,
    role: profile.role as UserRole,
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const user = await getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    }
  );

  return () => data.subscription?.unsubscribe();
}
