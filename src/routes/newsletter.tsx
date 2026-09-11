import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter · HYDROSEED Studio" },
      { name: "description", content: "The hydroseed.app newsletter workspace — coming soon." },
      { property: "og:title", content: "Newsletter · HYDROSEED Studio" },
      { property: "og:description", content: "The hydroseed.app newsletter workspace — coming soon." },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Newsletter"
        title="Newsletter"
        description="A twice-monthly briefing for contractors, engineers and landscapers."
        meta={
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Coming soon
          </span>
        }
      />
      <PageBody>
        <div className="surface-card grid place-items-center px-6 py-20 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-muted">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-foreground">Newsletter is coming soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Issue composition, subscriber management and campaign analytics will land here in a
            future release.
          </p>
        </div>
      </PageBody>
    </>
  );
}
