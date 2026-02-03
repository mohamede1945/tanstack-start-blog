import type { Post } from "content-collections";
import { PageHeader } from "./page-header";
import { PostList } from "./post-list";
import { Stack } from "./stack";

type PostListSectionProps = {
  title: string;
  description?: string;
  meta?: string;
  posts: Post[];
  emptyMessage?: string;
};

export function PostListSection({
  title,
  description,
  meta,
  posts,
  emptyMessage,
}: PostListSectionProps) {
  return (
    <Stack gap="lg">
      <PageHeader title={title} description={description} meta={meta} />
      <PostList posts={posts} emptyMessage={emptyMessage} />
    </Stack>
  );
}
