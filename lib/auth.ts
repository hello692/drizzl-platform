import { supabase } from './supabaseClient';

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}

// Create user profile after signup
export async function createUserProfile(userId: string, email: string, fullName?: string) {
  const { error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email,
        full_name: fullName || null,
        role: 'customer',
      },
    ]);

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Get current user with role
export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return profile;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

// Sign up
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    await createUserProfile(data.user.id, email, fullName);
  }

  return data;
}

// Sign in
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

// Sign in with magic link
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

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// Watch auth state
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data: subscription } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const user = await getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    }
  );

  return () => subscription?.unsubscribe();
}
