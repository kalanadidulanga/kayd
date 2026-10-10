import Link from "next/link";
import Image from "next/image";

import type { ExperienceInterface } from "@/config/experience";
import { skillLabel } from "@/lib/skills";
import { projectCover } from "@/lib/work";

/**
 * One project as a quiet row: year, name, one line, stack. When a
 * screenshot exists it floats in on hover (CSS only), so a missing image
 * never leaves an empty frame.
 */
export function WorkRow({ project }: { project: ExperienceInterface }) {
  const cover = projectCover(project);
  const year = project.startDate?.getUTCFullYear();

  return (
    <li>
      <Link
        href={`/work/${project.id}`}
        className="group relative grid grid-cols-[3rem_1fr_1.5rem] items-center gap-x-4 border-b border-border py-6 transition-colors duration-300 md:grid-cols-[4.5rem_1fr_16rem_1.5rem] md:gap-x-8 md:px-4 md:hover:bg-brand-soft"
      >
        <span className="self-start pt-1.5 font-mono text-[13px] tabular-nums text-subtle">{year}</span>
        <span className="min-w-0">
          <span className="type-card block transition-transform duration-500 ease-cine md:group-hover:translate-x-2">
            {project.companyName}
          </span>
          <span className="mt-1.5 line-clamp-2 block text-[15px] leading-snug text-muted-foreground md:line-clamp-1">
            {project.shortDescription}
          </span>
        </span>
        <span className="hidden truncate font-mono text-xs text-subtle md:block">
          {project.techStack.slice(0, 3).map(skillLabel).join(" · ")}
        </span>
        <span
          aria-hidden="true"
          className="text-lg text-subtle transition-all duration-300 ease-cine group-hover:translate-x-1 group-hover:text-brand"
        >
          →
        </span>
        {cover ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-20 top-1/2 z-10 hidden w-72 -translate-y-1/2 rotate-2 scale-90 opacity-0 transition-all duration-500 ease-cine group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none lg:block"
          >
            <Image
              src={cover}
              alt=""
              width={1440}
              height={900}
              sizes="288px"
              // Framed at 16:10 from the top: some screenshots are full-page
              // captures, and unframed they would tower over the list.
              className="shadow-soft aspect-[16/10] w-full rounded-xl border border-border-strong object-cover object-top"
            />
          </span>
        ) : null}
      </Link>
    </li>
  );
}

export function WorkList({ projects }: { projects: ExperienceInterface[] }) {
  return (
    <ul className="border-t border-border">
      {projects.map((p) => (
        <WorkRow key={p.id} project={p} />
      ))}
    </ul>
  );
}
