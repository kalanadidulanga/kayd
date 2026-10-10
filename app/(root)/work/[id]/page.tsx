import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { ScrollZoom } from "@/components/motion/scroll-zoom";
import { Magnetic } from "@/components/motion/magnetic";
import { btnGhost, btnPrimary } from "@/components/home/hero";
import { Icons } from "@/components/icons";
import { Experiences } from "@/config/experience";
import { skillId, skillLabel } from "@/lib/skills";
import { projectCover, projectKind, projectYears } from "@/lib/work";

interface WorkPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Experiences.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { id } = await params;
  const exp = Experiences.find((e) => e.id === id);
  return exp ? { title: exp.companyName, description: exp.shortDescription } : {};
}

function host(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { id } = await params;
  const index = Experiences.findIndex((e) => e.id === id);
  if (index === -1) redirect("/work");

  const exp = Experiences[index];
  const next = Experiences[(index + 1) % Experiences.length];
  const cover = projectCover(exp);
  // Screenshots other than the one already shown as the cover.
  const gallery = (exp.pagesInfoArr ?? [])
    .map((p) => ({ ...p, imgArr: (p.imgArr ?? []).filter((src) => src !== cover) }))
    .filter((p) => p.imgArr.length > 0);
  const overview = exp.descriptionDetails;
  const study = exp.caseStudy
    ? ([
        ["Problem", exp.caseStudy.problem],
        ["Approach", exp.caseStudy.approach],
        ["Outcome", exp.caseStudy.outcome],
      ] as const).filter(([, text]) => text)
    : [];

  return (
    <article>
      <header className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-70" />
        <div aria-hidden="true" className="glow absolute left-1/2 top-0 h-[480px] w-[800px] max-w-full -translate-x-1/2" />
        <div className="container relative">
          <Reveal>
            <Link href="/work" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <span aria-hidden="true" className="transition-transform duration-300 ease-cine group-hover:-translate-x-1">
                ←
              </span>
              All work
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-12 flex items-center gap-4">
              {exp.companyLogoImg ? (
                <Image
                  src={exp.companyLogoImg}
                  alt=""
                  width={96}
                  height={96}
                  className="h-11 w-11 rounded-xl border border-border-strong bg-white object-contain p-1"
                />
              ) : null}
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                {projectYears(exp)} · {projectKind(exp)}
              </p>
            </div>
            <h1 className="type-hero mt-6 max-w-5xl">{exp.companyName}</h1>
            <p className="type-lead mt-6 max-w-2xl">{exp.shortDescription}</p>
          </Reveal>
          {exp.websiteLink || exp.githubLink ? (
            <Reveal delay={160}>
              <div className="mt-10 flex flex-wrap gap-3">
                {exp.websiteLink ? (
                  <Magnetic>
                    <Link href={exp.websiteLink} target="_blank" rel="noreferrer" className={btnPrimary}>
                      Visit site <span aria-hidden="true">↗</span>
                    </Link>
                  </Magnetic>
                ) : null}
                {exp.githubLink ? (
                  <Magnetic>
                    <Link href={exp.githubLink} target="_blank" rel="noreferrer" className={btnGhost}>
                      <Icons.gitHub className="h-4 w-4" aria-hidden="true" />
                      Source code
                    </Link>
                  </Magnetic>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </header>

      {cover ? (
        <div className="container pb-24 md:pb-36">
          <ScrollZoom className="origin-top">
            <div className="shadow-soft overflow-hidden rounded-2xl border border-border-strong bg-surface">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <span className="ml-3 truncate font-mono text-xs text-subtle">
                  {host(exp.websiteLink) ?? exp.companyName}
                </span>
              </div>
              <Image
                src={cover}
                alt={`${exp.companyName} screenshot`}
                width={1440}
                height={900}
                sizes="(min-width: 1220px) 1156px, 100vw"
                priority
                // Natural proportions, capped: full-page captures stay a screen tall.
                className="h-auto max-h-[75vh] w-full object-cover object-top"
              />
            </div>
          </ScrollZoom>
        </div>
      ) : null}

      {study.length ? (
        <Section band>
          <Reveal>
            <p className="eyebrow">Case study</p>
          </Reveal>
          <div className="mt-10 grid gap-3.5 md:grid-cols-3">
            {study.map(([label, text], i) => (
              <Reveal key={label} delay={i * 80}>
                <Spotlight className="h-full p-7">
                  <div className="relative">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">{label}</p>
                    <p className={label === "Outcome" ? "serif-accent mt-4 text-3xl leading-tight" : "mt-4 leading-relaxed text-muted-foreground"}>
                      {text}
                    </p>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="grid gap-16 md:grid-cols-[1fr_18rem] md:gap-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Overview</p>
            <div className="mt-8 space-y-5 text-[17px] leading-relaxed">
              {(overview?.paragraphs ?? []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {overview?.bullets?.length ? (
              <ul className="mt-10 space-y-3.5">
                {overview.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 leading-snug text-muted-foreground">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
          <Reveal delay={120}>
            <aside>
              <h2 className="eyebrow">Stack</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {exp.techStack.map((s) => (
                  <li key={s}>
                    <Link
                      href={`/skills#${skillId(s)}`}
                      className="inline-flex rounded-full border border-border-strong px-3 py-1.5 text-[13px] transition-colors hover:border-brand hover:text-brand"
                    >
                      {skillLabel(s)}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="eyebrow mt-12">Category</h2>
              <p className="mt-4 text-sm text-muted-foreground">{exp.category.join(", ")}</p>
            </aside>
          </Reveal>
        </div>
      </Section>

      {gallery.length ? (
        <Section band>
          <Reveal>
            <p className="eyebrow">Screens</p>
          </Reveal>
          <div className="mt-12 space-y-16">
            {gallery.map((page, i) => (
              <Reveal key={i}>
                <figure>
                  {page.imgArr.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt={page.title}
                      width={1440}
                      height={900}
                      sizes="(min-width: 1220px) 1156px, 100vw"
                      className="shadow-soft h-auto w-full rounded-2xl border border-border-strong"
                    />
                  ))}
                  <figcaption className="mt-5">
                    <span className="type-card">{page.title}</span>
                    {page.description ? (
                      <span className="mt-1 block text-muted-foreground">{page.description}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Link href={`/work/${next.id}`} className="group block border-t border-border">
        <div className="container py-20 md:py-28">
          <p className="eyebrow">Next project</p>
          <p className="type-section mt-5 flex items-center gap-4">
            {next.companyName}
            <span
              aria-hidden="true"
              className="text-brand transition-transform duration-500 ease-cine group-hover:translate-x-3"
            >
              →
            </span>
          </p>
        </div>
      </Link>
    </article>
  );
}
