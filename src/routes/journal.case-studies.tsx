import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { CASE_STUDIES, CASE_INDUSTRIES } from "@/lib/public-content";

export const Route = createFileRoute("/journal/case-studies")({
  head: () => ({
    meta: [
      { title: "Customer Stories — HYDROSEED" },
      { name: "description", content: "How leading hydroseeding and erosion control contractors run their business on HYDROSEED." },
      { property: "og:title", content: "HYDROSEED Customer Stories" },
      { property: "og:description", content: "Sample stories from contractors that changed the way they operate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const [industry, setIndustry] = useState("All");
  const filtered = useMemo(
    () => CASE_STUDIES.filter(c => industry === "All" || c.industry === industry),
    [industry]
  );
  const [feature, ...rest] = CASE_STUDIES;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Hero — editorial */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 md:py-20">
          <div className="mono-label mb-3 text-accent-foreground">Customer Stories</div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-4xl">
            The teams building the future of erosion control — and what changed when they moved to HYDROSEED.
          </h1>
        </div>
      </section>

      {/* Feature story */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-12 grid gap-10 lg:grid-cols-2 items-center">
          <Link to="/journal/case-studies/$slug" params={{ slug: feature.slug }} className="group block overflow-hidden rounded-lg">
            <img src={feature.cover} alt={feature.company} className="aspect-[4/3] w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-foreground text-background font-display">{feature.logoLetters}</div>
              <div>
                <div className="font-medium">{feature.company}</div>
                <div className="text-xs text-muted-foreground">{feature.industry} · {feature.region}</div>
              </div>
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-4xl tracking-tight leading-tight">
              <Link to="/journal/case-studies/$slug" params={{ slug: feature.slug }} className="hover:underline underline-offset-4">
                {feature.headline}
              </Link>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{feature.summary}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {feature.metrics.map(m => (
                <div key={m.label} className="rounded-lg border border-border bg-card p-4">
                  <div className="font-display text-2xl text-primary">{m.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            <Link to="/journal/case-studies/$slug" params={{ slug: feature.slug }} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Read the story <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CASE_INDUSTRIES.map(i => (
            <button key={i} onClick={() => setIndustry(i)} className={`h-8 px-3 rounded-full text-xs border ${industry === i ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{i}</button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(industry === "All" ? rest : filtered).map(c => (
            <Link key={c.slug} to="/journal/case-studies/$slug" params={{ slug: c.slug }} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary transition">
              <img src={c.cover} alt={c.company} className="aspect-[16/9] w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-foreground text-background text-xs font-medium">{c.logoLetters}</div>
                  <div className="text-sm font-medium">{c.company}</div>
                  <div className="ml-auto text-xs text-muted-foreground">{c.industry}</div>
                </div>
                <h3 className="mt-3 font-display text-xl leading-snug group-hover:text-primary">{c.headline}</h3>
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  {c.metrics.slice(0, 2).map(m => (
                    <div key={m.label} className="rounded-md bg-primary-soft px-2 py-1 text-accent-foreground">
                      <span className="font-medium">{m.value}</span> · {m.label}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote wall */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16">
          <div className="mono-label mb-6">In their words</div>
          <div className="grid gap-6 md:grid-cols-3">
            {CASE_STUDIES.slice(0, 3).map(c => (
              <figure key={c.slug} className="rounded-xl border border-border bg-card p-6">
                <Quote className="h-5 w-5 text-primary" />
                <blockquote className="mt-3 font-display text-lg leading-snug">"{c.quote.text}"</blockquote>
                <figcaption className="mt-4 text-sm">
                  <div className="font-medium">{c.quote.author}</div>
                  <div className="text-muted-foreground text-xs">{c.quote.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA eyebrow="New stories" title="Get new customer stories in your inbox once a month." />
      <HydroseedCTA title="Your story could be next." body="Join the contractors running their operation on HYDROSEED." primary="Start free trial" secondary="Talk to sales" />
      <PublicFooter />
    </div>
  );
}
