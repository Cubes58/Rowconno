import Link from "next/link";
import { getAllWriteups } from "@/lib/writeups";

export const metadata = {
  title: "writeups — rowconno",
  description: "CTF writeups and security research notes.",
};

const categoryColors: Record<string, string> = {
  "Binary Exploitation": "text-red-400 border-red-900",
  Web: "text-blue-400 border-blue-900",
  Crypto: "text-yellow-400 border-yellow-900",
  Forensics: "text-purple-400 border-purple-900",
};

function categoryClass(cat: string) {
  return categoryColors[cat] ?? "text-zinc-400 border-zinc-700";
}

export default function WriteupListPage() {
  const writeups = getAllWriteups();

  return (
    <div className="space-y-10">
      <section>
        <p className="font-mono text-green-400 text-sm mb-2">ls ./writeups</p>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Writeups</h1>
        <p className="text-zinc-400 text-sm">
          CTF solutions, vulnerability analyses, and technique deep-dives.
        </p>
      </section>

      <ul className="space-y-4">
        {writeups.map((w) => (
          <li key={w.slug}>
            <Link
              href={`/writeups/${w.slug}/`}
              className="block border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h2 className="font-semibold text-zinc-200 group-hover:text-green-400 transition-colors leading-snug">
                  {w.title}
                </h2>
                <time className="font-mono text-xs text-zinc-500 shrink-0 pt-0.5">
                  {w.date}
                </time>
              </div>
              <div className="mt-2">
                <span
                  className={`font-mono text-xs border rounded px-2 py-0.5 ${categoryClass(w.category)}`}
                >
                  {w.category}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                {w.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
