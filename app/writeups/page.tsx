import { getAllWriteups } from "@/lib/writeups";
import WriteupsSearch from "@/components/WriteupsSearch";

export const metadata = {
  title: "writeups — rowconno",
  description: "CTF writeups and security research notes.",
};

export default function WriteupListPage() {
  const writeups = getAllWriteups();

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-green-400 text-sm mb-2">ls ./writeups</p>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Writeups</h1>
        <p className="text-zinc-400 text-sm">
          CTF solutions, vulnerability analyses, and technique deep-dives.
        </p>
      </section>

      <WriteupsSearch writeups={writeups} />
    </div>
  );
}
