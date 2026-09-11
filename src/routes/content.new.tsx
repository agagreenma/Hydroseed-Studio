import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { ContentEditorForm } from "@/components/studio/ContentEditorForm";

export const Route = createFileRoute("/content/new")({
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
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Content"
        title="New content"
        description="Create a draft. Status changes and publishing arrive in a later phase."
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
        <ContentEditorForm />
      </PageBody>
    </>
  );
}
