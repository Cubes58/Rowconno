import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const contentDir = path.join(process.cwd(), "content");

export async function parseMarkdownFile(relativePath: string) {
  const fullPath = path.join(contentDir, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(content);

  return {
    frontmatter: data,
    html: String(result),
  };
}
