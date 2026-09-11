import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Award, BarChart3, CheckCircle2, Clock, GraduationCap, PlayCircle, Sparkles, Users } from "lucide-react";
import { AcademyHeader, AcademyFooter } from "@/components/academy/AcademyChrome";
import { COURSES, ACADEMY_TRACKS } from "@/lib/public-content";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "HYDROSEED Academy — Learning centre for erosion control operators" },
      { name: "description", content: "Courses, learning paths and certification for professional hydroseeding contractors and erosion control operators. Learn project planning, commerce and leadership with HYDROSEED Academy." },
      { property: "og:title", content: "HYDROSEED Academy — Learning centre for erosion control operators" },
      { property: "og:description", content: "Courses, learning paths and certification for professional hydroseeding and erosion control operators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnHome,
});

const PATHS = [
  { title: "Operator", tagline: "From day one on the crew to owning the weekly plan.", weeks: 6, courses: ["foundations-of-hydroseeding", "job-scheduling-mastery"] },
  { title: "Commercial", tagline: "Own pricing, channels and margin.", weeks: 4, courses: ["commerce-for-hydroseeding-contractors"] },
  { title: "Founder", tagline: "Lead a growing contracting business past its first year.", weeks: 8, courses: ["leading-a-growing-crew", "advanced-erosion-control-systems"] },
];

function LearnHome() {
  const [track, setTrack] = useState("All");
  const [level, setLevel] = useState("All levels");
  const filtered = useMemo(
    () => COURSES.filter((c) => (track === "All" || c.track === track) && (level === "All levels" || c.level === level)),
    [track, level],
  );
  const featured = COURSES[0];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AcademyHeader />

      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-background to-background" aria-hidden />
        <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-14 md:py-20 grid gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 h-8 rounded-full border border-border bg-card px-3 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Autumn 2026 cohort now open
            </div>
            <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.03] tracking-tight">
              The learning centre for the people who run erosion control operations.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Structured courses, guided paths and certification — taught by operators, designed around the
              realities of a hydroseeding job site.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogue" className="h-11 grid place-items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Browse the catalogue</a>
              <a href="#paths" className="h-11 grid place-items-center rounded-md border border-border bg-card px-5 text-sm hover:bg-muted">Explore learning paths</a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <Stat icon={<GraduationCap className="h-4 w-4" />} label="Courses" value={String(COURSES.length)} />
              <Stat icon={<Clock className="h-4 w-4" />} label="Hours" value={`${COURSES.reduce((s, c) => s + c.hours, 0)}+`} />
              <Stat icon={<Users className="h-4 w-4" />} label="Learners" value="4,200+" />
            </div>
          </div>

          {/* Continue-learning card, academy-centre style */}
          <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-pop)] overflow-hidden">
            <div className="relative aspect-[16/9]">
              <img src={featured.cover} alt={featured.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 grid place-items-center bg-foreground/25">
                <PlayCircle className="h-14 w-14 text-background" />
              </div>
            </div>
            <div className="p-5">
              <div className="mono-label text-accent-foreground">Featured course</div>
              <h2 className="mt-1 font-display text-xl leading-snug">{featured.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{featured.tagline}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Module 2 of {featured.outline.length}</span>
                  <span>38%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[38%] rounded-full bg-primary" />
                </div>
              </div>
              <Link
                to="/learn/$slug"
                params={{ slug: featured.slug }}
                className="mt-5 h-10 w-full grid place-items-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
              >
                Continue course
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Paths */}
      <section id="paths" className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
          <div className="mono-label mb-3">Learning paths</div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">Pick the role you're growing into.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PATHS.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary transition">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-accent-foreground">{p.courses.length} courses</span>
                  <span className="text-xs text-muted-foreground">≈ {p.weeks} weeks</span>
                </div>
                <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.courses.map((slug) => {
                    const c = COURSES.find((x) => x.slug === slug);
                    if (!c) return null;
                    return (
                      <li key={slug}>
                        <Link to="/learn/$slug" params={{ slug }} className="flex items-center gap-2 hover:text-primary">
                          <PlayCircle className="h-4 w-4 text-primary shrink-0" /> {c.title}
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
      <section id="catalogue" className="mx-auto w-full max-w-[1280px] px-5 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mono-label mb-2">Course catalogue</div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">All courses</h2>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {ACADEMY_TRACKS.map((t) => (
              <button
                key={t}
                onClick={() => setTrack(t)}
                className={`h-8 px-3 rounded-full text-xs border transition ${track === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="h-8 rounded-full border border-border bg-card px-3 text-xs text-muted-foreground"
            >
              <option>All levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              to="/learn/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-[var(--shadow-pop)] transition"
            >
              <div className="relative">
                <img src={c.cover} alt={c.title} className="aspect-[16/9] w-full object-cover" />
                <span className="absolute left-3 top-3 h-6 px-2 grid place-items-center rounded-full bg-card/95 text-[11px]">{c.level}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mono-label text-accent-foreground">{c.track}</div>
                <h3 className="mt-1.5 font-display text-lg leading-snug group-hover:text-primary">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.hours}h</span>
                  <span>{c.lessons} lessons</span>
                  <span className="ml-auto">{c.instructor.initials}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">No courses match these filters yet.</p>
        )}
      </section>

      {/* Certification */}
      <section id="certification" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="mono-label mb-3">Certification</div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">A credential your crews can actually use.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
              Every path ends with a practical assessment reviewed by faculty. Pass it and you get a verifiable
              HYDROSEED Academy certificate — plus a report you can bring to your team.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Practical, operation-based assessment", "Reviewed by working operators", "Shareable, verifiable certificate", "Team dashboards for crew leads"].map((o) => (
                <li key={o} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" />{o}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MiniCard icon={<BarChart3 className="h-4 w-4" />} title="91%" body="Completion rate on guided paths" />
            <MiniCard icon={<Users className="h-4 w-4" />} title="120+" body="Contractors training their teams here" />
            <MiniCard icon={<Award className="h-4 w-4" />} title="3" body="Certification tracks available" />
            <MiniCard icon={<Clock className="h-4 w-4" />} title="4-8 wks" body="Typical time to certification" />
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section id="faculty" className="mx-auto w-full max-w-[1280px] px-5 lg:px-8 py-16">
        <div className="mono-label mb-3">Faculty</div>
        <h2 className="font-display text-3xl md:text-4xl tracking-tight">Taught by people who run operations.</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from(new Map(COURSES.map((c) => [c.instructor.name, c.instructor])).values()).map((i) => (
            <div key={i.name} className="rounded-xl border border-border bg-card p-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-sm font-medium text-accent-foreground">{i.initials}</span>
              <div className="mt-3 font-medium">{i.name}</div>
              <div className="text-sm text-muted-foreground">{i.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="enrol" className="border-t border-border bg-primary-soft">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">Start learning this week.</h2>
          <p className="mt-3 text-muted-foreground">Free to enrol. No credit card. Certificates when you're ready.</p>
          <form className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="you@crew.com" className="h-11 flex-1 rounded-md border border-border bg-card px-4 text-sm" />
            <button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Create account</button>
          </form>
        </div>
      </section>

      <AcademyFooter />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl">{value}</div>
      <div className="mono-label mt-1 inline-flex items-center gap-1.5">{icon} {label}</div>
    </div>
  );
}

function MiniCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-accent-foreground">{icon}</span>
      <div className="mt-3 font-display text-2xl">{title}</div>
      <div className="text-sm text-muted-foreground">{body}</div>
    </div>
  );
}
