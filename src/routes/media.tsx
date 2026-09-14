/**
 * Phase 2 — Media Library over the real media_assets records.
 * Scope is intentionally limited to create / read / delete.
 */
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Grid3x3, List, Plus, Save, Trash2, X } from "lucide-react";
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
  createMedia,
  deleteMedia,
  fetchMedia,
  updateMediaAltText,
  type MediaAsset,
} from "@/lib/studio-api";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media library · HYDROSEED Studio" },
      {
        name: "description",
        content: "Register, review and remove media records used by HYDROSEED Studio content.",
      },
      { property: "og:title", content: "Media library · HYDROSEED Studio" },
      {
        property: "og:description",
        content: "Media records for the HYDROSEED Studio content foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MediaPage,
});

const fieldCls = "h-9 w-full rounded-md border border-border bg-card px-3 text-sm";

function MediaPage() {
  const { isEditor, primaryRole, loading: roleLoading, userId } = useStudioRole();
  const queryClient = useQueryClient();
  const media = useQuery({ queryKey: ["media"], queryFn: fetchMedia });

  const [view, setView] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [altTextDraft, setAltTextDraft] = useState("");

  const rows = (media.data ?? []) as MediaAsset[];
  const selected = rows.find((m) => m.id === selectedId) ?? rows[0] ?? null;

  useEffect(() => {
    setAltTextDraft(selected?.alt_text ?? "");
  }, [selected?.id, selected?.alt_text]);

  function closeForm() {
    setFormOpen(false);
    setFilename("");
    setUrl("");
    setAltText("");
    setMimeType("");
    setWidth("");
    setHeight("");
    setValidation(null);
  }

  const save = useMutation({
    mutationFn: () =>
      createMedia({
        filename: filename.trim(),
        url: url.trim(),
        alt_text: altText.trim() || null,
        mime_type: mimeType.trim() || null,
        width: width.trim() ? Number(width) : null,
        height: height.trim() ? Number(height) : null,
        size_bytes: null,
      }),
    onSuccess: async () => {
      setSuccess("Media record created.");
      closeForm();
      await queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: async (_d, id) => {
      setSuccess("Media record deleted.");
      if (selectedId === id) setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const updateAltText = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error("Select a media asset before saving alt text.");
      return updateMediaAltText(selected.id, altTextDraft);
    },
    onSuccess: async () => {
      setSuccess("Alt text updated.");
      await queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  function canDelete(asset: MediaAsset) {
    return isEditor || (!!userId && asset.created_by === userId);
  }

  function canEdit(asset: MediaAsset) {
    return canDelete(asset);
  }

  return (
    <>
      <PageHeader
        eyebrow="Growth · Media Library"
        title="Media library"
        description="Media records referenced by content items. Create, review and delete only."
        actions={
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              closeForm();
              setFormOpen(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New media record
          </button>
        }
      />
      <PageBody>
        {!roleLoading && !isEditor && (
          <RoleNote>
            You are signed in as <strong className="text-foreground">{primaryRole}</strong>. You can
            add media and delete only the records you created.
          </RoleNote>
        )}
        {success && <SuccessNote>{success}</SuccessNote>}
        {validation && <ErrorState message={validation} />}
        {save.error && <ErrorState message={(save.error as Error).message} />}
        {remove.error && <ErrorState message={(remove.error as Error).message} />}
        {updateAltText.error && <ErrorState message={(updateAltText.error as Error).message} />}

        {formOpen && (
          <form
            className="surface-card space-y-3 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!filename.trim()) return setValidation("A filename is required.");
              if (!url.trim()) return setValidation("A media URL is required.");
              setValidation(null);
              save.mutate();
            }}
          >
            <div className="flex items-center justify-between">
              <div className="mono-label">New media record</div>
              <button type="button" onClick={closeForm} className="p-1 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="m-file">Filename</label>
                <input
                  id="m-file"
                  className={fieldCls}
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="slope-application.jpg"
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="m-url">URL</label>
                <input
                  id="m-url"
                  className={fieldCls}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="m-mime">MIME type</label>
                <input
                  id="m-mime"
                  className={fieldCls}
                  value={mimeType}
                  onChange={(e) => setMimeType(e.target.value)}
                  placeholder="image/jpeg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label mb-1.5 block" htmlFor="m-w">Width</label>
                  <input
                    id="m-w"
                    type="number"
                    className={fieldCls}
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mono-label mb-1.5 block" htmlFor="m-h">Height</label>
                  <input
                    id="m-h"
                    type="number"
                    className={fieldCls}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mono-label mb-1.5 block" htmlFor="m-alt">Alt text</label>
                <textarea
                  id="m-alt"
                  rows={2}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={save.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Create record"}
            </button>
          </form>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{rows.length} records</div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`grid h-7 w-7 place-items-center rounded ${view === "grid" ? "bg-muted" : ""}`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              className={`grid h-7 w-7 place-items-center rounded ${view === "list" ? "bg-muted" : ""}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {media.isLoading && <LoadingState label="Loading media…" />}
        {media.error && <ErrorState message={(media.error as Error).message} />}
        {!media.isLoading && !media.error && rows.length === 0 && (
          <EmptyState
            title="No media records yet"
            description="Create a media record so content items can reference a cover image."
          />
        )}

        {rows.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              {view === "grid" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {rows.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedId(m.id)}
                      className={`surface-card overflow-hidden text-left transition ${
                        selected?.id === m.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={m.url}
                          alt={m.alt_text ?? m.filename}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <div className="truncate text-xs font-medium">{m.filename}</div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {m.width && m.height ? `${m.width}×${m.height}` : m.mime_type ?? "—"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="surface-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">File</th>
                        <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Type</th>
                        <th className="hidden md:table-cell px-3 py-2.5 font-medium">Added</th>
                        <th className="px-3 py-2.5 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((m) => (
                        <tr
                          key={m.id}
                          onClick={() => setSelectedId(m.id)}
                          className={`cursor-pointer hover:bg-muted/30 ${
                            selected?.id === m.id ? "bg-primary-soft/40" : ""
                          }`}
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={m.url}
                                alt=""
                                loading="lazy"
                                className="h-9 w-12 rounded object-cover"
                              />
                              <div>
                                <div className="text-sm font-medium">{m.filename}</div>
                                <div className="text-xs text-muted-foreground">
                                  {m.width && m.height ? `${m.width}×${m.height}` : "—"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-3 py-2.5 text-xs text-muted-foreground">
                            {m.mime_type ?? "—"}
                          </td>
                          <td className="hidden md:table-cell px-3 py-2.5 text-xs text-muted-foreground">
                            {new Date(m.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete “${m.filename}”?`)) remove.mutate(m.id);
                                }}
                                disabled={!canDelete(m) || remove.isPending}
                                aria-label={`Delete ${m.filename}`}
                                className="grid h-8 w-8 place-items-center rounded-md border border-destructive/30 text-destructive disabled:opacity-50"
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
            </div>

            {selected && (
              <aside className="surface-card overflow-hidden">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={selected.url}
                    alt={selected.alt_text ?? selected.filename}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <div className="mono-label">File</div>
                    <div className="truncate text-sm font-medium">{selected.filename}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="mono-label">Type</div>
                      <div>{selected.mime_type ?? "—"}</div>
                    </div>
                    <div>
                      <div className="mono-label">Dimensions</div>
                      <div>
                        {selected.width && selected.height
                          ? `${selected.width}×${selected.height}`
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="mono-label">Added</div>
                      <div>{new Date(selected.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="mono-label">Record</div>
                      <div className="font-mono">{selected.id.slice(0, 8)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mono-label">Alt text</div>
                    <textarea
                      aria-label={`Alt text for ${selected.filename}`}
                      rows={3}
                      value={altTextDraft}
                      onChange={(event) => {
                        setSuccess(null);
                        updateAltText.reset();
                        setAltTextDraft(event.target.value);
                      }}
                      disabled={!canEdit(selected) || updateAltText.isPending}
                      placeholder="Describe this image, or leave blank if decorative."
                      className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => updateAltText.mutate()}
                    disabled={!canEdit(selected) || updateAltText.isPending || altTextDraft === (selected.alt_text ?? "")}
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {updateAltText.isPending ? "Saving…" : "Save alt text"}
                  </button>
                  {updateAltText.isSuccess && <p className="text-xs text-success">Saved to this media record.</p>}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete “${selected.filename}”?`)) remove.mutate(selected.id);
                    }}
                    disabled={!canDelete(selected) || remove.isPending}
                    className="h-9 w-full rounded-md bg-destructive text-sm text-destructive-foreground disabled:opacity-50"
                  >
                    {remove.isPending ? "Deleting…" : "Delete record"}
                  </button>
                </div>
              </aside>
            )}
          </div>
        )}
      </PageBody>
    </>
  );
}
