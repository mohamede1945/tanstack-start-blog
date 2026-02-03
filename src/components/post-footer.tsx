import { ChevronUp } from "lucide-react";
import iconBlueSky from "@/assets/icons/IconBlueSky.svg";
import iconBrandX from "@/assets/icons/IconBrandX.svg";
import iconFacebook from "@/assets/icons/IconFacebook.svg";
import iconLinkedIn from "@/assets/icons/IconLinkedin.svg";
import iconMail from "@/assets/icons/IconMail.svg";
import iconPinterest from "@/assets/icons/IconPinterest.svg";
import iconTelegram from "@/assets/icons/IconTelegram.svg";
import iconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import { Button } from "@/components/ui/button";

type PostFooterProps = {
  tags?: string[];
  title: string;
  url: string;
};

const buildShareLinks = (title: string, url: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} ${url}`);

  return [
    {
      label: "X",
      icon: iconBrandX,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Bluesky",
      icon: iconBlueSky,
      href: `https://bsky.app/intent/compose?text=${encodedText}`,
    },
    {
      label: "LinkedIn",
      icon: iconLinkedIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      icon: iconWhatsapp,
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
    },
    {
      label: "Facebook",
      icon: iconFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Telegram",
      icon: iconTelegram,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Pinterest",
      icon: iconPinterest,
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    {
      label: "Email",
      icon: iconMail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
    },
  ];
};

export function PostFooter({ tags = [], title, url }: PostFooterProps) {
  const shareLinks = buildShareLinks(title, url);

  return (
    <div className="flex flex-col gap-8">
      {tags.length ? (
        <div className="flex flex-wrap items-center gap-3 font-medium text-foreground text-sm">
          {tags.map((tag) => (
            <a
              key={tag}
              className="underline decoration-border/70 decoration-dotted underline-offset-4 transition-colors hover:text-foreground/70"
              href={`/tags/${encodeURIComponent(tag)}`}
            >
              # {tag}
            </a>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-sm italic">Share this post on:</span>
          <div className="flex flex-wrap items-center gap-4">
            {shareLinks.map((share) => (
              <Button
                key={share.label}
                render={(props) => (
                  <a href={share.href} target="_blank" rel="noopener noreferrer" {...props}>
                    {props.children}
                  </a>
                )}
                nativeButton={false}
                variant="ghost"
                size="icon-xs"
                className="transition-opacity hover:bg-transparent hover:opacity-70"
                aria-label={`Share on ${share.label}`}
              >
                <img className="h-6 w-6 dark:brightness-0 dark:invert" src={share.icon} alt="" />
              </Button>
            ))}
          </div>
        </div>
        <Button
          render={(props) => (
            <a href="#top" {...props}>
              {props.children}
            </a>
          )}
          nativeButton={false}
          variant="ghost"
          className="h-auto gap-2 px-0 text-foreground hover:bg-transparent hover:text-foreground/70"
        >
          <ChevronUp className="size-6" />
          <span>Back to Top</span>
        </Button>
      </div>
    </div>
  );
}
