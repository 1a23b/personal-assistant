import { readdir } from "node:fs/promises";
import { stat, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const roots = ["src/assets", "public"].map((dir) => join(process.cwd(), dir));
const exts = new Set([".png", ".jpg", ".jpeg"]);

const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const compressFile = async (filePath) => {
  const lower = filePath.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));
  if (!exts.has(ext)) {
    return;
  }
  const input = await readFile(filePath);
  let output;
  if (ext === ".png") {
    output = await sharp(input)
      .png({ quality: 80, compressionLevel: 9, adaptiveFiltering: true, palette: true })
      .toBuffer();
  } else if (ext !== ".webp") {
    output = await sharp(input).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  }
  if (output) {
    await writeFile(filePath, output);
  }
  if (filePath.includes(join("src", "assets", "background"))) {
    const avifPath = filePath.replace(/\.(png|jpg|jpeg)$/i, ".avif");
    const avif = await sharp(input).avif({ quality: 50, effort: 7 }).toBuffer();
    await writeFile(avifPath, avif);
  }
};

const walk = async (dir) => {
  if (!(await exists(dir))) {
    return;
  }
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        return;
      }
      if (entry.isFile()) {
        await compressFile(fullPath);
      }
    })
  );
};

const run = async () => {
  for (const root of roots) {
    await walk(root);
  }
};

await run();
