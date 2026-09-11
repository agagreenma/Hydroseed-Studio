import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Phase 1 authentication foundation.
 *
 * Session state only — no role model. The Phase 3 permission matrix is out of scope.
 */
type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (nextSession?.user) {
        // Defer: never call other Supabase APIs inside the auth callback.
        setTimeout(() => {
          // The query builder is lazy — it only issues the request once awaited.
          void supabase
            .from("studio_members")
            .upsert(
              {
                id: nextSession.user.id,
                email: nextSession.user.email ?? null,
                display_name:
                  (nextSession.user.user_metadata?.["full_name"] as string | undefined) ??
                  nextSession.user.email ??
                  null,
                last_seen_at: new Date().toISOString(),
              },
              { onConflict: "id" },
            )
            .then(({ error }) => {
              if (error) console.error("studio_members upsert failed", error);
            });
        }, 0);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
