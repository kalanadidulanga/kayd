import Link from "next/link";
import Image from "next/image";

import { featuredCaseStudies } from "@/config/experience";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

export function SelectedWork() {
  if (featuredCaseStudies.length === 0) return null;

  return (
    <section id="selected-work" className="container py-16 md:py-24">
      <SectionHeader
        index="02"
        label="Selected work"
        title="Selected work"
        description="A few projects in more detail: what the problem was, what I built, and what happened."
      />
      <div className="mt-12 space-y-20">
        {featuredCaseStudies.map((e, i) => (
          <Reveal key={e.id} delay={i * 80}>
            <article className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
              <div>
                <h3 className="type-card">{e.companyName}</h3>
                <p className="type-label mt-2 text-muted-foreground">
                  {e.techStack.join(" / ")}
                </p>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <div>
                    <p className="type-label text-foreground">Problem</p>
                    <p className="mt-1 leading-relaxed">{e.caseStudy?.problem}</p>
                  </div>
                  <div>
                    <p className="type-label text-foreground">Approach</p>
                    <p className="mt-1 leading-relaxed">{e.caseStudy?.approach}</p>
                  </div>
                  {e.caseStudy?.outcome ? (
                    <div>
                      <p className="type-label text-foreground">Outcome</p>
                      <p className="mt-1 leading-relaxed">{e.caseStudy.outcome}</p>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 flex gap-6 text-sm">
                  <Link
                    href={`/experience/${e.id}`}
                    className="text-brand hover:underline"
                  >
                    Read more
                  </Link>
                  {e.websiteLink ? (
                    <Link
                      href={e.websiteLink}
                      target="_blank"
                      className="text-brand hover:underline"
                    >
                      Visit site
                    </Link>
                  ) : null}
                </div>
              </div>
              {e.pagesInfoArr[0]?.imgArr?.[0] ? (
                <Image
                  src={e.pagesInfoArr[0].imgArr[0]}
                  alt={`${e.companyName} screenshot`}
                  width={800}
                  height={500}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="h-auto w-full rounded-lg border border-border object-cover object-top"
                />
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
