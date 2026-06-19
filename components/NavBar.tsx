"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "about" },
  { href: "/writeups/", label: "writeups" },
  { href: "/resume/", label: "resume / curriculum vitae" },
];

export default function NavBar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-green-400 font-semibold tracking-tight hover:text-green-300 transition-colors"
        >
          ~/rowconno
        </Link>
        <ul className="flex gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-mono text-sm transition-colors ${
                  isActive(href)
                    ? "text-green-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {isActive(href) ? `[${label}]` : label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
