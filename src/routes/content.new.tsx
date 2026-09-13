import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { ContentEditorForm } from "@/components/studio/ContentEditorForm";
import type { ContentType } from "@/lib/studio-api";

export const Route = createFileRoute("/content/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: search.type === "landing_page" ? ("landing_page" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "New content · HYDROSEED Studio" },
      {
        name: "description",
        content: "Create a new content draft and assign author, locale, category and tags.",
      },
      { property: "og:title", content: "New content · HYDROSEED Studio" },
      {
        property: "og:description",
        content: "Create a new content draft in the HYDROSEED Studio content foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewContentPage,
});

function NewContentPage() {
  const { type } = Route.useSearch();
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Content"
        title={type === "landing_page" ? "New website content" : "New content"}
        description="Create a draft in the central Content Library."
        actions={
          <Link
            to="/content"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
        }
      />
      <PageBody>
        <ContentEditorForm defaultType={(type ?? "article") as ContentType} />
      </PageBody>
    </>
  );
}
