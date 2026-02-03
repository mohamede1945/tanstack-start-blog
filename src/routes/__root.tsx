import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { buildSeoMeta } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      ...buildSeoMeta({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        image: `${SITE_URL}/assets/social.webp`,
        url: SITE_URL,
      }),
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "sitemap", href: "/sitemap-index.xml" },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: SITE_TITLE,
        href: "/rss.xml",
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
          <Header />
          <main className="relative box-border flex w-full flex-1 flex-col py-4">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
