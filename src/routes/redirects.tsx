import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { REDIRECTS } from "@/lib/mock";
import { Plus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/redirects")({
  head: () => ({
    meta: [
      { title: "Redirects · HYDROSEED Studio" },
      { name: "description", content: "Manage URL redirects on hydroseed.app." },
    ],
  }),
  component: RedirectsPage,
});

function RedirectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Growth · Redirects"
        title="URL redirects"
        description="301 and 302 rules for hydroseed.app. Track hits and disable rules without deleting them."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> New redirect
          </button>
        }
      />
      <PageBody>
        <div className="surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">Source → Destination</th>
                <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Type</th>
                <th className="hidden md:table-cell px-3 py-2.5 font-medium">Status</th>
                <th className="hidden lg:table-cell px-3 py-2.5 font-medium">Created</th>
                <th className="px-3 py-2.5 font-medium text-right">Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REDIRECTS.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 min-w-0">
                      <span className="truncate font-mono text-xs">{r.source}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate font-mono text-xs text-muted-foreground">{r.destination}</span>
                    </div>
                    {r.notes && <div className="mt-1 text-xs text-muted-foreground">{r.notes}</div>}
                  </td>
                  <td className="hidden sm:table-cell px-3 py-3">
                    <span className={`chip !border-border`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${r.active ? "text-success" : "text-muted-foreground"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r.active ? "bg-success" : "bg-muted-foreground/60"}`} />
                      {r.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-3 py-3 text-xs text-muted-foreground">{r.createdAt}</td>
                  <td className="px-3 py-3 text-right font-mono text-xs tabular-nums">{r.hits.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
