import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { SampleDataNote } from "@/components/studio/SampleDataNote";
import { SEO_ISSUES } from "@/lib/mock";
import { AlertTriangle, CheckCircle2, XCircle, Search, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/seo")({
  head: () => ({
    meta: [
      { title: "SEO Center · HYDROSEED Studio" },
      { name: "description", content: "Technical SEO, issues, structured data and AI search readiness for hydroseed.app." },
    ],
  }),
  component: SeoCenter,
});

const CARDS = [
  { label: "Indexed pages", value: 148, tone: "ok" },
  { label: "Pages with issues", value: 22, tone: "warn" },
  { label: "Missing titles", value: 4, tone: "warn" },
  { label: "Missing descriptions", value: 7, tone: "warn" },
  { label: "Missing alt text", value: 34, tone: "warn" },
  { label: "Broken links", value: 3, tone: "danger" },
  { label: "Duplicate metadata", value: 2, tone: "warn" },
  { label: "Schema issues", value: 5, tone: "warn" },
  { label: "Blocked from indexing", value: 1, tone: "danger" },
  { label: "Sitemap status", value: "Healthy", tone: "ok" },
];

const AI_CHECKS = [
  { label: "Content summary present", state: "Ready" },
  { label: "Direct answer near top", state: "Ready" },
  { label: "Definitions marked up", state: "Needs improvement" },
  { label: "FAQ schema", state: "Ready" },
  { label: "Named entities recognisable", state: "Ready" },
  { label: "Sources & citations", state: "Needs improvement" },
  { label: "Statistics with dates", state: "Missing" },
  { label: "Comparison tables", state: "Ready" },
  { label: "Author credibility", state: "Ready" },
  { label: "Updated date visible", state: "Ready" },
  { label: "Structured data coverage", state: "Needs improvement" },
  { label: "Machine-readable summary", state: "Not evaluated" },
];

const AREAS = ["Overview", "Pages", "Issues", "Keywords", "Internal Links", "Structured Data", "Sitemaps", "Robots", "Redirects", "Search Console", "Core Web Vitals", "AI Search"] as const;

function toneCls(t: string) {
  return t === "ok"
    ? "text-success"
    : t === "warn"
    ? "text-warn-foreground"
    : t === "danger"
    ? "text-destructive"
    : "text-foreground";
}

function SeoCenter() {
  const [area, setArea] = useState<(typeof AREAS)[number]>("Overview");
  return (
    <>
      <PageHeader
        eyebrow="Growth · SEO Center"
        title="Search & AI visibility"
        description="Technical SEO, structured data, and readiness for AI search surfaces."
        actions={
          <>
            <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <RefreshCw className="h-4 w-4" /> Rescan
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
              <Search className="h-4 w-4" /> Audit page
            </button>
          </>
        }
        meta={
          <div className="flex flex-wrap gap-1.5">
            {AREAS.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`chip cursor-pointer ${area === a ? "!bg-primary-soft !text-primary !border-primary/20" : ""}`}
              >
                {a}
              </button>
            ))}
          </div>
        }
      />
      <PageBody>
        <SampleDataNote />
        {area === "Overview" && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {CARDS.map((c) => (
                <div key={c.label} className="surface-card p-3">
                  <div className="mono-label">{c.label}</div>
                  <div className={`mt-1.5 h-display text-2xl ${toneCls(c.tone)}`}>{c.value}</div>
                </div>
              ))}
            </div>

            <div className="surface-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 text-warn" /> Open issues
                </div>
                <span className="text-xs text-muted-foreground">{SEO_ISSUES.filter((i) => i.state === "open").length} open</span>
              </div>
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-muted-foreground">
                    <tr className="text-left">
                      <th className="px-4 py-2.5 font-medium">Severity</th>
                      <th className="px-3 py-2.5 font-medium">Issue</th>
                      <th className="px-3 py-2.5 font-medium">Page</th>
                      <th className="px-3 py-2.5 font-medium">Type</th>
                      <th className="px-3 py-2.5 font-medium">Detected</th>
                      <th className="px-3 py-2.5 font-medium">Recommended action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SEO_ISSUES.filter((i) => i.state === "open").map((i) => (
                      <tr key={i.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <span className={`chip ${
                            i.severity === "critical" ? "!border-destructive/30 !text-destructive !bg-destructive/10"
                            : i.severity === "warn" ? "!border-warn/30 !text-warn-foreground !bg-warn/10"
                            : "!border-border !text-muted-foreground"
                          }`}>
                            {i.severity}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm">{i.issue}</td>
                        <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{i.page}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{i.type}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{i.detected}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{i.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="md:hidden divide-y divide-border">
                {SEO_ISSUES.filter((i) => i.state === "open").map((i) => (
                  <li key={i.id} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`chip ${
                        i.severity === "critical" ? "!border-destructive/30 !text-destructive !bg-destructive/10"
                        : i.severity === "warn" ? "!border-warn/30 !text-warn-foreground !bg-warn/10"
                        : ""
                      }`}>{i.severity}</span>
                      <span className="text-sm font-medium">{i.issue}</span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">{i.page}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{i.action}</div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {area === "AI Search" && (
          <>
            <div className="surface-card p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="h-display text-xl">AI search readiness</h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Prepare content for discovery in Google AI Overviews, ChatGPT, Gemini, Claude and Perplexity.
                    These checks are heuristic — we don't guarantee rankings or citations.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Google AIO", "ChatGPT", "Gemini", "Claude", "Perplexity"].map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AI_CHECKS.map((c) => (
                <div key={c.label} className="surface-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{c.label}</span>
                    <StateBadge state={c.state} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {area !== "Overview" && area !== "AI Search" && (
          <div className="surface-card p-10 text-center">
            <div className="mono-label mb-1">{area}</div>
            <h3 className="h-display text-xl">Detailed view coming</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              This SEO surface is scaffolded and connected to the same audit engine — deep views will land once the crawler is wired up.
            </p>
            <button className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm">
              <ExternalLink className="h-4 w-4" /> Learn more
            </button>
          </div>
        )}
      </PageBody>
    </>
  );
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, { cls: string; Icon: any }> = {
    Ready: { cls: "text-success bg-success/10 border-success/20", Icon: CheckCircle2 },
    "Needs improvement": { cls: "text-warn-foreground bg-warn/10 border-warn/25", Icon: AlertTriangle },
    Missing: { cls: "text-destructive bg-destructive/10 border-destructive/20", Icon: XCircle },
    "Not evaluated": { cls: "text-muted-foreground bg-muted border-border", Icon: RefreshCw },
  };
  const { cls, Icon } = map[state] ?? map["Not evaluated"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${cls}`}>
      <Icon className="h-3 w-3" /> {state}
    </span>
  );
}
