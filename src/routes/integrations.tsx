import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { useMemo, useState } from "react";
import {
  Search, Settings2, Plug, CheckCircle2, Circle, Filter, ArrowUpDown,
  BarChart3, Megaphone, Mail, Workflow, Users, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations · HYDROSEED Studio" },
      {
        name: "description",
        content:
          "Connect HYDROSEED Studio to analytics, advertising, email, automation and CRM providers. Conceptual UI — no backend logic implemented.",
      },
      { property: "og:title", content: "HYDROSEED Studio — Integrations" },
      {
        property: "og:description",
        content:
          "Unified surface for third-party integrations across analytics, advertising, email, automation and CRM.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Integrations,
});

type Integration = {
  id: string;
  name: string;
  description: string;
  category: CategoryKey;
  future?: boolean;
};

type CategoryKey = "analytics" | "advertising" | "email" | "automation" | "crm" | "future";

const CATEGORIES: { key: CategoryKey; label: string; icon: LucideIcon; kicker: string }[] = [
  { key: "analytics", label: "Analytics", icon: BarChart3, kicker: "Traffic, search performance and product analytics." },
  { key: "advertising", label: "Advertising", icon: Megaphone, kicker: "Pixels and conversion tags across ad networks." },
  { key: "email", label: "Email", icon: Mail, kicker: "Transactional and campaign delivery providers." },
  { key: "automation", label: "Automation", icon: Workflow, kicker: "No-code and workflow orchestration." },
  { key: "crm", label: "CRM", icon: Users, kicker: "Contacts, lifecycle stages and pipelines." },
  { key: "future", label: "Future", icon: Sparkles, kicker: "Planned integrations, tracked for the next roadmap window." },
];

const INTEGRATIONS: Integration[] = [
  { id: "ga4", name: "Google Analytics 4", description: "Session and event analytics for the public hydroseed.app site.", category: "analytics" },
  { id: "gsc", name: "Google Search Console", description: "Search impressions, clicks and indexing signals.", category: "analytics" },
  { id: "vercel", name: "Vercel Analytics", description: "Edge-level web vitals and audience insights.", category: "analytics" },

  { id: "meta-pixel", name: "Meta Pixel", description: "Facebook and Instagram conversion tracking.", category: "advertising" },
  { id: "google-ads", name: "Google Ads", description: "Conversion tags and audience export.", category: "advertising" },
  { id: "linkedin", name: "LinkedIn Insight Tag", description: "B2B audience tracking and retargeting.", category: "advertising" },
  { id: "tiktok", name: "TikTok Pixel", description: "TikTok Ads Manager events and audiences.", category: "advertising" },
  { id: "microsoft-ads", name: "Microsoft Ads", description: "Bing/Microsoft advertising UET tag.", category: "advertising" },

  { id: "resend", name: "Resend", description: "Transactional email delivery for editorial notifications.", category: "email" },
  { id: "beehiiv", name: "Beehiiv", description: "Newsletter platform for subscribers and campaigns.", category: "email" },
  { id: "mailchimp", name: "Mailchimp", description: "Legacy list management and automations.", category: "email" },

  { id: "zapier", name: "Zapier", description: "Trigger third-party actions on publishing events.", category: "automation" },
  { id: "make", name: "Make", description: "Visual scenarios across HYDROSEED publishing surfaces.", category: "automation" },
  { id: "n8n", name: "n8n", description: "Self-hosted workflow automation for editorial ops.", category: "automation" },

  { id: "hubspot", name: "HubSpot", description: "Contacts, lifecycle stages and marketing attribution.", category: "crm" },

  { id: "segment", name: "Segment", description: "Customer data infrastructure and event routing.", category: "future", future: true },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics for authenticated surfaces.", category: "future", future: true },
  { id: "posthog", name: "PostHog", description: "Open-source product analytics and feature flags.", category: "future", future: true },
];

type Sort = "recommended" | "name" | "category";

function Integrations() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [sort, setSort] = useState<Sort>("recommended");

  const filtered = useMemo(() => {
    let list = INTEGRATIONS.filter((i) =>
      (active === "all" || i.category === active) &&
      (q.trim() === "" ||
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.description.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "category") list = [...list].sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [q, active, sort]);

  const grouped = useMemo(() => {
    const map = new Map<CategoryKey, Integration[]>();
    for (const c of CATEGORIES) map.set(c.key, []);
    for (const i of filtered) map.get(i.category)?.push(i);
    return map;
  }, [filtered]);

  return (
    <>
      <PageHeader
        eyebrow="Growth · Integrations"
        title="Integrations"
        description="Prepare HYDROSEED Studio to connect with analytics, advertising, email, automation and CRM providers. Every integration is currently disconnected — connection logic is not yet implemented."
        meta={
          <>
            <span className="chip">{INTEGRATIONS.length} providers</span>
            <span className="chip">0 connected</span>
            <span className="chip">Conceptual UI</span>
          </>
        }
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
            <Plug className="h-4 w-4" /> Request integration
          </button>
        }
      />

      <PageBody>
        {/* Toolbar */}
        <div className="surface-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search integrations…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <button
                onClick={() => setActive("all")}
                className={`rounded px-2 py-0.5 ${active === "all" ? "bg-muted text-foreground" : "hover:text-foreground"}`}
              >
                All
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={`rounded px-2 py-0.5 ${active === c.key ? "bg-muted text-foreground" : "hover:text-foreground"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent text-xs focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sections per category */}
        {filtered.length === 0 ? (
          <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-display text-base text-foreground">No integrations match</div>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try clearing the search or switching category. Missing something? Use “Request integration”.
            </p>
          </div>
        ) : (
          CATEGORIES.map((cat) => {
            const items = grouped.get(cat.key) ?? [];
            if (items.length === 0) return null;
            const Icon = cat.icon;
            return (
              <section key={cat.key} className="space-y-3">
                <div className="flex items-end justify-between border-b border-border pb-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="h-display text-lg text-foreground">{cat.label}</div>
                      <div className="text-xs text-muted-foreground">{cat.kicker}</div>
                    </div>
                  </div>
                  <span className="mono-label">{String(items.length).padStart(2, "0")} providers</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((i) => (
                    <IntegrationCard key={i.id} integration={i} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </PageBody>
    </>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const initials = integration.name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <article className="surface-card flex flex-col p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-[11px] font-medium text-foreground">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-foreground">{integration.name}</div>
            {integration.future && (
              <span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Coming Soon
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Circle className="h-2 w-2 fill-muted-foreground/60 text-muted-foreground/60" />
            Not Connected
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{integration.description}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-[11px]">
        <div>
          <dt className="mono-label">Status</dt>
          <dd className="mt-0.5 text-foreground">Not Connected</dd>
        </div>
        <div>
          <dt className="mono-label">Last Sync</dt>
          <dd className="mt-0.5 text-muted-foreground">Never</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2">
        <button
          disabled={integration.future}
          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Connect
        </button>
        <button className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs text-foreground hover:bg-muted">
          <Settings2 className="h-3.5 w-3.5" />
          Settings
        </button>
      </div>
    </article>
  );
}
