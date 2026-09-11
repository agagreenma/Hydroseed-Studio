import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, LayoutDashboard, Blocks, Users, Settings } from "lucide-react";

/**
 * Private /admin boundary (Phase 1 infrastructure).
 *
 * Rendering only happens behind the Studio auth gate in __root.tsx. No Phase 2
 * content functionality lives here.
 */
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · HYDROSEED Studio" },
      { name: "description", content: "Private administration boundary for HYDROSEED Studio at studio.hydroseed.app." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Admin · HYDROSEED Studio" },
      { property: "og:description", content: "Private administration boundary for HYDROSEED Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminHome,
});

const LINKS = [
  { to: "/", label: "Overview", icon: LayoutDashboard, note: "Workspace dashboard" },
  { to: "/architecture", label: "Architecture", icon: Blocks, note: "Approved blueprint" },
  { to: "/team", label: "Team", icon: Users, note: "Studio members" },
  { to: "/settings", label: "Settings", icon: Settings, note: "Workspace configuration" },
] as const;

function AdminHome() {
  const { user, signOut } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow="System · Admin"
        title="Studio administration"
        description="Private boundary for studio.hydroseed.app. Authentication is required for every screen in this area."
      />
      <PageBody>
        <div className="surface-card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Authenticated session
            </span>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button
              onClick={() => void signOut()}
              className="ml-auto rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
            >
              Sign out
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Phase 1 infrastructure foundation: session-based access only. The five-role permission
            matrix arrives in Phase 3 and is intentionally not implemented here.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.to} to={l.to} className="surface-card flex items-center gap-3 p-4 hover:bg-muted/50">
                <Icon className="h-4 w-4 text-primary" />
                <span>
                  <span className="block text-sm font-medium">{l.label}</span>
                  <span className="block text-xs text-muted-foreground">{l.note}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
