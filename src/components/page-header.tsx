import type { HTMLAttributes } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  meta?: string;
  align?: "left" | "center";
};

const alignClass: Record<NonNullable<PageHeaderProps["align"]>, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
};

export function PageHeader({
  title,
  description,
  meta,
  align = "left",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", alignClass[align], className)} {...props}>
      {meta ? (
        <Badge
          variant="secondary"
          className="font-semibold text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]"
        >
          {meta}
        </Badge>
      ) : null}
      <h1 className="font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">{title}</h1>
      {description ? (
        <p className="text-base text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
