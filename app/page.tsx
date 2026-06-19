const skills = [
  { category: "Exploitation", items: ["Binary Exploitation", "ROP Chains", "Heap Exploitation", "Format Strings"] },
  { category: "Web", items: ["SQL Injection", "XSS", "SSRF", "Deserialization"] },
  { category: "Reverse Engineering", items: ["Ghidra", "IDA Pro", "GDB / pwndbg", "angr"] },
  { category: "Tools", items: ["pwntools", "Burp Suite", "Wireshark", "Metasploit"] },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-2">whoami</p>
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">rowconno</h1>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          Security consultant and CTF player focused on binary exploitation and web
          application security. I work on offensive security assessments and write
          up interesting techniques I encounter in competitions and research.
        </p>
      </section>

      {/* Links */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-3">links</p>
        <ul className="flex flex-wrap gap-4">
          {[
            { label: "GitHub", href: "https://github.com/rowconno" },
            { label: "Twitter / X", href: "https://twitter.com/rowconno" },
            { label: "CTFtime", href: "https://ctftime.org" },
          ].map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-zinc-400 hover:text-green-400 transition-colors border border-zinc-800 hover:border-green-900 rounded px-3 py-1.5"
              >
                {label} ↗
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
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="text-green-500">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Currently */}
      <section>
        <p className="font-mono text-green-400 text-sm mb-3">currently</p>
        <ul className="space-y-2">
          {[
            "Practicing heap exploitation (tcache poisoning, house of force)",
            "Playing CTFs with my team on weekends",
            "Reading: The Art of Exploitation — Jon Erickson",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-green-500 mt-0.5">›</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
