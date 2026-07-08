const fs = require("fs");
const path = require("path");

/*
 * Directories to exclude completely.
 * Leave empty if you want to scan everything.
 */
const EXCLUDED_DIRS = new Set([
//   "node_modules",
//   ".next",
//   ".git",
//   "graphify-out",
//   "dist",
//   "build",
//   "documents",
//   "coverage",
//   ".vercel",
//   "out",
//   "public",
//   "documents",
//   "assets",
//   "android",
//   ".expo"
]);

/*
 * Specific files to exclude.
 * Leave empty if you want to scan everything.
 */
const EXCLUDED_FILES = new Set([
//   "package-lock.json",
//   "package.json",
//   "next-env.d.ts",
//   "next.config.ts",
//   "tsconfig.json",
//   "components.json",
//   "README.md",
//   "AGENTS.md",
//   "AUDIT.md",
//   "CLAUDE.md",
//   "improvement.md",
//   "index.ts",
//   "app.json",
//   "eas.json",
//   ".gitignore",
//   "linecount.js",
//   "replace-png.js",
//   "resize-images.js",
//   "subset-fonts.js",
//   "convert-to-avif.js",
//   "manifest.json",
//   "design.md"
]);

/*
 * Exclude paths anywhere in the project.
 * Useful for nested folders.
 *
 * Examples:
 * "components/icons"
 * "src/generated"
 * "app/api/generated"
 */
const EXCLUDED_PATHS = [
//   "components/icons",
//   "src/generated"
];

/*
 * Allowed extensions.
 *
 * If EMPTY => scans ALL files.
 *
 * Examples:
 * ".js"
 * ".ts"
 * ".tsx"
 */
const ALLOWED_EXTENSIONS = new Set([
//   ".js",
//   ".jsx",
//   ".ts",
//   ".tsx",
//   ".css",
//   ".scss",
//   ".html",
//   ".json",
]);

let totalFiles = 0;
let totalLines = 0;
let totalWords = 0;
let totalChars = 0;

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  const lines = content.split(/\r?\n/).length;

  const words =
    content.match(/\S+/g)?.length || 0;

  const chars = content.length;

  return {
    lines,
    words,
    chars
  };
}

function shouldSkipPath(fullPath) {
  const normalized = fullPath.replace(/\\/g, "/");

  return EXCLUDED_PATHS.some(excluded =>
    normalized.includes(excluded)
  );
}

function scanDirectory(dir) {
  let entries;

  try {
    entries = fs.readdirSync(dir, {
      withFileTypes: true
    });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (shouldSkipPath(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) {
        continue;
      }

      scanDirectory(fullPath);
      continue;
    }

    if (EXCLUDED_FILES.has(entry.name)) {
      continue;
    }

    const ext = path.extname(entry.name);

    /*
     * If ALLOWED_EXTENSIONS is empty,
     * scan every file.
     */
    if (
      ALLOWED_EXTENSIONS.size > 0 &&
      !ALLOWED_EXTENSIONS.has(ext)
    ) {
      continue;
    }

    try {
      const stats = analyzeFile(fullPath);

      totalFiles++;
      totalLines += stats.lines;
      totalWords += stats.words;
      totalChars += stats.chars;

      console.log(
        `${stats.lines
          .toString()
          .padStart(8)} lines | ${stats.words
          .toString()
          .padStart(8)} words | ${stats.chars
          .toString()
          .padStart(10)} chars | ${fullPath}`
      );
    } catch (err) {
      console.log(`Skipped: ${fullPath}`);
    }
  }
}

const targetDir = process.argv[2] || ".";

console.log(`\nScanning: ${path.resolve(targetDir)}\n`);

scanDirectory(targetDir);

console.log("\n================================================");
console.log(`Files      : ${totalFiles.toLocaleString()}`);
console.log(`Lines      : ${totalLines.toLocaleString()}`);
console.log(`Words      : ${totalWords.toLocaleString()}`);
console.log(`Characters : ${totalChars.toLocaleString()}`);
console.log("================================================");