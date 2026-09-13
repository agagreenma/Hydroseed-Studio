import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Clock, ChevronRight } from "lucide-react";
import { studioUrl } from "@/lib/site";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CLUSTERS, GUIDES } from "@/lib/journal";
import { fetchPublishedArticles, formatDate, type PublishedArticle } from "@/lib/public-content";

export const Route = createFileRoute("/journal")({
  loader: () => fetchPublishedArticles(),
  head: () => ({
    meta: [
      { title: "HYDROSEED Journal — Insight for erosion control and revegetation pros" },
      {
        name: "description",
        content:
          "Practical guides, industry analysis and operational insights for hydroseeding contractors, erosion control specialists and revegetation crews.",
      },
      { property: "og:title", content: "HYDROSEED Journal" },
      {
        property: "og:description",
        content: "Insight for modern hydroseeding and erosion control operations — from small slopes to large infrastructure sites.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: studioUrl("/journal") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HYDROSEED Journal" },
      { name: "twitter:description", content: "Insight for modern hydroseeding and erosion control operations." },
    ],
    links: [{ rel: "canonical", href: studioUrl("/journal") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "HYDROSEED Journal",
          description:
            "Practical guides and operational insights for hydroseeding, erosion control and revegetation teams.",
          url: studioUrl("/journal"),
        }),
      },
    ],
  }),
  component: JournalIndex,
});

