import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { skillId, skillLabel, skillUsage } from "@/lib/skills";

function groupId(title: string) {
  return `group-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function plural(n: number) {
  return n === 1 ? "project" : "projects";
}

/**
 * The full skills view. Each skill is a native disclosure (no JavaScript):
 * the summary shows how many listed projects use it, and opening it lists
 * them. The count is the claim, and the list is its proof. Stated skills
 * follow as plain rows with no count.
 */
export function SkillTable() {
  return (
    <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
      {skillUsage().map((group) => (
        <section key={group.title} aria-labelledby={groupId(group.title)}>
          <h3 id={groupId(group.title)} className="type-card">
            {group.title}
          </h3>
          <ul className="mt-4 border-t border-border">
            {group.skills.map((s) => (
              <li key={s.name}>
                <details
                  id={skillId(s.name)}
                  className="group scroll-mt-28 border-b border-border transition-colors target:bg-brand-soft"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
                    <span>{skillLabel(s.name)}</span>
                    <span className="meta flex items-center gap-3">
                      <span>
                        <span data-count>{s.projects.length}</span>{" "}
                        {plural(s.projects.length)}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 ease-cine group-open:rotate-180 motion-reduce:transition-none"
                      />
                    </span>
                  </summary>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 pb-5">
                    {s.projects.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/work/${p.id}`}
                          className="text-[15px] text-brand hover:underline"
                        >
                          {p.companyName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            {group.stated.map((s) => (
              <li
                key={s}
                id={skillId(s)}
                data-stated
                className="flex scroll-mt-28 items-center justify-between gap-4 border-b border-border py-4 transition-colors target:bg-brand-soft"
              >
                <span>{skillLabel(s)}</span>
                <span className="meta">work not listed</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
