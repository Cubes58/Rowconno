import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parseMarkdownFile } from "@/lib/markdown";

interface SkillGroup {
  category: string;
  items: string[];
}

export const metadata = {
  title: "resume — rowconno",
  description: "Professional experience, certifications, and education.",
};

export default async function ResumePage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "resume.md"),
    "utf-8"
  );
  const { data } = matter(raw);
  const skills = (data.skills ?? []) as SkillGroup[];

  const { html } = await parseMarkdownFile("resume.md");

  return (
    <div className="space-y-10">
      <p className="font-mono text-green-400 text-sm">history</p>

      <div
        className="prose prose-invert prose-zinc prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline prose-code:text-green-300 prose-headings:text-zinc-100 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Skills — two-column grid */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-4">skills</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map(({ category, items }) => (
            <div key={category}>
              <h3 className="font-mono text-zinc-300 text-sm font-semibold mb-2">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <span className="text-green-500">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
