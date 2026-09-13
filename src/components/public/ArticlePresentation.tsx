import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { formatDate, type PublishedArticle } from "@/lib/public-content";

type Props = {
  article: PublishedArticle;
  related?: PublishedArticle[];
  preview?: boolean;
};

export function ArticlePresentation({ article, related = [], preview = false }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {preview && (
        <div className="border-b border-primary/20 bg-primary-soft px-5 py-2 text-center text-xs font-medium text-primary">
          Preview · Not publicly published
        </div>
      )}
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
          <img src={article.cover} alt={article.title} className="w-full aspect-[16/7] object-cover" />
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
            <div className="text-sm text-muted-foreground">{article.author.role} at HYDROSEED Studio.</div>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8">
            <div className="mono-label mb-6">Keep reading</div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} to="/journal/articles/$slug" params={{ slug: item.slug }} className="group">
                  <h3 className="font-display text-lg leading-snug group-hover:underline">{item.title}</h3>
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