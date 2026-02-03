import { Sparkles } from "lucide-react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const authorName = "Mohamed Afifi";
const coverImage = "assets/mohamed.webp";

export const SocialImage = () => {
  return (
    <AbsoluteFill className="relative bg-background font-sans text-foreground">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute -top-28 -right-28 h-[320px] w-[320px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-[280px] w-[280px] rounded-full bg-muted/50 blur-3xl" />
      </div>

      <div className="relative flex h-full w-full items-center justify-between px-[88px]">
        <div className="max-w-[600px] space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
            <Sparkles className="h-3 w-3 text-primary" />
            Template
          </div>
          <h1 className="font-semibold text-[76px] leading-[1.02] tracking-[-0.035em]">
            TanStack Start Blog
          </h1>
          <p className="text-muted-foreground text-sm">By {authorName}</p>
          <p className="text-[28px] text-muted-foreground leading-[1.3]">
            MDX, Prose UI, content collections, and Cloudflare Workers-ready.
          </p>
        </div>

        <div className="relative h-[360px] w-[360px]">
          <div className="absolute inset-0 rounded-[56px] bg-primary/20" />
          <div className="absolute inset-4 overflow-hidden rounded-[44px] border border-border/60 bg-background">
            <Img src={staticFile(coverImage)} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-12 -left-10 w-[230px] rounded-[28px] border border-border/60 bg-background/90 p-5">
            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              OG ready
            </div>
            <div className="mt-2 font-semibold text-foreground text-sm">By {authorName}</div>
            <div className="text-muted-foreground text-xs">Remotion templates</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
