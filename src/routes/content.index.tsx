import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge, LangChip } from "@/components/studio/StatusBadge";
import { EmptyState, ErrorState, LoadingState, RoleNote } from "@/components/studio/States";
import { useStudioRole } from "@/hooks/useStudioRole";
import {
  CONTENT_STATUSES,
  CONTENT_TYPES,
  fetchAuthors,
  fetchContentItems,
  fetchLocales,
  typeLabel,
  type ContentFilters,
} from "@/lib/studio-api";
import { statusLabel } from "@/lib/mock";

export const Route = createFileRoute("/content/")({
  head: () => ({
    meta: [
      { title: "Content · HYDROSEED Studio" },
      { name: "description", content: "Every HYDROSEED content item across types, statuses, locales and authors." },
      { property: "og:title", content: "Content · HYDROSEED Studio" },
      { property: "og:description", content: "The canonical content list for the HYDROSEED Studio workspace." },
    ],
  }),
  component: ContentListPage,
});

const selectCls = "h-9 rounded-md border border-border bg-card px-2.5 text-sm";

function ContentListPage() {
  const { primaryRole } = useStudioRole();
  const [filters, setFilters] = useState<ContentFilters>({
    type: "all",
    status: "all",
    locale: "all",
    authorId: "all",
    search: "",
  });

  const authors = useQuery({ queryKey: ["authors"], queryFn: fetchAuthors });
  const locales = useQuery({ queryKey: ["locales"], queryFn: fetchLocales });
  const items = useQuery({
    queryKey: ["content-items", filters],
    queryFn: () => fetchContentItems(filters),
  });

  const authorName = (id: string | null) =>
    authors.data?.find((a) => a.id === id)?.name ?? "Unassigned";

  return (
    <>
      <PageHeader
        eyebrow="Content · Library"
        title="Content items"
        description="The canonical record for every piece of HYDROSEED content."
        actions={
          <Link
            to="/content/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New content
          </Link>
        }
      />
      <PageBody>
        <RoleNote>
          You are signed in as <strong className="text-foreground">{primaryRole}</strong>. Writers
          may edit their own drafts, editors may edit any item, administrators manage taxonomy and
          locales.
        </RoleNote>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.search ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search titles"
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm"
            />
          </div>
          <select
            aria-label="Filter by type"
            className={selectCls}
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as ContentFilters["type"] }))}
          >
            <option value="all">All types</option>
            {CONTENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            className={selectCls}
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as ContentFilters["status"] }))}
          >
            <option value="all">All statuses</option>
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
          <select
            aria-label="Filter by locale"
            className={selectCls}
            value={filters.locale}
            onChange={(e) => setFilters((f) => ({ ...f, locale: e.target.value }))}
          >
            <option value="all">All locales</option>
            {locales.data?.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <select
            aria-label="Filter by author"
            className={selectCls}
            value={filters.authorId}
            onChange={(e) => setFilters((f) => ({ ...f, authorId: e.target.value }))}
          >
            <option value="all">All authors</option>
            {authors.data?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {items.isLoading && <LoadingState label="Loading content…" />}
        {items.error && <ErrorState message={(items.error as Error).message} />}
        {items.data?.length === 0 && (
          <EmptyState
            title="No content items yet"
            description="Create your first content item to start the HYDROSEED content library."
            action={
              <Link to="/content/new" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <Plus className="h-4 w-4" /> New content
              </Link>
            }
          />
        )}

        {!!items.data?.length && (
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Title</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Type</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="hidden px-3 py-2.5 font-medium md:table-cell">Locale</th>
                  <th className="hidden px-3 py-2.5 font-medium md:table-cell">Author</th>
                  <th className="hidden px-3 py-2.5 font-medium lg:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.data.map((it) => (
                  <tr key={it.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        to="/content/$id"
                        params={{ id: it.id }}
                        className="font-medium hover:text-primary"
                      >
                        {it.title}
                      </Link>
                      <div className="font-mono text-[11px] text-muted-foreground">/{it.slug}</div>
                    </td>
                    <td className="hidden px-3 py-3 sm:table-cell">
                      <span className="chip">{typeLabel(it.type)}</span>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={it.status} /></td>
                    <td className="hidden px-3 py-3 md:table-cell"><LangChip code={it.locale} /></td>
                    <td className="hidden px-3 py-3 text-xs md:table-cell">{authorName(it.author_id)}</td>
                    <td className="hidden px-3 py-3 text-xs text-muted-foreground lg:table-cell">
                      {new Date(it.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageBody>
    </>
  );
}
