import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllWriteups, getWriteupSlugs } from "@/lib/writeups";
import { parseMarkdownFile } from "@/lib/markdown";

export function generateStaticParams() {
  return getWriteupSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getAllWriteups().find((w) => w.slug === slug);
  if (!writeup) return {};
  return {
    title: `${writeup.title} — rowconno`,
    description: writeup.description,
  };
}

const categoryColors: Record<string, string> = {
  "Binary Exploitation": "text-red-400 border-red-900",
  Web: "text-blue-400 border-blue-900",
  Crypto: "text-yellow-400 border-yellow-900",
  Forensics: "text-purple-400 border-purple-900",
};

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getAllWriteups().find((w) => w.slug === slug);
  if (!meta) notFound();

  const { html } = await parseMarkdownFile(`writeups/${slug}.md`);
  const catClass =
    categoryColors[meta.category] ?? "text-zinc-400 border-zinc-700";

  return (
    <article>
      <div className="mb-8">
        <Link
          href="/writeups/"
          className="font-mono text-xs text-zinc-500 hover:text-green-400 transition-colors"
        >
          ← writeups
        </Link>
      </div>

      <header className="mb-10 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className={`font-mono text-xs border rounded px-2 py-0.5 ${catClass}`}
          >
            {meta.category}
          </span>
          <time className="font-mono text-xs text-zinc-500">{meta.date}</time>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 leading-snug mb-4">
          {meta.title}
        </h1>
        <p className="text-zinc-400 leading-relaxed">{meta.description}</p>
      </header>

      <div
        className="prose prose-invert prose-zinc prose-a:text-green-400 prose-code:text-green-300 prose-headings:text-zinc-100 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
