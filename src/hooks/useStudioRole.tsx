import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyRoles, type AppRole } from "@/lib/studio-api";

/**
 * Phase 2 role model only: writer / editor / administrator.
 * The full Phase 3 publishing permission matrix is out of scope.
 */
export function useStudioRole() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["my-roles", user?.id],
    queryFn: () => fetchMyRoles(user!.id),
    enabled: !!user?.id,
  });

  const roles: AppRole[] = query.data ?? [];
  const isAdmin = roles.includes("administrator");
  const isEditor = roles.includes("editor") || isAdmin;
  const isSeoReviewer = roles.includes("seo_reviewer") || isAdmin;
  const isPublisher = roles.includes("publisher") || isAdmin;
  const isWriter = roles.includes("writer") || isEditor;

  return {
    roles,
    loading: query.isLoading,
    isAdmin,
    isEditor,
    isSeoReviewer,
    isPublisher,
    isWriter,
    /** Writers may only edit their own items; editors and admins may edit any. */
    canEditItem: (createdBy: string | null | undefined) =>
      isEditor || (!!user && createdBy === user.id),
    userId: user?.id ?? null,
    primaryRole: (isAdmin
      ? "administrator"
      : isPublisher
        ? "publisher"
        : isSeoReviewer
          ? "seo_reviewer"
          : isEditor
            ? "editor"
            : "writer") as AppRole,
  };
}
