import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/learn")({
  component: () => <Outlet />,
});
