import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/studio/States";
import { fetchSeoAuditItems } from "@/lib/studio-api";
import { auditSeoItems, type SeoAudit } from "@/lib/seo-audit";
import { AlertTriangle, ExternalLink, RefreshCw, Search } from "lucide-react";
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
  const auditQuery = useQuery({ queryKey: ["seo-audit"], queryFn: fetchSeoAuditItems });
  const audit = auditQuery.data ? auditSeoItems(auditQuery.data) : null;

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
        {auditQuery.isLoading && <LoadingState label="Loading SEO audit…" />}
        {auditQuery.error && <ErrorState message={(auditQuery.error as Error).message} />}
        {area === "Overview" && audit && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "Total content items", value: audit.total, tone: "ok" },
                { label: "SEO titles", value: audit.withTitle, tone: "ok" },
                { label: "Missing SEO titles", value: audit.withoutTitle, tone: audit.withoutTitle ? "warn" : "ok" },
                { label: "Meta descriptions", value: audit.withDescription, tone: "ok" },
                { label: "Missing descriptions", value: audit.withoutDescription, tone: audit.withoutDescription ? "warn" : "ok" },
                { label: "Canonical URLs", value: audit.withCanonical, tone: "ok" },
                { label: "Missing canonicals", value: audit.withoutCanonical, tone: audit.withoutCanonical ? "warn" : "ok" },
                { label: "Cover media", value: audit.withCover, tone: "ok" },
                { label: "Missing cover media", value: audit.withoutCover, tone: audit.withoutCover ? "warn" : "ok" },
                { label: "Media missing alt text", value: audit.mediaMissingAlt, tone: audit.mediaMissingAlt ? "warn" : "ok" },
              ].map((c) => (
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
                <span className="text-xs text-muted-foreground">{audit.issues.length} open</span>
              </div>
              {audit.issues.length === 0 ? (
                <EmptyState title="No SEO issues detected" description="All audited fields are present on the current content records." />
              ) : (
                <>
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
                    {audit.issues.map((i) => (
                      <tr key={i.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <span className="chip !border-warn/30 !text-warn-foreground !bg-warn/10">
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
                {audit.issues.map((i) => (
                  <li key={i.id} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="chip !border-warn/30 !text-warn-foreground !bg-warn/10">{i.severity}</span>
                      <span className="text-sm font-medium">{i.issue}</span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">{i.page}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{i.action}</div>
                  </li>
                ))}
              </ul>
                </>
              )}
            </div>
            {Object.keys(audit.statusCounts).length > 0 && (
              <div className="surface-card p-4">
                <div className="mono-label mb-3">Content status distribution</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(audit.statusCounts).map(([status, count]) => (
                    <span key={status} className="chip">
                      {status}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {audit.total === 0 && (
              <EmptyState title="No content items to audit" description="Create content in the shared Content Library to begin the SEO audit." />
            )}
          </>
        )}

        {area !== "Overview" && (
          <div className="surface-card p-10 text-center">
            <div className="mono-label mb-1">{area}</div>
            <h3 className="h-display text-xl">Detailed view coming</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              This SEO surface is scaffolded. The live audit currently covers content metadata, canonical URLs and cover media.
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
