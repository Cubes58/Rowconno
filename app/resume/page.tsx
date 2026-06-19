export const metadata = {
  title: "resume — rowconno",
  description: "Professional experience, certifications, and education.",
};

const experience = [
  {
    role: "Security Consultant",
    company: "Accenture",
    period: "2024 — Present",
    points: [
      "Perform penetration tests against web applications, APIs, and internal network infrastructure.",
      "Deliver red team engagements simulating advanced persistent threat actors.",
      "Produce written remediation reports and present findings to technical and executive stakeholders.",
    ],
  },
  {
    role: "Security Analyst (Intern)",
    company: "Accenture",
    period: "Summer 2023",
    points: [
      "Assisted senior consultants on web application assessments.",
      "Automated reconnaissance tasks with Python, reducing manual effort by ~40%.",
      "Completed internal OWASP Top 10 training and certification.",
    ],
  },
];

const education = [
  {
    degree: "BSc Computer Science (Cyber Security)",
    institution: "University of Placeholder",
    period: "2020 — 2024",
    note: "First Class Honours",
  },
];

const certifications = [
  { name: "OSCP", issuer: "Offensive Security", year: "2024" },
  { name: "CompTIA Security+", issuer: "CompTIA", year: "2023" },
];

const skills = [
  "Python", "C / C++", "x86-64 Assembly", "Bash",
  "Burp Suite", "pwntools", "Ghidra", "Metasploit",
  "Linux", "Active Directory", "Docker", "Git",
];

export default function ResumePage() {
  return (
    <div className="space-y-12">
      <section>
        <p className="font-mono text-green-400 text-sm mb-2">cat resume.txt</p>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Connor Rowland</h1>
        <p className="text-zinc-400 text-sm font-mono">
          connor.rowland@accenture.com
        </p>
      </section>

      {/* Experience */}
      <section>
        <h2 className="font-mono text-green-400 text-sm mb-5">experience</h2>
        <div className="space-y-8">
          {experience.map((job) => (
            <div key={job.role + job.company}>
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                <div>
                  <span className="font-semibold text-zinc-200">{job.role}</span>
                  <span className="text-zinc-500 mx-2">·</span>
                  <span className="text-zinc-400">{job.company}</span>
                </div>
                <span className="font-mono text-xs text-zinc-500">{job.period}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {job.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="text-green-500 mt-0.5 shrink-0">›</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="font-mono text-green-400 text-sm mb-5">education</h2>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.degree}>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="font-semibold text-zinc-200">{edu.degree}</span>
                  <span className="text-zinc-500 mx-2">·</span>
                  <span className="text-zinc-400">{edu.institution}</span>
                </div>
                <span className="font-mono text-xs text-zinc-500">{edu.period}</span>
              </div>
              {edu.note && (
                <p className="text-sm text-zinc-500 mt-1">{edu.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="font-mono text-green-400 text-sm mb-5">certifications</h2>
        <ul className="space-y-2">
          {certifications.map((cert) => (
            <li key={cert.name} className="flex items-center justify-between text-sm">
              <span>
                <span className="text-zinc-200 font-medium">{cert.name}</span>
                <span className="text-zinc-500 mx-2">·</span>
                <span className="text-zinc-400">{cert.issuer}</span>
              </span>
              <span className="font-mono text-xs text-zinc-500">{cert.year}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section>
        <h2 className="font-mono text-green-400 text-sm mb-4">skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="font-mono text-xs text-zinc-400 border border-zinc-800 rounded px-2.5 py-1"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
