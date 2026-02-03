import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ColumnPreset = "contentSidebarSm" | "contentSidebarMd" | "contentSidebarLg";

type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: ColumnPreset;
  align?: "start" | "center";
  gap?: "sm" | "md" | "lg";
};

const columnClasses: Record<ColumnPreset, string> = {
  contentSidebarSm: "lg:grid-cols-[minmax(0,1fr)_200px]",
  contentSidebarMd: "lg:grid-cols-[minmax(0,1fr)_240px]",
  contentSidebarLg: "lg:grid-cols-[minmax(0,1fr)_320px]",
};

const gapClasses: Record<NonNullable<GridProps["gap"]>, string> = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function Grid({
  columns = "contentSidebarMd",
  align = "start",
  gap = "lg",
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "mdx-grid grid",
        gapClasses[gap],
        columnClasses[columns],
        align === "center" ? "lg:items-center" : "lg:items-start",
        className,
      )}
      {...props}
    />
  );
}

type GridCellProps = HTMLAttributes<HTMLDivElement>;

export function GridCell({ className, ...props }: GridCellProps) {
  return <div className={cn("mdx-grid-cell", className)} {...props} />;
}
