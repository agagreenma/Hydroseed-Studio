// Realistic mock content for the public HYDROSEED Journal
export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; role: string; initials: string };
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  cover: string;
  featured?: boolean;
};

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const TOPICS = [
  "All",
  "Hydroseeding",
  "Erosion Control",
  "Slope Stabilization",
  "Site Revegetation",
  "Seed & Mulch Mixes",
  "Contractor Operations",
  "Project Planning",
  "Business & Economics",
];

export const AUTHORS = {
  sofia: { name: "Sofia Reyes", role: "Revegetation Writer", initials: "SR" },
  amina: { name: "Amina Fassi", role: "Head of Content", initials: "AF" },
  julien: { name: "Julien Marchand", role: "Editor", initials: "JM" },
  karim: { name: "Karim Belkacem", role: "Product Marketing", initials: "KB" },
  nora: { name: "Nora El Idrissi", role: "SEO Lead", initials: "NE" },
};

export const POSTS: JournalPost[] = [
  {
    slug: "hydroseeding-crew-economics-per-acre",
    title: "The economics of running a hydroseeding crew per acre",
    excerpt:
      "A practical breakdown of coverage rates, recurring costs, labor, pricing and margins for a professional hydroseeding contractor.",
    category: "Business & Economics",
    author: AUTHORS.sofia,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-22",
    readingMinutes: 12,
    cover: img("1585320806297-9794b3e4eeae"),
    featured: true,
  },
  {
    slug: "slope-stabilization-costs-honest-math",
    title: "Slope stabilization costs: what the honest math looks like",
    excerpt: "Real material rates, application depth and coverage per acre — a grounded look behind the numbers.",
    category: "Slope Stabilization",
    author: AUTHORS.karim,
    publishedAt: "2026-07-10",
    updatedAt: "2026-07-15",
    readingMinutes: 9,
    cover: img("1560493676-04071c5f467b"),
  },
  {
    slug: "bfm-vs-smm-erosion-control-blanket-comparison",
    title: "BFM vs SMM: choosing an erosion control mix for steep slopes",
    excerpt: "Material selection, performance trade-offs and application overhead compared side by side.",
    category: "Seed & Mulch Mixes",
    author: AUTHORS.sofia,
    publishedAt: "2026-07-06",
    updatedAt: "2026-07-08",
    readingMinutes: 8,
    cover: img("1592982537447-6d3f2a0a4e42"),
  },
  {
    slug: "reliable-hydroseeding-project-schedule",
    title: "How to build a reliable hydroseeding project schedule",
    excerpt: "A repeatable weekly cadence for site prep, application and follow-up — without spreadsheets.",
    category: "Project Planning",
    author: AUTHORS.julien,
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-03",
    readingMinutes: 7,
    cover: img("1523348837708-15d4a09cfac2"),
  },
  {
    slug: "bidding-construction-revegetation-framework",
    title: "Bidding construction-site revegetation: a practical framework",
    excerpt: "How to price for general contractors and municipalities without eroding your margins.",
    category: "Business & Economics",
    author: AUTHORS.karim,
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-29",
    readingMinutes: 10,
    cover: img("1502741338009-cac2772e18bc"),
  },
  {
    slug: "hidden-cost-poor-material-planning",
    title: "The hidden cost of poor material planning",
    excerpt: "Why waste, mis-mixes and overapplication quietly consume 8–15% of project margin.",
    category: "Contractor Operations",
    author: AUTHORS.amina,
    publishedAt: "2026-06-22",
    updatedAt: "2026-06-24",
    readingMinutes: 6,
    cover: img("1518977676601-b53f82aba655"),
  },
  {
    slug: "site-compliance-essentials-swppp-basics",
    title: "Site compliance essentials: SWPPP basics for revegetation crews",
    excerpt: "The paperwork, inspection cadence and documentation you actually need in place.",
    category: "Contractor Operations",
    author: AUTHORS.amina,
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    readingMinutes: 8,
    cover: img("1416879595882-3373a0480b5b"),
  },
  {
    slug: "project-planning-without-spreadsheets",
    title: "Revegetation project planning without spreadsheets",
    excerpt: "A calmer approach to planning weekly site visits, application windows and follow-ups.",
    category: "Project Planning",
    author: AUTHORS.julien,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    readingMinutes: 7,
    cover: img("1521737604893-d14cc237f11d"),
  },
  {
    slug: "when-should-a-crew-add-another-hydroseed-rig",
    title: "When should a crew add another hydroseed rig?",
    excerpt: "A capacity and demand framework for deciding whether to expand or optimise first.",
    category: "Hydroseeding",
    author: AUTHORS.sofia,
    publishedAt: "2026-05-30",
    updatedAt: "2026-05-31",
    readingMinutes: 9,
    cover: img("1560493676-04071c5f467b"),
  },
];

export const CLUSTERS = [
  { slug: "hydroseeding", name: "Hydroseeding", description: "Application rates, cycles, unit economics and quality control.", count: 14 },
  { slug: "erosion-control", name: "Erosion Control", description: "Mix selection, materials and slope performance.", count: 18 },
  { slug: "slope-stabilization", name: "Slope Stabilization", description: "Grading, coverage, cost per acre and equipment.", count: 11 },
  { slug: "revegetation", name: "Site Revegetation", description: "Climate, soil conditions and establishment success.", count: 9 },
  { slug: "operations", name: "Contractor Operations", description: "Crews, workflow, compliance and delivery.", count: 22 },
  { slug: "business", name: "Contractor Business", description: "Bidding, municipal contracts and financial planning.", count: 13 },
];

export const GUIDES = [
  { slug: "complete-guide-starting-hydroseeding-business", title: "The complete guide to starting a hydroseeding business", minutes: 22 },
  { slug: "erosion-control-project-planning-fundamentals", title: "Erosion control project planning fundamentals", minutes: 18 },
  { slug: "how-contractors-manage-material-inventory", title: "How contractors manage material inventory", minutes: 14 },
  { slug: "building-municipal-contract-pipeline", title: "Building a municipal and GC contract pipeline", minutes: 16 },
  { slug: "choosing-contractor-management-software", title: "Choosing contractor management software", minutes: 12 },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, category: string, n = 3) {
  return POSTS.filter((p) => p.slug !== slug && p.category === category)
    .concat(POSTS.filter((p) => p.slug !== slug && p.category !== category))
    .slice(0, n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
