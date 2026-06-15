"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Auth state via Supabase magic-link (passwordless email). Degrades cleanly when
 * Supabase isn't configured: `configured` is false and the UI shows local-only mode.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string) => {
    if (!supabase) throw new Error("Auth is not configured");
    return supabase.auth.signInWithOtp({ email });
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return { user, ready, configured: isSupabaseConfigured, signInWithEmail, signOut };
}
