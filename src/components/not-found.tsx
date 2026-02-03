import { Link } from "@tanstack/react-router";
import { PageHeader } from "./page-header";
import { Stack } from "./stack";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <Stack gap="lg" className="py-16">
      <PageHeader
        title="Page not found"
        description="Looks like this URL doesn't exist - or it moved without telling us."
      />
      <div>
        <Button render={<Link to="/" />} nativeButton={false} variant="outline">
          Go to homepage
        </Button>
      </div>
    </Stack>
  );
}
