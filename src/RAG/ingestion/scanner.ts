import { readdir } from "node:fs/promises";
import path from "node:path";

export interface SourceFile {
  path: string;
  relativePath: string;
  extension: string;
  size: number;
}

const SUPPORTED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".css",
  ".scss",
  ".html",
]);

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
]);

const IGNORED_FILES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  "bun.lock",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
]);

export async function scanRepository(
  repositoryPath: string
): Promise<SourceFile[]> {
  const files: SourceFile[] = [];

  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }

        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (IGNORED_FILES.has(entry.name)) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();

      if (!SUPPORTED_EXTENSIONS.has(extension)) {
        continue;
      }

      const stats = await Bun.file(fullPath).stat();

      files.push({
        path: fullPath,
        relativePath: path.relative(repositoryPath, fullPath),
        extension,
        size: stats.size,
      });
    }
  }

  await walk(repositoryPath);

  return files;
}