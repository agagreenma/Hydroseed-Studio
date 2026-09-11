import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { ARTICLES, ARTICLE_SECTIONS, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/articles")({
  head: () => ({
    meta: [
      { title: "Articles — HYDROSEED Journal" },
      { name: "description", content: "Field reports, analysis, interviews and long reads on the professionalisation of hydroseeding and erosion control." },
      { property: "og:title", content: "Articles — HYDROSEED Journal" },
      { property: "og:description", content: "A premium editorial publication for professional hydroseeding and erosion control operators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [section, setSection] = useState("All");
  const [q, setQ] = useState("");

  const [lead, ...rest] = ARTICLES;
  const filtered = useMemo(() => {
    return rest.filter(a =>
      (section === "All" || a.section === section) &&
      (q === "" || (a.title + a.dek).toLowerCase().includes(q.toLowerCase()))
    );
  }, [section, q, rest]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Masthead */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 md:py-20">
          <div className="mono-label mb-3">HYDROSEED Journal · Vol. IV</div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-4xl">
            Articles. Reporting on the operators, science and economics of modern erosion control.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
            An editorial publication produced by the HYDROSEED newsroom. Field reports, analysis, interviews and long-form
            essays for the people running hydroseeding and revegetation crews.
          </p>
        </div>
      </section>

      {/* Feature */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-12 grid gap-10 md:grid-cols-[1.15fr_1fr] items-start">
          <Link
            to="/journal/articles/$slug"
            params={{ slug: lead.slug }}
            className="group block overflow-hidden rounded-lg border border-border"
          >
            <img src={lead.cover} alt={lead.title} className="aspect-[16/10] w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          </Link>
          <div>
            <div className="mono-label text-accent-foreground mb-3">The lead story · {lead.section}</div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight tracking-tight">
              <Link to="/journal/articles/$slug" params={{ slug: lead.slug }} className="hover:underline underline-offset-4">
                {lead.title}
              </Link>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{lead.dek}</p>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                {lead.author.initials}
              </span>
              <div>
                <div className="font-medium">{lead.author.name}</div>
                <div className="text-xs text-muted-foreground">{formatDate(lead.publishedAt)} · {lead.readingMinutes} min read</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section toolbar */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ARTICLE_SECTIONS.map(s => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`h-8 px-3 rounded-full text-xs border transition ${section === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search articles"
              className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(a => (
            <article key={a.slug} className="group">
              <Link to="/journal/articles/$slug" params={{ slug: a.slug }} className="block overflow-hidden rounded-md">
                <img src={a.cover} alt={a.title} className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="mono-label mt-4">{a.section}</div>
              <h3 className="mt-2 font-display text-xl leading-snug">
                <Link to="/journal/articles/$slug" params={{ slug: a.slug }} className="hover:underline underline-offset-4">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.dek}</p>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <span>{a.author.name}</span>
                <span>·</span>
                <span>{formatDate(a.publishedAt)}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readingMinutes} min</span>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-16">No articles match this filter.</div>
          )}
        </div>
      </section>

      <NewsletterCTA />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}
