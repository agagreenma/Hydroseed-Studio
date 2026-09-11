/**
 * Phase 2 — author management and team / author mapping.
 *
 * Members and their Phase 2 roles are read-only here (the first member becomes
 * administrator, later members start as writers). Author records are managed by
 * administrators and can be mapped to a studio member.
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
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
  createAuthor,
  deleteAuthor,
  fetchAllRoles,
  fetchAuthors,
  fetchMembers,
  slugify,
  updateAuthor,
  type Author,
} from "@/lib/studio-api";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Authors & team · HYDROSEED Studio" },
      {
        name: "description",
        content: "Manage author profiles and map them to studio members and Phase 2 roles.",
      },
      { property: "og:title", content: "Authors & team · HYDROSEED Studio" },
      {
        property: "og:description",
        content: "Author profiles and team mapping for the HYDROSEED Studio content foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

const fieldCls = "h-9 w-full rounded-md border border-border bg-card px-3 text-sm";

function TeamPage() {
  const { isAdmin, primaryRole, loading: roleLoading } = useStudioRole();
  const queryClient = useQueryClient();

  const members = useQuery({ queryKey: ["members"], queryFn: fetchMembers });
  const roles = useQuery({ queryKey: ["all-roles"], queryFn: fetchAllRoles });
  const authors = useQuery({ queryKey: ["authors"], queryFn: fetchAuthors });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [bio, setBio] = useState("");
  const [memberId, setMemberId] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setName("");
    setSlug("");
    setRoleTitle("");
    setBio("");
    setMemberId("");
    setValidation(null);
  }

  function openEdit(author: Author) {
    setSuccess(null);
    setEditing(author);
    setName(author.name);
    setSlug(author.slug);
    setRoleTitle(author.role_title ?? "");
    setBio(author.bio ?? "");
    setMemberId(author.member_id ?? "");
    setValidation(null);
    setFormOpen(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const input = {
        name: name.trim(),
        slug: (slug.trim() || slugify(name)).trim(),
        role_title: roleTitle.trim() || null,
        bio: bio.trim() || null,
        avatar_url: editing?.avatar_url ?? null,
        member_id: memberId || null,
      };
      if (editing) return updateAuthor(editing.id, input);
      return createAuthor(input);
    },
    onSuccess: async () => {
      setSuccess(editing ? "Author updated." : "Author created.");
      closeForm();
      await queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAuthor(id),
    onSuccess: async () => {
      setSuccess("Author deleted.");
      await queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });

  const memberRows = members.data ?? [];
  const roleRows = roles.data ?? [];
  const authorRows = (authors.data ?? []) as Author[];

  function memberLabel(id: string | null) {
    if (!id) return "Not mapped";
    const m = memberRows.find((x) => x.id === id);
    return m?.display_name ?? m?.email ?? "Unknown member";
  }

  function rolesFor(memberId: string) {
    return roleRows.filter((r) => r.user_id === memberId).map((r) => r.role);
  }

  return (
    <>
      <PageHeader
        eyebrow="System · Team"
        title="Authors & team"
        description="Author profiles used on content items, mapped to studio members and roles."
        actions={
          <button
            type="button"
            onClick={() => {
              closeForm();
              setSuccess(null);
              setFormOpen(true);
            }}
            disabled={!isAdmin}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New author
          </button>
        }
      />
      <PageBody>
        {!roleLoading && !isAdmin && (
          <RoleNote>
            You are signed in as <strong className="text-foreground">{primaryRole}</strong>. Only
            administrators can manage author records and mapping.
          </RoleNote>
        )}
        {success && <SuccessNote>{success}</SuccessNote>}
        {validation && <ErrorState message={validation} />}
        {save.error && <ErrorState message={(save.error as Error).message} />}
        {remove.error && <ErrorState message={(remove.error as Error).message} />}

        {formOpen && (
          <form
            className="surface-card space-y-3 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return setValidation("An author name is required.");
              setValidation(null);
              save.mutate();
            }}
          >
            <div className="flex items-center justify-between">
              <div className="mono-label">{editing ? "Edit author" : "New author"}</div>
              <button type="button" onClick={closeForm} className="p-1 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="a-name">Name</label>
                <input
                  id="a-name"
                  className={fieldCls}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editing) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="a-slug">Slug</label>
                <input
                  id="a-slug"
                  className={`${fieldCls} font-mono`}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="a-role">Role title</label>
                <input
                  id="a-role"
                  className={fieldCls}
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Agronomy lead"
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block" htmlFor="a-member">Mapped member</label>
                <select
                  id="a-member"
                  className={fieldCls}
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                >
                  <option value="">Not mapped</option>
                  {memberRows.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.display_name ?? m.email ?? m.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mono-label mb-1.5 block" htmlFor="a-bio">Bio</label>
                <textarea
                  id="a-bio"
                  rows={3}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!isAdmin || save.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : editing ? "Save changes" : "Create author"}
            </button>
          </form>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {authors.isLoading && <LoadingState label="Loading authors…" />}
            {authors.error && <ErrorState message={(authors.error as Error).message} />}
            {!authors.isLoading && !authors.error && authorRows.length === 0 && (
              <EmptyState
                title="No authors yet"
                description={
                  isAdmin
                    ? "Create an author so content items can be attributed."
                    : "An administrator needs to create the first author."
                }
              />
            )}
            {authorRows.length > 0 && (
              <div className="surface-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Author</th>
                      <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Mapped member</th>
                      <th className="px-3 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {authorRows.map((a) => (
                      <tr key={a.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {a.role_title ?? "—"} · <span className="font-mono">{a.slug}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 py-3 text-xs text-muted-foreground">
                          {memberLabel(a.member_id)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(a)}
                              disabled={!isAdmin}
                              className="grid h-8 w-8 place-items-center rounded-md border border-border disabled:opacity-50"
                              aria-label={`Edit ${a.name}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete author “${a.name}”?`)) remove.mutate(a.id);
                              }}
                              disabled={!isAdmin || remove.isPending}
                              className="grid h-8 w-8 place-items-center rounded-md border border-destructive/30 text-destructive disabled:opacity-50"
                              aria-label={`Delete ${a.name}`}
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

          <div className="surface-card p-4">
            <div className="mono-label flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Members & roles
            </div>
            {members.isLoading && (
              <div className="mt-3 text-xs text-muted-foreground">Loading members…</div>
            )}
            {members.error && (
              <div className="mt-3">
                <ErrorState message={(members.error as Error).message} />
              </div>
            )}
            {!members.isLoading && memberRows.length === 0 && (
              <p className="mt-3 text-xs text-muted-foreground">No members recorded yet.</p>
            )}
            <ul className="mt-3 space-y-2">
              {memberRows.map((m) => (
                <li key={m.id} className="rounded-md border border-border p-2.5">
                  <div className="text-sm font-medium">{m.display_name ?? m.email ?? m.id}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {rolesFor(m.id).length === 0 ? (
                      <span className="chip">writer</span>
                    ) : (
                      rolesFor(m.id).map((r) => (
                        <span key={r} className="chip">
                          {r}
                        </span>
                      ))
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              The first member becomes administrator; later members start as writers. Role changes
              beyond Phase 2 are out of scope.
            </p>
          </div>
        </div>
      </PageBody>
    </>
  );
}
