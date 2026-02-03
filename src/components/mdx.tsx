import { createMdxComponents } from "@prose-ui/react";
import type { ComponentProps } from "react";
import { SafeMdxRenderer } from "safe-mdx";
import { Grid, GridCell } from "@/components/grid";

export const mdxComponents = {
  ...createMdxComponents(),
  GridCell,
  Grid,
};

type SafeMdxAst = ComponentProps<typeof SafeMdxRenderer>["mdast"];

export const MDX = ({ markdown, mdast }: { markdown: string; mdast: unknown }) => {
  return (
    <article className="prose-ui wrap-break-word hyphens-auto">
      <SafeMdxRenderer markdown={markdown} mdast={mdast as SafeMdxAst} components={mdxComponents} />
    </article>
  );
};
