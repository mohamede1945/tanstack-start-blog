# tanstack-start-blog

## repo
- TanStack Start + Cloudflare Workers blog
- Shadcn components + Tailwind v4
- Prose UI for rich content rendering
- Content collections for Markdown + frontmatter + mdast
- safe-mdx renderer (Cloudflare Workers compatible)
- scripts/generate-rss.ts generates RSS (used by dev/build)
- Newsletter signup via Loops (env: LOOPS_API_KEY, LOOPS_MAILING_LIST_NEWSLETTER)

## structure
- src/routes/: app routes (file-based)
- src/components/: shared UI
- src/data/posts/: Markdown posts
- src/data/pages/: Markdown/MDX pages (not blog posts)
- src/remotion/: Remotion OG compositions
- public/: static assets

## commands (npm)
- dev: generate RSS + Vite dev server (localhost:5173)
- build: generate RSS + Vite build
- preview: Vite preview
- deploy: Wrangler deploy
- typecheck: tsgo -b
- lint: biome + oxlint
- lint:deep: lint + oxlint type-aware + eslint
- lint:fix: biome write + oxlint fix
- lint:changed: biome changed
- lint:staged: biome staged
- clean: tsgo -b --clean
- og:social: render public/assets/social.webp via Remotion
- og:post: render post OG from MD/MDX title into public/assets/og/<slug>.webp
- og:all-posts: render post OG images incrementally into public/assets/og/ (manifest: og-metadata.json; bump manifestVersion in scripts/generate-all-post-og.ts when template changes)

IMPORTANT: Whenever you update `post-og-image.tsx` file or its deps, bump `manifestVersion` in scripts/generate-all-post-og.ts before running `og:all-posts` to regenerate all post social images.
