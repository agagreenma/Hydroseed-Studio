import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Award, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, HydroseedCTA } from "@/components/public/NewsletterCTA";
import { COURSES, getCourse } from "@/lib/public-content";

export const Route = createFileRoute("/journal/academy/$slug")({
  loader: ({ params }) => {
    const course = getCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Course not found — HYDROSEED Academy" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.course;
    return {
      meta: [
        { title: `${c.title} — HYDROSEED Academy` },
        { name: "description", content: c.tagline },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.tagline },
        { property: "og:type", content: "article" },
        { property: "og:image", content: c.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: c.cover },
      ],
    };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { course: c } = Route.useLoaderData() as { course: import("@/lib/public-content").Course };
  const others = COURSES.filter(x => x.slug !== c.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Link to="/journal/academy" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> All courses
            </Link>
            <div className="mono-label mt-6 text-accent-foreground">{c.track} · {c.level}</div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">{c.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{c.tagline}</p>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {c.hours} hours</span>
              <span>{c.lessons} lessons</span>
              <span className="inline-flex items-center gap-1.5"><Award className="h-4 w-4" /> Certificate</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Enrol for free</button>
              <button className="h-11 rounded-md border border-border px-5 text-sm hover:bg-muted">Preview lesson</button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="relative aspect-video">
              <img src={c.cover} alt={c.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 grid place-items-center bg-foreground/30">
                <PlayCircle className="h-14 w-14 text-background" />
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-medium text-accent-foreground">{c.instructor.initials}</span>
                <div>
                  <div className="font-medium">{c.instructor.name}</div>
                  <div className="text-xs text-muted-foreground">{c.instructor.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
        <div className="mono-label mb-3">Curriculum</div>
        <h2 className="font-display text-3xl tracking-tight">What you'll cover</h2>
        <div className="mt-8 space-y-4 max-w-3xl">
          {c.outline.map((m, i) => (
            <div key={i} className="rounded-lg border border-border bg-card">
              <div className="p-5 border-b border-border">
                <div className="mono-label text-muted-foreground">Module {i + 1}</div>
                <h3 className="mt-1 font-display text-xl">{m.module.replace(/^Module \d+ — /, "")}</h3>
              </div>
              <ul className="divide-y divide-border">
                {m.lessons.map((l, j) => (
                  <li key={j} className="flex items-center gap-3 px-5 py-3 text-sm">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>{l}</span>
                    <span className="ml-auto text-xs text-muted-foreground">6 min</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mono-label mb-3">Learning outcomes</div>
            <h2 className="font-display text-3xl tracking-tight">By the end of this course</h2>
          </div>
          <ul className="space-y-4">
            {["Run a defensible weekly production plan", "Diagnose variance without blaming the floor", "Speak the language of margin, not just yield", "Ship a change without breaking the operation"].map(o => (
              <li key={o} className="flex gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
          <div className="mono-label mb-6">Continue learning</div>
          <div className="grid gap-6 md:grid-cols-3">
            {others.map(x => (
              <Link key={x.slug} to="/journal/academy/$slug" params={{ slug: x.slug }} className="group rounded-lg border border-border bg-card overflow-hidden">
                <img src={x.cover} alt={x.title} className="aspect-video w-full object-cover" />
                <div className="p-4">
                  <div className="mono-label">{x.level}</div>
                  <div className="font-display text-lg leading-snug group-hover:text-primary">{x.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
      <HydroseedCTA />
      <PublicFooter />
    </div>
  );
}
