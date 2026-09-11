import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { SampleDataNote } from "@/components/studio/SampleDataNote";
import { StatusBadge, LangChip } from "@/components/studio/StatusBadge";
import { ARTICLES, authorById, type Status } from "@/lib/mock";
import { Filter, Plus, Search as SearchIcon, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog · HYDROSEED Studio" },
      { name: "description", content: "Manage hydroseed.app articles, drafts, scheduled and published content." },
    ],
  }),
  component: BlogList,
});

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "in_review", label: "In Review" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

function SeoScore({ score }: { score: number }) {
  const tone = score >= 80 ? "text-success" : score >= 60 ? "text-warn-foreground" : "text-destructive";
  const bg = score >= 80 ? "bg-success" : score >= 60 ? "bg-warn" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${bg}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`font-mono text-xs tabular-nums ${tone}`}>{score}</span>
    </div>
  );
}

function BlogList() {
  const [tab, setTab] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");

  const counts: Record<string, number> = { all: ARTICLES.length };
  ARTICLES.forEach((a) => (counts[a.status] = (counts[a.status] ?? 0) + 1));

  const rows = ARTICLES.filter(
    (a) => (tab === "all" || a.status === tab) && (q === "" || a.title.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        eyebrow="Publishing · Blog"
        title="All articles"
        description="Every post across the public hydroseed.app blog. Filter, edit, schedule and publish."
        actions={
          <>
            <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95">
              <Plus className="h-4 w-4" /> New article
            </button>
          </>
        }
      />
      <PageBody>
        <SampleDataNote />
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative -mb-px px-3 py-2 text-sm transition ${
                tab === t.key
                  ? "text-foreground border-b-2 border-primary font-medium"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }`}
            >
              {t.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search / toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles"
              className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <select className="h-9 rounded-md border border-border bg-card px-2.5 text-sm">
            <option>All categories</option>
            <option>Erosion Control</option>
            <option>Hydroseeding</option>
            <option>Revegetation</option>
          </select>
          <select className="h-9 rounded-md border border-border bg-card px-2.5 text-sm">
            <option>All languages</option>
            <option>English</option>
            <option>Français</option>
            <option>Español</option>
            <option>العربية</option>
          </select>
        </div>

        {/* Desktop table */}
        <div className="surface-card hidden md:block overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-2.5 font-medium">
                  <span className="inline-flex items-center gap-1">Article <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-3 py-2.5 font-medium">Author</th>
                <th className="px-3 py-2.5 font-medium">Category</th>
                <th className="px-3 py-2.5 font-medium">Lang</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">SEO</th>
                <th className="px-3 py-2.5 font-medium">Updated</th>
                <th className="px-3 py-2.5 font-medium text-right">Views</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => {
                const author = authorById(a.author);
                return (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link to="/blog/$id" params={{ id: a.id }} className="flex items-center gap-3 min-w-0">
                        <img src={a.cover} alt="" className="h-9 w-12 shrink-0 rounded object-cover" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">{a.title}</div>
                          <div className="truncate text-xs text-muted-foreground font-mono">/blog/{a.slug}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-medium">{author.initials}</div>
                        <span className="text-xs">{author.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{a.category}</td>
                    <td className="px-3 py-3"><LangChip code={a.language} /></td>
                    <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-3 py-3"><SeoScore score={a.seoScore} /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(a.updatedAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs tabular-nums">{a.views?.toLocaleString() ?? "—"}</td>
                    <td className="px-2 py-3">
                      <button className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 md:hidden">
          {rows.map((a) => {
            const author = authorById(a.author);
            return (
              <Link
                key={a.id}
                to="/blog/$id"
                params={{ id: a.id }}
                className="surface-card block p-3 hover:border-border-strong"
              >
                <div className="flex gap-3">
                  <img src={a.cover} alt="" className="h-16 w-20 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-medium">{a.title}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{author.name} · {a.category}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={a.status} />
                      <LangChip code={a.language} />
                      <span className="chip">SEO {a.seoScore}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {rows.length === 0 && (
          <div className="surface-card p-10 text-center">
            <div className="mono-label mb-2">Empty</div>
            <h3 className="h-display text-xl">No articles match your filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or switching tab.</p>
          </div>
        )}
      </PageBody>
    </>
  );
}
