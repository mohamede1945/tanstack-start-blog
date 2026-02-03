import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createBuilder } from "@content-collections/core";
import type { Post } from "content-collections";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../src/consts.ts";

const root = process.cwd();
const publicDir = path.join(root, "public");
const configPath = path.join(root, "content-collections.ts");

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? new Date(0) : date;
};

const builder = await createBuilder(configPath);
await builder.build();

const { allPosts } = (await import(
  pathToFileURL(path.join(root, ".content-collections", "generated", "index.js")).href
)) as { allPosts: Post[] };
const posts = allPosts.map((post) => {
  const publishDate = String(post.publishDate ?? "");
  return {
    ...post,
    date: toDate(publishDate),
  };
});

posts.sort((a, b) => b.date.valueOf() - a.date.valueOf());

const rssItems = posts
  .map((post) => {
    const link = `${SITE_URL}/posts/${post._meta.path}`;
    return `\n      <item>\n        <title>${escapeXml(post.title)}</title>\n        <link>${link}</link>\n        <guid>${link}</guid>\n        <pubDate>${post.date.toUTCString()}</pubDate>\n        <description>${escapeXml(post.description)}</description>\n      </item>`;
  })
  .join("");

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(SITE_TITLE)}</title>\n    <description>${escapeXml(SITE_DESCRIPTION)}</description>\n    <link>${SITE_URL}</link>${rssItems}\n  </channel>\n</rss>`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "rss.xml"), rssXml);
