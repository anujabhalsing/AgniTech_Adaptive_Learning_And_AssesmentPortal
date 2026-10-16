/**
 * AuthContext — wraps Supabase Auth.
 * When Supabase is not configured, falls back to a guest demo session.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isSupabaseConfigured, tryGetSupabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  isGuest: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  resendVerification: (email: string) => Promise<{ error: string | null }>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const GUEST_USER: AuthUser = {
  id: 'guest-demo',
  email: 'demo@skilltrace.ai',
  name: 'Demo Student',
  emailVerified: true,
  isGuest: true,
};

const GUEST_STORAGE_KEY = 'skilltrace-guest-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      // Auto-restore guest session
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      if (saved === 'true') setUser(GUEST_USER);
      setLoading(false);
      return;
    }

    const sb = tryGetSupabase()!;

    // Get current session
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? session.user.email ?? 'Student',
          emailVerified: session.user.email_confirmed_at != null,
          isGuest: false,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? session.user.email ?? 'Student',
          emailVerified: session.user.email_confirmed_at != null,
          isGuest: false,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (!configured) return { error: 'Supabase is not configured. Use the guest demo.' };
    const sb = tryGetSupabase()!;
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error?.message ?? null };
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) return { error: 'Supabase is not configured. Use the guest demo.' };
    const sb = tryGetSupabase()!;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, [configured]);

  const signOut = useCallback(async () => {
    if (user?.isGuest) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setUser(null);
      return;
    }
    if (!configured) { setUser(null); return; }
    await tryGetSupabase()?.auth.signOut();
    setUser(null);
  }, [configured, user]);

  const resetPassword = useCallback(async (email: string) => {
    if (!configured) return { error: 'Supabase is not configured.' };
    const sb = tryGetSupabase()!;
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: error?.message ?? null };
  }, [configured]);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!configured) return { error: 'Supabase is not configured.' };
    const sb = tryGetSupabase()!;
    const { error } = await sb.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  }, [configured]);

  const resendVerification = useCallback(async (email: string) => {
    if (!configured) return { error: 'Supabase is not configured.' };
    const sb = tryGetSupabase()!;
    const { error } = await sb.auth.resend({ type: 'signup', email });
    return { error: error?.message ?? null };
  }, [configured]);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    setUser(GUEST_USER);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, isConfigured: configured,
      signUp, signIn, signOut, resetPassword, updatePassword,
      resendVerification, continueAsGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
