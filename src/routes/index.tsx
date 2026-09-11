import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { SampleDataNote } from "@/components/studio/SampleDataNote";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { ARTICLES, ACTIVITY, TOP_PAGES, SEO_ISSUES, authorById, MEDIA } from "@/lib/mock";
import { ArrowUpRight, AlertTriangle, Calendar, Clock, Sparkles, Plus, FileText, Image as ImageIcon, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · HYDROSEED Studio" },
      {
        name: "description",
        content:
          "Marketing, content and growth operations overview for hydroseed.app — hydroseeding, erosion control and revegetation content in one workspace.",
      },
      { property: "og:title", content: "Overview · HYDROSEED Studio" },
      {
        property: "og:description",
        content: "Marketing, content and growth operations overview for hydroseed.app.",
      },
    ],
  }),
  component: Overview,
});

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "ok" | "warn" | "danger" }) {
  const dot = tone === "warn" ? "bg-warn" : tone === "danger" ? "bg-destructive" : "bg-success";
  return (
    <div className="surface-card p-4">
      <div className="mono-label flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-2 h-display text-3xl">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Overview() {
  const drafts = ARTICLES.filter((a) => a.status === "draft");
  const inReview = ARTICLES.filter((a) => a.status === "in_review");
  const scheduled = ARTICLES.filter((a) => a.status === "scheduled");
  const published = ARTICLES.filter((a) => a.status === "published");
  const criticalIssues = SEO_ISSUES.filter((i) => i.severity === "critical" && i.state === "open");

  return (
    <>
      <PageHeader
        eyebrow="Studio · Monday, 27 July 2026"
        title="Editorial operations"
        description="What needs your attention across the HYDROSEED public website today."
        actions={
          <>
            <a
              href="/journal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
            >
              <ArrowUpRight className="h-4 w-4" /> Open public blog
            </a>
            <Link to="/blog" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <FileText className="h-4 w-4" /> Open blog
            </Link>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95">
              <Plus className="h-4 w-4" /> New article
            </button>
          </>
        }
      />
      <PageBody>
        <SampleDataNote />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat label="Needs attention" value={String(criticalIssues.length + inReview.length)} sub={`${criticalIssues.length} SEO · ${inReview.length} in review`} tone="warn" />
          <Stat label="Drafts in progress" value={String(drafts.length)} sub="Across 3 authors" />
          <Stat label="Scheduled" value={String(scheduled.length)} sub="Next: Wed 08:00 CET" />
          <Stat label="Published (30d)" value={String(published.length)} sub="+2 vs last month" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Attention list */}
          <div className="surface-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-warn" /> Needs your attention
              </div>
              <Link to="/seo" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                View SEO center <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {[...criticalIssues.slice(0, 3), ...inReview.slice(0, 2).map((a) => ({ page: `/blog/${a.slug}`, issue: `In review: ${a.title}`, severity: "info" as const }))].map((row, i) => (
                <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{row.issue}</div>
                    <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{row.page}</div>
                  </div>
                  <button className="shrink-0 rounded-md border border-border bg-card px-2.5 py-1 text-xs hover:bg-muted">Review</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Publishing calendar preview */}
          <div className="surface-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" /> Publishing calendar
              </div>
              <span className="text-xs text-muted-foreground">This week</span>
            </div>
            <ul className="p-2">
              {scheduled.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-md p-2 hover:bg-muted">
                  <div className="mt-0.5 grid h-8 w-10 shrink-0 place-items-center rounded-md bg-primary-soft text-[11px] font-mono text-primary">
                    {new Date(a.publishAt!).toLocaleDateString("en", { day: "2-digit", month: "short" })}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {authorById(a.author).name} · {a.category}
                    </div>
                  </div>
                </li>
              ))}
              {scheduled.length === 0 && <li className="p-4 text-sm text-muted-foreground">Nothing scheduled this week.</li>}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recently published */}
          <div className="surface-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" /> Recently published
              </div>
              <Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            <ul className="divide-y divide-border">
              {published.slice(0, 4).map((a) => (
                <li key={a.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                  <img src={a.cover} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {authorById(a.author).name} · {a.category}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-sm tabular-nums">{a.views?.toLocaleString()}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">views</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top pages */}
          <div className="surface-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Search className="h-4 w-4 text-primary" /> Top pages
              </div>
              <span className="text-xs text-muted-foreground">Last 30d</span>
            </div>
            <ul className="divide-y divide-border">
              {TOP_PAGES.map((p) => (
                <li key={p.path} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 px-4 py-2.5">
                  <div className="min-w-0 truncate font-mono text-xs text-muted-foreground">{p.path}</div>
                  <div className="font-mono text-xs tabular-nums">{p.views.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Activity */}
          <div className="surface-card lg:col-span-2">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Team activity</div>
            <ul className="divide-y divide-border">
              {ACTIVITY.map((a, i) => {
                const author = authorById(a.who);
                return (
                  <li key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-medium">
                      {author.initials}
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="font-medium">{author.name}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{a.when}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recently uploaded media */}
          <div className="surface-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4 text-primary" /> Media
              </div>
              <Link to="/media" className="text-xs text-muted-foreground hover:text-foreground">Open library</Link>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {MEDIA.slice(0, 6).map((m) => (
                <div key={m.id} className="aspect-square overflow-hidden rounded-md border border-border">
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="surface-card p-4">
          <div className="mono-label mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Quick actions
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "New article", to: "/blog" },
              { label: "New landing page", to: "/landing" },
              { label: "Upload media", to: "/media" },
              { label: "Create redirect", to: "/redirects" },
              { label: "Fix SEO issue", to: "/seo" },
            ].map((a) => (
              <Link key={a.label} to={a.to} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Draft list */}
        <div className="surface-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm font-medium">
            Drafts in progress
            <Link to="/blog" className="text-xs font-normal text-muted-foreground hover:text-foreground">Open blog</Link>
          </div>
          <ul className="divide-y divide-border">
            {drafts.map((a) => (
              <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {authorById(a.author).name} · updated {new Date(a.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={a.status} />
                <Link to="/blog/$id" params={{ id: a.id }} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs hover:bg-muted">
                  Continue
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageBody>
    </>
  );
}
