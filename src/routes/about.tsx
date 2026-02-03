import { createFileRoute } from "@tanstack/react-router";
import { allPages } from "content-collections";
import { MDX } from "@/components/mdx";
import { SITE_URL } from "../consts";
import { buildCanonicalLink, buildSeoMeta } from "../lib/seo";

const title = "About - TanStack Start Blog";
const description =
  "A template about page you can customize with your bio, mission, and current projects.";

export const Route = createFileRoute("/about")({
  loader: () => {
    const page = allPages.find((entry) => entry._meta.path === "about");
    if (!page) throw new Error("About page not found");
    return page;
  },
  head: () => {
    const url = `${SITE_URL}/about`;
    return {
      meta: buildSeoMeta({
        title,
        description,
        url,
      }),
      links: [buildCanonicalLink(url)],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const page = Route.useLoaderData();
  return <MDX markdown={page.content} mdast={page.mdast} />;
}
