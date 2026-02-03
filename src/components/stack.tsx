import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type StackSize = "sm" | "md" | "lg";

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: StackSize;
};

const gapClass: Record<StackSize, string> = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-10",
};

export function Stack({ className, gap = "md", ...props }: StackProps) {
  return <div className={cn("flex flex-col", gapClass[gap], className)} {...props} />;
}
