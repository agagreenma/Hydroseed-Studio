import { supabase } from "@/integrations/supabase/client";

// Static content below remains reserved for explicitly future public sections.
// Each section has its own list + detail records.

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export type PublishedArticle = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  category: string;
  section: string;
  author: { name: string; role: string; initials: string };
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  cover: string | null;
  canonicalUrl: string;
  body: { heading?: string; paragraph: string }[];
  seo: { meta_title?: string; meta_description?: string; canonical_url?: string };
};

type PublicContentRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  seo: Record<string, unknown> | null;
  locale: string;
  updated_at: string;
  published_at: string | null;
  author_id: string | null;
  category_id: string | null;
  authors?: { name: string; role_title: string | null } | null;
  categories?: { name: string } | null;
  media_assets?: { url: string; alt_text: string | null } | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function bodyBlocks(body: string | null): PublishedArticle["body"] {
  const blocks = (body ?? "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.map((block) => {
    const heading = block.match(/^#{1,3}\s+(.+)$/m);
    return heading
      ? {
          heading: heading[1],
          paragraph: block.replace(/^#{1,3}\s+.+\n?/, "").trim() || heading[1],
        }
      : { paragraph: block };
  });
}

function mapPublishedArticle(row: PublicContentRow): PublishedArticle {
  const seo = (row.seo ?? {}) as PublishedArticle["seo"];
  const content = row.body ?? "";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.excerpt ?? "",
    excerpt: row.excerpt ?? "",
    section: row.categories?.name ?? "HYDROSEED Journal",
    category: row.categories?.name ?? "HYDROSEED Journal",
    author: {
      name: row.authors?.name ?? "HYDROSEED Studio",
      role: row.authors?.role_title ?? "HYDROSEED Studio",
      initials: initials(row.authors?.name ?? "HYDROSEED"),
    },
    publishedAt: row.published_at ?? row.updated_at,
    updatedAt: row.updated_at,
    readingMinutes: Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)),
    cover: row.media_assets?.url ?? null,
    canonicalUrl: seo.canonical_url ?? `https://studio.hydroseed.app/journal/articles/${row.slug}`,
    body: bodyBlocks(row.body),
    seo,
  };
}

