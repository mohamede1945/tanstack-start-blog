import { Link } from "@tanstack/react-router";
import type { Post } from "content-collections";
import { Stack } from "./stack";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

type PostListProps = {
  posts: Post[];
  emptyMessage?: string;
};

export function PostList({ posts, emptyMessage }: PostListProps) {
  const postCount = posts.length;

  return (
    <Stack gap="lg">
      {postCount === 0 && emptyMessage ? (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      ) : null}
      {posts.map((post) => {
        return (
          <Link
            key={post._meta.path}
            className="group block focus-visible:outline-none"
            to="/posts/$"
            params={{ _splat: post._meta.path }}
          >
            <Card className="transition-transform duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
              <CardHeader className="gap-3">
                <CardTitle className="text-2xl transition-colors group-hover:text-primary">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-base">{post.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-3 border-foreground/5 border-t pt-4 text-[0.7rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-semibold uppercase tracking-[0.18em]">
                  <span>{post.publishDate}</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span>{post.readingTime}</span>
                </div>
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 font-semibold text-foreground/80 uppercase tracking-[0.2em] transition-colors group-hover:border-primary/40 group-hover:text-primary sm:self-auto">
                  Read post
                </span>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </Stack>
  );
}
