import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/studio/States";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { fetchContentItems } from "@/lib/studio-api";
import { statusLabel, type Status } from "@/lib/mock";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Website Content · HYDROSEED Studio" },
      { name: "description", content: "Manage website content records in the central Content Library." },
      { property: "og:title", content: "Landing Pages · HYDROSEED Studio" },
      { property: "og:description", content: "Campaign landing pages for hydroseed.app — coming soon." },
    ],
  }),
  component: WebsiteContentPage,
});

function WebsiteContentPage() {
  const items = useQuery({
    queryKey: ["website-content"],
    queryFn: () => fetchContentItems({ type: "landing_page" }),
  });

  return (
    <>
      <PageHeader
        eyebrow="Publishing · Website content"
        title="Website content"
        description="Manage website content records through the central Content Library."
        actions={<Link to="/content/new" search={{ type: "landing_page" }} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> New website content</Link>}
      />
      <PageBody>
        {items.isLoading && <LoadingState label="Loading website content…" />}
        {items.error && <ErrorState message="Website content could not be loaded." />}
        {!items.isLoading && !items.error && items.data?.length === 0 && <EmptyState title="No website content yet" description="Create a website content draft in the central Content Library." action={<Link to="/content/new" search={{ type: "landing_page" }} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> New website content</Link>} />}
        {!!items.data?.length && <div className="surface-card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted/40 text-left text-muted-foreground"><tr><th className="px-4 py-2.5 font-medium">Page</th><th className="px-3 py-2.5 font-medium">Status</th><th className="px-3 py-2.5 font-medium">Locale</th><th className="px-3 py-2.5 font-medium">Updated</th></tr></thead><tbody className="divide-y divide-border">{items.data.map((item) => <tr key={item.id} className="hover:bg-muted/30"><td className="px-4 py-3"><Link to="/content/$id" params={{ id: item.id }} className="font-medium hover:text-primary">{item.title}</Link><div className="font-mono text-[11px] text-muted-foreground">/{item.slug}</div></td><td className="px-3 py-3"><StatusBadge status={item.status as Status} /></td><td className="px-3 py-3 font-mono text-xs">{item.locale}</td><td className="px-3 py-3 text-xs text-muted-foreground">{new Date(item.updated_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
      </PageBody>
    </>
  );
}
