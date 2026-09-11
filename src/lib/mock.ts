// Sample data for HYDROSEED Studio (internal marketing & content workspace for hydroseed.app).
// NOTE: everything in this file is hard-coded sample data. Nothing here is connected to a
// live database, analytics provider or publishing backend.

export type Status = "draft" | "in_review" | "approved" | "scheduled" | "published" | "archived";
export type Language = "en" | "fr" | "es" | "ar";

export const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "ar", label: "العربية", flag: "AR" },
];

export const AUTHORS = [
  { id: "a1", name: "Amina Fassi", role: "Head of Content", initials: "AF" },
  { id: "a2", name: "Julien Marchand", role: "Editor", initials: "JM" },
  { id: "a3", name: "Sofia Reyes", role: "Revegetation Writer", initials: "SR" },
  { id: "a4", name: "Karim Belkacem", role: "Product Marketing", initials: "KB" },
  { id: "a5", name: "Nora El Idrissi", role: "SEO Lead", initials: "NE" },
];

export const CATEGORIES = [
  "Hydroseeding",
  "Erosion Control",
  "Slope Stabilization",
  "Site Revegetation",
  "Seed & Mulch Mixes",
  "Soil Stabilization",
  "Turf Establishment",
  "Contractor Operations",
  "Product Updates",
];

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  language: Language;
  status: Status;
  seoScore: number;
  updatedAt: string;
  publishAt?: string;
  views?: number;
  cover: string;
};

