import { createFileRoute } from "@tanstack/react-router";
import { PostListSection } from "../components/post-list-section";
import { SITE_URL } from "../consts";
import { getAllPosts } from "../lib/posts";
import { buildCanonicalLink, buildSeoMeta } from "../lib/seo";

export const Route = createFileRoute("/posts/")({
  loader: async () => getAllPosts(),
  head: () => {
    const url = `${SITE_URL}/posts`;
    return {
      meta: buildSeoMeta({ url }),
      links: [buildCanonicalLink(url)],
    };
  },
  component: PostsPage,
});

function PostsPage() {
  const posts = Route.useLoaderData();

  return <PostListSection title="Posts" posts={posts} />;
}
