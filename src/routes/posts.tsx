import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Stack } from "../components/stack";

export const Route = createFileRoute("/posts")({
  component: PostsLayout,
});

function PostsLayout() {
  return (
    <Stack gap="lg" className="py-8">
      <Outlet />
    </Stack>
  );
}
