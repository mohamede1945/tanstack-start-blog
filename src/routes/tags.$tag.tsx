import { createFileRoute } from "@tanstack/react-router";
import { PostListSection } from "../components/post-list-section";
import { SITE_TITLE, SITE_URL } from "../consts";
import { getAllPosts } from "../lib/posts";
import { buildCanonicalLink, buildSeoMeta } from "../lib/seo";

type TagLoaderData = {
  tag: string;
  posts: Awaited<ReturnType<typeof getAllPosts>>;
};

const normalizeTag = (value: string) => value.trim();

export const Route = createFileRoute("/tags/$tag")({
  loader: async ({ params }) => {
    const rawTag = decodeURIComponent(params.tag ?? "");
    const tag = normalizeTag(rawTag);
    const posts = await getAllPosts();
    const normalized = tag.toLowerCase();
    const filtered = posts.filter((post) =>
      (post.tags ?? []).some((postTag) => postTag.toLowerCase() === normalized),
    );
    return { tag, posts: filtered } satisfies TagLoaderData;
  },
  head: ({ loaderData }) => {
    const tag = loaderData?.tag || "Tag";
    const description = tag ? `Posts tagged “${tag}”.` : undefined;
    const url = `${SITE_URL}/tags/${encodeURIComponent(tag)}`;
    return {
      meta: buildSeoMeta({
        title: `#${tag} - ${SITE_TITLE}`,
        description,
        url,
      }),
      links: [buildCanonicalLink(url)],
    };
  },
  component: TagPage,
});

function TagPage() {
  const { tag, posts } = Route.useLoaderData();
  const postCount = posts.length;

  return (
    <PostListSection
      title={`Tag: ${tag}`}
      meta={`${postCount} ${postCount === 1 ? "post" : "posts"} tagged`}
      posts={posts}
      emptyMessage="No posts for this tag yet."
    />
  );
}
