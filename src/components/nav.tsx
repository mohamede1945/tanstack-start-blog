import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "./theme-toggle-button";
import { Button } from "./ui/button";

const baseLink =
  "relative block px-2 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform";
const selectedLink = "text-foreground after:scale-x-100 after:bg-primary";
const unselectedLink =
  "text-muted-foreground hover:text-foreground hover:after:scale-x-100 hover:after:bg-muted-foreground";
const mobileBaseLink =
  "block w-full px-2 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] transition-colors";
const mobileSelectedLink = "text-foreground";
const mobileUnselectedLink = "text-muted-foreground hover:text-foreground";

const navItems = [
  { href: "/posts", label: "Posts", type: "route" },
  { href: "/about", label: "About", type: "route" },
] as const;

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string, type: (typeof navItems)[number]["type"]) =>
    cn(baseLink, type === "route" && isActive(href) ? selectedLink : unselectedLink);
  const mobileLinkClass = (href: string) =>
    cn(mobileBaseLink, isActive(href) ? mobileSelectedLink : mobileUnselectedLink);

  return (
    <nav className="ml-auto flex flex-1 flex-col items-end gap-2">
      <div className="flex w-full items-center justify-end gap-4">
        <div className="hidden items-center gap-4 min-[521px]:flex">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.type === "route" ? (
                <Link className={linkClass(item.href, item.type)} to={item.href}>
                  {item.label}
                </Link>
              ) : (
                <a className={linkClass(item.href, item.type)} href={item.href}>
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-border text-muted-foreground hover:text-foreground min-[521px]:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
        <div className="hidden min-[521px]:block">
          <ThemeToggleButton />
        </div>
      </div>
      {isOpen ? (
        <div className="w-full min-[521px]:hidden">
          <div className="mt-2 w-full divide-y divide-border/60 border-border/60 border-t">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.type === "route" ? (
                  <Link
                    className={mobileLinkClass(item.href)}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    className={mobileLinkClass(item.href)}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
            <div className="px-2 py-3">
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
