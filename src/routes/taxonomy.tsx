/**
 * Phase 2 — taxonomy management.
 *
 * Categories, tags, topics and content clusters. Reading is open to signed-in
 * members; creating, editing and deleting requires the administrator role.
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RoleNote,
  SuccessNote,
} from "@/components/studio/States";
import { useStudioRole } from "@/hooks/useStudioRole";
import {
  createTaxonomy,
  deleteTaxonomy,
  fetchCategories,
  fetchClusters,
  fetchTags,
  fetchTopics,
  slugify,
  updateTaxonomy,
} from "@/lib/studio-api";

export const Route = createFileRoute("/taxonomy")({
  head: () => ({
    meta: [
      { title: "Taxonomy · HYDROSEED Studio" },
      {
        name: "description",
        content: "Manage categories, tags, topics and content clusters for HYDROSEED Studio.",
      },
      { property: "og:title", content: "Taxonomy · HYDROSEED Studio" },
      {
        property: "og:description",
        content: "Categories, tags, topics and content clusters in the content foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaxonomyPage,
});

type TabKey = "categories" | "tags" | "topics" | "content_clusters";

const TABS: { key: TabKey; label: string; hasDescription: boolean; hasPillar: boolean }[] = [
  { key: "categories", label: "Categories", hasDescription: true, hasPillar: false },
  { key: "tags", label: "Tags", hasDescription: false, hasPillar: false },
  { key: "topics", label: "Topics", hasDescription: true, hasPillar: false },
  { key: "content_clusters", label: "Content clusters", hasDescription: true, hasPillar: true },
];

type Row = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  pillar_path?: string | null;
};

const fieldCls = "h-9 w-full rounded-md border border-border bg-card px-3 text-sm";

function TaxonomyPage() {
  const [tab, setTab] = useState<TabKey>("categories");
  const meta = TABS.find((t) => t.key === tab)!;
  const { isAdmin, primaryRole, loading: roleLoading } = useStudioRole();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<Row | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [pillarPath, setPillarPath] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const list = useQuery({
    queryKey: [tab],
    queryFn: () =>
      tab === "categories"
        ? fetchCategories()
        : tab === "tags"
          ? fetchTags()
          : tab === "topics"
            ? fetchTopics()
            : fetchClusters(),
  });

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setPillarPath("");
    setValidation(null);
  }

  function openCreate() {
    closeForm();
    setSuccess(null);
    setFormOpen(true);
  }

  function openEdit(row: Row) {
    setSuccess(null);
    setEditing(row);
    setName(row.name);
    setSlug(row.slug);
    setDescription(row.description ?? "");
    setPillarPath(row.pillar_path ?? "");
    setValidation(null);
    setFormOpen(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const values = {
        name: name.trim(),
        slug: (slug.trim() || slugify(name)).trim(),
        description: meta.hasDescription ? description.trim() || null : null,
        pillar_path: meta.hasPillar ? pillarPath.trim() || null : null,
      };
      if (editing) return updateTaxonomy(tab, editing.id, values);
      return createTaxonomy(tab, values);
    },
    onSuccess: async () => {
      setSuccess(editing ? "Entry updated." : "Entry created.");
      closeForm();
      await queryClient.invalidateQueries({ queryKey: [tab] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTaxonomy(tab, id),
    onSuccess: async () => {
      setSuccess("Entry deleted.");
      await queryClient.invalidateQueries({ queryKey: [tab] });
    },
  });

  const rows = (list.data ?? []) as Row[];

  return (
    <>
      <PageHeader
        eyebrow="Growth · Taxonomy"
        title="Taxonomy"
        description="Categories, tags, topics and content clusters used across content items."
        actions={
          <button
            type="button"
            onClick={openCreate}
            disabled={!isAdmin}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New entry
          </button>
        }
      />
      <PageBody>
        {!roleLoading && !isAdmin && (
          <RoleNote>
            You are signed in as <strong className="text-foreground">{primaryRole}</strong>. Only
            administrators can create, edit or delete taxonomy entries.
          </RoleNote>
        )}
        {success && <SuccessNote>{success}</SuccessNote>}
        {validation && <ErrorState message={validation} />}
        {save.error && <ErrorState message={(save.error as Error).message} />}
        {remove.error && <ErrorState message={(remove.error as Error).message} />}

        <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                closeForm();
                setSuccess(null);
              }}
              className={`h-8 rounded px-3 text-sm ${
                tab === t.key ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {formOpen && (
          <form
            className="surface-card space-y-3 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return setValidation("A name is required.");
              setValidation(null);
              save.mutate();
            }}
          >
            <div className="flex items-center justify-between">
              <div className="mono-label">{editing ? "Edit entry" : "New entry"}</div>
              <button type="button" onClick={closeForm} className="p-1 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="tax-name">Name</label>
                <input
                  id="tax-name"
                  className={fieldCls}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editing) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="tax-slug">Slug</label>
                <input
                  id="tax-slug"
                  className={`${fieldCls} font-mono`}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              {meta.hasDescription && (
                <div className="sm:col-span-2">
                  <label className="mono-label mb-1.5 block" htmlFor="tax-desc">Description</label>
                  <textarea
                    id="tax-desc"
                    rows={2}
                    className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              )}
              {meta.hasPillar && (
                <div className="sm:col-span-2">
                  <label className="mono-label mb-1.5 block" htmlFor="tax-pillar">Pillar path</label>
                  <input
                    id="tax-pillar"
                    className={`${fieldCls} font-mono`}
                    value={pillarPath}
                    onChange={(e) => setPillarPath(e.target.value)}
                    placeholder="/hydroseeding"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!isAdmin || save.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : editing ? "Save changes" : "Create entry"}
            </button>
          </form>
        )}

        {list.isLoading && <LoadingState label={`Loading ${meta.label.toLowerCase()}…`} />}
        {list.error && <ErrorState message={(list.error as Error).message} />}
        {!list.isLoading && !list.error && rows.length === 0 && (
          <EmptyState
            title={`No ${meta.label.toLowerCase()} yet`}
            description={
              isAdmin
                ? "Create the first entry to start organising content."
                : "An administrator needs to create the first entry."
            }
          />
        )}
        {rows.length > 0 && (
          <div className="surface-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Slug</th>
                  {meta.hasDescription && (
                    <th className="hidden md:table-cell px-3 py-2.5 font-medium">Description</th>
                  )}
                  {meta.hasPillar && (
                    <th className="hidden md:table-cell px-3 py-2.5 font-medium">Pillar</th>
                  )}
                  <th className="px-3 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="hidden sm:table-cell px-3 py-3 font-mono text-xs text-muted-foreground">
                      {row.slug}
                    </td>
                    {meta.hasDescription && (
                      <td className="hidden md:table-cell px-3 py-3 text-xs text-muted-foreground">
                        {row.description ?? "—"}
                      </td>
                    )}
                    {meta.hasPillar && (
                      <td className="hidden md:table-cell px-3 py-3 font-mono text-xs text-muted-foreground">
                        {row.pillar_path ?? "—"}
                      </td>
                    )}
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          disabled={!isAdmin}
                          className="grid h-8 w-8 place-items-center rounded-md border border-border disabled:opacity-50"
                          aria-label={`Edit ${row.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete “${row.name}”?`)) remove.mutate(row.id);
                          }}
                          disabled={!isAdmin || remove.isPending}
                          className="grid h-8 w-8 place-items-center rounded-md border border-destructive/30 text-destructive disabled:opacity-50"
                          aria-label={`Delete ${row.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