async function queryPublishedArticles(slug?: string) {
  let query = supabase
    .from("content_items")
    .select("*, authors(name, role_title), categories(name), media_assets(url, alt_text)")
    .in("type", ["article", "blog_post"])
    .eq("status", "published")
    .or(`scheduled_at.is.null,scheduled_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as PublicContentRow[];
}

export async function fetchPublishedArticles() {
  const rows = await queryPublishedArticles();
  return rows.map(mapPublishedArticle);
}

export async function fetchPublishedArticle(slug: string) {
  const rows = await queryPublishedArticles(slug);
  return rows[0] ? mapPublishedArticle(rows[0]) : null;
}

/* -------------------------- ARTICLES -------------------------- */
export type Article = {
  slug: string;
  title: string;
  dek: string;
  section: string;
  author: { name: string; role: string; initials: string };
  publishedAt: string;
  readingMinutes: number;
  cover: string;
  body: { heading?: string; paragraph: string }[];
};

const A_AUTHORS = {
  sofia: { name: "Sofia Reyes", role: "Revegetation Editor", initials: "SR" },
  amina: { name: "Amina Fassi", role: "Editor in Chief", initials: "AF" },
  julien: { name: "Julien Marchand", role: "Contributing Writer", initials: "JM" },
  nora: { name: "Nora El Idrissi", role: "Field Correspondent", initials: "NE" },
};

export const ARTICLE_SECTIONS = [
  "All",
  "Field Report",
  "Analysis",
  "Interviews",
  "Opinion",
  "Long Read",
];

export const ARTICLES: Article[] = [
  {
    slug: "the-quiet-industrialisation-of-hydroseeding",
    title: "The quiet industrialisation of hydroseeding",
    dek: "How falling equipment costs and rising labour costs are rewriting what a revegetation crew looks like.",
    section: "Long Read",
    author: A_AUTHORS.amina,
    publishedAt: "2026-07-22",
    readingMinutes: 14,
    cover: img("1523348837708-15d4a09cfac2"),
    body: [
      {
        paragraph:
          "On a cut slope outside a new interchange, a three-person crew lays down a bonded fibre matrix in under an hour. The crew lead is a former landscaper. Nothing about this scene would have been legible five years ago.",
      },
      {
        heading: "A slow-motion transition",
        paragraph:
          "The story of hydroseeding in the 2020s is not one of hype cycles. It is a slow-motion transition, driven by the mundane arithmetic of tank capacity and labour.",
      },
      {
        heading: "What contractors are actually doing",
        paragraph:
          "Contractors are quietly rebuilding their operations around software: bid estimating, mix tracking, and site scheduling running side by side.",
      },
      {
        paragraph:
          "The industrial revegetation crew is here. It just doesn't look like the render.",
      },
    ],
  },
  {
    slug: "field-report-a-week-on-a-highway-slope-crew",
    title: "Field report: a week on a highway slope crew",
    dek: "Five days, two tanker trucks, one rain delay, and a lot of mulch.",
    section: "Field Report",
    author: A_AUTHORS.nora,
    publishedAt: "2026-07-18",
    readingMinutes: 11,
    cover: img("1500937386664-56d1dfef3854"),
    body: [
      {
        paragraph:
          "The first truck rolls out at 06:00. A rain delay the day before pushed the schedule into the weekend and the crew is chasing daylight.",
      },
      {
        heading: "Rhythm of the site",
        paragraph:
          "Everything runs on a rhythm: seed mix loaded at dawn, application by mid-morning, tackifier set by early afternoon. Deviation from the rhythm is the enemy.",
      },
      {
        paragraph:
          "By Friday the last slope is covered. The foreman walks the site, checks coverage, and closes the week.",
      },
    ],
  },
  {
    slug: "why-pounds-per-acre-is-the-wrong-metric",
    title: "Why pounds per acre is the wrong metric",
    dek: "A provocation for anyone still benchmarking revegetation jobs with a single number.",
    section: "Opinion",
    author: A_AUTHORS.julien,
    publishedAt: "2026-07-11",
    readingMinutes: 7,
    cover: img("1592982537447-6f2a6a0c8b1a"),
    body: [
      { paragraph: "Application rate per acre is the vanity metric of erosion control." },
      {
        heading: "Establishment rate is the real number",
        paragraph:
          "A hydroseeding job exists to convert seed, mulch and water into durable, established vegetation cover.",
      },
      {
        paragraph:
          "Track that, and the correct mix and re-application conversations start to happen on their own.",
      },
    ],
  },
  {
    slug: "interview-what-a-general-contractor-actually-wants",
    title: "Interview: what a general contractor actually wants from a revegetation sub",
    dek: "A project manager at a civil construction firm on schedule reliability, documentation and site compliance.",
    section: "Interviews",
    author: A_AUTHORS.sofia,
    publishedAt: "2026-07-04",
    readingMinutes: 9,
    cover: img("1466692476868-aef1dfb1e735"),
    body: [
      {
        paragraph:
          '"We do not need heroic coverage numbers. We need a crew that shows up on the day the grading inspector signs off."',
      },
      {
        heading: "Reliability over novelty",
        paragraph:
          "The project manager is unambiguous: schedule reliability, not novelty, wins repeat work.",
      },
      {
        heading: "Paperwork is the second theme",
        paragraph:
          "Everything is a document. Application logs, mix tickets, site photos — every document is a decision.",
      },
    ],
  },
  {
    slug: "analysis-the-real-cost-of-a-slope-stabilisation-job",
    title: "Analysis: the real cost of a slope stabilisation job",
    dek: "We rebuilt a fictional 12-acre roadside job line by line to see where the budget actually goes.",
    section: "Analysis",
    author: A_AUTHORS.julien,
    publishedAt: "2026-06-27",
    readingMinutes: 13,
    cover: img("1497436072909-60f360e1d4b1"),
    body: [
      { paragraph: "Seed and mulch are the headline cost, but they are far from the whole story." },
      {
        heading: "The unseen 30%",
        paragraph:
          "Mobilisation, water hauling, and site prep routinely take a third of the total budget.",
      },
      {
        paragraph:
          "Design decisions that reduce re-mobilisation pay back faster than any mix upgrade.",
      },
    ],
  },
  {
    slug: "long-read-the-return-of-native-seed-mixes",
    title: "Long read: the return of native seed mixes",
    dek: "The most interesting shift in erosion control today is not the mulch. It is what's inside the seed, and it is regional.",
    section: "Long Read",
    author: A_AUTHORS.amina,
    publishedAt: "2026-06-20",
    readingMinutes: 16,
    cover: img("1416879595882-3373a0480b5b"),
    body: [
      {
        paragraph:
          "For a decade, the default for roadside revegetation was a fast, generic turf mix. In 2026 more specifications call for a regional native blend instead.",
      },
      {
        paragraph:
          "Native mixes paired with bonded fibre matrix are quietly setting new benchmarks for long-term slope stability per dollar of contract value.",
      },
    ],
  },
];

/* -------------------------- RESOURCES -------------------------- */
export type Resource = {
  slug: string;
  title: string;
  summary: string;
  type: "Guide" | "Playbook" | "Template" | "Report" | "Toolkit";
  category: string;
  minutes: number;
  updated: string;
  cover: string;
  chapters: { title: string; body: string }[];
};

export const RESOURCE_TYPES = ["All", "Guide", "Playbook", "Template", "Report", "Toolkit"];
export const RESOURCE_CATEGORIES = ["Operations", "Commerce", "Finance", "Compliance", "People"];

export const RESOURCES: Resource[] = [
  {
    slug: "starting-a-hydroseeding-business",
    title: "Starting a hydroseeding business",
    summary:
      "A 42-page guide covering equipment selection, mix sourcing, unit economics and go-to-market for a professional hydroseeding operation.",
    type: "Guide",
    category: "Operations",
    minutes: 45,
    updated: "2026-07-14",
    cover: img("1585320806297-9794b3e4eeae"),
    chapters: [
      {
        title: "1. Choosing the right tank and truck",
        body: "Tank capacity, agitation system, hose length, and access for a work truck are the four things that matter most.",
      },
      {
        title: "2. Mix sourcing and storage",
        body: "Buy seed and mulch from three suppliers minimum, rotate stock every season, and store cool and dry.",
      },
      {
        title: "3. Unit economics",
        body: "Model contribution margin per acre, not per bag. Everything else follows.",
      },
      {
        title: "4. Contractor go-to-market",
        body: "Two general contractors a week for eight weeks builds a pipeline.",
      },
    ],
  },
  {
    slug: "job-scheduling-playbook",
    title: "Job scheduling playbook",
    summary:
      "Templates and workflows for weekly and seasonal job scheduling for revegetation crews.",
    type: "Playbook",
    category: "Operations",
    minutes: 30,
    updated: "2026-07-05",
    cover: img("1500382017468-9049fed747ef"),
    chapters: [
      { title: "The weekly cycle", body: "A rolling 12-week schedule reviewed every Monday." },
      { title: "Handling weather variance", body: "Buffer days, not heroics." },
    ],
  },
  {
    slug: "bid-pricing-template",
    title: "Bid pricing template",
    summary: "A spreadsheet + written framework for building defensible hydroseeding bid prices.",
    type: "Template",
    category: "Commerce",
    minutes: 15,
    updated: "2026-06-28",
    cover: img("1524594152303-9fd13543fe6e"),
    chapters: [
      {
        title: "The three-tier model",
        body: "Public bid, private contract, homeowner retail — priced from cost, not from feel.",
      },
      { title: "Discount discipline", body: "Set the floor before the first call." },
    ],
  },
  {
    slug: "state-of-hydroseeding-2026",
    title: "State of Hydroseeding 2026",
    summary:
      "An annual report on capacity, equipment, fuel and labour trends across regional erosion control contractors.",
    type: "Report",
    category: "Finance",
    minutes: 25,
    updated: "2026-06-15",
    cover: img("1466692476868-aef1dfb1e735"),
    chapters: [
      {
        title: "Executive summary",
        body: "Growth slowed, margins improved, the industry got serious.",
      },
      { title: "Data appendix", body: "Sample of 84 contractors, self-reported and normalised." },
    ],
  },
  {
    slug: "site-compliance-audit-toolkit",
    title: "Site compliance audit toolkit",
    summary:
      "Checklists, SOP templates and audit prep material for stormwater and erosion control site inspections.",
    type: "Toolkit",
    category: "Compliance",
    minutes: 40,
    updated: "2026-06-01",
    cover: img("1416879595882-3373a0480b5b"),
    chapters: [
      { title: "The pre-inspection walk", body: "Do it two weeks out, then again the day before." },
      { title: "Documenting the invisible", body: "If it is not written, it did not happen." },
    ],
  },
  {
    slug: "hiring-a-crew-foreman",
    title: "Hiring a crew foreman",
    summary: "Job description, interview scorecard and 90-day plan for your first foreman hire.",
    type: "Playbook",
    category: "People",
    minutes: 20,
    updated: "2026-05-22",
    cover: img("1500937386664-56d1dfef3854"),
    chapters: [
      { title: "What to look for", body: "Curiosity over pedigree, calm over charisma." },
      { title: "The trial week", body: "Pay for it. Watch the debrief." },
    ],
  },
];

/* -------------------------- ACADEMY -------------------------- */
export type Course = {
  slug: string;
  title: string;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  track: string;
  hours: number;
  lessons: number;
  instructor: { name: string; role: string; initials: string };
  cover: string;
  outline: { module: string; lessons: string[] }[];
};

export const ACADEMY_TRACKS = ["All", "Foundations", "Operations", "Commerce", "Leadership"];
export const ACADEMY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const COURSES: Course[] = [
  {
    slug: "foundations-of-hydroseeding",
    title: "Foundations of Hydroseeding",
    tagline: "A structured introduction for professionals entering the industry.",
    level: "Beginner",
    track: "Foundations",
    hours: 6,
    lessons: 24,
    instructor: { name: "Amina Fassi", role: "Editor in Chief", initials: "AF" },
    cover: img("1523348837708-15d4a09cfac2"),
    outline: [
      {
        module: "Module 1 — The industry",
        lessons: ["Why now", "Segments and business models", "Regulatory landscape"],
      },
      {
        module: "Module 2 — Revegetation science essentials",
        lessons: ["Germination for operators", "Soil, moisture, and mulch", "Common site failures"],
      },
      {
        module: "Module 3 — Equipment fundamentals",
        lessons: ["Tank and pump layout", "Mix ratios", "Water logistics"],
      },
    ],
  },
  {
    slug: "job-scheduling-mastery",
    title: "Job Scheduling Mastery",
    tagline: "From the weekly schedule to the annual capacity model.",
    level: "Intermediate",
    track: "Operations",
    hours: 8,
    lessons: 28,
    instructor: { name: "Julien Marchand", role: "Head of Curriculum", initials: "JM" },
    cover: img("1500382017468-9049fed747ef"),
    outline: [
      {
        module: "Module 1 — The schedule of record",
        lessons: ["Cycles and cadence", "Batching jobs", "Weather buffers"],
      },
      { module: "Module 2 — Handling reality", lessons: ["Variance", "Rework", "Escalations"] },
    ],
  },
  {
    slug: "commerce-for-hydroseeding-contractors",
    title: "Commerce for Hydroseeding Contractors",
    tagline: "Pricing, channels, contracts and margin defence.",
    level: "Intermediate",
    track: "Commerce",
    hours: 5,
    lessons: 20,
    instructor: { name: "Sofia Reyes", role: "Commerce Faculty", initials: "SR" },
    cover: img("1524594152303-9fd13543fe6e"),
    outline: [
      {
        module: "Module 1 — Pricing",
        lessons: ["Cost-plus", "Value-based", "Discount discipline"],
      },
      {
        module: "Module 2 — Channels",
        lessons: ["Public bids", "General contractors", "Residential retail"],
      },
    ],
  },
  {
    slug: "leading-a-growing-crew",
    title: "Leading a Growing Crew",
    tagline: "Team, cadence, and personal operating system for founders past the first year.",
    level: "Advanced",
    track: "Leadership",
    hours: 7,
    lessons: 22,
    instructor: { name: "Nora El Idrissi", role: "Leadership Faculty", initials: "NE" },
    cover: img("1497436072909-60f360e1d4b1"),
    outline: [
      { module: "Module 1 — People", lessons: ["Hiring", "Firing", "Growing"] },
      { module: "Module 2 — Cadence", lessons: ["Weekly", "Monthly", "Quarterly"] },
    ],
  },
  {
    slug: "advanced-erosion-control-systems",
    title: "Advanced Erosion Control Systems",
    tagline:
      "BFM, SMM and turf reinforcement mats at commercial scale — design and apply for reliability.",
    level: "Advanced",
    track: "Operations",
    hours: 9,
    lessons: 30,
    instructor: { name: "Julien Marchand", role: "Head of Curriculum", initials: "JM" },
    cover: img("1466692476868-aef1dfb1e735"),
    outline: [
      { module: "Module 1 — Systems", lessons: ["BFM", "SMM", "Turf reinforcement mats"] },
      { module: "Module 2 — Mixes", lessons: ["Recipes", "Monitoring", "Correction"] },
    ],
  },
];

/* -------------------------- CASE STUDIES -------------------------- */
export type CaseStudy = {
  slug: string;
  company: string;
  headline: string;
  summary: string;
  industry: string;
  region: string;
  size: string;
  logoLetters: string;
  cover: string;
  metrics: { label: string; value: string }[];
  quote: { text: string; author: string; role: string };
  story: { heading: string; body: string }[];
};

export const CASE_INDUSTRIES = [
  "All",
  "Civil Construction",
  "Roadside & Infrastructure",
  "Mining & Restoration",
  "Commercial Landscaping",
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "northline-civil-cutting-bid-time-by-70",
    company: "Northline Civil",
    headline: "How Northline Civil cut bid prep time by 70% across three regions",
    summary:
      "A regional civil construction firm consolidated bidding, scheduling and job tracking on HYDROSEED.APP.",
    industry: "Civil Construction",
    region: "Ontario · Quebec · Manitoba",
    size: "120 employees",
    logoLetters: "NC",
    cover: img("1523348837708-15d4a09cfac2"),
    metrics: [
      { label: "Bid prep time saved", value: "-70%" },
      { label: "Estimate accuracy", value: "99.4%" },
      { label: "Regions on one platform", value: "3" },
    ],
    quote: {
      text: "For the first time our three regions are running on one schedule.",
      author: "Ines de Vries",
      role: "COO, Northline Civil",
    },
    story: [
      {
        heading: "The context",
        body: "Three regions, three spreadsheets, three definitions of the truth.",
      },
      {
        heading: "The rollout",
        body: "Six weeks from kickoff to first live weekly schedule on HYDROSEED.APP.",
      },
      {
        heading: "The result",
        body: "Bid meetings shrank from 90 minutes to 25. Estimate errors fell to under one percent.",
      },
    ],
  },
  {
    slug: "ridgeway-landscapes-margin-transparency",
    company: "Ridgeway Landscapes",
    headline: "Ridgeway Landscapes gets to real-time job margin",
    summary:
      "A commercial landscaping group replaces a monthly finance close with live per-job margin.",
    industry: "Commercial Landscaping",
    region: "Alberta",
    size: "260 employees",
    logoLetters: "RL",
    cover: img("1416879595882-3373a0480b5b"),
    metrics: [
      { label: "Time to margin visibility", value: "Live" },
      { label: "Jobs tracked", value: "142" },
      { label: "Manual reports removed", value: "17" },
    ],
    quote: {
      text: "The finance team stopped chasing numbers and started using them.",
      author: "Peter Janssens",
      role: "CFO, Ridgeway Landscapes",
    },
    story: [
      { heading: "The context", body: "Monthly close, quarterly insight, annual regret." },
      { heading: "The change", body: "Cost and revenue in one place, per job." },
      { heading: "The result", body: "Loss-making jobs identified in weeks, not quarters." },
    ],
  },
  {
    slug: "sierra-slope-works-scaling-roadside-contracts",
    company: "Sierra Slope Works",
    headline: "Sierra Slope Works scales from 40 to 300 roadside contracts",
    summary:
      "A roadside and infrastructure revegetation contractor uses HYDROSEED.APP to add contracts without adding chaos.",
    industry: "Roadside & Infrastructure",
    region: "Nevada",
    size: "18 employees",
    logoLetters: "SW",
    cover: img("1585320806297-9794b3e4eeae"),
    metrics: [
      { label: "Contracts served", value: "300+" },
      { label: "On-time completion", value: "98.7%" },
      { label: "Ops headcount added", value: "+2" },
    ],
    quote: {
      text: "We seven-x'd our route with two extra people.",
      author: "Camille Roche",
      role: "Founder, Sierra Slope Works",
    },
    story: [
      { heading: "The context", body: "A hand-drawn job map on a whiteboard." },
      { heading: "The change", body: "A single source of truth for jobs, routes and mix stock." },
      { heading: "The result", body: "A calm office at 5pm on a Friday." },
    ],
  },
  {
    slug: "cascade-reclamation-tightening-the-mix-chain",
    company: "Cascade Reclamation",
    headline: "Cascade Reclamation tightens the mix supply chain",
    summary:
      "A mining and restoration contractor unifies subcontractor onboarding, orders and application tracking.",
    industry: "Mining & Restoration",
    region: "British Columbia",
    size: "80 employees",
    logoLetters: "CR",
    cover: img("1500937386664-56d1dfef3854"),
    metrics: [
      { label: "Subcontractors onboarded", value: "62" },
      { label: "Application log latency", value: "< 2 min" },
      { label: "Complaint rate", value: "-41%" },
    ],
    quote: {
      text: "Every load is now traceable to a specific slope.",
      author: "Lena Roth",
      role: "Head of Ops, Cascade Reclamation",
    },
    story: [
      { heading: "The context", body: "Sixty subcontractors, sixty ways of doing things." },
      { heading: "The change", body: "One onboarding flow, one order form, one report." },
      { heading: "The result", body: "The site inspector stopped calling with questions." },
    ],
  },
];

/* -------------------------- HELP CENTER -------------------------- */
export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  updated: string;
  body: { heading?: string; paragraph: string }[];
};

export const HELP_CATEGORIES = [
  {
    slug: "getting-started",
    name: "Getting started",
    description: "Set up your workspace and invite your team.",
    icon: "🚀",
  },
  {
    slug: "production",
    name: "Job scheduling",
    description: "Cycles, jobs, mix loads and applications.",
    icon: "🌱",
  },
  {
    slug: "orders",
    name: "Bids & customers",
    description: "Manage public, private and residential bids.",
    icon: "📦",
  },
  {
    slug: "inventory",
    name: "Inventory",
    description: "Track seed, mulch, tackifier and movements.",
    icon: "🧺",
  },
  {
    slug: "billing",
    name: "Billing & plans",
    description: "Subscriptions, invoices and seats.",
    icon: "💳",
  },
  {
    slug: "integrations",
    name: "Integrations",
    description: "Connect HYDROSEED.APP to your other tools.",
    icon: "🔌",
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "creating-your-first-job-schedule",
    title: "Creating your first job schedule",
    summary: "Set up a weekly schedule in under 10 minutes.",
    category: "production",
    updated: "2026-07-20",
    body: [
      {
        heading: "Open the scheduler",
        paragraph: "From the sidebar, choose Jobs → Schedule and click New schedule.",
      },
      {
        heading: "Pick a template",
        paragraph:
          "Start from an existing template to save time. You can edit every field afterwards.",
      },
      { heading: "Publish", paragraph: "Publishing locks the schedule and notifies the team." },
    ],
  },
  {
    slug: "inviting-your-team",
    title: "Inviting your team",
    summary: "Add teammates with the right role.",
    category: "getting-started",
    updated: "2026-07-18",
    body: [
      { paragraph: "Go to Settings → Team and click Invite." },
      {
        heading: "Roles",
        paragraph:
          "Owner, Admin, Operator and Viewer. Assign the lowest role that lets someone do their job.",
      },
    ],
  },
  {
    slug: "receiving-and-fulfilling-a-bid-contract",
    title: "Receiving and fulfilling a bid contract",
    summary: "From awarded bid to signed completion note.",
    category: "orders",
    updated: "2026-07-15",
    body: [
      { paragraph: "Awarded bids show up in the Contracts inbox with a Pending status." },
      {
        heading: "Fulfilment",
        paragraph:
          "Assign a crew, print the job sheet, and mark the contract as Ready to schedule.",
      },
    ],
  },
  {
    slug: "counting-inventory-weekly",
    title: "Counting inventory weekly",
    summary: "A repeatable process for accurate stock.",
    category: "inventory",
    updated: "2026-07-10",
    body: [
      { paragraph: "Use the Cycle count screen every Friday afternoon." },
      { heading: "Reconciliation", paragraph: "Investigate any variance above 3%." },
    ],
  },
  {
    slug: "updating-billing-details",
    title: "Updating billing details",
    summary: "Change your payment method or billing address.",
    category: "billing",
    updated: "2026-07-08",
    body: [
      {
        paragraph: "Settings → Billing → Payment method. Changes take effect on the next invoice.",
      },
    ],
  },
  {
    slug: "connecting-hydroseed-app-to-quickbooks",
    title: "Connecting HYDROSEED.APP to QuickBooks",
    summary: "Sync invoices and customers automatically.",
    category: "integrations",
    updated: "2026-07-02",
    body: [
      {
        paragraph:
          "Settings → Integrations → QuickBooks. Authorize the connection and pick a sync direction.",
      },
    ],
  },
  {
    slug: "understanding-jobs-vs-cycles",
    title: "Understanding jobs vs cycles",
    summary: "Two concepts that trip up new operators.",
    category: "production",
    updated: "2026-06-28",
    body: [
      {
        paragraph:
          "A job is what you sell. A cycle is how you schedule it. One cycle can generate many jobs.",
      },
    ],
  },
  {
    slug: "adding-a-new-customer",
    title: "Adding a new customer",
    summary: "Set up billing terms and site preferences.",
    category: "orders",
    updated: "2026-06-24",
    body: [
      {
        paragraph:
          "Customers → New. Payment terms default to Net 14, override per customer as needed.",
      },
    ],
  },
];

/* -------------------------- CHANGELOG -------------------------- */
export type Release = {
  slug: string;
  version: string;
  title: string;
  publishedAt: string;
  category: "New" | "Improved" | "Fixed";
  summary: string;
  highlights: { title: string; body: string }[];
};

export const RELEASES: Release[] = [
  {
    slug: "2026-07-25-journal-redesign",
    version: "v3.14",
    title: "HYDROSEED Journal redesign and shared publishing calendar",
    publishedAt: "2026-07-25",
    category: "New",
    summary:
      "A refreshed public Journal layout and a shared calendar for the content and marketing team.",
    highlights: [
      {
        title: "Journal redesign",
        body: "New article and resource layouts across hydroseed.app/journal.",
      },
      {
        title: "Shared publishing calendar",
        body: "The Monday screen for every writer and editor on the team.",
      },
      {
        title: "Slack notifications",
        body: "Publish, revise, and schedule events flow into any channel.",
      },
    ],
  },
  {
    slug: "2026-07-11-seo-metadata",
    version: "v3.13",
    title: "Improved SEO metadata across marketing pages",
    publishedAt: "2026-07-11",
    category: "New",
    summary:
      "Structured metadata and social preview cards computed automatically from page content.",
    highlights: [
      {
        title: "Auto-generated previews",
        body: "No more manual social card uploads for every new page.",
      },
      {
        title: "Metadata sources",
        body: "Title, description and canonical tags allocated per page template.",
      },
    ],
  },
  {
    slug: "2026-06-27-resource-library-2",
    version: "v3.12",
    title: "Resource library 2.0",
    publishedAt: "2026-06-27",
    category: "Improved",
    summary: "A rebuilt resource library experience with faster search and better filtering.",
    highlights: [
      {
        title: "Faster search",
        body: "Keyboard-first search across guides, playbooks and reports.",
      },
      { title: "Filter panel", body: "See and refine results in the same view." },
    ],
  },
  {
    slug: "2026-06-13-case-study-page-fixes",
    version: "v3.11.4",
    title: "Case study page reliability",
    publishedAt: "2026-06-13",
    category: "Fixed",
    summary: "Bug fixes and stability improvements for public case study pages.",
    highlights: [
      { title: "Duplicate metrics", body: "Fixed a rare case where a metric could appear twice." },
      { title: "Filter persistence", body: "Industry filter now persists across sessions." },
    ],
  },
  {
    slug: "2026-05-30-quickbooks-billing-sync",
    version: "v3.11",
    title: "QuickBooks billing sync",
    publishedAt: "2026-05-30",
    category: "New",
    summary: "Sync studio invoices and customers with QuickBooks Online.",
    highlights: [
      { title: "Two-way sync", body: "Customers and invoices flow in both directions." },
      {
        title: "Field mapping",
        body: "Configure how HYDROSEED.APP fields map to QuickBooks fields.",
      },
    ],
  },
  {
    slug: "2026-05-16-mobile-editor-preview",
    version: "v3.10",
    title: "Mobile editor preview",
    publishedAt: "2026-05-16",
    category: "New",
    summary: "A tablet-first preview mode for reviewing Journal drafts on the go.",
    highlights: [
      { title: "One screen per draft", body: "Optimised for quick review between site visits." },
      { title: "Offline tolerant", body: "Sync when the tablet reconnects." },
    ],
  },
];

export const getArticle = (s: string) => ARTICLES.find((a) => a.slug === s);
export const getResource = (s: string) => RESOURCES.find((a) => a.slug === s);
export const getCourse = (s: string) => COURSES.find((a) => a.slug === s);
export const getCaseStudy = (s: string) => CASE_STUDIES.find((a) => a.slug === s);
export const getHelpArticle = (s: string) => HELP_ARTICLES.find((a) => a.slug === s);
export const getRelease = (s: string) => RELEASES.find((a) => a.slug === s);
