import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type OgMetadataEntry = {
  sourcePath: string;
  outputPath: string;
  title: string;
  hash: string;
  updatedAt: string;
};

type OgMetadata = {
  version: number;
  posts: Record<string, OgMetadataEntry>;
};

const root = process.cwd();
// Bump to force regeneration when the Remotion template or props contract changes.
const manifestVersion = 1;
const postsDir = path.join(root, "src", "data", "posts");
const outputDir = path.join(root, "public", "assets", "og");
const metadataPath = path.join(root, "og-metadata.json");
const remotionBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "remotion.cmd" : "remotion",
);

const toPosix = (value: string) => value.replace(/\\/g, "/");
const toRelative = (value: string) => toPosix(path.relative(root, value));

const fileExists = async (filePath: string) => {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

const hashContents = (contents: string) =>
  crypto.createHash("sha256").update(contents).digest("hex");

const parseTitle = (contents: string) => {
  const frontmatterMatch = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch?.[1]) {
    throw new Error("Missing frontmatter block in blog file.");
  }

  const frontmatterLines = frontmatterMatch[1].split(/\r?\n/);
  const titleLine = frontmatterLines.find((line) => line.trim().startsWith("title:"));

  if (!titleLine) {
    throw new Error("Missing title in frontmatter.");
  }

  let title = titleLine.replace(/^\s*title:\s*/, "").trim();
  if (
    (title.startsWith('"') && title.endsWith('"')) ||
    (title.startsWith("'") && title.endsWith("'"))
  ) {
    title = title.slice(1, -1);
  }

  return title;
};

const toPostKey = (filePath: string) => {
  const relative = toPosix(path.relative(postsDir, filePath));
  if (!relative || relative.startsWith("..")) {
    return path.basename(filePath, path.extname(filePath));
  }
  return relative.replace(/\.[^/.]+$/, "");
};

const collectPostFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPostFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && [".md", ".mdx"].includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const runRemotion = (title: string, outputPath: string) =>
  new Promise<void>((resolve, reject) => {
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
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Remotion exited with code ${code ?? "unknown"}.`));
    });

    child.on("error", (error) => {
      reject(error);
    });
  });

const runTrash = (filePath: string) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn("trash", [filePath], { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`trash exited with code ${code ?? "unknown"}.`));
    });

    child.on("error", (error) => {
      reject(error);
    });
  });

const readMetadata = async (): Promise<OgMetadata> => {
  if (!(await fileExists(metadataPath))) {
    return { version: manifestVersion, posts: {} };
  }

  try {
    const raw = await readFile(metadataPath, "utf8");
    const parsed = JSON.parse(raw) as OgMetadata;
    if (!parsed.posts) {
      return { version: manifestVersion, posts: {} };
    }
    return parsed;
  } catch (error) {
    console.warn(`Failed to read ${toRelative(metadataPath)}. Rebuilding metadata.`);
    console.warn(error);
    return { version: manifestVersion, posts: {} };
  }
};

const collectOutputFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectOutputFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && path.extname(entry.name) === ".webp") {
      files.push(fullPath);
    }
  }

  return files;
};

const removeStaleImages = async (expected: Set<string>) => {
  if (!(await fileExists(outputDir))) return;

  const files = await collectOutputFiles(outputDir);
  for (const filePath of files) {
    const relOutput = toPosix(path.relative(outputDir, filePath));
    if (expected.has(relOutput)) continue;

    console.log(`Removing stale OG image ${toRelative(filePath)}...`);
    await runTrash(filePath);
  }
};

await mkdir(outputDir, { recursive: true });

if (!(await fileExists(postsDir))) {
  console.error(`Posts directory not found: ${toRelative(postsDir)}.`);
  process.exit(1);
}

const postFiles = await collectPostFiles(postsDir);
if (postFiles.length === 0) {
  console.log("No posts found. Cleaning existing OG images.");
  await removeStaleImages(new Set());
  const nextMetadata: OgMetadata = { version: manifestVersion, posts: {} };
  await writeFile(metadataPath, `${JSON.stringify(nextMetadata, null, 2)}\n`, "utf8");
  console.log(`Saved OG metadata to ${toRelative(metadataPath)}.`);
  process.exit(0);
}

const previousMetadata = await readMetadata();
const nextPosts: Record<string, OgMetadataEntry> = {};
const now = new Date().toISOString();
const versionMismatch = previousMetadata.version !== manifestVersion;

for (const filePath of postFiles) {
  const contents = await readFile(filePath, "utf8");
  const title = parseTitle(contents);
  const hash = hashContents(contents);
  const postKey = toPostKey(filePath);
  const outputPath = path.join(outputDir, `${postKey}.webp`);
  const relSourcePath = toRelative(filePath);
  const relOutputPath = toRelative(outputPath);
  const previous = previousMetadata.posts?.[postKey];
  const outputExists = await fileExists(outputPath);

  const shouldRegenerate =
    versionMismatch ||
    !outputExists ||
    !previous ||
    previous.hash !== hash ||
    previous.title !== title ||
    previous.sourcePath !== relSourcePath ||
    previous.outputPath !== relOutputPath;

  if (shouldRegenerate) {
    console.log(`Generating OG image for ${relSourcePath}...`);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await runRemotion(title, outputPath);
  } else {
    console.log(`Skipping ${relSourcePath}, unchanged.`);
  }

  nextPosts[postKey] = {
    sourcePath: relSourcePath,
    outputPath: relOutputPath,
    title,
    hash,
    updatedAt: shouldRegenerate ? now : (previous.updatedAt ?? now),
  };
}

const sortedPosts: Record<string, OgMetadataEntry> = {};
for (const slug of Object.keys(nextPosts).sort()) {
  const entry = nextPosts[slug];
  if (!entry) continue;
  sortedPosts[slug] = entry;
}

const expectedOutputs = new Set(
  Object.values(sortedPosts).map((entry) =>
    toPosix(path.relative(outputDir, path.resolve(root, entry.outputPath))),
  ),
);
await removeStaleImages(expectedOutputs);

const nextMetadata: OgMetadata = {
  version: manifestVersion,
  posts: sortedPosts,
};

await writeFile(metadataPath, `${JSON.stringify(nextMetadata, null, 2)}\n`, "utf8");
console.log(`Saved OG metadata to ${toRelative(metadataPath)}.`);
