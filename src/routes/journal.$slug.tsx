import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { studioUrl } from "@/lib/site";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { getPost, relatedPosts, formatDate, POSTS } from "@/lib/journal";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found — HYDROSEED Journal" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const url = studioUrl(`/journal/${params.slug}`);
    return {
      meta: [
        { title: `${post.title} — HYDROSEED Journal` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: post.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.cover },
        { name: "author", content: post.author.name },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:modified_time", content: post.updatedAt },
        { property: "article:section", content: post.category },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { "@type": "Person", name: post.author.name },
            publisher: {
              "@type": "Organization",
              name: "HYDROSEED",
            },
            mainEntityOfPage: url,
            articleSection: post.category,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Blog", item: studioUrl("/journal") },
              { "@type": "ListItem", position: 2, name: post.category },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 grid place-items-center px-5 py-24">
        <div className="text-center max-w-md">
          <div className="mono-label mb-2">404</div>
          <h1 className="font-display text-3xl">This article isn't available</h1>
          <p className="mt-2 text-muted-foreground text-sm">It may have been moved or unpublished.</p>
          <Link to="/journal" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Link>
        </div>
      </div>
      <PublicFooter />
    </div>
  ),
  component: ArticlePage,
});

const TOC = [
  { id: "context", label: "The context" },
  { id: "capacity", label: "Production capacity" },
  { id: "costs", label: "Costs and margins" },
  { id: "pricing", label: "Pricing strategy" },
  { id: "labor", label: "Labor and workflow" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ = [
  {
    q: "How much slope area can a standard hydroseeding crew realistically cover in a day?",
    a: "A well-run two-person crew running a mid-size hydro-mulcher typically covers several thousand square metres of slope per day, depending on access, slope gradient and mix specification.",
  },
  {
    q: "What is the largest recurring cost for a small erosion control contractor?",
    a: "Labor and mobilization are almost always the largest recurring costs, followed by seed, mulch fibre and tackifier. Equipment maintenance is meaningful but rarely dominant compared with material spend.",
  },
  {
    q: "Should a contractor prioritize civil, roadside or commercial landscaping jobs first?",
    a: "Most contractors start with civil and roadside work for steady recurring contracts and predictable specs, then layer commercial landscaping once crew scheduling is reliable.",
  },
];

function ArticlePage() {
  const { post } = Route.useLoaderData();
  const related = relatedPosts(post.slug, post.category, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-4 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link to="/journal" className="hover:text-foreground">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{post.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-[860px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="mono-label">{post.category}</div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            {post.title}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-medium">
                {post.author.initials}
              </span>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-muted-foreground">{post.author.role}</div>
              </div>
            </div>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              Published {formatDate(post.publishedAt)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Updated {formatDate(post.updatedAt)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-8">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full rounded-xl border border-border object-cover aspect-[16/9]"
          />
        </div>
      </div>

      {/* Body */}
      <section>
        <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-14 grid gap-14 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mono-label mb-3">On this page</div>
              <ul className="space-y-2 text-sm">
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-muted-foreground hover:text-foreground">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <article className="max-w-[680px] mx-auto lg:mx-0 text-[17px] leading-[1.75] text-foreground/90">
            <p className="text-xl leading-relaxed text-foreground">
              A serious hydroseeding operation is less about spray-rig skill and more about the honest
              math behind coverage, labor and pricing. This piece breaks down how a professional
              crew actually earns money on a project — and where most contractors quietly lose it.
            </p>

            <h2 id="context" className="font-display text-3xl mt-12 tracking-tight">The context</h2>
            <p className="mt-4">
              We use a benchmark crew: a two-person team running a 3,000-litre hydro-mulcher, a mixed
              slope and roadside project load, and a channel strategy weighted toward civil
              contracts. Values here are directionally correct across most European and North
              American markets.
            </p>

            <blockquote className="mt-8 border-l-2 border-primary pl-5 italic text-lg text-foreground/85">
              &ldquo;The contractors that succeed at this scale don&rsquo;t out-bid the market — they
              out-operate it. Consistency is the moat.&rdquo;
            </blockquote>

            <h2 id="capacity" className="font-display text-3xl mt-12 tracking-tight">Production capacity</h2>
            <p className="mt-4">
              With a well-tuned rig and efficient site access, a well-managed crew supports roughly
              4,000–6,000&nbsp;m&sup2; of slope coverage per day, applying 2,000–4,000&nbsp;kg of
              seed and mulch mix per week when planned carefully.
            </p>

            <div className="mt-8 rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Mix type</th>
                    <th className="px-4 py-2.5 font-medium">Application rate</th>
                    <th className="px-4 py-2.5 font-medium">Coverage / load</th>
                    <th className="px-4 py-2.5 font-medium">Cost €/m&sup2;</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {[
                    ["Wood fibre mulch", "2,000 kg/ha", "1,800 m²", "0.18"],
                    ["Bonded fibre matrix (BFM)", "3,500 kg/ha", "1,200 m²", "0.32"],
                    ["Straw + tackifier", "2,500 kg/ha", "1,600 m²", "0.22"],
                    ["Soil stabilizing mulch (SMM)", "4,000 kg/ha", "1,000 m²", "0.40"],
                    ["Native seed blend", "40 kg/ha", "2,000 m²", "0.26"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((c, i) => (
                        <td key={i} className={`px-4 py-2.5 ${i === 3 ? "font-mono tabular-nums" : ""}`}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 id="costs" className="font-display text-3xl mt-12 tracking-tight">Costs and margins</h2>
            <p className="mt-4">
              For most contractor operations, cost of goods breaks down roughly as:
            </p>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>Labor: 40–50% of revenue</li>
              <li>Seed, mulch and tackifier: 20–28%</li>
              <li>Equipment and fuel: 8–12%</li>
              <li>Mobilization: 5–8%</li>
              <li>Site travel: 3–8% depending on radius</li>
            </ul>

            <div className="mt-8 rounded-lg border border-primary/30 bg-primary-soft/50 p-5">
              <div className="mono-label text-primary">Operator note</div>
              <p className="mt-2 text-sm">
                Contractors that standardize mix specs and pre-load hoppers first — not chase bigger
                rigs — consistently gain the most margin in year two. Labor is the lever.
              </p>
            </div>

            <h2 id="pricing" className="font-display text-3xl mt-12 tracking-tight">Pricing strategy</h2>
            <p className="mt-4">
              Civil project pricing should anchor on total slope stabilization outcome, not on cost-plus
              alone. A specifier will accept a premium BFM rate without hesitation — but only if
              coverage, germination and compliance documentation are consistently correct.
            </p>

            <h2 id="labor" className="font-display text-3xl mt-12 tracking-tight">Labor and workflow</h2>
            <p className="mt-4">
              A single trained crew lead can manage a multi-site weekly schedule in 25–32 hours of
              planning once workflows stabilise. The step-change comes from documenting SOPs and
              running the same mix-prep day, application day, and inspection day each week.
            </p>

            <h2 id="faq" className="font-display text-3xl mt-12 tracking-tight">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {FAQ.map((f) => (
                <div key={f.q} className="py-5">
                  <div className="font-medium">{f.q}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl mt-12 tracking-tight">References</h2>
            <ol className="mt-4 space-y-1.5 text-sm text-muted-foreground list-decimal pl-5">
              <li>Industry survey — Sample erosion control contractor benchmarking (2024).</li>
              <li>Sample dataset — Regional revegetation project indicators (2023).</li>
              <li>HYDROSEED benchmark dataset — sample contractor operations, 2025–2026.</li>
            </ol>
          </article>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="mono-label mb-6">Related articles</div>
          <div className="grid gap-y-12 gap-x-10 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/journal/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="overflow-hidden rounded-lg border border-border bg-card aspect-[4/3]">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" loading="lazy" />
                </div>
                <div className="mt-4">
                  <div className="mono-label">{p.category}</div>
                  <h3 className="mt-2 font-display text-lg tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter mini */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[820px] px-5 lg:px-8 py-14 text-center">
          <div className="mono-label">Newsletter</div>
          <h2 className="mt-3 font-display text-3xl tracking-tight">Keep reading, weekly.</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            One considered email each week — new HYDROSEED guides, product updates and operational insight.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="you@yourcrew.com"
              className="flex-1 h-11 rounded-md border border-border bg-card px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Product CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 lg:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="mono-label">HYDROSEED Studio</div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl tracking-tight max-w-lg">
              Run the operation you just read about — from one connected system.
            </h2>
          </div>
          <div className="flex gap-2">
            <a href="#product" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95">
              Explore HYDROSEED
            </a>
            <a href="#trial" className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm hover:bg-muted">
              Start free trial
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

// Force include for TS
export const _all = POSTS.length;
