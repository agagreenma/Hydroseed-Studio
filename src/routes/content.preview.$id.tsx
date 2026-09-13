import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { ArticlePresentation } from "@/components/public/ArticlePresentation";
import { ErrorState, LoadingState } from "@/components/studio/States";
import { fetchPreviewArticle } from "@/lib/public-content";

export const Route = createFileRoute("/content/preview/$id")({
  head: () => ({
    meta: [
      { title: "Article preview · HYDROSEED Studio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ArticlePreview,
});

function ArticlePreview() {
  const { id } = Route.useParams();
  const preview = useQuery({
    queryKey: ["article-preview", id],
    queryFn: () => fetchPreviewArticle(id),
  });

  if (preview.isLoading) return <LoadingState label="Loading article preview…" />;

  if (preview.error) {
    return (
      <div className="space-y-4 p-6">
        <ErrorState message="The article preview could not be loaded. Check your Studio access and try again." />
        <Link to="/content" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Content
        </Link>
      </div>
    );
  }

  if (!preview.data) {
    return (
      <div className="space-y-4 p-6">
        <ErrorState message="This article could not be found or is not a previewable article." />
        <Link to="/content" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Content
        </Link>
      </div>
    );
  }

  return <ArticlePresentation article={preview.data} preview />;
}