const cover = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=400&q=60`;

export const ARTICLES: Article[] = [
  {
    id: "art_01",
    title: "What a hydroseeding job on a 2:1 construction slope actually costs",
    slug: "hydroseeding-cost-construction-slope",
    excerpt:
      "A grounded breakdown of mix, water, mobilisation and labour for a typical civil slope application.",
    author: "a3",
    category: "Hydroseeding",
    tags: ["cost", "slopes", "civil"],
    language: "en",
    status: "published",
    seoScore: 86,
    updatedAt: "2026-07-22T09:14:00Z",
    publishAt: "2026-07-19T10:00:00Z",
    views: 4210,
    cover: cover("1416879595882-3373a0480b5b"),
  },
  {
    id: "art_02",
    title: "Wood fibre versus bonded fibre matrix: choosing a mulch for steep ground",
    slug: "wood-fibre-vs-bfm-steep-slopes",
    excerpt:
      "Coverage, cure time, rainfall tolerance and cost per hectare compared side by side.",
    author: "a3",
    category: "Seed & Mulch Mixes",
    tags: ["bfm", "mulch", "specification"],
    language: "en",
    status: "in_review",
    seoScore: 74,
    updatedAt: "2026-07-25T14:02:00Z",
    cover: cover("1592982537447-6d3f2a0a4e42"),
  },
  {
    id: "art_03",
    title: "Comment planifier la revégétalisation d'un chantier routier",
    slug: "planifier-revegetalisation-chantier-routier",
    excerpt: "Un cadre pratique pour organiser l'ensemencement sur 12 semaines de chantier.",
    author: "a2",
    category: "Site Revegetation",
    tags: ["planification", "chantier"],
    language: "fr",
    status: "scheduled",
    seoScore: 81,
    updatedAt: "2026-07-24T16:30:00Z",
    publishAt: "2026-07-30T08:00:00Z",
    cover: cover("1523348837708-15d4a09cfac2"),
  },
  {
    id: "art_04",
    title: "Erosion control documentation contractors are asked for on site",
    slug: "erosion-control-site-documentation",
    excerpt: "The inspection records, product data and photo evidence to keep on every job file.",
    author: "a1",
    category: "Erosion Control",
    tags: ["compliance", "inspections"],
    language: "en",
    status: "draft",
    seoScore: 42,
    updatedAt: "2026-07-26T11:47:00Z",
    cover: cover("1518977676601-b53f82aba655"),
  },
  {
    id: "art_05",
    title: "Water planning for large-area hydroseeding in dry season",
    slug: "water-planning-large-area-hydroseeding",
    excerpt: "Tank logistics, application rates and establishment windows when water is limited.",
    author: "a4",
    category: "Turf Establishment",
    tags: ["water", "logistics", "seasonal"],
    language: "en",
    status: "published",
    seoScore: 92,
    updatedAt: "2026-07-15T08:00:00Z",
    publishAt: "2026-07-10T09:00:00Z",
    views: 12840,
    cover: cover("1560493676-04071c5f467b"),
  },
  {
    id: "art_06",
    title: "Cómo preparar una propuesta de hidrosiembra para obra civil",
    slug: "propuesta-hidrosiembra-obra-civil",
    excerpt: "Guía práctica para presupuestar y presentar trabajos de revegetación.",
    author: "a2",
    category: "Contractor Operations",
    tags: ["presupuesto", "obra"],
    language: "es",
    status: "draft",
    seoScore: 55,
    updatedAt: "2026-07-23T13:20:00Z",
    cover: cover("1502741338009-cac2772e18bc"),
  },
  {
    id: "art_07",
    title: "Soil preparation and tackifier selection before seeding",
    slug: "soil-preparation-tackifier-selection",
    excerpt: "Surface roughening, amendments and binder choice for surfaces that shed water.",
    author: "a3",
    category: "Soil Stabilization",
    tags: ["tackifier", "soil"],
    language: "en",
    status: "approved",
    seoScore: 78,
    updatedAt: "2026-07-25T09:00:00Z",
    cover: cover("1416879595882-3373a0480b5b"),
  },
  {
    id: "art_08",
    title: "New on hydroseed.app: project galleries for contractors",
    slug: "hydroseed-app-project-galleries",
    excerpt: "Contractor profiles can now show completed revegetation projects with before/after photos.",
    author: "a4",
    category: "Product Updates",
    tags: ["release", "profiles"],
    language: "en",
    status: "published",
    seoScore: 88,
    updatedAt: "2026-07-05T09:00:00Z",
    publishAt: "2026-07-02T09:00:00Z",
    views: 8710,
    cover: cover("1521737604893-d14cc237f11d"),
  },
  {
    id: "art_09",
    title: "أساسيات التثبيت النباتي للمنحدرات",
    slug: "slope-stabilization-basics-ar",
    excerpt: "دليل مبسّط لتثبيت التربة وزراعة المنحدرات بعد أعمال الحفر.",
    author: "a1",
    category: "Slope Stabilization",
    tags: ["slopes", "starter"],
    language: "ar",
    status: "draft",
    seoScore: 38,
    updatedAt: "2026-07-20T10:00:00Z",
    cover: cover("1416879595882-3373a0480b5b"),
  },
  {
    id: "art_10",
    title: "Reducing re-seeding callbacks after heavy rainfall",
    slug: "reduce-reseeding-callbacks-rainfall",
    excerpt: "Practical steps for protecting a fresh application through the first storm cycle.",
    author: "a3",
    category: "Erosion Control",
    tags: ["rainfall", "callbacks"],
    language: "en",
    status: "archived",
    seoScore: 71,
    updatedAt: "2026-06-10T09:00:00Z",
    publishAt: "2026-06-01T09:00:00Z",
    views: 2140,
    cover: cover("1523348837708-15d4a09cfac2"),
  },
];

export type PageRow = {
  name: string;
  path: string;
  status: Status;
  language: Language;
  seo: "ok" | "warn" | "issue";
  lastUpdated: string;
  lastPublished?: string;
  author: string;
};

export const WEBSITE_PAGES: PageRow[] = [
  { name: "Homepage", path: "/", status: "published", language: "en", seo: "ok", lastUpdated: "2026-07-24", lastPublished: "2026-07-24", author: "a1" },
  { name: "Pricing", path: "/pricing", status: "published", language: "en", seo: "warn", lastUpdated: "2026-07-19", lastPublished: "2026-07-19", author: "a4" },
  { name: "Services", path: "/services", status: "published", language: "en", seo: "ok", lastUpdated: "2026-07-22", lastPublished: "2026-07-22", author: "a4" },
  { name: "Erosion Control", path: "/erosion-control", status: "published", language: "en", seo: "ok", lastUpdated: "2026-07-18", lastPublished: "2026-07-18", author: "a4" },
  { name: "Find a Contractor", path: "/contractors", status: "draft", language: "en", seo: "issue", lastUpdated: "2026-07-26", author: "a4" },
  { name: "Projects", path: "/projects", status: "scheduled", language: "en", seo: "warn", lastUpdated: "2026-07-25", author: "a1" },
  { name: "About", path: "/about", status: "published", language: "en", seo: "ok", lastUpdated: "2026-06-12", lastPublished: "2026-06-12", author: "a1" },
  { name: "Contact", path: "/contact", status: "published", language: "en", seo: "ok", lastUpdated: "2026-05-30", lastPublished: "2026-05-30", author: "a1" },
  { name: "Careers", path: "/careers", status: "published", language: "en", seo: "warn", lastUpdated: "2026-07-10", lastPublished: "2026-07-10", author: "a2" },
  { name: "Privacy", path: "/privacy", status: "published", language: "en", seo: "ok", lastUpdated: "2026-04-01", lastPublished: "2026-04-01", author: "a1" },
  { name: "Terms", path: "/terms", status: "published", language: "en", seo: "ok", lastUpdated: "2026-04-01", lastPublished: "2026-04-01", author: "a1" },
  { name: "Cookies", path: "/cookies", status: "published", language: "en", seo: "ok", lastUpdated: "2026-04-01", lastPublished: "2026-04-01", author: "a1" },
];

export type LandingPage = {
  name: string;
  path: string;
  campaign: string;
  status: Status;
  language: Language;
  seo: "ok" | "warn" | "issue";
  conversion: number; // 0-100
  updatedAt: string;
};

export const LANDING_PAGES: LandingPage[] = [
  { name: "Slope Stabilization Quote", path: "/lp/slope-quote", campaign: "Q3 Slopes", status: "published", language: "en", seo: "ok", conversion: 4.2, updatedAt: "2026-07-24" },
  { name: "HYDROSEED for Civil Contractors", path: "/lp/civil", campaign: "Civil 2026", status: "published", language: "en", seo: "warn", conversion: 2.9, updatedAt: "2026-07-20" },
  { name: "Request a Site Assessment", path: "/lp/site-assessment", campaign: "Commercial Push", status: "scheduled", language: "en", seo: "ok", conversion: 0, updatedAt: "2026-07-25" },
  { name: "تثبيت المنحدرات", path: "/lp/slopes-ar", campaign: "MENA 2026", status: "draft", language: "ar", seo: "issue", conversion: 0, updatedAt: "2026-07-26" },
  { name: "Hydro-ensemencement — Guide gratuit", path: "/lp/guide-hydro", campaign: "FR Lead Magnet", status: "published", language: "fr", seo: "ok", conversion: 6.1, updatedAt: "2026-07-18" },
  { name: "Roadside Revegetation — Winter Prep", path: "/lp/roadside-winter", campaign: "Winter Prep", status: "archived", language: "en", seo: "warn", conversion: 1.8, updatedAt: "2026-05-11" },
];

export type SeoIssue = {
  id: string;
  severity: "critical" | "warn" | "info";
  issue: string;
  page: string;
  type: string;
  detected: string;
  state: "open" | "fixed" | "ignored";
  action: string;
};

export const SEO_ISSUES: SeoIssue[] = [
  { id: "s1", severity: "critical", issue: "Missing meta description", page: "/contractors", type: "Metadata", detected: "2026-07-25", state: "open", action: "Add meta description under 160 chars." },
  { id: "s2", severity: "critical", issue: "Broken outbound link", page: "/blog/water-planning-large-area-hydroseeding", type: "Links", detected: "2026-07-24", state: "open", action: "Replace or remove the 404 link." },
  { id: "s3", severity: "warn", issue: "Missing alt text (3 images)", page: "/blog/hydroseeding-cost-construction-slope", type: "Accessibility", detected: "2026-07-23", state: "open", action: "Provide descriptive alt text." },
  { id: "s4", severity: "warn", issue: "Duplicate H1", page: "/pricing", type: "Headings", detected: "2026-07-22", state: "open", action: "Ensure a single H1 per page." },
  { id: "s5", severity: "warn", issue: "Meta title over 60 chars", page: "/projects", type: "Metadata", detected: "2026-07-25", state: "open", action: "Shorten the meta title." },
  { id: "s6", severity: "info", issue: "Canonical points to redirect", page: "/lp/civil", type: "Canonical", detected: "2026-07-19", state: "open", action: "Update canonical to the final URL." },
  { id: "s7", severity: "info", issue: "Sitemap missing 2 published URLs", page: "/sitemap.xml", type: "Sitemap", detected: "2026-07-20", state: "open", action: "Regenerate sitemap." },
  { id: "s8", severity: "warn", issue: "FAQ schema not detected", page: "/services", type: "Schema", detected: "2026-07-14", state: "open", action: "Add FAQPage JSON-LD." },
  { id: "s9", severity: "critical", issue: "Page blocked by robots.txt", page: "/lp/site-assessment", type: "Robots", detected: "2026-07-25", state: "open", action: "Remove Disallow rule." },
  { id: "s10", severity: "info", issue: "Image over 500KB", page: "/blog/hydroseed-app-project-galleries", type: "Performance", detected: "2026-07-12", state: "fixed", action: "Compress hero image." },
];

export type Redirect = {
  id: string;
  source: string;
  destination: string;
  type: 301 | 302;
  active: boolean;
  createdAt: string;
  hits: number;
  notes?: string;
};

export const REDIRECTS: Redirect[] = [
  { id: "r1", source: "/old-blog/slope-costs", destination: "/blog/hydroseeding-cost-construction-slope", type: 301, active: true, createdAt: "2026-06-04", hits: 1240, notes: "Migration from old site" },
  { id: "r2", source: "/pricing-2024", destination: "/pricing", type: 301, active: true, createdAt: "2026-01-08", hits: 812, notes: "Legacy pricing URL" },
  { id: "r3", source: "/quote", destination: "/lp/site-assessment", type: 302, active: true, createdAt: "2026-07-01", hits: 96 },
  { id: "r4", source: "/hydro-ensemencement", destination: "/fr/hydro-ensemencement", type: 301, active: true, createdAt: "2026-05-22", hits: 231 },
  { id: "r5", source: "/team", destination: "/about", type: 301, active: false, createdAt: "2026-03-15", hits: 44, notes: "Disabled after About refresh" },
  { id: "r6", source: "/blog/water", destination: "/blog/water-planning-large-area-hydroseeding", type: 301, active: true, createdAt: "2026-07-06", hits: 512 },
];

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
  uploader: string;
  folder: string;
};

export const MEDIA: MediaItem[] = [
  { id: "m1", name: "slope-application-hero.jpg", type: "image", url: cover("1416879595882-3373a0480b5b"), size: "412 KB", dimensions: "2400×1600", uploadedAt: "2026-07-24", uploader: "a1", folder: "Blog" },
  { id: "m2", name: "roadside-revegetation.jpg", type: "image", url: cover("1560493676-04071c5f467b"), size: "628 KB", dimensions: "2000×1333", uploadedAt: "2026-07-15", uploader: "a3", folder: "Blog" },
  { id: "m3", name: "site-prep-morning.jpg", type: "image", url: cover("1523348837708-15d4a09cfac2"), size: "391 KB", dimensions: "2400×1600", uploadedAt: "2026-07-11", uploader: "a3", folder: "Landing" },
  { id: "m4", name: "project-galleries-cover.jpg", type: "image", url: cover("1521737604893-d14cc237f11d"), size: "245 KB", dimensions: "1920×1080", uploadedAt: "2026-07-02", uploader: "a4", folder: "Product" },
  { id: "m5", name: "mulch-mix-loading.jpg", type: "image", url: cover("1518977676601-b53f82aba655"), size: "512 KB", dimensions: "2000×1333", uploadedAt: "2026-07-08", uploader: "a2", folder: "Blog" },
  { id: "m6", name: "tank-and-hose.jpg", type: "image", url: cover("1592982537447-6d3f2a0a4e42"), size: "302 KB", dimensions: "1600×1067", uploadedAt: "2026-07-22", uploader: "a3", folder: "Blog" },
  { id: "m7", name: "commercial-turf-establishment.jpg", type: "image", url: cover("1502741338009-cac2772e18bc"), size: "489 KB", dimensions: "2400×1600", uploadedAt: "2026-07-19", uploader: "a2", folder: "Landing" },
  { id: "m8", name: "germination-week-three.jpg", type: "image", url: cover("1523348837708-15d4a09cfac2"), size: "356 KB", dimensions: "2000×1333", uploadedAt: "2026-07-06", uploader: "a1", folder: "Resources" },
];

export const CHANGELOG = [
  { version: "2.4.0", date: "2026-07-24", title: "Project galleries for contractor profiles", tag: "Feature", body: "Contractor profiles on hydroseed.app can present completed revegetation projects with before and after imagery." },
  { version: "2.3.2", date: "2026-07-11", title: "Clearer service-area pages", tag: "Improvement", body: "Regional service pages now render a consistent coverage map and enquiry form." },
  { version: "2.3.1", date: "2026-07-02", title: "Faster site search", tag: "Improvement", body: "Public search results return in under 120ms on average." },
  { version: "2.3.0", date: "2026-06-18", title: "Resource downloads", tag: "Feature", body: "Guides and specification sheets can be published as downloadable resources." },
  { version: "2.2.4", date: "2026-05-30", title: "Bug fixes and stability", tag: "Fix", body: "Resolved a caching issue on the enquiry confirmation page." },
];

export const CLUSTERS = [
  { name: "Hydroseeding", pillar: "/blog/hydroseeding-cost-construction-slope", supporting: 6, missing: 2, langs: 3 },
  { name: "Erosion Control", pillar: "/blog/reduce-reseeding-callbacks-rainfall", supporting: 8, missing: 3, langs: 2 },
  { name: "Slope Stabilization", pillar: "/blog/soil-preparation-tackifier-selection", supporting: 5, missing: 4, langs: 2 },
  { name: "Site Revegetation", pillar: "/resources/site-revegetation-playbook", supporting: 11, missing: 1, langs: 4 },
  { name: "Seed & Mulch Mixes", pillar: "/resources/seed-and-mulch-selection", supporting: 4, missing: 5, langs: 1 },
];

export const TOP_QUERIES = [
  { q: "hydroseeding cost per square metre", clicks: 1820, impressions: 21400, ctr: 8.5, position: 3.2 },
  { q: "erosion control blanket vs hydroseeding", clicks: 1104, impressions: 15200, ctr: 7.3, position: 4.1 },
  { q: "bonded fibre matrix application rate", clicks: 892, impressions: 11800, ctr: 7.6, position: 4.6 },
  { q: "hydroseeding contractors near me", clicks: 812, impressions: 24600, ctr: 3.3, position: 6.2 },
  { q: "how long does hydroseed take to grow", clicks: 654, impressions: 9800, ctr: 6.7, position: 5.1 },
  { q: "slope stabilization seed mix", clicks: 512, impressions: 6300, ctr: 8.1, position: 3.9 },
];

export const TOP_PAGES = [
  { path: "/blog/water-planning-large-area-hydroseeding", views: 12840, avgTime: "4:20", bounce: 38 },
  { path: "/blog/hydroseed-app-project-galleries", views: 8710, avgTime: "3:12", bounce: 44 },
  { path: "/blog/hydroseeding-cost-construction-slope", views: 4210, avgTime: "5:02", bounce: 32 },
  { path: "/pricing", views: 3920, avgTime: "2:14", bounce: 51 },
  { path: "/services", views: 3184, avgTime: "3:48", bounce: 40 },
];

export const ACTIVITY = [
  { who: "a1", what: "published", target: "What a hydroseeding job on a 2:1 construction slope actually costs", when: "2h ago" },
  { who: "a3", what: "commented on", target: "Wood fibre versus bonded fibre matrix", when: "3h ago" },
  { who: "a2", what: "scheduled", target: "Comment planifier la revégétalisation d'un chantier routier", when: "5h ago" },
  { who: "a4", what: "updated SEO on", target: "/pricing", when: "yesterday" },
  { who: "a5", what: "created redirect", target: "/blog/water → /blog/water-planning-large-area-hydroseeding", when: "2 days ago" },
  { who: "a1", what: "uploaded 12 assets to", target: "Media / Blog", when: "3 days ago" },
];

export function authorById(id: string) {
  return AUTHORS.find((a) => a.id === id) ?? AUTHORS[0];
}

export function statusLabel(s: Status): string {
  switch (s) {
    case "in_review": return "In Review";
    case "draft": return "Draft";
    case "approved": return "Approved";
    case "scheduled": return "Scheduled";
    case "published": return "Published";
    case "archived": return "Archived";
  }
}
