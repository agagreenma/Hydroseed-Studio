import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { ContentEditorForm } from "@/components/studio/ContentEditorForm";
import { ErrorState, LoadingState, EmptyState } from "@/components/studio/States";
import { StatusBadge, LangChip } from "@/components/studio/StatusBadge";
import { useStudioRole } from "@/hooks/useStudioRole";
import {
  deleteContentItem,
  fetchAuditLogs,
  fetchContentItem,
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
  const { canEditItem } = useStudioRole();

  const item = useQuery({ queryKey: ["content-item", id], queryFn: () => fetchContentItem(id) });
  const history = useQuery({ queryKey: ["audit-logs", id], queryFn: () => fetchAuditLogs(id) });

  const remove = useMutation({
    mutationFn: () => deleteContentItem(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-items"] });
      navigate({ to: "/content" });
    },
  });

  const data = (item.data ?? null) as ContentItem | null;
  const canEdit = canEditItem(data?.created_by);

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
            <ContentEditorForm item={data} />
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
          </>
        )}
      </PageBody>
    </>
  );
}
