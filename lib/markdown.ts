import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

const contentDir = path.join(process.cwd(), "content");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function rehypeRebaseImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img" && typeof node.properties?.src === "string") {
        if (node.properties.src.startsWith("/")) {
          node.properties.src = basePath + node.properties.src;
        }
      }
    });
  };
}

export async function parseMarkdownFile(relativePath: string) {
  const fullPath = path.join(contentDir, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeRebaseImages)
    .use(rehypeStringify)
    .process(content);

  return {
    frontmatter: data,
    html: String(result),
  };
}
