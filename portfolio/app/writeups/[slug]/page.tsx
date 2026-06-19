import { notFound } from "next/navigation";
import Link from "next/link";
import { writeups, getWriteup, type WriteupSection } from "@/lib/writeups";

export function generateStaticParams() {
  return writeups.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) return {};
  return {
    title: `${writeup.title} — rowconno`,
    description: writeup.description,
  };
}

function Section({ section }: { section: WriteupSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">
          {section.content as string}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="text-base font-semibold text-zinc-200 mt-6 mb-2">
          {section.content as string}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-zinc-400 leading-relaxed">{section.content as string}</p>
      );
    case "code":
      return (
        <div className="my-4">
          {section.language && (
            <div className="font-mono text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 border-b-0 rounded-t px-4 py-1.5">
              {section.language}
            </div>
          )}
          <pre className="bg-zinc-900 border border-zinc-800 rounded-b p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
            <code>{section.content as string}</code>
          </pre>
        </div>
      );
    case "list":
      return (
        <ul className="space-y-2 my-4">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-green-500 mt-0.5 shrink-0">›</span>
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) notFound();

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
          <span className="font-mono text-xs text-green-500 border border-green-900 rounded px-2 py-0.5">
            {writeup.category}
          </span>
          <time className="font-mono text-xs text-zinc-500">{writeup.date}</time>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 leading-snug mb-4">
          {writeup.title}
        </h1>
        <p className="text-zinc-400 leading-relaxed">{writeup.description}</p>
      </header>

      <div className="space-y-4">
        {writeup.sections.map((section, i) => (
          <Section key={i} section={section} />
        ))}
      </div>
    </article>
  );
}
