import { parseMarkdownFile } from "@/lib/markdown";

export const metadata = {
  title: "resume — rowconno",
  description: "Professional experience, certifications, and education.",
};

export default async function ResumePage() {
  const { html } = await parseMarkdownFile("resume.md");
  return (
    <div
      className="prose prose-invert prose-zinc prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline prose-code:text-green-300 prose-headings:text-zinc-100 max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
