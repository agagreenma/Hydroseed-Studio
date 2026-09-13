/**
 * Phase 2 — shared content editor form.
 *
 * Used by /content/new (create) and /content/$id (edit). Save writes a draft
 * through the shared data layer, so audit rows and version bumps are handled by
 * the database. Permission-disabled, validation, save-conflict and success
 * states follow the Phase 2 patterns.
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { ErrorState, LoadingState, RoleNote, SuccessNote } from "./States";
import { useStudioRole } from "@/hooks/useStudioRole";
import {
  CONTENT_TYPES,
  createContentItem,
  fetchAuthors,
  fetchCategories,
  fetchClusters,
  fetchContentTagIds,
  fetchLocales,
  fetchMedia,
  uploadMediaFile,
  fetchTags,
  slugify,
  updateContentItem,
  type ContentDraftInput,
  type ContentItem,
  type ContentType,
} from "@/lib/studio-api";

const fieldCls =
  "h-9 w-full rounded-md border border-border bg-card px-3 text-sm disabled:opacity-60";
const areaCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm disabled:opacity-60";
const labelCls = "mono-label mb-1.5 block";

type Props = { item?: ContentItem; defaultType?: ContentType };

export function ContentEditorForm({ item, defaultType = "article" }: Props) {
  const isEdit = !!item;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canEditItem, primaryRole, loading: roleLoading } = useStudioRole();

  const authors = useQuery({ queryKey: ["authors"], queryFn: fetchAuthors });
  const categories = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const clusters = useQuery({ queryKey: ["clusters"], queryFn: fetchClusters });
  const tags = useQuery({ queryKey: ["tags"], queryFn: fetchTags });
  const locales = useQuery({ queryKey: ["locales"], queryFn: fetchLocales });
  const media = useQuery({ queryKey: ["media"], queryFn: fetchMedia });
  const itemTags = useQuery({
    queryKey: ["content-item-tags", item?.id],
    queryFn: () => fetchContentTagIds(item!.id),
    enabled: isEdit,
  });

  const seo = (item?.seo ?? {}) as {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
  };

  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [type, setType] = useState<ContentType>(item?.type ?? defaultType);
  const [locale, setLocale] = useState(item?.locale ?? "en");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [body, setBody] = useState(item?.body ?? "");
  const [authorId, setAuthorId] = useState(item?.author_id ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? "");
  const [clusterId, setClusterId] = useState(item?.cluster_id ?? "");
  const [coverMediaId, setCoverMediaId] = useState(item?.cover_media_id ?? "");
  const [metaTitle, setMetaTitle] = useState(seo.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(seo.meta_description ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(seo.canonical_url ?? "");
  const [selectedTags, setSelectedTags] = useState<string[] | null>(null);
  const [validation, setValidation] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const tagIds = selectedTags ?? itemTags.data ?? [];
  const coverMedia = media.data?.find((asset) => asset.id === coverMediaId);
  const canEdit = isEdit
    ? canEditItem(item!.created_by) && (item!.status === "draft" || item!.status === "updated")
    : true;

  const referenceLoading =
    authors.isLoading || locales.isLoading || (isEdit && itemTags.isLoading) || roleLoading;
  const referenceError =
    (authors.error as Error | null) ??
    (locales.error as Error | null) ??
    (itemTags.error as Error | null);

  const draft: ContentDraftInput = useMemo(
    () => ({
      title: title.trim(),
      slug: (slugTouched ? slug : slugify(title)).trim(),
      type,
      locale,
      excerpt: excerpt.trim() ? excerpt.trim() : null,
      body: body.trim() ? body.trim() : null,
      author_id: authorId || null,
      category_id: categoryId || null,
      cluster_id: clusterId || null,
      cover_media_id: coverMediaId || null,
      seo: {
        ...(metaTitle.trim() ? { meta_title: metaTitle.trim() } : {}),
        ...(metaDescription.trim() ? { meta_description: metaDescription.trim() } : {}),
        ...(canonicalUrl.trim() ? { canonical_url: canonicalUrl.trim() } : {}),
      },
    }),
    [
      title, slug, slugTouched, type, locale, excerpt, body,
      authorId, categoryId, clusterId, coverMediaId, metaTitle, metaDescription, canonicalUrl,
    ],
  );

  const save = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        return updateContentItem(item!.id, item!.version, draft, tagIds);
      }
      return createContentItem(draft, tagIds);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["content-items"] });
      await queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      if (!isEdit) {
        navigate({ to: "/content/$id", params: { id: result.id } });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["content-item", item!.id] });
      await queryClient.invalidateQueries({ queryKey: ["content-item-tags", item!.id] });
      setSaved(`Draft saved · version ${result.version}`);
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(null);
    if (!draft.title) return setValidation("A title is required before saving.");
    if (!draft.slug) return setValidation("A URL slug is required before saving.");
    setValidation(null);
    save.mutate();
  }

  if (referenceLoading) return <LoadingState label="Loading editor…" />;
  if (referenceError) return <ErrorState message={referenceError.message} />;

  const saveError = save.error as Error | null;
  const conflict = saveError?.message.startsWith("SAVE_CONFLICT");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {!canEdit && (
        <RoleNote>
          {isEdit && item && item.status !== "draft" && item.status !== "updated" ? (
            <>Content fields are editable in Draft or Updated status. Change the status to Draft to edit this item.</>
          ) : (
            <>You are signed in as <strong className="text-foreground">{primaryRole}</strong>. Writers may only edit content they created, so this item is read-only for you.</>
          )}
        </RoleNote>
      )}
      {validation && <ErrorState message={validation} />}
      {saveError && (
        <ErrorState
          message={
            conflict
              ? "This item changed since you opened it. Reload the page to pick up the latest version, then save again."
              : saveError.message
          }
        />
      )}
      {saved && <SuccessNote>{saved}</SuccessNote>}
      {uploadError && <ErrorState message={uploadError} />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="surface-card space-y-4 p-4">
            <div>
              <label className={labelCls} htmlFor="title">Title</label>
              <input
                id="title"
                className={fieldCls}
                value={title}
                disabled={!canEdit}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                placeholder="How hydroseeding beats hand seeding on slopes"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="slug">URL slug</label>
              <input
                id="slug"
                className={`${fieldCls} font-mono`}
                value={slugTouched ? slug : slugify(title)}
                disabled={!canEdit}
                onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                rows={2}
                className={areaCls}
                value={excerpt}
                disabled={!canEdit}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="body">Body</label>
              <textarea
                id="body"
                rows={14}
                className={`${areaCls} font-mono text-[13px]`}
                value={body}
                disabled={!canEdit}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write the content body in Markdown."
              />
            </div>
          </div>

          <div className="surface-card space-y-4 p-4">
            <div className="mono-label">SEO placeholder</div>
            <div>
              <label className={labelCls} htmlFor="meta-title">Meta title</label>
              <input
                id="meta-title"
                className={fieldCls}
                value={metaTitle}
                disabled={!canEdit}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="meta-description">Meta description</label>
              <textarea
                id="meta-description"
                rows={3}
                className={areaCls}
                value={metaDescription}
                disabled={!canEdit}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="canonical-url">Canonical URL</label>
              <input
                id="canonical-url"
                className={fieldCls}
                value={canonicalUrl}
                disabled={!canEdit}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://studio.hydroseed.app/journal/articles/example"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="surface-card space-y-4 p-4">
            <div>
              <label className={labelCls} htmlFor="type">Type</label>
              <select
                id="type"
                className={fieldCls}
                value={type}
                disabled={!canEdit}
                onChange={(e) => setType(e.target.value as ContentType)}
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="locale">Locale</label>
              <select
                id="locale"
                className={fieldCls}
                value={locale}
                disabled={!canEdit}
                onChange={(e) => setLocale(e.target.value)}
              >
                {locales.data?.filter((l) => l.enabled).map((l) => (
                  <option key={l.code} value={l.code}>{l.name} · {l.native_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="author">Author</label>
              <select
                id="author"
                className={fieldCls}
                value={authorId}
                disabled={!canEdit}
                onChange={(e) => setAuthorId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {authors.data?.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="category">Category</label>
              <select
                id="category"
                className={fieldCls}
                value={categoryId}
                disabled={!canEdit}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">No category</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="cluster">Content cluster</label>
              <select
                id="cluster"
                className={fieldCls}
                value={clusterId}
                disabled={!canEdit}
                onChange={(e) => setClusterId(e.target.value)}
              >
                <option value="">No cluster</option>
                {clusters.data?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="cover">Cover image</label>
              {coverMedia && (
                <img
                  src={coverMedia.url}
                  alt={coverMedia.alt_text ?? coverMedia.filename}
                  className="mb-2 aspect-video w-full rounded-md border border-border object-cover"
                />
              )}
              <select
                id="cover"
                className={fieldCls}
                value={coverMediaId}
                disabled={!canEdit}
                onChange={(e) => setCoverMediaId(e.target.value)}
              >
                <option value="">No cover</option>
                {media.data?.map((m) => (
                  <option key={m.id} value={m.id}>{m.filename}</option>
                ))}
              </select>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={!canEdit || uploading}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setUploadError(null);
                  setUploading(true);
                  try {
                    const asset = await uploadMediaFile(file);
                    setCoverMediaId(asset.id);
                    await queryClient.invalidateQueries({ queryKey: ["media"] });
                  } catch (error) {
                    setUploadError((error as Error).message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              <label
                htmlFor="cover-upload"
                className="mt-2 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-60"
              >
                <ImagePlus className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload Image"}
              </label>
            </div>
          </div>

          <div className="surface-card p-4">
            <div className="mono-label mb-2">Tags</div>
            {tags.isLoading && <div className="text-xs text-muted-foreground">Loading tags…</div>}
            {!tags.isLoading && !tags.data?.length && (
              <p className="text-xs text-muted-foreground">
                No tags exist yet. Administrators create them in Taxonomy.
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {tags.data?.map((t) => {
                const active = tagIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() =>
                      setSelectedTags(
                        active ? tagIds.filter((x) => x !== t.id) : [...tagIds, t.id],
                      )
                    }
                    className={`chip ${active ? "!border-primary/30 !bg-primary-soft !text-primary" : ""} disabled:opacity-60`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {isEdit && (
            <div className="surface-card p-4 text-xs text-muted-foreground">
              <div className="mono-label mb-2">Record</div>
              <div>Version {item!.version}</div>
              <div>Status {item!.status}</div>
              <div>Updated {new Date(item!.updated_at).toLocaleString()}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canEdit || save.isPending}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Save draft" : "Create draft"}
          </button>
        </aside>
      </div>
    </form>
  );
}
