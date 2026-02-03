import { allPosts, type Post } from "content-collections";

export async function getAllPosts(): Promise<Post[]> {
  return [...allPosts].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPostByPath(path: string): Promise<Post | null> {
  const match = allPosts.find((post) => post._meta.path === path);
  if (!match) return null;
  return match;
}
