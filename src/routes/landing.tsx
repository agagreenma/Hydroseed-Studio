import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { LayoutTemplate } from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Landing Pages · HYDROSEED Studio" },
      { name: "description", content: "Campaign landing pages for hydroseed.app — coming soon." },
      { property: "og:title", content: "Landing Pages · HYDROSEED Studio" },
      { property: "og:description", content: "Campaign landing pages for hydroseed.app — coming soon." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Landing pages"
        title="Campaigns & landing pages"
        description="Standalone marketing pages, grouped by campaign."
        meta={
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Coming soon
          </span>
        }
      />
      <PageBody>
        <div className="surface-card grid place-items-center px-6 py-20 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-muted">
            <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-foreground">Landing pages are coming soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Campaign builder, templates and conversion tracking are in the works. This section will
            open up in a future release.
          </p>
        </div>
      </PageBody>
    </>
  );
}
