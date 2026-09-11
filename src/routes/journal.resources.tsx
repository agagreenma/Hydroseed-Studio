import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Download, FileText, LayoutTemplate, PieChart, Wrench, Search } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { RESOURCES, RESOURCE_TYPES, RESOURCE_CATEGORIES, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/resources")({
  head: () => ({
    meta: [
      { title: "Resources — HYDROSEED Journal" },
      { name: "description", content: "Guides, playbooks, templates, reports and toolkits for professional hydroseeding and erosion control operators." },
      { property: "og:title", content: "Resources — HYDROSEED Journal" },
      { property: "og:description", content: "A premium knowledge library for hydroseeding and erosion control operations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Guide: BookOpen,
  Playbook: FileText,
  Template: LayoutTemplate,
  Report: PieChart,
  Toolkit: Wrench,
};

function ResourcesPage() {
  const [type, setType] = useState("All");
  const [cat, setCat] = useState<string | "All">("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return RESOURCES.filter(r =>
      (type === "All" || r.type === type) &&
      (cat === "All" || r.category === cat) &&
      (q === "" || (r.title + r.summary).toLowerCase().includes(q.toLowerCase()))
    );
  }, [type, cat, q]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-background to-background" aria-hidden />
        <div className="relative mx-auto max-w-[1240px] px-5 lg:px-8 py-16 md:py-24 grid gap-10 md:grid-cols-[1.3fr_1fr] items-center">
          <div>
            <div className="mono-label mb-3 text-accent-foreground">The HYDROSEED Library</div>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight">
              Everything a modern erosion control contractor needs to run a better business.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
              A curated library of guides, playbooks, spreadsheets, industry reports and audit-ready toolkits — free
              for the hydroseeding and revegetation community.
            </p>
            <div className="mt-8 relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search the library — try &quot;pricing&quot; or &quot;slope compliance&quot;"
                className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {RESOURCE_TYPES.filter(t => t !== "All").map(t => {
              const Icon = TYPE_ICONS[t] ?? FileText;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-left rounded-lg border p-4 transition ${type === t ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-border-strong"}`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="mt-3 font-medium">{t}s</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {RESOURCES.filter(r => r.type === t).length} items
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category rail */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-4 flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setCat("All")} className={`h-8 px-3 rounded-full text-xs border shrink-0 ${cat === "All" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}>All categories</button>
          {RESOURCE_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`h-8 px-3 rounded-full text-xs border shrink-0 ${cat === c ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
          ))}
          <div className="ml-auto text-xs text-muted-foreground shrink-0">{filtered.length} of {RESOURCES.length}</div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(r => {
            const Icon = TYPE_ICONS[r.type] ?? FileText;
            return (
              <Link
                key={r.slug}
                to="/journal/resources/$slug"
                params={{ slug: r.slug }}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={r.cover} alt={r.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-7 rounded-full bg-background/95 px-2.5 text-xs font-medium">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {r.type}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mono-label">{r.category}</div>
                  <h3 className="mt-2 font-display text-lg leading-snug group-hover:text-primary">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.summary}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.minutes} min · Updated {formatDate(r.updated)}</span>
                    <span className="inline-flex items-center gap-1 text-primary font-medium"><Download className="h-3.5 w-3.5" /> Open</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <NewsletterCTA eyebrow="New in the library" title="Get a monthly digest of new guides, templates and reports." />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}
