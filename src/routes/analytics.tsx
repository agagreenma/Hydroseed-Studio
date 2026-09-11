import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { SampleDataNote } from "@/components/studio/SampleDataNote";
import { TOP_PAGES, TOP_QUERIES } from "@/lib/mock";
import { PlugZap } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · HYDROSEED Studio" },
      { name: "description", content: "Sample traffic, engagement and content performance data for hydroseed.app." },
    ],
  }),
  component: AnalyticsPage,
});

const INTEGRATIONS = [
  { name: "Google Analytics 4", state: "Not connected" },
  { name: "Google Search Console", state: "Not connected" },
  { name: "Vercel Analytics", state: "Not connected" },
];

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Growth · Analytics"
        title="Website analytics"
        description="Organic traffic, top pages and search queries. Live integrations light up as you connect them."
      />
      <PageBody>
        <SampleDataNote />
        <div className="grid gap-3 sm:grid-cols-3">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="surface-card p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{i.name}</div>
                <span className={`chip ${i.state === "Connected" ? "!bg-success/10 !text-success !border-success/20" : ""}`}>
                  {i.state}
                </span>
              </div>
              <button className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs hover:bg-muted">
                <PlugZap className="h-3.5 w-3.5" /> {i.state === "Connected" ? "Manage" : "Connect"}
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Top pages · last 30 days</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {TOP_PAGES.map((p) => (
                  <tr key={p.path}>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground truncate max-w-0">{p.path}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">{p.views.toLocaleString()}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right font-mono text-xs">{p.avgTime}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right text-xs text-muted-foreground">{p.bounce}% bounce</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="surface-card">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Top search queries</div>
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Query</th>
                  <th className="hidden sm:table-cell px-3 py-2 font-medium text-right">Clicks</th>
                  <th className="hidden md:table-cell px-3 py-2 font-medium text-right">Impr.</th>
                  <th className="hidden md:table-cell px-3 py-2 font-medium text-right">CTR</th>
                  <th className="px-3 py-2 font-medium text-right">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TOP_QUERIES.map((q) => (
                  <tr key={q.q}>
                    <td className="px-4 py-2.5 text-sm truncate max-w-0">{q.q}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right font-mono text-xs tabular-nums">{q.clicks}</td>
                    <td className="hidden md:table-cell px-3 py-2.5 text-right font-mono text-xs tabular-nums">{q.impressions.toLocaleString()}</td>
                    <td className="hidden md:table-cell px-3 py-2.5 text-right font-mono text-xs">{q.ctr}%</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Countries", "Devices", "Traffic sources", "Engagement"].map((l) => (
            <div key={l} className="surface-card p-4">
              <div className="mono-label">{l}</div>
              <div className="mt-3 h-16 rounded-md grid-bg" />
              <div className="mt-2 text-xs text-muted-foreground">Requires GA4 connection</div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
