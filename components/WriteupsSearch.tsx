"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { WriteupMeta } from "@/lib/writeups";

const categoryColors: Record<string, string> = {
  "Binary Exploitation": "text-red-400 border-red-900",
  Web: "text-blue-400 border-blue-900",
  Crypto: "text-yellow-400 border-yellow-900",
  Forensics: "text-purple-400 border-purple-900",
};

function categoryClass(cat: string) {
  return categoryColors[cat] ?? "text-zinc-400 border-zinc-700";
}

const categoryActive: Record<string, string> = {
  "Binary Exploitation": "bg-red-950 text-red-300 border-red-800",
  Web: "bg-blue-950 text-blue-300 border-blue-800",
  Crypto: "bg-yellow-950 text-yellow-300 border-yellow-800",
  Forensics: "bg-purple-950 text-purple-300 border-purple-800",
};

function categoryActiveClass(cat: string) {
  return categoryActive[cat] ?? "bg-zinc-800 text-zinc-200 border-zinc-600";
}

export default function WriteupsSearch({
  writeups,
}: {
  writeups: WriteupMeta[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(writeups.map((w) => w.category))),
    [writeups]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return writeups.filter((w) => {
      const matchesQuery = q === "" || w.title.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === null || w.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [writeups, query, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-green-500 text-sm pointer-events-none">
          &gt;_
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search writeups..."
          className="w-full bg-zinc-900 border border-zinc-700 focus:border-green-700 focus:outline-none rounded px-10 py-2.5 font-mono text-sm text-zinc-200 placeholder-zinc-600 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 font-mono text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`font-mono text-xs border rounded px-2.5 py-1 transition-colors ${
            activeCategory === null
              ? "bg-zinc-800 text-zinc-200 border-zinc-600"
              : "text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
          }`}
        >
          all
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`font-mono text-xs border rounded px-2.5 py-1 transition-colors ${
              activeCategory === cat
                ? categoryActiveClass(cat)
                : `${categoryClass(cat)} hover:opacity-80`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-zinc-500">no results found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((w) => (
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
      )}
    </div>
  );
}
