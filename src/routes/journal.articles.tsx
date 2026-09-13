import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { fetchPublishedArticles, formatDate, type PublishedArticle } from "@/lib/public-content";

export const Route = createFileRoute("/journal/articles")({
  loader: () => fetchPublishedArticles(),
  head: () => ({
    meta: [
      { title: "Articles — HYDROSEED Journal" },
      {
        name: "description",
        content: "Published HYDROSEED articles on hydroseeding, erosion control and revegetation.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: ArticlesPage,
});

function ArticleCard({ article }: { article: PublishedArticle }) {
  return (
    <article className="group">
      <Link
        to="/journal/articles/$slug"
        params={{ slug: article.slug }}
        className="block overflow-hidden rounded-md border border-border"
      >
        {article.cover ? (
          <img
            src={article.cover}
            alt={article.title}
            className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="aspect-[4/3] bg-muted" />
        )}
      </Link>
      <div className="mono-label mt-4">{article.section}</div>
      <h2 className="mt-2 font-display text-xl leading-snug">
        <Link
          to="/journal/articles/$slug"
          params={{ slug: article.slug }}
          className="hover:underline"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{article.dek}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{article.author.name}</span>
        <span>·</span>
        <span>{formatDate(article.publishedAt)}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {article.readingMinutes} min
        </span>
      </div>
    </article>
  );
}

function ArticlesPage() {
  const articles = Route.useLoaderData();
  const [section, setSection] = useState("All");
  const [q, setQ] = useState("");
  const sections = ["All", ...Array.from(new Set(articles.map((article) => article.section)))];
  const filtered = useMemo(
    () =>
      articles.filter(
        (article) =>
          (section === "All" || article.section === section) &&
          (q === "" || `${article.title} ${article.dek}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [articles, q, section],
  );
  const [lead, ...rest] = filtered;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 md:py-20">
          <div className="mono-label mb-3">HYDROSEED Journal</div>
          <h1 className="max-w-4xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
            Published articles for modern erosion control.
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Field reports, analysis and practical knowledge from the HYDROSEED editorial library.
          </p>
        </div>
      </section>
      <section className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-5 py-4 lg:px-8">
          <div className="flex flex-wrap gap-1.5">
            {sections.map((value) => (
              <button
                key={value}
                onClick={() => setSection(value)}
                className={`h-8 rounded-full border px-3 text-xs ${section === value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search articles"
              className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>
      <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-14 lg:px-8">
        {lead ? (
          <section className="mb-14 grid items-start gap-10 border-b border-border pb-12 md:grid-cols-[1.15fr_1fr]">
            <Link
              to="/journal/articles/$slug"
              params={{ slug: lead.slug }}
              className="group block overflow-hidden rounded-lg border border-border"
            >
              {lead.cover ? (
                <img
                  src={lead.cover}
                  alt={lead.title}
                  className="aspect-[16/10] w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="aspect-[16/10] bg-muted" />
              )}
            </Link>
            <div>
              <div className="mono-label mb-3">Featured · {lead.section}</div>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                <Link
                  to="/journal/articles/$slug"
                  params={{ slug: lead.slug }}
                  className="hover:underline"
                >
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead.dek}</p>
              <div className="mt-6 text-sm">
                {lead.author.name} · {formatDate(lead.publishedAt)} · {lead.readingMinutes} min read
              </div>
            </div>
          </section>
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No published articles are available.
          </div>
        )}
        {rest.length > 0 && (
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <NewsletterCTA />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}
