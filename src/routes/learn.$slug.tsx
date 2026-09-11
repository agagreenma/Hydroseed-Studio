import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Award, CheckCircle2, Clock, PlayCircle, Users } from "lucide-react";
import { AcademyHeader, AcademyFooter } from "@/components/academy/AcademyChrome";
import { COURSES, getCourse, type Course } from "@/lib/public-content";

export const Route = createFileRoute("/learn/$slug")({
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
        { property: "og:title", content: `${c.title} — HYDROSEED Academy` },
        { property: "og:description", content: c.tagline },
        { property: "og:type", content: "article" },
        { property: "og:image", content: c.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: c.cover },
      ],
    };
  },
  component: CoursePage,
});

function CoursePage() {
  const { course: c } = Route.useLoaderData() as { course: Course };
  const others = COURSES.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AcademyHeader />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to catalogue
            </Link>
            <div className="mono-label mt-6 text-accent-foreground">{c.track} · {c.level}</div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">{c.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{c.tagline}</p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {c.hours} hours</span>
              <span>{c.lessons} lessons</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> 1,240 enrolled</span>
              <span className="inline-flex items-center gap-1.5"><Award className="h-4 w-4" /> Certificate</span>
            </div>
          </div>

          <aside className="rounded-xl border border-border bg-card overflow-hidden self-start">
            <div className="relative aspect-video">
              <img src={c.cover} alt={c.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 grid place-items-center bg-foreground/25">
                <PlayCircle className="h-14 w-14 text-background" />
              </div>
            </div>
            <div className="p-5">
              <button className="h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground">Enrol for free</button>
              <button className="mt-2 h-11 w-full rounded-md border border-border text-sm hover:bg-muted">Preview first lesson</button>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-sm font-medium text-accent-foreground">{c.instructor.initials}</span>
                <div>
                  <div className="font-medium text-sm">{c.instructor.name}</div>
                  <div className="text-xs text-muted-foreground">{c.instructor.role}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto w-full max-w-[1280px] px-5 lg:px-8 py-14">
        <div className="mono-label mb-3">Curriculum</div>
        <h2 className="font-display text-3xl tracking-tight">What you'll cover</h2>
        <div className="mt-8 space-y-4 max-w-3xl">
          {c.outline.map((m, i) => (
            <div key={i} className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between gap-4 p-5 border-b border-border">
                <div>
                  <div className="mono-label text-muted-foreground">Module {i + 1}</div>
                  <h3 className="mt-1 font-display text-xl">{m.module.replace(/^Module \d+ — /, "")}</h3>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{m.lessons.length} lessons</span>
              </div>
              <ul className="divide-y divide-border">
                {m.lessons.map((l, j) => (
                  <li key={j} className="flex items-center gap-3 px-5 py-3 text-sm">
                    <PlayCircle className="h-4 w-4 text-primary shrink-0" />
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
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-14 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mono-label mb-3">Learning outcomes</div>
            <h2 className="font-display text-3xl tracking-tight">By the end of this course</h2>
          </div>
          <ul className="space-y-4">
            {["Run a defensible weekly production plan", "Diagnose variance without blaming the floor", "Speak the language of margin, not just yield", "Ship a change without breaking the operation"].map((o) => (
              <li key={o} className="flex gap-3 text-sm"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" />{o}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto w-full max-w-[1280px] px-5 lg:px-8 py-14">
        <div className="mono-label mb-6">Continue learning</div>
        <div className="grid gap-6 md:grid-cols-3">
          {others.map((x) => (
            <Link key={x.slug} to="/learn/$slug" params={{ slug: x.slug }} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary transition">
              <img src={x.cover} alt={x.title} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <div className="mono-label text-accent-foreground">{x.level}</div>
                <div className="font-display text-lg leading-snug group-hover:text-primary">{x.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AcademyFooter />
    </div>
  );
}
