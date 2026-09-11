import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { Plus, FileText, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation · HYDROSEED Studio" },
      { name: "description", content: "Manage docs.hydroseed.app content." },
    ],
  }),
  component: DocsPage,
});

const SECTIONS = [
  {
    name: "Getting started",
    pages: [
      { title: "Introduction to HYDROSEED", status: "published" as const, updated: "3d ago" },
      { title: "Set up your first project", status: "published" as const, updated: "1w ago" },
      { title: "Connect your project site", status: "in_review" as const, updated: "yesterday" },
    ],
  },
  {
    name: "Mixes & Planner",
    pages: [
      { title: "Seed & mulch mix basics 101", status: "published" as const, updated: "2w ago" },
      { title: "Application windows", status: "published" as const, updated: "5d ago" },
      { title: "Coverage forecasting", status: "draft" as const, updated: "yesterday" },
    ],
  },
  {
    name: "Bids & Inventory",
    pages: [
      { title: "Bid lifecycle", status: "published" as const, updated: "3w ago" },
      { title: "Route splitting", status: "published" as const, updated: "12d ago" },
      { title: "Inventory accuracy", status: "scheduled" as const, updated: "yesterday" },
    ],
  },
  {
    name: "API reference",
    pages: [
      { title: "Authentication", status: "published" as const, updated: "1mo ago" },
      { title: "Projects endpoint", status: "published" as const, updated: "1mo ago" },
      { title: "Webhooks", status: "draft" as const, updated: "2d ago" },
    ],
  },
];

function DocsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Documentation"
        title="Documentation"
        description="Content served under docs.hydroseed.app, organised by section."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> New doc
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.name} className="surface-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-sm font-medium">{s.name}</div>
                <span className="text-xs text-muted-foreground">{s.pages.length} pages</span>
              </div>
              <ul className="divide-y divide-border">
                {s.pages.map((p) => (
                  <li key={p.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-2.5 hover:bg-muted/30 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate text-sm">{p.title}</div>
                      <div className="text-xs text-muted-foreground">Updated {p.updated}</div>
                    </div>
                    <StatusBadge status={p.status} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