function AuthorLine({ post, muted = false }: { post: PublishedArticle; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${muted ? "text-muted-foreground" : ""}`}>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-medium">
        {post.author.initials}
      </span>
      <span className="font-medium text-foreground">{post.author.name}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{formatDate(post.publishedAt)}</span>
      <span className="text-muted-foreground">·</span>
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Clock className="h-3 w-3" /> {post.readingMinutes} min
      </span>
    </div>
  );
}

function ArticleCard({ post, size = "md" }: { post: PublishedArticle; size?: "md" | "lg" }) {
  return (
    <Link
      to="/journal/articles/$slug"
      params={{ slug: post.slug }}
      className="group block"
    >
      <div className={`overflow-hidden rounded-lg border border-border bg-card ${size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {post.cover ? <img
          src={post.cover}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        /> : <div className="h-full w-full bg-muted" />}
      </div>
      <div className="mt-4">
        <div className="mono-label">{post.category}</div>
        <h3 className={`mt-2 font-display tracking-tight leading-tight ${size === "lg" ? "text-2xl" : "text-lg"}`}>
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-3">
          <AuthorLine post={post} muted />
        </div>
      </div>
    </Link>
  );
}

function JournalIndex() {
  const posts = Route.useLoaderData();
  const [topic, setTopic] = useState<string>("All");
  const [q, setQ] = useState("");

  const featured = posts[0];
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : [];
  const topics = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];

  const filtered = useMemo(() => {
    return rest.filter((p) => {
      const matchTopic =
        topic === "All" ||
        p.category === topic ||
        (topic === "Erosion Control" && p.category === "Erosion Control");
      const matchQ = q === "" || p.title.toLowerCase().includes(q.toLowerCase());
      return matchTopic && matchQ;
    });
  }, [rest, topic, q]);

  if (!featured) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-20 text-center lg:px-8">
          <div className="eyebrow">HYDROSEED Journal</div>
          <h1 className="mt-3 font-display text-3xl">No published articles yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">Published articles will appear here when they are ready.</p>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />

      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="eyebrow">HYDROSEED Journal</div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Insight for modern erosion control operations.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Practical guides, industry analysis and operational insights for hydroseeding
              contractors, erosion control specialists and site revegetation teams.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search the Journal"
                  className="w-full h-11 rounded-md border border-border bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring/60"
                />
              </div>
              <a
                href="#topics"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-4 text-sm hover:bg-muted"
              >
                Browse topics <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="mono-label mb-6">Featured</div>
          <Link
            to="/journal/articles/$slug"
            params={{ slug: featured.slug }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-14 items-center group"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card aspect-[4/3] lg:aspect-[5/4]">
              {featured.cover ? <img
                src={featured.cover}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              /> : <div className="h-full w-full bg-muted" />}
            </div>
            <div>
              <div className="mono-label">{featured.category}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
                {featured.title}
              </h2>
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="mt-6">
                <AuthorLine post={featured} />
              </div>
              <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* TOPICS FILTER */}
      <section id="topics" className="border-b border-border sticky top-16 z-30 bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 -mx-1 no-scrollbar">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`shrink-0 h-8 rounded-full border px-3.5 text-sm transition ${
                  topic === t
                    ? "bg-foreground text-background border-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST GRID */}
      <section>
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="mono-label">Latest</div>
              <h2 className="mt-2 font-display text-3xl tracking-tight">Recent articles</h2>
            </div>
            <div className="text-sm text-muted-foreground">{filtered.length} article{filtered.length === 1 ? "" : "s"}</div>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-border rounded-lg p-14 text-center">
              <div className="mono-label mb-2">Nothing here yet</div>
              <p className="text-sm text-muted-foreground">Try a different topic or clear your search.</p>
            </div>
          ) : (
            <div className="grid gap-y-14 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ArticleCard key={p.slug} post={p} size={i === 0 ? "lg" : "md"} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CLUSTERS */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-10">
            <div className="mono-label">Explore by topic</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight">
              Deep dives on the areas that shape modern revegetation work.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CLUSTERS.map((c) => (
              <a
                key={c.slug}
                href={`#topic-${c.slug}`}
                className="group block rounded-lg border border-border bg-card p-6 hover:border-border-strong transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl tracking-tight">{c.name}</h3>
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    {c.count} articles
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View topic <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR GUIDES */}
      <section>
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <div className="mono-label">Popular guides</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight">
                Long-form reference material for operators.
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Comprehensive guides written for contractor owners, project managers and crews building
                serious hydroseeding and erosion control capacity.
              </p>
            </div>
            <ol className="lg:col-span-2 divide-y divide-border border-y border-border">
              {GUIDES.map((g, i) => (
                <li key={g.slug}>
                  <a
                    href={`#guide-${g.slug}`}
                    className="group flex items-center gap-6 py-5 hover:bg-muted/40 transition -mx-2 px-2 rounded"
                  >
                    <span className="font-mono text-xs text-muted-foreground w-6 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-lg md:text-xl tracking-tight">
                      {g.title}
                    </span>
                    <span className="hidden sm:inline text-xs text-muted-foreground">{g.minutes} min</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mono-label">Newsletter</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight">
              Operate with greater clarity.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Receive practical hydroseeding and erosion control insights, new HYDROSEED guides and product updates.
              No noise.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="you@yourcrew.com"
                className="flex-1 h-11 rounded-md border border-border bg-card px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring/60"
              />
              <button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-95">
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              We respect your inbox. Unsubscribe with one click at any time.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCT CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mono-label">HYDROSEED Studio</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight">
                Turn operational knowledge into daily execution.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
                Plan projects, manage mix specs, coordinate crews and run your revegetation business from
                one connected operating system.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <a
                  href="#product"
                  className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95"
                >
                  Explore HYDROSEED
                </a>
                <a
                  href="#trial"
                  className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm hover:bg-muted"
                >
                  Start free trial
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 lg:p-10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { k: "Planning", v: "Weekly project scheduling" },
                  { k: "Inventory", v: "Live seed and mulch stock" },
                  { k: "Orders", v: "Civil, roadside, commercial jobs" },
                  { k: "Intelligence", v: "KPIs written in plain English" },
                ].map((f) => (
                  <div key={f.k}>
                    <div className="mono-label">{f.k}</div>
                    <div className="mt-1.5 text-sm">{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
