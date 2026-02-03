import { createFileRoute, notFound } from "@tanstack/react-router";
import { MDX } from "@/components/mdx";
import { Separator } from "@/components/ui/separator";
import { Bio } from "../components/bio";
import { PageHeader } from "../components/page-header";
import { PostFooter } from "../components/post-footer";
import { SITE_DESCRIPTION, SITE_URL } from "../consts";
import { getPostByPath } from "../lib/posts";
import { buildCanonicalLink, buildSeoMeta } from "../lib/seo";

export const Route = createFileRoute("/posts/$")({
  loader: async ({ params }) => {
    const pathSegments = params._splat ? params._splat.split("/").filter(Boolean) : [];
    const path = pathSegments.length > 0 ? pathSegments.join("/") : "/";
    const post = await getPostByPath(path);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title;
    const description = loaderData?.description ?? SITE_DESCRIPTION;
    const path = loaderData?._meta.path;
    const url = `${SITE_URL}/posts/${path ?? ""}`;
    const ogImage = path ? `${SITE_URL}/assets/og/${path}.webp` : undefined;

    return {
      meta: buildSeoMeta({
        title,
        description,
        url,
        image: ogImage,
      }),
      links: [buildCanonicalLink(url)],
    };
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  const path = post._meta.path ?? "";
  const postUrl = `${SITE_URL}/posts/${path}`;

  return (
    <>
      <span id="top" className="sr-only" />
      <PageHeader
        align="center"
        meta={`${post.publishDate} - ${post.readingTime}`}
        title={post.title}
      />

      <Separator />
      <MDX markdown={post.content} mdast={post.mdast} />
      <Separator className="my-10" />
      <PostFooter tags={post.tags ?? []} title={post.title} url={postUrl} />
      <Separator className="my-10" />
      <Bio />
    </>
  );
}
