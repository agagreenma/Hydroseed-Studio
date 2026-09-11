import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ARTICLES, AUTHORS, CATEGORIES, LANGS, authorById } from "@/lib/mock";
import { StatusBadge } from "@/components/studio/StatusBadge";
import {
  ChevronLeft, Eye, Calendar, MoreHorizontal, Save, Bold, Italic, Heading1, Heading2,
  List, ListOrdered, Quote, Code, Image as ImageIcon, Link2, Table as TableIcon,
  CheckCircle2, XCircle, AlertTriangle, Info,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/blog/$id")({
  loader: ({ params }) => {
    const article = ARTICLES.find((a) => a.id === params.id);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Article"} · HYDROSEED Studio` },
      { name: "description", content: "Edit article in HYDROSEED Studio." },
    ],
  }),
  component: Editor,
});

type Tab = "general" | "seo" | "social" | "schema" | "localization" | "relations";

function Editor() {
  const article = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("general");
  const author = authorById(article.author);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      {/* Editor top bar */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Link to="/blog" className="p-1.5 rounded-md hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{article.title}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={article.status} />
                <span className="inline-flex items-center gap-1"><Save className="h-3 w-3" /> Saved just now</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <Eye className="h-4 w-4" /> Preview
            </button>
            <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <Calendar className="h-4 w-4" /> Schedule
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95">
              Publish
            </button>
            <button className="p-2 rounded-md hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px] sm:px-6">
        {/* Main editor */}
        <div className="min-w-0">
          <div className="surface-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
              {[Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Code, ImageIcon, Link2, TableIcon].map((I, i) => (
                <button key={i} className="grid h-8 w-8 place-items-center rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                  <I className="h-4 w-4" />
                </button>
              ))}
              <div className="ml-auto text-xs text-muted-foreground pr-1">~1,240 words · 5 min read</div>
            </div>

            {/* Cover */}
            <div className="relative">
              <img src={article.cover} alt="" className="h-52 w-full object-cover" />
              <button className="absolute right-3 top-3 rounded-md border border-border bg-card/95 px-2.5 py-1 text-xs hover:bg-card">
                Replace cover
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-8 sm:px-10">
              <input
                defaultValue={article.title}
                className="w-full border-0 bg-transparent text-3xl sm:text-4xl font-display font-normal tracking-[-0.028em] leading-tight text-foreground focus:outline-none"
              />
              <textarea
                defaultValue={article.excerpt}
                rows={2}
                className="mt-4 w-full resize-none border-0 bg-transparent text-lg leading-relaxed text-muted-foreground focus:outline-none"
              />
              <hr className="my-6 border-border" />
              <article className="prose prose-slate max-w-none text-[15px] leading-7 text-foreground">
                <p>
                  Bidding a profitable hydroseeding job is less about the rig and more about mix efficiency.
                  In this piece we walk through the unit economics of a 2-acre slope stabilization job,
                  with realistic material costs and a contractor-focused bid price.
                </p>
                <h2 className="mt-8 text-xl font-display font-normal tracking-[-0.02em]">1. What you actually spend</h2>
                <p>
                  Fixed costs — equipment amortisation, crew and mobilisation — are usually 60–70% of job outflow.
                  Variable costs (seed, mulch, tackifier) scale with area. The good news: they are highly
                  predictable once you stabilise your mix ratios.
                </p>
                <div className="my-5 rounded-md border border-primary/20 bg-primary-soft/60 p-4">
                  <div className="mono-label mb-1 text-primary">Callout</div>
                  <p className="m-0 text-sm text-foreground">
                    <strong>Rule of thumb:</strong> under 2,000 lbs/acre of wood fibre mulch, your
                    erosion-control performance can fall below spec on steep slopes.
                  </p>
                </div>
                <h2 className="mt-8 text-xl font-display font-normal tracking-[-0.02em]">2. Bidding to contractors</h2>
                <p>
                  General contractors care about compliance and consistency more than price. A stable
                  per-acre bid with SWPPP documentation wins over an occasional discount quote.
                </p>
                <ul>
                  <li>Mobilize early to reduce weather-window risk.</li>
                  <li>Standardise mix reporting to keep site inspections fast.</li>
                  <li>Offer a bundled "slope package" for multi-phase sites.</li>
                </ul>
                <p className="text-muted-foreground italic mt-6">Continue writing…</p>
              </article>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <aside className="min-w-0">
          <div className="surface-card sticky top-32">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
              {(["general", "seo", "social", "schema", "localization", "relations"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-2.5 py-1.5 text-xs capitalize transition ${
                    tab === t ? "bg-primary-soft text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === "general" && <GeneralPanel article={article} authorName={author.name} />}
              {tab === "seo" && <SeoPanel article={article} />}
              {tab === "social" && <SocialPanel article={article} />}
              {tab === "schema" && <SchemaPanel article={article} />}
              {tab === "localization" && <LocalizationPanel />}
              {tab === "relations" && <RelationsPanel />}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <div className="mono-label">{label}</div>
      {children}
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </label>
  );
}

const inputCls =
  "w-full h-9 rounded-md border border-border bg-card px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";

function GeneralPanel({ article, authorName }: { article: any; authorName: string }) {
  return (
    <div className="space-y-4">
      <Field label="Slug"><input className={inputCls} defaultValue={article.slug} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Author">
          <select className={inputCls} defaultValue={article.author}>
            {AUTHORS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select className={inputCls} defaultValue={article.category}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Tags"><input className={inputCls} defaultValue={article.tags.join(", ")} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Language">
          <select className={inputCls} defaultValue={article.language}>
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls} defaultValue={article.status}>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>
      <Field label="Publish date"><input type="datetime-local" className={inputCls} /></Field>
      <Field label="Canonical URL"><input className={inputCls} placeholder={`https://hydroseed.app/blog/${article.slug}`} /></Field>
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
        <span>NoIndex</span>
        <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" />
      </div>
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
        <span>NoFollow</span>
        <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" />
      </div>
      <div className="text-xs text-muted-foreground">Author currently: {authorName}</div>
    </div>
  );
}

function SeoPanel({ article }: { article: any }) {
  const checks = [
    { ok: true, label: "Meta title within 60 characters" },
    { ok: true, label: "Meta description within 160 characters" },
    { ok: false, label: "Focus keyword appears in H1" },
    { ok: false, label: "3 images missing alt text" },
    { ok: true, label: "Reading grade appropriate (Grade 8)" },
    { ok: true, label: "At least 2 internal links" },
  ];
  return (
    <div className="space-y-4">
      <Field label="Focus keyword"><input className={inputCls} defaultValue="hydroseeding erosion control" /></Field>
      <Field label="Meta title" hint="55 / 60"><input className={inputCls} defaultValue={`${article.title} · HYDROSEED`} /></Field>
      <Field label="Meta description" hint="152 / 160">
        <textarea className="w-full min-h-[80px] rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" defaultValue={article.excerpt} />
      </Field>

      <div className="rounded-md border border-border p-3">
        <div className="mono-label mb-2">Search preview</div>
        <div className="text-[13px] text-info truncate">hydroseed.app › blog › {article.slug}</div>
        <div className="text-[15px] text-[#1a0dab] leading-snug line-clamp-2">{article.title} · HYDROSEED</div>
        <div className="text-[13px] text-muted-foreground line-clamp-2">{article.excerpt}</div>
      </div>

      <div>
        <div className="mono-label mb-2">SEO checklist</div>
        <ul className="space-y-1.5">
          {checks.map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              {c.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
              <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SocialPanel({ article }: { article: any }) {
  return (
    <div className="space-y-4">
      <Field label="Open Graph title"><input className={inputCls} defaultValue={article.title} /></Field>
      <Field label="Open Graph description">
        <textarea className="w-full min-h-[70px] rounded-md border border-border bg-card p-2.5 text-sm" defaultValue={article.excerpt} />
      </Field>
      <Field label="Open Graph image">
        <div className="overflow-hidden rounded-md border border-border">
          <img src={article.cover} alt="" className="h-32 w-full object-cover" />
        </div>
      </Field>

      <div className="rounded-md border border-border p-3">
        <div className="mono-label mb-2">X / Twitter preview</div>
        <div className="overflow-hidden rounded-md border border-border">
          <img src={article.cover} alt="" className="h-24 w-full object-cover" />
          <div className="p-2.5 bg-card">
            <div className="text-[11px] text-muted-foreground">hydroseed.app</div>
            <div className="text-sm font-medium line-clamp-1">{article.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SchemaPanel({ article }: { article: any }) {
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: authorById(article.author).name },
    datePublished: article.publishAt ?? null,
    dateModified: article.updatedAt,
    inLanguage: article.language,
    image: article.cover,
  };
  return (
    <div className="space-y-4">
      <Field label="Schema type">
        <select className={inputCls} defaultValue="BlogPosting">
          <option>BlogPosting</option>
          <option>Article</option>
          <option>NewsArticle</option>
        </select>
      </Field>
      <div>
        <div className="mono-label mb-2">FAQ entries</div>
        <div className="space-y-2">
          {["What seed mix works for steep slopes?", "How much mulch does a 2-acre site need?"].map((q, i) => (
            <div key={i} className="rounded-md border border-border p-2.5">
              <div className="text-sm font-medium">{q}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Answer configured · 2 sentences</div>
            </div>
          ))}
          <button className="w-full rounded-md border border-dashed border-border py-2 text-xs text-muted-foreground hover:text-foreground">
            + Add FAQ entry
          </button>
        </div>
      </div>
      <div>
        <div className="mono-label mb-2">JSON-LD preview</div>
        <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-[11px] leading-relaxed text-foreground">
{JSON.stringify(jsonld, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function LocalizationPanel() {
  const trans = [
    { code: "en", label: "English", state: "source", complete: 100 },
    { code: "fr", label: "Français", state: "published", complete: 100 },
    { code: "es", label: "Español", state: "draft", complete: 62 },
    { code: "ar", label: "العربية (RTL)", state: "missing", complete: 0 },
  ];
  return (
    <div className="space-y-3">
      <div className="mono-label">Translations</div>
      <ul className="space-y-2">
        {trans.map((t) => (
          <li key={t.code} className="rounded-md border border-border p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="chip font-mono uppercase">{t.code}</span>
                <span className="text-sm">{t.label}</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">{t.state}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${t.complete}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelationsPanel() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mono-label mb-2">Related articles</div>
        <ul className="space-y-1.5">
          {ARTICLES.slice(0, 3).map((a) => (
            <li key={a.id} className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
              <img src={a.cover} alt="" className="h-7 w-9 rounded object-cover" />
              <span className="truncate">{a.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mono-label mb-2 flex items-center gap-1.5">
          <Info className="h-3 w-3" /> Internal linking suggestions
        </div>
        <ul className="space-y-1.5 text-sm">
          <li className="rounded-md bg-primary-soft/60 border border-primary/20 p-2 text-primary">
            Link "seed mix ratios" → /blog/hydroseed-mix-ratios
          </li>
          <li className="rounded-md border border-border p-2">
            Link "bidding playbook" → /resources/hydroseeding-bid-playbook
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-warn/30 bg-warn/10 p-2.5 text-xs text-warn-foreground">
        <AlertTriangle className="h-3.5 w-3.5" /> 2 outbound links haven't been checked in 30 days.
      </div>
    </div>
  );
}
