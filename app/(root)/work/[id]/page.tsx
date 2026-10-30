import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Scene, Cue } from "@/components/scene";
import { Download } from "@/components/work/download";
import { Icons } from "@/components/icons";
import { Experiences, type ExperienceInterface } from "@/config/experience";
import { skillLabel } from "@/lib/skills";
import {
  DEPTHS,
  DOMAINS,
  OWNERSHIP,
  PLATFORMS,
  projectCover,
  projectDepth,
  projectOwnership,
  projectPlatform,
  projectYears,
  relatedProjects,
} from "@/lib/work";

interface WorkPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Experiences.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { id } = await params;
  const exp = Experiences.find((e) => e.id === id);
  if (!exp) return {};
  return {
    title: exp.companyName,
    description: exp.shortDescription,
    alternates: { canonical: `/work/${exp.id}` },
    openGraph: {
      type: "article",
      siteName: "KayD",
      title: `${exp.companyName} | KayD`,
      description: exp.shortDescription,
    },
  };
}

/** A titled part of the story. Rendered only when it has something in it. */
function Part({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} data-rise="" className="scroll-mt-28">
      <h2 id={`${id}-title`} className="type-title">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Screens({ exp, skip }: { exp: ExperienceInterface; skip?: string }) {
  const pages = (exp.pagesInfoArr ?? [])
    .map((p) => ({ ...p, imgArr: (p.imgArr ?? []).filter((src) => src !== skip) }))
    .filter((p) => p.imgArr.length > 0);
  if (!pages.length) return null;
  return (
    <Part id="screens" title="Screens">
      <div className="space-y-14">
        {pages.map((page, i) => (
          <figure key={i}>
            {page.imgArr.map((src) => (
              <Image
                key={src}
                src={src}
                alt={page.title}
                width={1440}
                height={900}
                sizes="(min-width: 1024px) 720px, 100vw"
                className="h-auto max-h-[80vh] w-full rounded-lg border border-border-strong object-cover object-top"
              />
            ))}
            <figcaption className="mt-4 text-[15px]">
              {page.title}
              {page.description ? <span className="block text-muted-foreground">{page.description}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </Part>
  );
}

function SystemMap({ exp }: { exp: ExperienceInterface }) {
  if (!exp.systemMap?.length) return null;
  return (
    <Part id="system-map" title="System map">
      <figure>
        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {exp.systemMap.map((lane) => (
            <li key={lane.layer} className="relative border-l border-brand/40 pl-5">
              <span aria-hidden="true" className="absolute -left-[4px] top-1.5 h-[7px] w-[7px] rounded-full bg-brand" />
              <h3 className="meta text-brand">{lane.layer}</h3>
              <ul className="mt-3 space-y-2">
                {lane.items.map((item) => (
                  <li key={item} className="text-[15px] leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <figcaption className="meta mt-6">Drawn from the documented facts of the project, top layer first.</figcaption>
      </figure>
    </Part>
  );
}

function Illustration({ exp }: { exp: ExperienceInterface }) {
  const art = exp.illustration;
  if (!art) return null;
  return (
    <figure data-rise="">
      <Image src={art.src} alt={art.alt} width={art.width} height={art.height} sizes="(min-width: 1024px) 760px, 100vw" className="art h-auto w-full rounded-lg" />
      <figcaption className="meta mt-3">Illustration, not a screenshot of the product.</figcaption>
    </figure>
  );
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { id } = await params;
  const exp = Experiences.find((e) => e.id === id);
  if (!exp) redirect("/work");

  const depth = projectDepth(exp);
  const cover = projectCover(exp);
  const related = relatedProjects(exp);
  const paragraphs = exp.descriptionDetails?.paragraphs ?? [];
  const bullets = exp.descriptionDetails?.bullets ?? [];
  const deep = depth !== "note";

  const facts: [string, string | undefined][] = [
    ["Years", projectYears(exp)],
    ["Platform", PLATFORMS[projectPlatform(exp)]],
    ["Domain", DOMAINS[exp.domain]],
    ["Kind", exp.team ? `${OWNERSHIP[projectOwnership(exp)]}, team built` : OWNERSHIP[projectOwnership(exp)]],
    ["Role", exp.role],
    ["Depth", DEPTHS[depth]],
  ];

  return (
    <article data-depth={depth}>
      <Scene as="header" texture="field" light={[80, 20]} edge="fog" className="pb-12 pt-36 md:pb-16 md:pt-44">
        <div className="container">
          <Link href="/work" className="group inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground">
            <span aria-hidden="true" className="transition-transform duration-300 ease-cine group-hover:-translate-x-1">
              ←
            </span>
            All work
          </Link>
          <div data-rise="load" className="mt-10 flex items-center gap-4">
            {exp.companyLogoImg ? (
              <Image
                src={exp.companyLogoImg}
                alt=""
                width={96}
                height={96}
                className="h-11 w-11 rounded-lg border border-border-strong bg-white object-contain p-1"
              />
            ) : null}
            <p className="meta">{DEPTHS[depth]}</p>
          </div>
          <h1 data-rise="load" className="type-display mt-5 max-w-5xl">
            {exp.companyName}
          </h1>
          <p data-rise="load" className="type-lead mt-6 max-w-2xl">
            {exp.shortDescription}
          </p>
          {exp.websiteLink || exp.githubLink || exp.release ? (
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
              {exp.release ? (
                <a href="#download" className="text-brand">
                  <Cue>Download</Cue>
                </a>
              ) : null}
              {exp.websiteLink ? (
                <Link href={exp.websiteLink} target="_blank" rel="noreferrer" className="text-brand">
                  <Cue>Visit the site</Cue>
                </Link>
              ) : null}
              {exp.githubLink ? (
                <Link href={exp.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground hover:text-brand">
                  <Icons.gitHub className="h-4 w-4" aria-hidden="true" />
                  Source code
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </Scene>

      {exp.release ? (
        <Download exp={exp} />
      ) : cover ? (
        <div className="container pb-16 md:pb-24">
          <div data-rise="load" style={{ "--rise-delay": "200ms" } as React.CSSProperties}>
            <Image
              src={cover}
              alt={`${exp.companyName} screenshot`}
              width={1440}
              height={900}
              sizes="(min-width: 1400px) 1272px, 100vw"
              priority
              // Natural proportions, capped: full-page captures stay a screen tall.
              className="shadow-soft h-auto max-h-[75vh] w-full rounded-lg border border-border-strong object-cover object-top"
            />
          </div>
        </div>
      ) : null}

      <div className="container grid gap-14 pb-24 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-20 md:pb-36">
        <aside aria-label="Project facts" className="lg:sticky lg:top-28 lg:self-start">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">
            {facts
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="meta">{k}</dt>
                  <dd className="mt-1 text-[15px]">{v}</dd>
                </div>
              ))}
          </dl>
          <h2 className="meta mt-8">Stack</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {exp.techStack.map((s) => (
              <li key={s}>
                <Link
                  href={`/work?tech=${encodeURIComponent(skillLabel(s))}`}
                  className="inline-flex rounded-full border border-border-strong px-3 py-1 text-[13px] transition-colors hover:border-brand hover:text-brand"
                >
                  {skillLabel(s)}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="max-w-[760px] space-y-20">
          {paragraphs.length ? (
            <Part id="context" title={depth === "case-study" ? "Context" : "About the project"}>
              <div className="space-y-5 text-[18px] leading-[1.7]">
                {(deep ? paragraphs : paragraphs.slice(0, 1)).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Part>
          ) : null}

          {depth === "case-study" ? <Illustration exp={exp} /> : null}
          {depth === "case-study" ? <SystemMap exp={exp} /> : null}

          {depth === "case-study" && exp.caseStudy ? (
            <Part id="challenge" title="The challenge">
              <p className="text-[clamp(1.25rem,2vw,1.625rem)] leading-snug">{exp.caseStudy.problem}</p>
            </Part>
          ) : null}

          {deep && (exp.decisions?.length || exp.caseStudy) ? (
            <Part id="decisions" title="Decisions">
              {exp.decisions?.length ? (
                <ol className="space-y-6">
                  {exp.decisions.slice(0, depth === "story" ? 3 : undefined).map((d) => (
                    <li key={d} className="border-l border-border-strong pl-5 text-[17px] leading-relaxed">
                      {d}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-[17px] leading-relaxed">{exp.caseStudy!.approach}</p>
              )}
            </Part>
          ) : null}

          {deep ? <Screens exp={exp} skip={cover} /> : null}
          {depth === "story" ? <Illustration exp={exp} /> : null}

          {bullets.length ? (
            <Part id="focus" title={depth === "note" ? "One detail" : exp.focusTitle ?? "What it covers"}>
              <ul className="space-y-3">
                {(deep ? bullets : bullets.slice(0, 1)).map((b) => (
                  <li key={b} className="flex gap-3 leading-snug">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-brand" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Part>
          ) : null}

          {exp.contribution ? (
            <Part id="contribution" title="My part">
              <p className="text-[18px] leading-[1.7]">{exp.contribution}</p>
            </Part>
          ) : null}

          {exp.caseStudy?.outcome ? (
            <Part id="outcome" title="Outcome">
              <p className="type-title type-soft">{exp.caseStudy.outcome}</p>
            </Part>
          ) : null}

          {related.length ? (
            <Part id="related" title="Related work">
              <ul className="relative border-l border-brand/30">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/work/${r.id}`} className="group block py-4 pl-6 hover:text-brand">
                      <span className="type-card block">{r.companyName}</span>
                      <span className="mt-1 block text-[15px] text-muted-foreground">{r.shortDescription}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Part>
          ) : null}
        </div>
      </div>
    </article>
  );
}
