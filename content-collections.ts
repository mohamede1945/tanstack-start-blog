import { defineCollection, defineConfig } from "@content-collections/core";
import { remarkPlugins } from "@prose-ui/core";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import { remarkMarkAndUnravel } from "safe-mdx/parse";
import { z } from "zod";

const estimateReadingTime = (text: string): string => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const toCamelCase = (value: string) =>
  value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const normalizeStyleKey = (key: string) => {
  const trimmed = key.trim();
  if (!trimmed) return "";
  return toCamelCase(trimmed);
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

const toStyleObjectLiteral = (value: string) => {
  const entries = value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawKey, ...rest] = entry.split(":");
      const key = normalizeStyleKey(rawKey ?? "");
      const val = rest.join(":").trim();
      if (!key || !val) return null;
      return `${key}: ${JSON.stringify(val)}`;
    })
    .filter(Boolean);
  return entries.length ? `{ ${entries.join(", ")} }` : "";
};

const normalizeMdxContent = (content: string) => {
  const lines = content.split("\n");
  let inFence = false;
  return lines
    .map((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith("```")) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line
        .replace(/\sstyle="([^"]*)"/g, (_, styleValue: string) => {
          const objectLiteral = toStyleObjectLiteral(styleValue);
          return objectLiteral ? ` style={{${objectLiteral.slice(1, -1)}}}` : "";
        })
        .replace(/\bframeborder=/g, "frameBorder=")
        .replace(/\ballowfullscreen\b/g, "allowFullScreen");
    })
    .join("\n");
};

const mdxProcessor = remark()
  .use(remarkMdx)
  .use(remarkFrontmatter, ["yaml", "toml"])
  .use(remarkPlugins())
  .use(remarkMarkAndUnravel)
  .use(() => {
    return (tree, file) => {
      file.data.ast = tree;
    };
  });

const parseMdxAst = async (content: string): Promise<JsonValue> => {
  const file = await mdxProcessor.process(content);
  return JSON.parse(JSON.stringify(file.data.ast));
};

const posts = defineCollection({
  name: "posts",
  directory: "src/data/posts",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.iso.date(),
    tags: z.array(z.string()).optional().default([]),
    content: z.string(),
  }),
  transform: async (document) => {
    const content = normalizeMdxContent(document.content);
    const mdast = await parseMdxAst(content);
    const date = new Date(document.publishDate);
    const readingTime = estimateReadingTime(content);
    return {
      ...document,
      content,
      mdast,
      publishDate: formatDate(document.publishDate),
      date,
      readingTime,
    };
  },
});

const pages = defineCollection({
  name: "pages",
  directory: "src/data/pages",
  include: "**/*.{md,mdx}",
  schema: z.object({
    content: z.string(),
  }),
  transform: async (document) => {
    const content = normalizeMdxContent(document.content);
    const mdast = await parseMdxAst(content);
    return {
      ...document,
      content,
      mdast,
    };
  },
});

export default defineConfig({
  collections: [posts, pages],
});
