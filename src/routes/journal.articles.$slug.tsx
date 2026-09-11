import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { ARTICLES, getArticle, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/articles/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found — HYDROSEED Journal" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — HYDROSEED Journal` },
        { name: "description", content: a.dek },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.dek },
        { property: "og:type", content: "article" },
        { property: "og:image", content: a.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: a.cover },
      ],
    };
  },
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article: a } = Route.useLoaderData() as { article: import("@/lib/public-content").Article };
  const related = ARTICLES.filter(x => x.slug !== a.slug && x.section === a.section).slice(0, 3);
  const fallback = ARTICLES.filter(x => x.slug !== a.slug).slice(0, 3);
  const pool = related.length ? related : fallback;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <article>
        {/* Cover */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10">
            <Link to="/journal/articles" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <div className="mono-label mt-6 text-accent-foreground">{a.section}</div>
            <h1 className="mt-3 font-display text-4xl md:text-6xl leading-[1.03] tracking-tight max-w-5xl">{a.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl leading-relaxed">{a.dek}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-medium text-accent-foreground">{a.author.initials}</span>
                <div>
                  <div className="font-medium">{a.author.name}</div>
                  <div className="text-xs text-muted-foreground">{a.author.role}</div>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">{formatDate(a.publishedAt)}</div>
              <div className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"><Clock className="h-3.5 w-3.5" /> {a.readingMinutes} min read</div>
              <button className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm hover:bg-muted">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>

        <img src={a.cover} alt={a.title} className="w-full aspect-[16/7] object-cover" />

        {/* Body */}
        <div className="mx-auto max-w-[720px] px-5 lg:px-0 py-14 prose-neutral">
          {a.body.map((b, i) => (
            <div key={i} className="mb-8">
              {b.heading && <h2 className="font-display text-2xl md:text-3xl mt-10 mb-4 tracking-tight">{b.heading}</h2>}
              <p className="text-[17px] leading-[1.75] text-foreground/90">{b.paragraph}</p>
            </div>
          ))}
          <div className="mt-14 rounded-lg border border-border bg-accent/40 p-6">
            <div className="mono-label text-accent-foreground mb-2">About the author</div>
            <div className="font-medium">{a.author.name}</div>
            <div className="text-sm text-muted-foreground">{a.author.role} at HYDROSEED Journal.</div>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
          <div className="mono-label mb-6">Keep reading</div>
          <div className="grid gap-8 md:grid-cols-3">
            {pool.map(r => (
              <Link key={r.slug} to="/journal/articles/$slug" params={{ slug: r.slug }} className="group">
                <img src={r.cover} alt={r.title} className="aspect-[4/3] w-full rounded-md object-cover group-hover:opacity-90" />
                <div className="mono-label mt-4">{r.section}</div>
                <h3 className="mt-2 font-display text-lg leading-snug group-hover:underline underline-offset-4">{r.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}
