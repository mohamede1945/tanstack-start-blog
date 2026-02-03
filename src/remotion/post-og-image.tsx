import { Sparkles } from "lucide-react";
import { useCallback, useMemo } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const siteName = "TanStack Start Blog";
const siteDomain = "template.mafifi.dev";
const authorName = "Mohamed Afifi";
const authorDomain = "mafifi.dev";
const coverImage = "assets/mohamed.webp";

export interface BlogOgImageProps {
  title?: string;
}

export const BlogOgImage = ({ title }: BlogOgImageProps) => {
  const resolvedTitle = title ?? "Ship a TanStack Start blog in hours, not weeks.";
  const canvasWidth = 1200;
  const canvasHeight = 630;
  const padding = 72;
  const leftColumnWidth = 280;
  const columnGap = 56;
  const titleAreaWidth = canvasWidth - padding * 2 - leftColumnWidth - columnGap;
  const titleAreaHeight = canvasHeight - padding * 2 - 80;
  const titleLineHeight = 1.05;
  const titleMaxLines = 4;
  const baseTitleMaxSize = 100;
  const baseTitleMinSize = 52;

  const measureTextWidth = useCallback((text: string, font: string, size: number) => {
    if (typeof document === "undefined") {
      return text.length * size * 0.55;
    }
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return text.length * size * 0.55;
    context.font = font;
    return context.measureText(text).width;
  }, []);

  const wrapText = useCallback(
    (text: string, fontSize: number, maxWidth: number) => {
      const font = `600 ${fontSize}px "Space Grotesk Variable", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu`;
      const words = text.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let currentLine = "";
      let hasOverflowWord = false;

      const pushLine = () => {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
      };

      for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (measureTextWidth(candidate, font, fontSize) <= maxWidth) {
          currentLine = candidate;
          continue;
        }

        pushLine();

        if (measureTextWidth(word, font, fontSize) <= maxWidth) {
          currentLine = word;
          continue;
        }

        hasOverflowWord = true;
        currentLine = word;
      }

      pushLine();
      return { lines, hasOverflowWord };
    },
    [measureTextWidth],
  );

  const { titleFontSize, titleLines } = useMemo(() => {
    const titleLength = resolvedTitle.length;
    const minSizeCap = titleLength > 140 ? 48 : titleLength > 120 ? 50 : baseTitleMinSize;
    const maxSizeCap = titleLength > 140 ? 84 : titleLength > 120 ? 96 : baseTitleMaxSize;
    let bestSize = minSizeCap;
    let bestLines = wrapText(resolvedTitle, minSizeCap, titleAreaWidth).lines;
    let low = minSizeCap;
    let high = Math.min(baseTitleMaxSize, maxSizeCap);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const { lines, hasOverflowWord } = wrapText(resolvedTitle, mid, titleAreaWidth);
      const height = lines.length * mid * titleLineHeight;
      const fits = lines.length <= titleMaxLines && height <= titleAreaHeight && !hasOverflowWord;
      if (fits) {
        bestSize = mid;
        bestLines = lines;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return { titleFontSize: bestSize, titleLines: bestLines };
  }, [resolvedTitle, titleAreaHeight, titleAreaWidth, wrapText]);

  return (
    <AbsoluteFill className="relative bg-background font-sans text-foreground">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute -top-24 -right-28 h-[320px] w-[320px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-[260px] w-[260px] rounded-full bg-muted/50 blur-3xl" />
      </div>

      <div className="relative flex h-full w-full items-center px-[72px]">
        <div className="flex h-full w-full gap-[56px]">
          <div className="flex w-[280px] flex-col justify-between py-[72px]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                <Sparkles className="h-3 w-3 text-primary" />
                Template
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-2xl text-foreground">{siteName}</div>
                <div className="text-muted-foreground text-sm">{siteDomain}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-[72px] w-[72px]">
                <div className="absolute inset-0 rounded-2xl bg-primary/15" />
                <div className="absolute inset-2 overflow-hidden rounded-xl bg-background">
                  <Img src={staticFile(coverImage)} className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                <div className="font-semibold text-foreground">By {authorName}</div>
                <div>{authorDomain}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center py-[72px]">
            <div className="max-w-[640px]">
              <h1
                className="font-semibold text-foreground tracking-[-0.04em]"
                style={{
                  fontSize: titleFontSize,
                  lineHeight: titleLineHeight,
                  whiteSpace: "pre-line",
                }}
              >
                {titleLines.join("\n")}
              </h1>
            </div>
            <div className="mt-8 h-[2px] w-[140px] rounded-full bg-primary/70" />
            <div className="mt-6 text-muted-foreground text-sm">
              A starter built for fast publishing and clean SEO.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
