import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { fetchPublishedArticle, fetchPublishedArticles, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/articles/$slug")({
  loader: async ({ params }) => {
    const article = await fetchPublishedArticle(params.slug);
    if (!article) throw notFound();
    return {
      article,
      related: (await fetchPublishedArticles())
        .filter((item) => item.slug !== article.slug)
        .slice(0, 3),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Article not found — HYDROSEED Journal" },
          { name: "robots", content: "noindex" },
        ],
      };
    const article = loaderData.article;
    const seo = article.seo;
    return {
      meta: [
        { title: `${seo.meta_title ?? article.title} — HYDROSEED Journal` },
        { name: "description", content: seo.meta_description ?? article.dek },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: seo.meta_title ?? article.title },
        { property: "og:description", content: seo.meta_description ?? article.dek },
        { property: "og:type", content: "article" },
        { property: "og:url", content: article.canonicalUrl },
        ...(article.cover ? [{ property: "og:image", content: article.cover }] : []),
      ],
      links: [{ rel: "canonical", href: article.canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.dek,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            mainEntityOfPage: article.canonicalUrl,
            author: { "@type": "Person", name: article.author.name },
          }),
        },
      ],
    };
  },
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article, related } = Route.useLoaderData();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />
      <article>
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8">
            <Link
              to="/journal/articles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <div className="mono-label mt-6">{article.section}</div>
            <h1 className="mt-3 max-w-5xl font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {article.dek}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm">
              <div>
                <div className="font-medium">{article.author.name}</div>
                <div className="text-xs text-muted-foreground">{article.author.role}</div>
              </div>
              <div className="text-muted-foreground">{formatDate(article.publishedAt)}</div>
              <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} min read
              </div>
              <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm hover:bg-muted">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>
        {article.cover && (
          <img
            src={article.cover}
            alt={article.title}
            className="w-full aspect-[16/7] object-cover"
          />
        )}
        <div className="mx-auto max-w-[720px] px-5 py-14 lg:px-0">
          {article.body.map((block, index) => (
            <div key={index} className="mb-8">
              {block.heading && (
                <h2 className="mt-10 mb-4 font-display text-2xl tracking-tight md:text-3xl">
                  {block.heading}
                </h2>
              )}
              <p className="text-[17px] leading-[1.75] text-foreground/90">{block.paragraph}</p>
            </div>
          ))}
          <div className="mt-14 rounded-lg border border-border bg-accent/40 p-6">
            <div className="mono-label mb-2">About the author</div>
            <div className="font-medium">{article.author.name}</div>
            <div className="text-sm text-muted-foreground">
              {article.author.role} at HYDROSEED Studio.
            </div>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8">
            <div className="mono-label mb-6">Keep reading</div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to="/journal/articles/$slug"
                  params={{ slug: item.slug }}
                  className="group"
                >
                  <h3 className="font-display text-lg leading-snug group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.dek}</p>
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
