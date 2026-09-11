import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Quote } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { CASE_STUDIES, getCaseStudy } from "@/lib/public-content";

export const Route = createFileRoute("/journal/case-studies/$slug")({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Story not found — HYDROSEED" }, { name: "robots", content: "noindex" }] };
    const s = loaderData.study;
    return {
      meta: [
        { title: `${s.company} — HYDROSEED Customer Story` },
        { name: "description", content: s.summary },
        { property: "og:title", content: s.headline },
        { property: "og:description", content: s.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: s.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: s.cover },
      ],
    };
  },
  component: CaseStudyDetail,
});

function CaseStudyDetail() {
  const { study: s } = Route.useLoaderData() as { study: import("@/lib/public-content").CaseStudy };
  const others = CASE_STUDIES.filter(x => x.slug !== s.slug).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
          <Link to="/journal/case-studies" className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-background">
            <ArrowLeft className="h-4 w-4" /> All customer stories
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-background text-foreground font-display">{s.logoLetters}</div>
            <div>
              <div className="font-medium">{s.company}</div>
              <div className="text-xs text-background/60">{s.industry} · {s.region} · {s.size}</div>
            </div>
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.03] tracking-tight max-w-4xl">
            {s.headline}
          </h1>
          <p className="mt-4 text-lg text-background/80 max-w-2xl">{s.summary}</p>
        </div>
      </section>

      {/* Metrics row */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10 grid gap-6 md:grid-cols-3">
          {s.metrics.map(m => (
            <div key={m.label}>
              <div className="font-display text-4xl md:text-5xl text-primary">{m.value}</div>
              <div className="mono-label mt-2">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Image */}
      <img src={s.cover} alt={s.company} className="w-full aspect-[16/6] object-cover" />

      {/* Story */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 grid gap-16 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block sticky top-24 self-start">
          <div className="mono-label mb-3">On this page</div>
          <ol className="space-y-2 text-sm">
            {s.story.map((c, i) => (
              <li key={i}><a href={`#s-${i}`} className="text-muted-foreground hover:text-foreground">{c.heading}</a></li>
            ))}
          </ol>
        </aside>
        <div className="max-w-[720px]">
          {s.story.map((c, i) => (
            <div key={i} id={`s-${i}`} className="mb-12">
              <div className="mono-label text-muted-foreground">Section {i + 1}</div>
              <h2 className="mt-2 font-display text-2xl md:text-3xl tracking-tight">{c.heading}</h2>
              <p className="mt-3 text-[17px] leading-[1.75] text-foreground/90">{c.body}</p>
            </div>
          ))}
          <figure className="mt-6 rounded-xl border border-border bg-accent/40 p-8">
            <Quote className="h-6 w-6 text-primary" />
            <blockquote className="mt-3 font-display text-xl md:text-2xl leading-snug">"{s.quote.text}"</blockquote>
            <figcaption className="mt-4 text-sm">
              <div className="font-medium">{s.quote.author}</div>
              <div className="text-xs text-muted-foreground">{s.quote.role}</div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Other stories */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
          <div className="mono-label mb-6">More stories</div>
          <div className="grid gap-6 md:grid-cols-2">
            {others.map(x => (
              <Link key={x.slug} to="/journal/case-studies/$slug" params={{ slug: x.slug }} className="group rounded-xl border border-border bg-card overflow-hidden">
                <img src={x.cover} alt={x.company} className="aspect-[16/9] w-full object-cover" />
                <div className="p-5">
                  <div className="text-sm font-medium">{x.company}</div>
                  <div className="mt-1 font-display text-lg group-hover:text-primary">{x.headline}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HydroseedCTA />
      <NewsletterCTA />
      <PublicFooter />
    </div>
  );
}
