import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticlePresentation } from "@/components/public/ArticlePresentation";
import { fetchPublishedArticle, fetchPublishedArticles } from "@/lib/public-content";

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
  return <ArticlePresentation article={article} related={related} />;
}
