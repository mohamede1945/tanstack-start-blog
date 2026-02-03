import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inputPath = process.argv[2];
const postsDir = path.join(root, "src", "data", "posts");

if (!inputPath) {
  console.error("Usage: npm run og:post -- <path-to-md-or-mdx>");
  process.exit(1);
}

const resolvedPath = path.resolve(root, inputPath);
const fileContents = await readFile(resolvedPath, "utf8");
const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);

if (!frontmatterMatch) {
  console.error("Missing frontmatter block in blog file.");
  process.exit(1);
}

if (!frontmatterMatch[1]) {
  console.error("Missing frontmatter block in blog file.");
  process.exit(1);
}

const frontmatterLines = frontmatterMatch[1].split("\n");
const titleLine = frontmatterLines.find((line) => line.trim().startsWith("title:"));

if (!titleLine) {
  console.error("Missing title in frontmatter.");
  process.exit(1);
}

let title = titleLine.replace(/^\s*title:\s*/, "").trim();
if (
  (title.startsWith('"') && title.endsWith('"')) ||
  (title.startsWith("'") && title.endsWith("'"))
) {
  title = title.slice(1, -1);
}

const slug = path.basename(resolvedPath, path.extname(resolvedPath));
const outputDir = path.join(root, "public", "assets", "og");
const relative = path.relative(postsDir, resolvedPath);
const slugPath = relative.startsWith("..")
  ? slug
  : relative.replace(/\.[^/.]+$/, "").replace(/\\/g, "/");
const outputPath = path.join(outputDir, `${slugPath}.webp`);

await mkdir(path.dirname(outputPath), { recursive: true });

const remotionBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "remotion.cmd" : "remotion",
);

const args = [
  "still",
  "src/remotion/index.tsx",
  "blog-og",
  outputPath,
  "--image-format=webp",
  "--props",
  JSON.stringify({ title }),
];

const child = spawn(remotionBin, args, { stdio: "inherit" });
child.on("exit", (code) => {
  process.exit(code ?? 1);
});
