/**
 * Phase 2 — Content Foundation data access.
 *
 * All reads/writes go through the browser Supabase client so RLS applies as the
 * signed-in Studio member. Audit rows are written by database triggers, so every
 * mutation here is automatically recorded.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type ContentType = Database["public"]["Enums"]["content_type"];
export type ContentStatus = Database["public"]["Enums"]["content_status"];

export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Topic = Database["public"]["Tables"]["topics"]["Row"];
export type Cluster = Database["public"]["Tables"]["content_clusters"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];
export type Locale = Database["public"]["Tables"]["locales"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type ContentVersion = Database["public"]["Tables"]["content_versions"]["Row"];
export type StudioMember = Database["public"]["Tables"]["studio_members"]["Row"];

export const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "article", label: "Article" },
  { value: "blog_post", label: "Blog post" },
  { value: "landing_page", label: "Landing page" },
  { value: "case_study", label: "Case study" },
  { value: "resource", label: "Resource" },
  { value: "documentation", label: "Documentation" },
  { value: "academy_lesson", label: "Academy lesson" },
];

export const CONTENT_STATUSES: ContentStatus[] = [
  "draft",
  "in_review",
  "seo_review",
  "approved",
  "scheduled",
  "published",
  "updated",
  "archived",
];

export const WORKFLOW_TRANSITIONS: Record<ContentStatus, ContentStatus | null> = {
  draft: "in_review",
  in_review: "seo_review",
  seo_review: "approved",
  approved: "scheduled",
  scheduled: "published",
  published: "updated",
  updated: "archived",
  archived: null,
};

export function typeLabel(t: ContentType) {
  return CONTENT_TYPES.find((x) => x.value === t)?.label ?? t;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

/* ---------------- roles ---------------- */

export async function fetchMyRoles(userId: string): Promise<AppRole[]> {
  const rows = unwrap(
    await supabase.from("studio_user_roles").select("role").eq("user_id", userId),
  );
  return rows.map((r) => r.role);
}

export async function fetchAllRoles() {
  return unwrap(await supabase.from("studio_user_roles").select("*"));
}

export async function addMemberRole(userId: string, role: AppRole) {
  const { error } = await supabase.from("studio_user_roles").insert({ user_id: userId, role });
  if (error) throw new Error(error.message);
}

export async function removeMemberRole(userId: string, role: AppRole) {
  const { error } = await supabase
    .from("studio_user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role);
  if (error) throw new Error(error.message);
}

export async function fetchMembers() {
  return unwrap(
    await supabase.from("studio_members").select("*").order("created_at", { ascending: true }),
  );
}

/* ---------------- reference data ---------------- */

export async function fetchLocales() {
  return unwrap(await supabase.from("locales").select("*").order("sort_order"));
}
export async function fetchAuthors() {
  return unwrap(await supabase.from("authors").select("*").order("name"));
}
export async function fetchCategories() {
  return unwrap(await supabase.from("categories").select("*").order("name"));
}
export async function fetchTags() {
  return unwrap(await supabase.from("tags").select("*").order("name"));
}
export async function fetchTopics() {
  return unwrap(await supabase.from("topics").select("*").order("name"));
}
export async function fetchClusters() {
  return unwrap(await supabase.from("content_clusters").select("*").order("name"));
}
export async function fetchMedia() {
  return unwrap(
    await supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
  );
}

/* ---------------- content ---------------- */

export type ContentFilters = {
  type?: ContentType | "all";
  status?: ContentStatus | "all";
  locale?: string | "all";
  authorId?: string | "all";
  search?: string;
};

export async function fetchContentItems(filters: ContentFilters = {}) {
  let q = supabase.from("content_items").select("*").order("updated_at", { ascending: false });
  if (filters.type && filters.type !== "all") q = q.eq("type", filters.type);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.locale && filters.locale !== "all") q = q.eq("locale", filters.locale);
  if (filters.authorId && filters.authorId !== "all") q = q.eq("author_id", filters.authorId);
  if (filters.search?.trim()) q = q.ilike("title", `%${filters.search.trim()}%`);
  return unwrap(await q);
}

export async function fetchContentItem(id: string) {
  return unwrap(await supabase.from("content_items").select("*").eq("id", id).maybeSingle());
}

export async function fetchContentVersions(contentId: string) {
  return unwrap(
    await supabase
      .from("content_versions")
      .select("*")
      .eq("content_item_id", contentId)
      .order("version", { ascending: false }),
  );
}

export async function fetchContentTagIds(id: string) {
  const rows = unwrap(
    await supabase.from("content_item_tags").select("tag_id").eq("content_item_id", id),
  );
  return rows.map((r) => r.tag_id);
}

export async function fetchContentTopicIds(id: string) {
  const rows = unwrap(
    await supabase.from("content_item_topics").select("topic_id").eq("content_item_id", id),
  );
  return rows.map((r) => r.topic_id);
}

export type ContentDraftInput = {
  title: string;
  slug: string;
  type: ContentType;
  locale: string;
  excerpt: string | null;
  body: string | null;
  author_id: string | null;
  category_id: string | null;
  cluster_id: string | null;
  cover_media_id: string | null;
  seo: { meta_title?: string; meta_description?: string };
};

