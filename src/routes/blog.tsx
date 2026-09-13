import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { EmptyState, ErrorState, LoadingState, RoleNote } from "@/components/studio/States";
import { fetchContentItems, type ContentStatus } from "@/lib/studio-api";
import { statusLabel, type Status } from "@/lib/mock";
import { useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog · HYDROSEED Studio" },
      { name: "description", content: "Manage HYDROSEED article content and publishing workflow." },
    ],
  }),
  component: BlogList,
});

function BlogList() {
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const items = useQuery({
    queryKey: ["blog-content", status, search],
    queryFn: () => fetchContentItems({ type: "article", status, search }),
  });
  const rows = items.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Publishing · Blog"
        title="Articles"
        description="Manage article records through the shared Content Library and publishing workflow."
        actions={
          <Link
            to="/content/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New article
          </Link>
        }
      />
      <PageBody>
        <RoleNote>
          Blog articles are stored in the central Content Library. Public Journal pages show only
          published, schedule-eligible articles.
        </RoleNote>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles"
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm"
            />
          </div>
          <select
            aria-label="Filter article status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ContentStatus | "all")}
            className="h-9 rounded-md border border-border bg-card px-2.5 text-sm"
          >
            <option value="all">All statuses</option>
            {(
              [
                "draft",
                "in_review",
                "seo_review",
                "approved",
                "scheduled",
                "published",
                "updated",
                "archived",
              ] as ContentStatus[]
            ).map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
        </div>
        {items.isLoading && <LoadingState label="Loading articles…" />}
        {items.error && <ErrorState message={(items.error as Error).message} />}
        {!items.isLoading && !items.error && rows.length === 0 && (
          <EmptyState
            title="No articles yet"
            description="Create an article to begin the publishing workflow."
            action={
              <Link
                to="/content/new"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> New article
              </Link>
            }
          />
        )}
        {rows.length > 0 && (
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Article</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Locale</th>
                  <th className="px-3 py-2.5 font-medium">Version</th>
                  <th className="px-3 py-2.5 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        to="/content/$id"
                        params={{ id: item.id }}
                        className="font-medium hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        /{item.slug}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={item.status as Status} />
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{item.locale}</td>
                    <td className="px-3 py-3 font-mono text-xs">v{item.version}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString()}
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
