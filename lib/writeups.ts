import fs from "fs";
import path from "path";
import matter from "gray-matter";

const writeupsDir = path.join(process.cwd(), "content", "writeups");

export interface WriteupMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
}

export function getAllWriteups(): WriteupMeta[] {
  return fs
    .readdirSync(writeupsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = path.basename(file, ".md");
      const { data } = matter(
        fs.readFileSync(path.join(writeupsDir, file), "utf-8")
      );
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        category: data.category as string,
        description: data.description as string,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getWriteupSlugs(): string[] {
  return fs
    .readdirSync(writeupsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.basename(f, ".md"));
}
