import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { StudioLogo } from "@/components/studio/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · HYDROSEED Studio" },
      { name: "description", content: "Sign in to the private HYDROSEED Studio workspace at studio.hydroseed.app." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Sign in · HYDROSEED Studio" },
      { property: "og:description", content: "Private sign-in for the HYDROSEED Studio workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthScreen,
});

function safeRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

function AuthScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const search = useRouterState({ select: (s) => s.location.search }) as { redirect?: string };
  const redirectTo = safeRedirect(search?.redirect);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) void navigate({ to: redirectTo });
  }, [loading, user, redirectTo, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        void navigate({ to: redirectTo });
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (err) throw err;
        setNotice("Check your inbox to confirm this address, then sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    try {
      sessionStorage.setItem("studio_post_auth_redirect", redirectTo);
    } catch {
      /* ignore */
    }
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in failed. Try again or use email.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: redirectTo });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <StudioLogo />
        </div>
        <div className="surface-card p-6">
          <div className="mono-label">Private workspace</div>
          <h1 className="mt-2 h-display text-2xl">
            {mode === "signin" ? "Sign in to Studio" : "Create your Studio account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            studio.hydroseed.app is restricted to the HYDROSEED team.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <div>
              <label className="mono-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mono-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={onGoogle}
            className="h-10 w-full rounded-md border border-border bg-card text-sm hover:bg-muted"
          >
            Continue with Google
          </button>

          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNotice(null); }}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
