import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Link {
  label: string;
  href: string;
}

interface SkillGroup {
  category: string;
  items: string[];
}

interface AboutFrontmatter {
  bio: string;
  links: Link[];
  skills: SkillGroup[];
  contact: { email: string };
}

export const metadata = {
  title: "rowconno",
  description: "Security researcher. CTF player. Writeups and projects.",
};

export default function AboutPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "about.md"),
    "utf-8"
  );
  const { data } = matter(raw);
  const { bio, links, skills, contact } = data as AboutFrontmatter;

  return (
    <div className="space-y-12">
      {/* Bio */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-2">whoami</p>
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">rowconno</h1>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">{bio}</p>
      </section>

      {/* Links */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-3">links</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {links.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between font-mono text-sm text-zinc-400 hover:text-green-400 transition-colors border border-zinc-800 hover:border-green-900 rounded px-3 py-2"
              >
                {label}
                <span className="text-zinc-600 group-hover:text-green-600">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
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

      {/* Contact */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-3">contact</p>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-2 font-mono text-sm text-zinc-400 hover:text-green-400 transition-colors border border-zinc-800 hover:border-green-900 rounded px-3 py-2"
        >
          {contact.email}
        </a>
      </section>
    </div>
  );
}
