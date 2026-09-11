import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GraduationCap, Clock, PlayCircle, Award } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { COURSES, ACADEMY_TRACKS } from "@/lib/public-content";

export const Route = createFileRoute("/journal/academy")({
  head: () => ({
    meta: [
      { title: "Academy — HYDROSEED" },
      { name: "description", content: "Professional education for the modern hydroseeding and erosion control operator. Structured tracks in operations, commerce and leadership." },
      { property: "og:title", content: "HYDROSEED Academy" },
      { property: "og:description", content: "A modern learning platform for professional erosion control and revegetation operators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademyPage,
});

const PATHS = [
  { title: "Operator", tagline: "From day one on the crew to running the weekly plan.", courses: ["foundations-of-hydroseeding", "job-scheduling-mastery"] },
  { title: "Commercial", tagline: "Own pricing, channels and margin.", courses: ["commerce-for-hydroseeding-contractors"] },
  { title: "Founder", tagline: "Lead a growing contracting business past the first year.", courses: ["leading-a-growing-crew", "advanced-erosion-control-systems"] },
];

function AcademyPage() {
  const [track, setTrack] = useState("All");
  const filtered = useMemo(() => COURSES.filter(c => track === "All" || c.track === track), [track]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary-soft to-background" aria-hidden />
        <div className="relative mx-auto max-w-[1240px] px-5 lg:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 h-8 rounded-full border border-border bg-background/70 px-3 text-xs">
            <GraduationCap className="h-3.5 w-3.5 text-primary" /> HYDROSEED Academy · Cohort Autumn 2026 open
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-4xl">
            Professional education for the operators building the next generation of revegetation businesses.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            Structured courses, cohort-based learning paths and certifications — designed for people running
            hydroseeding crews and job sites, not for the classroom.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#courses" className="h-11 grid place-items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Browse the catalogue</a>
            <a href="#paths" className="h-11 grid place-items-center rounded-md border border-border px-5 text-sm hover:bg-muted">See learning paths</a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
            <Stat label="Courses" value={String(COURSES.length)} />
            <Stat label="Hours of content" value={`${COURSES.reduce((s, c) => s + c.hours, 0)}+`} />
            <Stat label="Learners" value="4,200+" />
          </div>
        </div>
      </section>

      {/* Paths */}
      <section id="paths" className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16">
          <div className="mono-label mb-3">Learning paths</div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">Pick the role you're growing into.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PATHS.map(p => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                <div className="mono-label text-accent-foreground">{p.courses.length} courses</div>
                <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.courses.map(slug => {
                    const c = COURSES.find(x => x.slug === slug);
                    if (!c) return null;
                    return (
                      <li key={slug}>
                        <Link to="/journal/academy/$slug" params={{ slug }} className="flex items-center gap-2 text-foreground hover:text-primary">
                          <PlayCircle className="h-4 w-4 text-primary" /> {c.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Award className="h-3.5 w-3.5" /> Certificate on completion
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="courses" className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mono-label mb-2">Course catalogue</div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">All courses</h2>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {ACADEMY_TRACKS.map(t => (
              <button key={t} onClick={() => setTrack(t)} className={`h-8 px-3 rounded-full text-xs border ${track === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filtered.map(c => (
            <Link key={c.slug} to="/journal/academy/$slug" params={{ slug: c.slug }} className="group grid grid-cols-[140px_1fr] gap-5 rounded-xl border border-border bg-card p-4 hover:border-primary transition">
              <img src={c.cover} alt={c.title} className="aspect-square rounded-md object-cover" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 h-6 grid place-items-center rounded-full bg-primary-soft text-accent-foreground">{c.level}</span>
                  <span className="text-muted-foreground">{c.track}</span>
                </div>
                <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-primary">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.hours}h</span>
                  <span>{c.lessons} lessons</span>
                  <span>Taught by {c.instructor.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterCTA eyebrow="Course updates" title="Be the first to know when a new cohort opens." />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl">{value}</div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  );
}
