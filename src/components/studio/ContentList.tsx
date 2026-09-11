import { PageBody, PageHeader } from "./PageHeader";
import { StatusBadge, LangChip } from "./StatusBadge";
import { SampleDataNote } from "./SampleDataNote";
import { Plus, Search } from "lucide-react";
import type { Status, Language } from "@/lib/mock";

export type ContentItem = {
  id: string;
  title: string;
  meta: string; // secondary line (author · date etc.)
  chips?: string[];
  status: Status;
  language?: Language;
  cover?: string;
  updated: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  items: ContentItem[];
  emptyLabel?: string;
};

export function ContentList({ eyebrow, title, description, ctaLabel = "New", items }: Props) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> {ctaLabel}
          </button>
        }
      />
      <PageBody>
        <SampleDataNote />
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder={`Search ${title.toLowerCase()}`} className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm" />
          </div>
          <select className="h-9 rounded-md border border-border bg-card px-2.5 text-sm">
            <option>All statuses</option><option>Draft</option><option>Published</option>
          </select>
          <select className="h-9 rounded-md border border-border bg-card px-2.5 text-sm">
            <option>All languages</option><option>English</option><option>Français</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.id} className="surface-card overflow-hidden">
              {it.cover && <img src={it.cover} alt="" className="h-32 w-full object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium leading-snug line-clamp-2">{it.title}</h3>
                  {it.language && <LangChip code={it.language} />}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{it.meta}</div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={it.status} />
                  {it.chips?.map((c) => <span key={c} className="chip">{c}</span>)}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground">Updated {it.updated}</div>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
