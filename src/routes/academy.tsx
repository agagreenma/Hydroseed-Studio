import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { GraduationCap, Play, Plus, Clock } from "lucide-react";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Academy · HYDROSEED Studio" },
      { name: "description", content: "Courses and training on hydroseed.app/academy." },
    ],
  }),
  component: AcademyPage,
});

const cover = (s: string) => `https://images.unsplash.com/photo-${s}?auto=format&fit=crop&w=800&q=60`;

const COURSES = [
  { title: "Hydroseeding for contractors", modules: 8, hours: "2h 40m", students: 342, status: "published" as const, cover: cover("1585320806297-9794b3e4eeae") },
  { title: "Slope stabilization operations", modules: 12, hours: "4h 10m", students: 218, status: "published" as const, cover: cover("1560493676-04071c5f467b") },
  { title: "Seed & mulch mix control", modules: 6, hours: "1h 55m", students: 156, status: "in_review" as const, cover: cover("1416879595882-3373a0480b5b") },
  { title: "Bidding to general contractors", modules: 5, hours: "1h 20m", students: 0, status: "draft" as const, cover: cover("1502741338009-cac2772e18bc") },
];

function AcademyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Academy"
        title="HYDROSEED Academy"
        description="Multi-module courses for contractors and site operators."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> New course
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Courses" value="12" />
          <StatCard label="Modules" value="87" />
          <StatCard label="Enrolments (30d)" value="+412" />
          <StatCard label="Completion rate" value="61%" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <div key={c.title} className="surface-card overflow-hidden">
              <div className="relative">
                <img src={c.cover} alt="" className="h-40 w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-card/90 shadow-sm">
                    <Play className="h-5 w-5 text-primary translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute right-3 top-3"><StatusBadge status={c.status} /></div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mono-label">
                  <GraduationCap className="h-3.5 w-3.5" /> Course
                </div>
                <h3 className="mt-1 text-sm font-medium">{c.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{c.modules} modules</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.hours}</span>
                  <span>·</span>
                  <span>{c.students} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <div className="mono-label">{label}</div>
      <div className="mt-1.5 h-display text-2xl">{value}</div>
    </div>
  );
}
