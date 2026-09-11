import { createFileRoute } from "@tanstack/react-router";
import { ContentList, type ContentItem } from "@/components/studio/ContentList";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies · HYDROSEED Studio" },
      { name: "description", content: "Customer success stories and case studies." },
    ],
  }),
  component: () => (
    <ContentList
      eyebrow="Publishing · Case Studies"
      title="Case studies & success stories"
      description="Real contractors using HYDROSEED — surfaced on hydroseed.app/case-studies."
      ctaLabel="New case study"
      items={ITEMS}
    />
  ),
});

const cover = (s: string) => `https://images.unsplash.com/photo-${s}?auto=format&fit=crop&w=800&q=60`;

const ITEMS: ContentItem[] = [
  { id: "cs1", title: "How Northline Civil grew bid win rate 3.2× with HYDROSEED", meta: "Denver · Highway slopes · 220 acres", chips: ["Bids", "3.2× win rate"], status: "published", language: "en", cover: cover("1560493676-04071c5f467b"), updated: "5 days ago" },
  { id: "cs2", title: "Ridgeway Landscapes: cutting reseeding calls from 14% to 4%", meta: "Portland · Commercial sites · 60 acres", chips: ["Reseed rate", "Coverage"], status: "published", language: "en", cover: cover("1585320806297-9794b3e4eeae"), updated: "2 weeks ago" },
  { id: "cs3", title: "Comment Talus Vert double sa capacité sans embaucher", meta: "Lyon · Talus routiers · 800 acres", chips: ["Planning", "Automation"], status: "in_review", language: "fr", cover: cover("1416879595882-3373a0480b5b"), updated: "yesterday" },
  { id: "cs4", title: "SlopeWorks: from 3 sites to 47 in 18 months", meta: "London · Roadside revegetation · 400 acres", chips: ["Sales", "Scale"], status: "draft", language: "en", cover: cover("1502741338009-cac2772e18bc"), updated: "3 days ago" },
  { id: "cs5", title: "Green Rooftop Civil: profitable at 45 acres", meta: "Amsterdam · Infrastructure · 45 acres", chips: ["Unit economics"], status: "scheduled", language: "en", cover: cover("1518977676601-b53f82aba655"), updated: "yesterday" },
  { id: "cs6", title: "Terrain Ferme: SWPPP compliance without the paperwork nightmare", meta: "Montréal · Diversified · 320 acres", chips: ["Compliance"], status: "published", language: "fr", cover: cover("1523348837708-15d4a09cfac2"), updated: "1 month ago" },
];
