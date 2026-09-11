import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, CheckCircle2, Download } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { RESOURCES, getResource, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/resources/$slug")({
  loader: ({ params }) => {
    const resource = getResource(params.slug);
    if (!resource) throw notFound();
    return { resource };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Resource not found — HYDROSEED" }, { name: "robots", content: "noindex" }] };
    const r = loaderData.resource;
    return {
      meta: [
        { title: `${r.title} — HYDROSEED Resources` },
        { name: "description", content: r.summary },
        { property: "og:title", content: r.title },
        { property: "og:description", content: r.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: r.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: r.cover },
      ],
    };
  },
  component: ResourceDetail,
});

function ResourceDetail() {
  const { resource: r } = Route.useLoaderData() as { resource: import("@/lib/public-content").Resource };
  const related = RESOURCES.filter(x => x.slug !== r.slug && x.category === r.category).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10">
          <Link to="/journal/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All resources
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] items-center">
            <div>
              <div className="mono-label mb-3 text-accent-foreground">{r.type} · {r.category}</div>
              <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">{r.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{r.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
                  <Download className="h-4 w-4" /> Download the {r.type.toLowerCase()}
                </button>
                <button className="inline-flex items-center gap-2 h-11 rounded-md border border-border px-5 text-sm hover:bg-muted">
                  <Bookmark className="h-4 w-4" /> Save
                </button>
              </div>
              <div className="mt-6 text-xs text-muted-foreground">
                {r.minutes} minute read · Updated {formatDate(r.updated)}
              </div>
            </div>
            <img src={r.cover} alt={r.title} className="rounded-lg border border-border aspect-[4/3] object-cover" />
          </div>
        </div>
      </section>

      {/* Body with table of contents */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block sticky top-24 self-start">
          <div className="mono-label mb-3">In this {r.type.toLowerCase()}</div>
          <ol className="space-y-2 text-sm">
            {r.chapters.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
                <a href={`#c-${i}`} className="text-muted-foreground hover:text-foreground">{c.title.replace(/^\d+\.\s*/, "")}</a>
              </li>
            ))}
          </ol>
        </aside>
        <div className="max-w-[720px]">
          {r.chapters.map((c, i) => (
            <div key={i} id={`c-${i}`} className="mb-10 pb-8 border-b border-border last:border-0">
              <div className="mono-label text-muted-foreground">Chapter {i + 1}</div>
              <h2 className="mt-2 font-display text-2xl md:text-3xl tracking-tight">{c.title.replace(/^\d+\.\s*/, "")}</h2>
              <p className="mt-4 text-[17px] leading-[1.75] text-foreground/90">{c.body}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Applies to slope, roadside and commercial revegetation projects
              </div>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
            <div className="mono-label mb-6">More in {r.category}</div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map(x => (
                <Link key={x.slug} to="/journal/resources/$slug" params={{ slug: x.slug }} className="group rounded-lg border border-border bg-card overflow-hidden">
                  <img src={x.cover} alt={x.title} className="aspect-[16/9] w-full object-cover group-hover:scale-105 transition" />
                  <div className="p-4">
                    <div className="mono-label">{x.type}</div>
                    <div className="mt-1 font-display text-lg leading-snug group-hover:text-primary">{x.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterCTA />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}
