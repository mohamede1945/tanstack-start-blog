import iconBlueSky from "@/assets/icons/IconBlueSky.svg";
import iconBrandX from "@/assets/icons/IconBrandX.svg";
import iconGitHub from "@/assets/icons/IconGitHub.svg";
import iconLinkedIn from "@/assets/icons/IconLinkedin.svg";
import iconMail from "@/assets/icons/IconMail.svg";
import iconRss from "@/assets/icons/IconRss.svg";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Button } from "@/components/ui/button";

export function Footer() {
  const year = new Date().getFullYear();
  const newsletterEnabled = import.meta.env.VITE_NEWSLETTER_ENABLED !== "false";
  const icons = [
    { href: "https://github.com/mohamede1945", label: "GitHub", icon: iconGitHub },
    { href: "https://x.com/mohamede1945", label: "X", icon: iconBrandX },
    {
      href: "https://bsky.app/profile/mohamede1945.bsky.social",
      label: "Bluesky",
      icon: iconBlueSky,
    },
    { href: "https://www.linkedin.com/in/mohamede1945", label: "LinkedIn", icon: iconLinkedIn },
    { href: "mailto:me@mafifi.dev", label: "Email", icon: iconMail },
    { href: "/rss.xml", label: "RSS", icon: iconRss },
  ];
  const socialLinks = (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {icons.map((icon) => (
        <Button
          key={icon.label}
          render={(props) => (
            <a
              href={icon.href}
              target={icon.href.startsWith("http") ? "_blank" : undefined}
              rel={icon.href.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {props.children}
            </a>
          )}
          nativeButton={false}
          variant="ghost"
          size="icon-xs"
          className="hover:bg-transparent hover:opacity-70"
          aria-label={icon.label}
        >
          <img className="h-5 w-5 dark:brightness-0 dark:invert" src={icon.icon} alt="" />
        </Button>
      ))}
    </div>
  );

  return (
    <footer className="w-full border-border/60 border-t py-10 text-muted-foreground text-sm">
      <div className="flex flex-col gap-8">
        {newsletterEnabled ? (
          <div id="subscribe" className="space-y-3">
            <p className="font-semibold text-foreground text-sm">
              New posts, templates, and launch notes
            </p>
            <NewsletterSignup aside={socialLinks} />
            <p className="text-xs">One email when you publish. No spam.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-semibold text-foreground text-sm">Stay in the loop</p>
            {socialLinks}
          </div>
        )}
        <div className="flex flex-col gap-2 border-border/60 border-t pt-6 text-xs">
          <p>&copy; {year} TanStack Start Blog</p>
        </div>
      </div>
    </footer>
  );
}
