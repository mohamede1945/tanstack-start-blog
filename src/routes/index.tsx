import { createFileRoute, Link } from "@tanstack/react-router";
import { PostList } from "../components/post-list";
import { Stack } from "../components/stack";
import { SITE_URL } from "../consts";
import { getAllPosts } from "../lib/posts";
import { buildCanonicalLink, buildSeoMeta } from "../lib/seo";

export const Route = createFileRoute("/")({
  loader: async () => getAllPosts(),
  head: () => {
    const url = SITE_URL;
    return {
      meta: buildSeoMeta({ url }),
      links: [buildCanonicalLink(url)],
    };
  },
  component: HomePage,
});

function HomePage() {
  const posts = Route.useLoaderData();
  const latestPosts = posts.slice(0, 5);

  return (
    <Stack gap="lg" className="py-10">
      <section>
        <Stack gap="md">
          <div className="space-y-4">
            <h1 className="font-semibold text-3xl sm:text-4xl">
              TanStack Start blog template for fast, polished publishing.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              MDX, Prose UI, content collections, and Cloudflare Workers-ready. Customize the
              content and ship your writing with confidence.
            </p>
            <p className="text-muted-foreground text-sm">
              This is the template discussed in{" "}
              <a
                className="font-semibold text-foreground hover:underline"
                href="https://mafifi.dev/posts/accidentally-built-a-blog-platform/"
                target="_blank"
                rel="noreferrer"
              >
                accidentally built a blog platform
              </a>
              .
            </p>
          </div>
          <div className="overflow-hidden rounded-4xl border border-border/60 bg-muted/30">
            <img
              src="/assets/desk.jpeg"
              alt="Workspace illustration"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Stack>
      </section>

      <section id="posts">
        <Stack gap="md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h2 className="font-semibold text-2xl text-foreground">Posts</h2>
              <p className="text-muted-foreground text-sm">
                Template-ready posts showcasing MDX components and content features.
              </p>
            </div>
            <Link className="font-semibold text-foreground text-sm hover:underline" to="/posts">
              All posts &rarr;
            </Link>
          </div>
          <PostList posts={latestPosts} emptyMessage="No posts yet." />
        </Stack>
      </section>
    </Stack>
  );
}