export async function createContentItem(input: ContentDraftInput, tagIds: string[]) {
  const { data, error } = await supabase
    .from("content_items")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  const created = data as ContentItem;
  await syncContentTags(created.id, tagIds);
  return created;
}

export async function updateContentItem(
  id: string,
  expectedVersion: number,
  input: ContentDraftInput,
  tagIds: string[],
) {
  const rows = unwrap(
    await supabase
      .from("content_items")
      .update({ ...input })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*"),
  );
  if (!rows.length) {
    throw new Error(
      "SAVE_CONFLICT: this item changed since you opened it. Reload to get the latest version.",
    );
  }
  await syncContentTags(id, tagIds);
  return rows[0]!;
}

export async function transitionContentStatus(
  id: string,
  expectedVersion: number,
  targetStatus: ContentStatus,
  scheduledAt?: string | null,
) {
  const { data, error } = await supabase.rpc("transition_content_status", {
    _content_id: id,
    _expected_version: expectedVersion,
    _target_status: targetStatus,
    _scheduled_at: scheduledAt ?? null,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function restoreContentVersion(
  contentId: string,
  versionId: string,
  expectedVersion: number,
) {
  const { data, error } = await supabase.rpc("restore_content_version", {
    _content_id: contentId,
    _version_id: versionId,
    _expected_version: expectedVersion,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteContentItem(id: string) {
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

async function syncContentTags(contentId: string, tagIds: string[]) {
  const current = await fetchContentTagIds(contentId);
  const toAdd = tagIds.filter((t) => !current.includes(t));
  const toRemove = current.filter((t) => !tagIds.includes(t));
  if (toAdd.length) {
    const { error } = await supabase
      .from("content_item_tags")
      .insert(toAdd.map((tag_id) => ({ content_item_id: contentId, tag_id })));
    if (error) throw new Error(error.message);
  }
  if (toRemove.length) {
    const { error } = await supabase
      .from("content_item_tags")
      .delete()
      .eq("content_item_id", contentId)
      .in("tag_id", toRemove);
    if (error) throw new Error(error.message);
  }
}

export async function setContentTopics(contentId: string, topicIds: string[]) {
  const current = await fetchContentTopicIds(contentId);
  const toAdd = topicIds.filter((t) => !current.includes(t));
  const toRemove = current.filter((t) => !topicIds.includes(t));
  if (toAdd.length) {
    const { error } = await supabase
      .from("content_item_topics")
      .insert(toAdd.map((topic_id) => ({ content_item_id: contentId, topic_id })));
    if (error) throw new Error(error.message);
  }
  if (toRemove.length) {
    const { error } = await supabase
      .from("content_item_topics")
      .delete()
      .eq("content_item_id", contentId)
      .in("topic_id", toRemove);
    if (error) throw new Error(error.message);
  }
}

/* ---------------- taxonomy CRUD ---------------- */

type TaxTable = "categories" | "tags" | "topics" | "content_clusters";

export async function createTaxonomy(
  table: TaxTable,
  values: { name: string; slug: string; description?: string | null; pillar_path?: string | null },
) {
  const payload: Record<string, unknown> = { name: values.name, slug: values.slug };
  if (table !== "tags") payload["description"] = values.description ?? null;
  if (table === "content_clusters") payload["pillar_path"] = values.pillar_path ?? null;
  const { error } = await supabase.from(table).insert(payload as never);
  if (error) throw new Error(error.message);
}

export async function updateTaxonomy(
  table: TaxTable,
  id: string,
  values: { name: string; slug: string; description?: string | null; pillar_path?: string | null },
) {
  const payload: Record<string, unknown> = { name: values.name, slug: values.slug };
  if (table !== "tags") payload["description"] = values.description ?? null;
  if (table === "content_clusters") payload["pillar_path"] = values.pillar_path ?? null;
  const { error } = await supabase.from(table).update(payload as never).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTaxonomy(table: TaxTable, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------- authors ---------------- */

export type AuthorInput = {
  name: string;
  slug: string;
  role_title: string | null;
  bio: string | null;
  avatar_url: string | null;
  member_id: string | null;
};

export async function createAuthor(input: AuthorInput) {
  const { error } = await supabase.from("authors").insert(input);
  if (error) throw new Error(error.message);
}
export async function updateAuthor(id: string, input: Partial<AuthorInput>) {
  const { error } = await supabase.from("authors").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function deleteAuthor(id: string) {
  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------- media ---------------- */

export type MediaInput = {
  filename: string;
  url: string;
  alt_text: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
};

export async function createMedia(input: MediaInput) {
  const { data, error } = await supabase
    .from("media_assets")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as MediaAsset;
}

export async function uploadMediaFile(file: File) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be signed in to upload an image.");

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return createMedia({
    filename: file.name,
    url: data.publicUrl,
    alt_text: null,
    mime_type: file.type || null,
    width: null,
    height: null,
    size_bytes: file.size,
  });
}
export async function deleteMedia(id: string) {
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------- locales ---------------- */

export async function setLocaleEnabled(id: string, enabled: boolean) {
  const { error } = await supabase.from("locales").update({ enabled }).eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------- audit ---------------- */

export async function fetchAuditLogs(entityId?: string, limit = 50) {
  let q = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (entityId) q = q.eq("entity_id", entityId);
  return unwrap(await q);
}
