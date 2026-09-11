import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import {
  Layers, GitBranch, Network, Workflow, ShieldCheck, Plug, FolderTree,
  Database, Ruler, Map as MapIcon, ArrowRight, Target, Boxes, Share2,
  TrendingUp, ServerCog, Compass, Palette, Repeat, Cloud, Bot, Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture Blueprint · HYDROSEED Studio" },
      {
        name: "description",
        content:
          "Final approved architecture blueprint for HYDROSEED Studio: independent deployment, 21 modules, publishing workflow, growth layer, data entities, AI development playbook and delivery roadmap.",
      },
      { property: "og:title", content: "HYDROSEED Studio — Architecture Blueprint" },
      {
        property: "og:description",
        content:
          "Conceptual system document describing how HYDROSEED Studio operates as an independent internal content and growth operating system at studio.hydroseed.app.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HYDROSEED Studio — Architecture Blueprint" },
      {
        name: "twitter:description",
        content: "Final blueprint: independence, modules, workflow, entities, AI playbook and roadmap.",
      },
    ],
  }),
  component: Architecture,
});

/* ── primitives ─────────────────────────────────────────── */

function Section({
  n, id, icon: Icon, title, kicker, children,
}: {
  n: string; id: string; icon: LucideIcon; title: string; kicker?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-start gap-3 border-b border-border pb-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="eyebrow">Section {n}</div>
          <h2 className="h-display text-xl sm:text-2xl text-foreground">{title}</h2>
          {kicker && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{kicker}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Node({ label, sub, tone }: { label: string; sub?: string; tone?: "primary" | "muted" }) {
  return (
    <div
      className={`surface-card px-3.5 py-2.5 text-center ${
        tone === "primary" ? "border-primary/30 bg-primary-soft" : ""
      }`}
    >
      <div className="text-sm font-medium text-foreground">{label}</div>
      {sub && <div className="mono-label mt-1">{sub}</div>}
    </div>
  );
}

function Arrow() {
  return (
    <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" aria-hidden />
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

/* ── data ───────────────────────────────────────────────── */

const MODULES: { group: string; items: { name: string; note: string }[] }[] = [
  {
    group: "Workspace",
    items: [
      { name: "Overview", note: "Editorial control room" },
      { name: "Architecture", note: "This blueprint" },
    ],
  },
  {
    group: "Publishing",
    items: [
      { name: "Landing Pages", note: "Campaign surfaces (coming soon)" },
      { name: "Blog", note: "Editorial articles" },
      { name: "Resources", note: "Gated + open assets" },
      { name: "Documentation", note: "Product reference" },
      { name: "Academy", note: "Courses & lessons" },
      { name: "Case Studies", note: "Customer proof" },
      { name: "Newsletter", note: "Campaign composition (coming soon)" },
    ],
  },
  {
    group: "Growth",
    items: [
      { name: "SEO", note: "Metadata, audits, GEO" },
      { name: "Analytics", note: "Content performance" },
      { name: "Integrations", note: "Marketing providers" },
      { name: "Media Library", note: "Assets & derivatives" },
      { name: "Redirects", note: "URL lifecycle" },
      { name: "Taxonomy", note: "Categories, tags, clusters" },
    ],
  },
  {
    group: "System",
    items: [
      { name: "Team", note: "Roles & permissions" },
      { name: "Settings", note: "Locales & workspace" },
    ],
  },
];

const RELATIONS: { from: string; rel: string; to: string }[] = [
  { from: "Pages", rel: "has one", to: "SEO metadata" },
  { from: "Articles", rel: "belongs to", to: "Authors" },
  { from: "Articles", rel: "belongs to", to: "Categories" },
  { from: "Articles", rel: "many-to-many", to: "Tags" },
  { from: "Topics", rel: "group into", to: "Content clusters" },
  { from: "Articles / Pages", rel: "reference", to: "Media assets" },
  { from: "Pages", rel: "emit on slug change", to: "Redirects" },
  { from: "Content item", rel: "translated into", to: "Locales (EN/FR/ES/AR)" },
  { from: "Content item", rel: "carries", to: "Publishing status" },
  { from: "Content item", rel: "accumulates", to: "Version history" },
  { from: "Version history", rel: "restores into", to: "Draft" },
  { from: "Every transition", rel: "writes", to: "Audit log" },
];

const WORKFLOW = [
  "Author", "Draft", "In Review", "SEO Review", "Approved",
  "Scheduled", "Published", "Updated", "Archived",
];

const ROLES: { role: string; can: string }[] = [
  { role: "Writer", can: "Create and edit drafts, submit for review" },
  { role: "Editor", can: "Review content, request changes, approve editorial quality" },
  { role: "SEO Reviewer", can: "Validate metadata, slugs, redirects, indexing and structured data" },
  { role: "Publisher", can: "Schedule, publish, update, unpublish, archive" },
  { role: "Administrator", can: "Manage roles, locales, integrations, workspace configuration" },
];

const TRUTH: { owner: string; owns: string; tone?: "warn" }[] = [
  {
    owner: "Definition",
    owns: "HYDROSEED Studio is the source of truth for HYDROSEED-owned editorial, marketing, educational, documentation and public brand content.",
  },
  {
    owner: "Exclusion",
    owns: "HYDROSEED Studio does not own field operational data, jobs, crews, materials, seed and mulch recipes, batches, QA records, equipment telemetry or HYDROSEED Field Intelligence recommendations.",
    tone: "warn",
  },
  { owner: "HYDROSEED Studio", owns: "Editorial content, metadata, media, taxonomy, publishing state and versions" },
  { owner: "Main HYDROSEED application", owns: "Homepage, authentication, dashboard, HYDROSEED OS, Field, Jobs, Crews, Materials, Recipes, Batches, QA" },
  {
    owner: "Constraint",
    owns: "Studio must never be merged into the hydroseed.app codebase and must never write operational data into it.",
    tone: "warn",
  },
  {
    owner: "Constraint",
    owns: "Public rendering remains owned by the independent hydroseed.app project. Studio manages structured content only.",
    tone: "warn",
  },
];

const PLATFORM_BOUNDARIES: { name: string; note: string }[] = [
  { name: "Main HYDROSEED application", note: "Independent app at hydroseed.app — no shared runtime" },
  { name: "HYDROSEED Field Core", note: "Jobs, crews, materials, batches — outside Studio ownership" },
  { name: "HYDROSEED Field Intelligence", note: "Recommendations — outside Studio ownership" },
  { name: "QA & Compliance", note: "Field QA records and reporting — outside Studio ownership" },
  { name: "Public website", note: "Rendering surface owned by hydroseed.app" },
  { name: "Media storage", note: "Studio-owned asset storage, provisioned separately" },
];

const MARKETING_INTEGRATIONS: { group: string; items: string[] }[] = [
  { group: "Analytics", items: ["Google Analytics 4", "Google Search Console", "Vercel Analytics", "PostHog", "Mixpanel"] },
  { group: "Advertising", items: ["Google Ads", "Meta Pixel", "TikTok Pixel", "LinkedIn Insight Tag", "Microsoft Ads"] },
  { group: "Email", items: ["Resend", "Beehiiv", "Mailchimp"] },
  { group: "Automation", items: ["Zapier", "Make", "n8n"] },
  { group: "CRM", items: ["HubSpot"] },
];

const FOLDERS = `src/
  features/
    overview/         architecture/     landing-pages/
    blog/             resources/        documentation/
    academy/          case-studies/     newsletter/
    seo/              analytics/
    integrations/     media/            redirects/
    taxonomy/         team/             settings/
  lib/
    content/          publishing/       permissions/
    localization/     seo/              media/
    integrations/     audit/
  routes/
  components/
  styles/`;

const ENTITIES: { name: string; note: string }[] = [
  { name: "content_items", note: "Polymorphic base: status, locale, owner, timestamps" },
  { name: "pages", note: "Structured website and landing surfaces" },
  { name: "articles", note: "Editorial long-form content" },
  { name: "authors", note: "Bylines mapped to team members" },
  { name: "categories", note: "Single-parent classification" },
  { name: "tags", note: "Free-form cross-cutting labels" },
  { name: "topics", note: "Search-intent groupings across modules" },
  { name: "content_clusters", note: "Pillar and supporting content graphs" },
  { name: "media_assets", note: "Originals, alt text, derivatives, usage" },
  { name: "seo_metadata", note: "Title, description, canonical, OG, schema" },
  { name: "redirects", note: "Source, target, code, origin content item" },
  { name: "publishing_versions", note: "Immutable snapshots per transition" },
  { name: "publishing_workflows", note: "State machine and role gates" },
  { name: "review_comments", note: "Review threads bound to versions" },
  { name: "scheduled_publications", note: "Future-dated transitions" },
  { name: "newsletter_campaigns", note: "Composition, audience, dispatch state" },
  { name: "integrations", note: "Provider catalogue and capabilities" },
  { name: "integration_connections", note: "Per-workspace connection state and credentials reference" },
  { name: "audit_logs", note: "Who changed what, when and from which role" },
  { name: "locales", note: "EN, FR, ES, AR with direction and fallbacks" },
];

const STANDARDS = [
  "One source of truth per content domain.",
  "No duplicated publishing logic.",
  "No direct operational writes to the main HYDROSEED application.",
  "Every content item supports status, author, timestamps, locale, SEO metadata, version history and audit history.",
  "Public and private access must remain separate.",
  "All modules must support English, French, Spanish and Arabic.",
  "Arabic must be RTL-safe at layout and component level.",
  "Every feature must define owner, permissions, dependencies, data source, publishing impact and failure states.",
  "No feature may modify an unrelated module.",
  "No routing library changes without explicit approval.",
  "No new UI package without explicit approval.",
  "No database migration without an approved schema plan.",
  "No direct production changes without tests and rollback instructions.",
  "Preserve backward compatibility unless explicitly approved.",
];

const AI_RULES: { n: string; title: string; points: string[] }[] = [
  {
    n: "01", title: "Read before writing",
    points: [
      "Inspect the Architecture Blueprint, project structure, design tokens, routes, components and data models.",
      "Understand the current task scope before editing anything.",
      "Never assume a feature is missing before searching the project.",
    ],
  },
  {
    n: "02", title: "One task at a time",
    points: [
      "Implement only the approved task.",
      "No unrelated features, redesigns, renames or refactors.",
      "No navigation, colour, typography or package changes without approval.",
    ],
  },
  {
    n: "03", title: "Audit before implementation",
    points: [
      "Report existing related files, routes, components and data dependencies.",
      "Report conflicts, missing requirements and a proposed plan.",
      "List the files expected to change before starting.",
    ],
  },
  {
    n: "04", title: "Preserve the stack",
    points: [
      "Do not replace the framework, router, design system, editor, state management or database provider.",
      "Stack changes require explicit approval.",
    ],
  },
  {
    n: "05", title: "Source of truth",
    points: [
      "Priority order: repository, Architecture Blueprint, approved task instructions, design system, existing tests.",
      "Never invent architecture that conflicts with these sources.",
    ],
  },
  {
    n: "06", title: "File change discipline",
    points: [
      "Report files added, modified and deleted.",
      "Report database, route and dependency changes.",
      "Report known limitations and tests performed. No hidden changes.",
    ],
  },
  {
    n: "07", title: "Error prevention",
    points: [
      "Verify TypeScript, build, routes, navigation and imports.",
      "No console errors, duplicate components or missing responsive states.",
      "No unintended visual regressions, committed secrets or exposed production data.",
    ],
  },
  {
    n: "08", title: "Database safety",
    points: [
      "Audit existing schema, then define entities, relationships and indexes.",
      "Define RLS, permissions, migration order and rollback plan.",
      "Never create random tables or fields without an approved data model.",
    ],
  },
  {
    n: "09", title: "Security",
    points: [
      "Consider authentication, authorization, roles, RLS and input validation.",
      "Validate file uploads, manage secrets and write audit logs.",
      "Never disable security to make a feature work.",
    ],
  },
  {
    n: "10", title: "Design consistency",
    points: [
      "Reuse existing typography, colours, spacing, cards, tables, forms and modals.",
      "Reuse existing responsive patterns. Never create a second design system.",
    ],
  },
  {
    n: "11", title: "Completion standard",
    points: [
      "Scope implemented, build passes, tests pass, desktop and mobile verified.",
      "Empty, loading and error states exist. No unrelated files changed.",
      "Final report provided with a clear next step.",
    ],
  },
  {
    n: "12", title: "No false claims",
    points: [
      "Distinguish implemented, mocked, conceptual, planned, not connected and coming soon.",
      "Never claim an integration, backend, authentication, publishing, analytics or SEO audit is live unless the code proves it.",
    ],
  },
];

const TASK_TEMPLATE = `PROJECT:
HYDROSEED Studio

STACK:
Use the existing project stack.
Do not change framework, router or UI libraries without approval.

SOURCE OF TRUTH:
Read the repository and the HYDROSEED Studio Architecture Blueprint
before making changes.

TASK:
[Insert one approved task only]

RULES:
- Audit before implementation
- Do not redesign
- Do not modify unrelated modules
- Do not add packages without approval
- Preserve responsive behavior
- Preserve EN/FR/ES/AR readiness
- Preserve RTL support
- Preserve security boundaries

BEFORE CODING, REPORT:
- Current implementation
- Relevant files
- Dependencies
- Risks
- Proposed plan
- Files expected to change

AFTER CODING, REPORT:
- Files changed
- What was implemented
- Tests executed
- Build result
- Remaining limitations
- Recommended next task`;

const ROADMAP: { phase: string; title: string; scope: string }[] = [
  { phase: "Phase 1", title: "Architecture and Design System", scope: "Tokens, primitives, application shell, architecture approval" },
  { phase: "Phase 2", title: "Infrastructure Foundation", scope: "Independent repository, Vercel project, studio.hydroseed.app, independent database project, environment variables, authentication foundation" },
  { phase: "Phase 3", title: "Content Foundation", scope: "Content items, authors, locales, taxonomy, media, audit foundation" },
  { phase: "Phase 4", title: "Publishing Workflow", scope: "Status state machine, roles, reviews, versions, scheduling" },
  { phase: "Phase 5", title: "Blog and Website Content", scope: "Articles, website content records, preview, publishing payloads" },
  { phase: "Phase 6", title: "Media and SEO", scope: "Storage, metadata, structured data, redirects, sitemaps, SEO checks" },
  { phase: "Phase 7", title: "Resources and Knowledge", scope: "Resources, documentation, academy" },
  { phase: "Phase 8", title: "Growth Integrations", scope: "Analytics, advertising pixels, email, automation, CRM" },
  { phase: "Phase 9", title: "Localization and Quality", scope: "EN, FR, ES, AR, RTL, accessibility, performance, security audit" },
  { phase: "Phase 10", title: "Production Readiness", scope: "End-to-end tests, backup, monitoring, rollback, launch checklist" },
];

const FUTURE: [string, string][] = [
  ["AI Editorial Assist", "Draft acceleration, translation review, SEO drafting."],
  ["Content APIs", "Read APIs powering independent public surfaces and partners."],
  ["Personalization", "Audience-aware variants for landing and resources."],
  ["Experimentation", "Structured A/B on landing, blog and newsletter."],
  ["Deeper CRM", "Two-way sync with pipelines and lifecycle stages."],
  ["Programmatic SEO", "Templated pages from taxonomy and structured data."],
  ["AI Translation Review", "Assisted quality review across EN, FR, ES and AR."],
  ["Internal Linking Engine", "Cluster-aware link suggestions across modules."],
  ["Content Refresh Detection", "Decay signals that flag ageing content."],
  ["Automated Schema Suggestions", "Structured data proposals per content type."],
  ["Search Intent Mapping", "Intent classification feeding topics and clusters."],
  ["Multi-channel Publishing", "Coordinated release across owned surfaces."],
  ["Content Quality Scoring", "Editorial, SEO and accessibility scoring."],
  ["Knowledge Graph", "Entity graph connecting topics, products and content."],
];

const CONTENTS: [string, string][] = [
  ["mission", "Mission"],
  ["ecosystem", "Ecosystem"],
  ["deployment", "Deployment Architecture"],
  ["overview", "System Overview"],
  ["modules", "Module Architecture"],
  ["relationships", "Content Relationships"],
  ["workflow", "Publishing Workflow"],
  ["distribution", "Distribution Engine"],
  ["growth-layer", "Growth Layer"],
  ["system-layer", "System Layer"],
  ["lifecycle", "Content Lifecycle"],
  ["truth", "Source-of-Truth Rules"],
  ["boundaries", "Platform Boundaries"],
  ["integrations", "Marketing Integrations"],
  ["folders", "Folder Structure"],
  ["entities", "Core Data Entities"],
  ["standards", "Development Standards"],
  ["playbook", "AI Development Playbook"],
  ["roadmap", "Delivery Roadmap"],
  ["principles", "Design Principles"],
  ["future", "Future Roadmap"],
];

/* ── page ───────────────────────────────────────────────── */

function Architecture() {
  return (
    <>
      <PageHeader
        eyebrow="Internal document · Revision 2.0 · Final approved blueprint"
        title="HYDROSEED Studio — Architecture Blueprint"
        description="Conceptual system document describing HYDROSEED Studio as an independent internal content and growth operating system deployed at studio.hydroseed.app. No backend, authentication, CMS engine, API or integration described here is implemented."
        meta={
          <>
            <span className="chip">Status · Approved</span>
            <span className="chip">Scope · Studio only</span>
            <span className="chip">Domain · studio.hydroseed.app</span>
            <span className="chip">Owner · Content Platform</span>
          </>
        }
      />

      <PageBody>
        <nav aria-label="Blueprint contents" className="surface-card p-3">
          <div className="mono-label mb-2 px-1">Contents</div>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {CONTENTS.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} className="flex gap-2 rounded px-1 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="surface-card p-4">
          <div className="mono-label">Reading key</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {[
              ["Current", "Exists in this application today"],
              ["Conceptual", "Architecture only, no implementation"],
              ["Planned", "Scheduled on the delivery roadmap"],
              ["Coming Soon", "Directional, not scheduled"],
              ["Not Connected", "Integration defined but never connected"],
            ].map(([t, d]) => (
              <span key={t} className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5">
                <Tag>{t}</Tag>
                <span className="text-xs text-muted-foreground">{d}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 1 Mission */}
        <Section
          n="01" id="mission" icon={Target} title="Mission"
          kicker="HYDROSEED Studio is the private internal operating system used by the HYDROSEED team to create, organize, review, optimize, publish and measure public-facing HYDROSEED content."
        >
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Author with intent", "Structured models replace freeform pages so every surface stays coherent, localized and measurable."],
              ["Release with control", "Explicit review gates, immutable versions and scheduled transitions protect the public brand."],
              ["Grow with evidence", "SEO, analytics and integrations feed back into the same records that drove the release."],
            ].map(([t, d]) => (
              <div key={t} className="surface-card p-4">
                <div className="mono-label">Principle</div>
                <div className="mt-1 h-display text-base text-foreground">{t}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 surface-card p-4">
            <div className="mono-label">Access boundary</div>
            <p className="mt-1.5 text-sm text-foreground">
              Public visitors must never access the HYDROSEED Studio dashboard. Studio is private, internal and team-only.
            </p>
          </div>
        </Section>

        {/* 2 Ecosystem */}
        <Section
          n="02" id="ecosystem" icon={Boxes} title="Ecosystem"
          kicker="Two completely independent applications that share the HYDROSEED brand and nothing else."
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <div className="surface-card p-5">
              <div className="mono-label">Main HYDROSEED application</div>
              <div className="mt-1 h-display text-lg text-foreground">hydroseed.app</div>
              <div className="mt-3 grid gap-2">
                {["Homepage", "Authentication", "Dashboard", "HYDROSEED OS", "Field & Jobs", "Crews & Materials", "Recipes & Batches", "QA"].map((n) => (
                  <div key={n} className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground">{n}</div>
                ))}
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-3 lg:flex-col">
              <div className="hidden h-full w-px bg-border-strong lg:block" />
              <span className="mono-label whitespace-nowrap rounded-full border border-border bg-muted px-2.5 py-1">
                Boundary
              </span>
              <div className="hidden h-full w-px bg-border-strong lg:block" />
            </div>

            <div className="surface-card border-primary/30 p-5">
              <div className="mono-label">Independent internal application</div>
              <div className="mt-1 h-display text-lg text-foreground">studio.hydroseed.app</div>
              <div className="mt-3 grid gap-2">
                {["HYDROSEED Studio", "Content Operations", "Publishing", "SEO", "Analytics", "Integrations", "Media"].map((n) => (
                  <div key={n} className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground">{n}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Independent applications",
              "Shared HYDROSEED brand",
              "No shared codebase",
              "No shared infrastructure",
              "No shared runtime dependency",
            ].map((l) => (
              <span key={l} className="chip">{l}</span>
            ))}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            If hydroseed.app is unavailable, HYDROSEED Studio remains operational. If HYDROSEED Studio is unavailable,
            hydroseed.app remains operational. Studio must never be merged into the hydroseed.app codebase.
          </p>
        </Section>

        {/* 3 Deployment */}
        <Section
          n="03" id="deployment" icon={Cloud} title="Deployment Architecture"
          kicker="HYDROSEED Studio owns its entire delivery chain. Nothing below is shared with the main HYDROSEED application."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Repository", "Separate GitHub repository"],
              ["Hosting", "Separate Vercel project"],
              ["Database", "Separate database project"],
              ["Authentication", "Separate authentication"],
              ["Environment", "Separate environment variables"],
              ["Deployments", "Separate deployments and release lifecycle"],
              ["Backend", "Separate backend"],
              ["Security", "Separate security policies"],
              ["Domain", "studio.hydroseed.app — the only approved private Studio URL"],
            ].map(([t, d]) => (
              <div key={t} className="surface-card p-4">
                <div className="mono-label">{t}</div>
                <p className="mt-1.5 text-sm text-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 surface-card border-warn/30 p-4">
            <div className="mono-label text-warn">Non-negotiable</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-foreground sm:grid-cols-2">
              {[
                "No hydroseed.app/studio",
                "No hydroseed.app/admin-studio",
                "No hydroseed.app/content",
                "No hydroseed.app/cms",
              ].map((l) => <li key={l}>{l}</li>)}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              HYDROSEED Studio must not depend on the main HYDROSEED application to operate.
            </p>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="surface-card p-4">
              <div className="mono-label">Private admin</div>
              <p className="mt-1.5 text-sm text-foreground">studio.hydroseed.app/admin</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Authenticated Studio workspace. Never publicly indexed.
              </p>
            </div>
            <div className="surface-card p-4">
              <div className="mono-label">Public knowledge platform</div>
              <p className="mt-1.5 text-sm text-foreground">studio.hydroseed.app/journal</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The public hub for everything HYDROSEED publishes as knowledge.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="surface-card p-4">
              <div className="mono-label">Public pages</div>
              <ul className="mt-2 grid gap-1.5 text-sm text-foreground">
                {[
                  "/journal/articles",
                  "/journal/resources",
                  "/journal/academy",
                  "/journal/case-studies",
                ].map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
            <div className="surface-card p-4">
              <div className="mono-label">Detail page patterns</div>
              <ul className="mt-2 grid gap-1.5 text-sm text-foreground">
                {[
                  "/journal/articles/:slug",
                  "/journal/resources/:slug",
                  "/journal/academy/:slug",
                  "/journal/case-studies/:slug",
                ].map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-3 surface-card p-4">
            <div className="mono-label">Journal homepage</div>
            <p className="mt-1.5 text-sm text-foreground">
              /journal is the public hub. It may show preview sections from Latest Articles, Resources, Academy,
              Case Studies, Changelog and Newsletter. Each content type still has its own dedicated public page.
            </p>
          </div>
        </Section>


        {/* 4 System Overview */}
        <Section
          n="04" id="overview" icon={Layers} title="System Overview"
          kicker="Everything HYDROSEED publishes as editorial, marketing, educational or documentation content is authored, reviewed, versioned and released here."
        >
          <div className="surface-card p-5 sm:p-6">
            <div className="grid items-center gap-3 md:grid-cols-[1.1fr_auto_1fr_auto_1fr_auto_1.2fr]">
              <Node label="HYDROSEED Studio" sub="Operating system" tone="primary" />
              <Arrow />
              <Node label="Content Operations" sub="Author · Review" />
              <Arrow />
              <Node label="Publishing" sub="Schedule · Release" />
              <Arrow />
              <div className="grid gap-3">
                <Node label="Growth" sub="SEO · Analytics" />
                <Node label="Approved payloads" sub="Future delivery" />
              </div>
            </div>
            <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
              {[
                ["Authoring", "Structured content models per domain, localized from the first draft."],
                ["Governance", "Explicit roles, review gates and immutable version history."],
                ["Preparation", "One approved state becomes the payload independent surfaces may consume later."],
              ].map(([t, d]) => (
                <div key={t}>
                  <div className="mono-label">{t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              The Website module manages public website content, page metadata, SEO fields, Open Graph data, page status,
              approved public copy and structured content records. It does not mean HYDROSEED Studio is the public website —
              public rendering remains owned by the independent hydroseed.app project.
            </p>
          </div>
        </Section>

        {/* 5 Modules */}
        <Section
          n="05" id="modules" icon={GitBranch} title="Module Architecture"
          kicker="21 modules grouped into four operational domains. Each module owns one content domain end to end."
        >
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {MODULES.map((g) => (
              <div key={g.group} className="surface-card p-4">
                <div className="flex items-baseline justify-between border-b border-border pb-2">
                  <div className="h-display text-lg">{g.group}</div>
                  <span className="mono-label">{String(g.items.length).padStart(2, "0")} modules</span>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {g.items.map((m) => (
                    <li key={m.name} className="rounded-md border border-border bg-surface px-3 py-2">
                      <div className="text-sm font-medium text-foreground">{m.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{m.note}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Workspace 2 · Publishing 11 · Growth 6 · System 2. No module is hidden or removed; future modules may carry a
            small Coming Soon badge.
          </p>
        </Section>

        {/* 6 Relationships */}
        <Section n="06" id="relationships" icon={Network} title="Content Relationships" kicker="Every public artefact resolves to a content item with an author, a locale, metadata, a version trail and an audit trail.">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="surface-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left">
                    <th className="mono-label px-4 py-2 font-medium">Entity</th>
                    <th className="mono-label px-4 py-2 font-medium">Relationship</th>
                    <th className="mono-label px-4 py-2 font-medium">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {RELATIONS.map((r) => (
                    <tr key={r.from + r.to} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground">{r.from}</td>
                      <td className="px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{r.rel}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="surface-card p-5">
              <div className="mono-label">Graph</div>
              <div className="mt-4 grid gap-3">
                <Node label="Content item" sub="Canonical record" tone="primary" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {["Pages", "Articles", "Authors", "Categories", "Tags", "Topics", "Clusters", "Media", "SEO metadata", "Redirects", "Locales", "Publishing status", "Version history", "Audit log"].map((n) => (
                    <div key={n} className="rounded-md border border-border bg-surface px-2.5 py-2 text-center text-xs text-muted-foreground">
                      {n}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Satellites attach to the canonical record; none of them exist independently of a content item and its locale.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* 7 Workflow */}
        <Section n="07" id="workflow" icon={Workflow} title="Publishing Workflow" kicker="A single state machine shared by every module. Transitions are role-gated and every transition conceptually creates a version snapshot.">
          <div className="surface-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              {WORKFLOW.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      s === "Published"
                        ? "border-success/25 bg-success/10 text-success"
                        : s === "Archived"
                          ? "border-border bg-muted text-muted-foreground"
                          : s === "In Review" || s === "SEO Review"
                            ? "border-warn/25 bg-warn/15 text-foreground"
                            : "border-border bg-card text-foreground"
                    }`}
                  >
                    <span className="mr-1.5 font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </span>
                  {i < WORKFLOW.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Every transition must conceptually create a version snapshot, restorable back into Draft.
            </p>
            <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-5">
              {ROLES.map((r) => (
                <div key={r.role} className="rounded-md border border-border bg-surface p-3">
                  <div className="text-sm font-medium text-foreground">{r.role}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.can}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 8 Distribution */}
        <Section
          n="08" id="distribution" icon={Share2} title="Distribution Engine"
          kicker="Conceptual architecture only. HYDROSEED Studio does not currently own public rendering."
        >
          <div className="surface-card p-5 sm:p-6">
            <div className="grid items-start gap-5 lg:grid-cols-[auto_1fr]">
              <ol className="space-y-2">
                {["Author", "Draft", "Review", "SEO", "Approval", "Schedule", "Publish"].map((s, i, a) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                      s === "Publish" ? "border-success/25 bg-success/10 text-success" : "border-border bg-card text-foreground"
                    }`}>
                      {s}
                    </span>
                    {i < a.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                  </li>
                ))}
                <li className="pt-1">
                  <span className="rounded-md border border-primary/30 bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                    Distribution Engine
                  </span>
                </li>
              </ol>
              <div>
                <div className="flex items-center gap-2">
                  <span className="mono-label">Potential downstream surfaces</span>
                  <Tag>Conceptual</Tag>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["Blog", "Owned"], ["Resources", "Owned"],
                    ["Documentation", "Owned"], ["Academy", "Owned"], ["Case Studies", "Owned"],
                    ["Newsletter", "Planned"],
                    ["RSS", "Owned"], ["Sitemap", "Owned"], ["Search Engines", "Discovery"],
                    ["AI Search Engines", "Discovery"], ["Social Media", "Discovery"], ["Future APIs", "Planned"],
                  ].map(([label, tag]) => (
                    <div key={label} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
                      <span className="text-sm text-foreground">{label}</span>
                      <span className="mono-label">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              HYDROSEED Studio prepares and manages content. Independent public surfaces consume approved content through
              future APIs, exports or integrations.
            </p>
          </div>
        </Section>

        {/* 9 Growth Layer */}
        <Section
          n="09" id="growth-layer" icon={TrendingUp} title="Growth Layer"
          kicker="Six modules that turn managed content into signal, distribution and measurable outcomes."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["SEO", ["Metadata", "Canonical URLs", "Structured data", "Sitemaps", "Indexing", "Audits", "Internal linking", "GEO", "AI Search optimization"]],
              ["Analytics", ["Traffic", "Engagement", "Content performance", "Search performance", "Conversions"]],
              ["Integrations", ["Analytics providers", "Advertising platforms", "Email providers", "Automation tools", "CRM tools"]],
              ["Media Library", ["Images", "Video", "Documents", "Alt text", "Derivatives", "Usage tracking"]],
              ["Redirects", ["URL lifecycle", "Legacy path protection", "301 and 302 redirects"]],
              ["Taxonomy", ["Authors", "Categories", "Tags", "Topics", "Content clusters"]],
            ].map(([t, items]) => (
              <div key={t as string} className="surface-card p-4">
                <div className="text-sm font-medium text-foreground">{t as string}</div>
                <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                  {(items as string[]).map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* 10 System Layer */}
        <Section
          n="10" id="system-layer" icon={ServerCog} title="System Layer"
          kicker="Cross-cutting concerns that every module inherits — governance, identity and workspace configuration."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Team", "Roles, permissions and editorial responsibilities."],
              ["Settings", "Workspace, locales, brand and environment controls."],
              ["Audit trail", "Version snapshots on every transition, restorable to draft."],
              ["Localization", "EN · FR · ES · AR with RTL-safe primitives."],
            ].map(([t, d]) => (
              <div key={t} className="surface-card p-4">
                <div className="text-sm font-medium text-foreground">{t}</div>
                <p className="mt-1 text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 11 Lifecycle */}
        <Section
          n="11" id="lifecycle" icon={Repeat} title="Content Lifecycle"
          kicker="Every content item moves through the same eight-stage lifecycle regardless of module."
        >
          <div className="surface-card p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Ideate", "Briefs, content backlog, editorial calendar."],
                ["Produce", "Draft, structure, media, translations."],
                ["Govern", "Editorial review, SEO review, approval, scheduling."],
                ["Publish", "Release through the publishing system."],
                ["Measure", "Analytics, SEO feedback, integration signals."],
                ["Iterate", "Refresh, re-translate, update, republish."],
                ["Retire", "Archive, redirect old URLs, preserve snapshots."],
                ["Restore", "Restore a previous version into Draft."],
              ].map(([t, d], i) => (
                <div key={t} className="rounded-md border border-border bg-surface p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-foreground">{t}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 12 Truth */}
        <Section n="12" id="truth" icon={ShieldCheck} title="Source-of-Truth Rules" kicker="What HYDROSEED Studio owns — and what it must never own.">
          <div className="grid gap-3 md:grid-cols-2">
            {TRUTH.map((t) => (
              <div key={t.owns} className={`surface-card p-4 ${t.tone === "warn" ? "border-warn/30" : ""}`}>
                <div className={`mono-label ${t.tone === "warn" ? "text-warn" : ""}`}>{t.owner}</div>
                <p className="mt-1.5 text-sm text-foreground">{t.owns}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 13 Platform Boundaries */}
        <Section
          n="13" id="boundaries" icon={Lock} title="Platform Boundaries"
          kicker="HYDROSEED Studio has no required runtime dependency on any of the systems below."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_BOUNDARIES.map((b) => (
              <div key={b.name} className="surface-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{b.name}</span>
                  <Tag>Boundary</Tag>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{b.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Future integrations may be introduced only when explicitly approved. Any future connection must initially be
            optional, read-only, isolated, documented, auditable and failure-safe. None are implemented today.
          </p>
        </Section>

        {/* 14 Marketing Integrations */}
        <Section
          n="14" id="integrations" icon={Plug} title="Marketing Integrations"
          kicker="Provider catalogue only. Every integration is defined as Not Connected — nothing is implemented."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {MARKETING_INTEGRATIONS.map((g) => (
              <div key={g.group} className="surface-card overflow-hidden">
                <div className="flex items-baseline justify-between border-b border-border bg-surface px-4 py-2">
                  <span className="h-display text-base text-foreground">{g.group}</span>
                  <span className="mono-label">{String(g.items.length).padStart(2, "0")} providers</span>
                </div>
                <ul>
                  {g.items.map((i) => (
                    <li key={i} className="flex items-center justify-between border-b border-border px-4 py-2.5 last:border-0">
                      <span className="text-sm text-foreground">{i}</span>
                      <Tag>Not Connected</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* 15 Folder Structure */}
        <Section n="15" id="folders" icon={FolderTree} title="Folder Structure" kicker="Feature-first organisation. Shared publishing concerns live in lib, never inside a single feature.">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <pre className="surface-card overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-foreground">
              {FOLDERS}
            </pre>
            <div className="surface-card p-5">
              <div className="mono-label">Rules</div>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>One feature folder per module.</li>
                <li>No duplicated publishing logic.</li>
                <li>Shared rules belong in <span className="text-foreground">lib</span>.</li>
                <li>Routes remain thin.</li>
                <li>Shared components must be reusable.</li>
                <li>No feature-specific global styling.</li>
                <li>No direct cross-feature imports unless explicitly documented.</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 16 Entities */}
        <Section n="16" id="entities" icon={Database} title="Core Data Entities" kicker="Conceptual entities only. No SQL, schema, migrations or backend logic are defined at this stage.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENTITIES.map((e) => (
              <div key={e.name} className="surface-card p-3.5">
                <div className="font-mono text-[12.5px] text-primary">{e.name}</div>
                <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 17 Standards */}
        <Section n="17" id="standards" icon={Ruler} title="Development Standards" kicker="Non-negotiable rules for every module added to Studio.">
          <ol className="surface-card divide-y divide-border">
            {STANDARDS.map((s, i) => (
              <li key={s} className="flex gap-3 px-4 py-3 text-sm">
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* 18 AI Playbook */}
        <Section
          n="18" id="playbook" icon={Bot} title="AI Development Playbook"
          kicker="Permanent operating instructions for any AI assistant, coding agent or developer working on HYDROSEED Studio. This section is mandatory project guidance."
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {AI_RULES.map((r) => (
              <div key={r.n} className="surface-card p-4">
                <div className="flex items-baseline justify-between">
                  <span className="mono-label">Rule {r.n}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">{r.title}</div>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {r.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <pre className="surface-card overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-foreground">
              {TASK_TEMPLATE}
            </pre>
            <div className="surface-card p-5">
              <div className="mono-label">AI task template</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Copy this template into any AI coding tool before starting work on HYDROSEED Studio. One approved task per run,
                audited before implementation and reported after implementation.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><span className="text-foreground">Before coding</span> — report current implementation, files, dependencies, risks and plan.</li>
                <li><span className="text-foreground">After coding</span> — report files changed, tests, build result, limitations and next task.</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 19 Roadmap */}
        <Section n="19" id="roadmap" icon={MapIcon} title="Delivery Roadmap" kicker="Ten sequenced phases for the independent Studio architecture. Each phase closes with a review against this blueprint.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((p, i) => (
              <div key={p.phase} className={`surface-card p-4 ${i === 0 ? "border-primary/30" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="mono-label">{p.phase}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-border-strong"}`} />
                </div>
                <div className="mt-2 h-display text-base leading-snug text-foreground">{p.title}</div>
                <p className="mt-1.5 text-xs text-muted-foreground">{p.scope}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 20 Design Principles */}
        <Section
          n="20" id="principles" icon={Palette} title="Design Principles"
          kicker="Non-negotiable visual and interaction rules across every module of HYDROSEED Studio."
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Editorial calm", "Neutral surfaces, restrained accents; content is the interface."],
              ["Structural clarity", "One header pattern, one card pattern, one table pattern."],
              ["Localized by default", "EN, FR, ES and RTL Arabic are first-class layout constraints."],
              ["Signal over ornament", "Status, ownership and freshness are always visible without decoration."],
              ["Progressive disclosure", "Detail views expand context; lists stay dense and scannable."],
              ["System over exception", "Design tokens win; never patch a single screen with local styles."],
            ].map(([t, d]) => (
              <div key={t} className="surface-card p-4">
                <div className="mono-label">Principle</div>
                <div className="mt-1 text-sm font-medium text-foreground">{t}</div>
                <p className="mt-1 text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 21 Future */}
        <Section
          n="21" id="future" icon={Compass} title="Future Roadmap"
          kicker="Directional bets tracked after the delivery roadmap ships. None are scheduled or implemented."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FUTURE.map((r) => (
              <div key={r[0]} className="surface-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{r[0]}</span>
                  <Tag>Coming Soon</Tag>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{r[1]}</p>
              </div>
            ))}
          </div>
        </Section>

        <footer className="border-t border-border pt-4 text-xs text-muted-foreground">
          HYDROSEED Studio · studio.hydroseed.app · Internal architecture document · Conceptual only — no backend,
          authentication, CMS engine, API or integration described here is implemented.
        </footer>
      </PageBody>
    </>
  );
}
