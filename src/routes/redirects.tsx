import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { EmptyState, ErrorState, LoadingState, RoleNote, SuccessNote } from "@/components/studio/States";
import { useStudioRole } from "@/hooks/useStudioRole";
import {
  createRedirect,
  deleteRedirect,
  fetchRedirects,
  updateRedirect,
  validateRedirectInput,
  type Redirect,
  type RedirectInput,
} from "@/lib/studio-api";
import { Plus, ArrowRight, Pencil, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/redirects")({
  head: () => ({
    meta: [
      { title: "Redirects · HYDROSEED Studio" },
      { name: "description", content: "Manage URL redirects on hydroseed.app." },
    ],
  }),
  component: RedirectsPage,
});

function RedirectsPage() {
  const { isEditor, primaryRole, loading: roleLoading } = useStudioRole();
  const queryClient = useQueryClient();
  const redirects = useQuery({ queryKey: ["redirects"], queryFn: fetchRedirects });
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [active, setActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const rows = (redirects.data ?? []) as Redirect[];

  function resetForm() {
    setFormOpen(false);
    setEditingId(null);
    setSource("");
    setDestination("");
    setStatusCode(301);
    setActive(true);
    setFormError(null);
  }

  function editRedirect(redirect: Redirect) {
    setEditingId(redirect.id);
    setSource(redirect.source_path);
    setDestination(redirect.destination);
    setStatusCode(redirect.status_code as 301 | 302);
    setActive(redirect.active);
    setFormError(null);
    setSuccess(null);
    setFormOpen(true);
  }

  const save = useMutation({
    mutationFn: (input: RedirectInput) => editingId ? updateRedirect(editingId, input) : createRedirect(input),
    onSuccess: async () => {
      setSuccess(editingId ? "Redirect updated." : "Redirect created.");
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["redirects"] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteRedirect,
    onSuccess: async () => {
      setSuccess("Redirect deleted.");
      await queryClient.invalidateQueries({ queryKey: ["redirects"] });
    },
  });

  function submit() {
    const input: RedirectInput = {
      source_path: source.trim(),
      destination: destination.trim(),
      status_code: statusCode,
      active,
    };
    const validation = validateRedirectInput(input, rows, editingId ?? undefined);
    if (validation) {
      setFormError(validation);
      return;
    }
    setFormError(null);
    save.mutate(input);
  }

  return (
    <>
      <PageHeader
        eyebrow="Growth · Redirects"
        title="URL redirects"
        description="301 and 302 rules for hydroseed.app. Track hits and disable rules without deleting them."
        actions={
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              resetForm();
              setFormOpen(true);
            }}
            disabled={!isEditor}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> New redirect
          </button>
        }
      />
      <PageBody>
        {!roleLoading && !isEditor && <RoleNote>You are signed in as <strong className="text-foreground">{primaryRole}</strong>. Redirect management is restricted to editors and administrators.</RoleNote>}
        {success && <SuccessNote>{success}</SuccessNote>}
        {redirects.isLoading && <LoadingState label="Loading redirects…" />}
        {redirects.error && <ErrorState message={(redirects.error as Error).message} />}
        {save.error && <ErrorState message={(save.error as Error).message} />}
        {remove.error && <ErrorState message={(remove.error as Error).message} />}
        {formOpen && (
          <form className="surface-card mb-4 space-y-3 p-4" onSubmit={(event) => { event.preventDefault(); submit(); }}>
            <div className="flex items-center justify-between">
              <div className="mono-label">{editingId ? "Edit redirect" : "New redirect"}</div>
              <button type="button" onClick={resetForm} className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            {formError && <ErrorState message={formError} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Source path<input value={source} onChange={(event) => setSource(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-3 font-mono text-xs" placeholder="/old-path" /></label>
              <label className="text-sm">Destination<input value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-3 font-mono text-xs" placeholder="/journal/articles/new-path" /></label>
              <label className="text-sm">Status code<select value={statusCode} onChange={(event) => setStatusCode(Number(event.target.value) as 301 | 302)} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-3 text-sm"><option value={301}>301 Permanent</option><option value={302}>302 Temporary</option></select></label>
              <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active</label>
            </div>
            <button type="submit" disabled={!isEditor || save.isPending} className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50">{save.isPending ? "Saving…" : editingId ? "Save redirect" : "Create redirect"}</button>
          </form>
        )}
        {!redirects.isLoading && !redirects.error && rows.length === 0 && <EmptyState title="No redirects yet" description="Create a redirect for a retired public path." />}
        {!redirects.isLoading && !redirects.error && rows.length > 0 && (
        <div className="surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">Source → Destination</th>
                <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Type</th>
                <th className="hidden md:table-cell px-3 py-2.5 font-medium">Status</th>
                <th className="hidden lg:table-cell px-3 py-2.5 font-medium">Created</th>
                <th className="px-3 py-2.5 font-medium text-right">Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 min-w-0">
                      <span className="truncate font-mono text-xs">{r.source_path}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate font-mono text-xs text-muted-foreground">{r.destination}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-3">
                    <span className={`chip !border-border`}>
                      {r.status_code}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${r.active ? "text-success" : "text-muted-foreground"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r.active ? "bg-success" : "bg-muted-foreground/60"}`} />
                      {r.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-3 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => editRedirect(r)} disabled={!isEditor} aria-label={`Edit ${r.source_path}`} className="grid h-8 w-8 place-items-center rounded-md border border-border disabled:opacity-40"><Pencil className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => remove.mutate(r.id)} disabled={!isEditor || remove.isPending} aria-label={`Delete ${r.source_path}`} className="grid h-8 w-8 place-items-center rounded-md border border-destructive/30 text-destructive disabled:opacity-40"><Trash2 className="h-3.5 w-3.5" /></button>
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
