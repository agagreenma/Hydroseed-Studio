import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Clock3, Eye, RotateCcw, Send, Trash2 } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { ContentEditorForm } from "@/components/studio/ContentEditorForm";
import { ErrorState, LoadingState, EmptyState, RoleNote, SuccessNote } from "@/components/studio/States";
import { StatusBadge, LangChip } from "@/components/studio/StatusBadge";
import { useStudioRole } from "@/hooks/useStudioRole";
import {
  deleteContentItem,
  fetchContentVersions,
  fetchAuditLogs,
  fetchContentItem,
  restoreContentVersion,
  transitionContentStatus,
  CONTENT_STATUSES,
  type ContentStatus,
  typeLabel,
  type ContentItem,
} from "@/lib/studio-api";
import type { Status } from "@/lib/mock";

export const Route = createFileRoute("/content/$id")({
  head: () => ({
    meta: [
      { title: "Content editor · HYDROSEED Studio" },
      {
        name: "description",
        content: "Edit a content item, assign taxonomy and save a new draft version.",
      },
      { property: "og:title", content: "Content editor · HYDROSEED Studio" },
      {
        property: "og:description",
        content: "Edit content items in the HYDROSEED Studio content foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContentItemPage,
});

function ContentItemPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    canEditItem,
    isAdmin,
    isEditor,
    isPublisher,
    isSeoReviewer,
    isWriter,
    userId,
  } = useStudioRole();

  const item = useQuery({ queryKey: ["content-item", id], queryFn: () => fetchContentItem(id) });
  const history = useQuery({ queryKey: ["audit-logs", id], queryFn: () => fetchAuditLogs(id) });
  const versions = useQuery({ queryKey: ["content-versions", id], queryFn: () => fetchContentVersions(id) });
  const [scheduledAt, setScheduledAt] = useState("");
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const remove = useMutation({
    mutationFn: () => deleteContentItem(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-items"] });
      navigate({ to: "/content" });
    },
  });

  const transition = useMutation({
    mutationFn: (target: ContentStatus) =>
      transitionContentStatus(
        id,
        data!.version,
        target,
        target === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      ),
    onSuccess: async () => {
      setWorkflowMessage("Workflow status updated.");
      setWorkflowError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["content-item", id] }),
        queryClient.invalidateQueries({ queryKey: ["content-items"] }),
        queryClient.invalidateQueries({ queryKey: ["audit-logs", id] }),
        queryClient.invalidateQueries({ queryKey: ["content-versions", id] }),
      ]);
    },
  });

  const restore = useMutation({
    mutationFn: (versionId: string) => restoreContentVersion(id, versionId, data!.version),
    onSuccess: async () => {
      setWorkflowMessage("Previous version restored to Draft.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["content-item", id] }),
        queryClient.invalidateQueries({ queryKey: ["content-items"] }),
        queryClient.invalidateQueries({ queryKey: ["audit-logs", id] }),
        queryClient.invalidateQueries({ queryKey: ["content-versions", id] }),
      ]);
    },
  });

  const data = (item.data ?? null) as ContentItem | null;
  const canEdit = canEditItem(data?.created_by);
  const canChangeTo = (target: ContentStatus) => Boolean(
    data && target !== data.status && (
      isAdmin ||
      (data.status === "draft" && target === "in_review" && isWriter && data.created_by === userId) ||
      (data.status === "in_review" && target === "seo_review" && isEditor) ||
      (data.status === "seo_review" && target === "approved" && isSeoReviewer) ||
      (data.status === "approved" && target === "scheduled" && isPublisher) ||
      (data.status === "scheduled" && target === "published" && isPublisher) ||
      (data.status === "published" && target === "updated" && isPublisher) ||
      (data.status === "updated" && target === "archived" && isPublisher)
    ),
  );
  const canChangeStatus = Boolean(data && CONTENT_STATUSES.some(canChangeTo));
  const statusName = (status: ContentStatus) =>
    status === "seo_review"
      ? "SEO Review"
      : status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const statusErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Status update failed.";
    if (message.includes("Invalid or unauthorized")) return "Your role cannot make that status change.";
    if (message.includes("Scheduled content requires")) return "Choose a schedule time before selecting Scheduled.";
    if (message.includes("SAVE_CONFLICT")) return "This item changed since you opened it. Reload and try again.";
    return "The status could not be updated. Please try again.";
  };

  return (
    <>
      <PageHeader
        eyebrow="Publishing · Content"
        title={data?.title ?? "Content item"}
        description={data ? `${typeLabel(data.type)} · /${data.slug}` : undefined}
        meta={
          data && (
            <>
              <StatusBadge status={data.status as Status} />
              <LangChip code={data.locale} />
              <span className="chip">v{data.version}</span>
            </>
          )
        }
        actions={
          <>
            <Link
              to="/content"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Link>
            {data && (data.type === "article" || data.type === "blog_post") && (
              <Link
                to="/content/preview/$id"
                params={{ id }}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
            )}
            {data && canEdit && (
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
              >
                {editing ? "Done" : "Modify"}
              </button>
            )}
            <button
              type="button"
              disabled={!canEdit || remove.isPending}
              onClick={() => {
                if (confirm("Delete this content item? This cannot be undone.")) remove.mutate();
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 text-sm text-destructive disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </>
        }
      />
      <PageBody>
        {item.isLoading && <LoadingState label="Loading content item…" />}
        {item.error && <ErrorState message={(item.error as Error).message} />}
        {remove.error && <ErrorState message={(remove.error as Error).message} />}
        {!item.isLoading && !item.error && !data && (
          <EmptyState
            title="Content item not found"
            description="It may have been deleted, or your role does not allow reading it."
          />
        )}
        {data && (
          <>
            {workflowMessage && <div className="mb-4"><SuccessNote>{workflowMessage}</SuccessNote></div>}
            {workflowError && <div className="mb-4"><ErrorState message={workflowError} /></div>}
            {(transition.error || restore.error) && (
              <div className="mb-4">
                <ErrorState message={transition.error ? statusErrorMessage(transition.error) : (restore.error as Error).message} />
              </div>
            )}
            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              <div className="surface-card p-4">
                <div className="mono-label mb-2 flex items-center gap-2"><Send className="h-3.5 w-3.5" /> Workflow</div>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <label className="text-xs text-muted-foreground">
                    Status
                    <select
                      value={data.status}
                      disabled={!canChangeStatus || transition.isPending}
                      onChange={(event) => {
                        const target = event.target.value as ContentStatus;
                        if (!canChangeTo(target)) return;
                        if (target === "scheduled" && !scheduledAt) {
                          setWorkflowMessage(null);
                          setWorkflowError("Choose a schedule time before selecting Scheduled.");
                          return;
                        }
                        setWorkflowMessage(null);
                        setWorkflowError(null);
                        transition.mutate(target);
                      }}
                      className="mt-1 block h-9 min-w-44 rounded-md border border-border bg-card px-2 text-sm capitalize text-foreground disabled:opacity-60"
                    >
                      {CONTENT_STATUSES.map((status) => (
                        <option key={status} value={status} disabled={status !== data.status && !canChangeTo(status)}>
                          {statusName(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  {canChangeTo("scheduled") && (
                    <label className="text-xs text-muted-foreground">
                      Schedule at
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(event) => setScheduledAt(event.target.value)}
                        className="mt-1 block h-9 rounded-md border border-border bg-card px-2 text-sm text-foreground"
                      />
                    </label>
                  )}
                </div>
                {!canChangeStatus && (
                  <RoleNote>Your role cannot change this content status.</RoleNote>
                )}
                {canChangeStatus && (
                  <div className="mt-2 text-xs text-muted-foreground">Select an authorized status to update the workflow.</div>
                )}
              </div>
              <div className="surface-card p-4">
                <div className="mono-label mb-2 flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> Schedule</div>
                <div className="text-xs text-muted-foreground">
                  {data.scheduled_at ? `Scheduled for ${new Date(data.scheduled_at).toLocaleString()}` : "No schedule set."}
                </div>
                {data.published_at && <div className="mt-1 text-xs text-muted-foreground">Published {new Date(data.published_at).toLocaleString()}</div>}
              </div>
            </div>
            <ContentEditorForm item={data} editing={editing} />
            <div className="surface-card p-4">
              <div className="mono-label mb-3">History</div>
              {history.isLoading && (
                <div className="text-xs text-muted-foreground">Loading history…</div>
              )}
              {history.error && <ErrorState message={(history.error as Error).message} />}
              {!history.isLoading && !history.data?.length && (
                <p className="text-xs text-muted-foreground">No history recorded yet.</p>
              )}
              <ul className="divide-y divide-border">
                {history.data?.map((log) => (
                  <li key={log.id} className="flex items-center justify-between py-2 text-xs">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card mt-4 p-4">
              <div className="mono-label mb-3">Version snapshots</div>
              {versions.isLoading && <div className="text-xs text-muted-foreground">Loading versions…</div>}
              {versions.data?.map((version) => (
                <div key={version.id} className="flex items-center justify-between border-b border-border py-2 text-xs last:border-0">
                  <span>v{version.version} · {version.status.replace("_", " ")}</span>
                  {version.version !== data.version && (isAdmin || isEditor || isPublisher) && (
                    <button
                      type="button"
                      disabled={restore.isPending}
                      onClick={() => {
                        if (confirm(`Restore version ${version.version} to Draft?`)) restore.mutate(version.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs disabled:opacity-60"
                    >
                      <RotateCcw className="h-3 w-3" /> Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </PageBody>
    </>
  );
}
