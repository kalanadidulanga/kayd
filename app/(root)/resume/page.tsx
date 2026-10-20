import type { Metadata } from "next";
import Link from "next/link";

import { PrintButton } from "@/components/print-button";
import { Experiences, featuredCaseStudies } from "@/config/experience";
import { contributionsUnsorted } from "@/config/contributions";
import { educations } from "@/config/educations";
import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/config/socials";
import { formatRange, roles } from "@/config/work-history";
import { skillLabel, skillUsage } from "@/lib/skills";
import { projectYears } from "@/lib/work";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.name}: roles, selected work, skills with proof, and education, on one printable page.`,
  alternates: { canonical: "/resume" },
};

/**
 * The resume, built only from the verified config the rest of the site
 * uses, laid out to print cleanly on A4 or Letter. "Save as PDF" in the
 * print dialog makes the file; a hosted PDF is linked too when one is set.
 */
export default function ResumePage() {
  const pdf = process.env.NEXT_PUBLIC_RESUME_LINK;
  const email = SocialLinks.find((s) => s.link.startsWith("mailto:"))!.link.replace("mailto:", "");
  const linkedin = SocialLinks.find((s) => s.name === "LinkedIn")?.link;
  const github = SocialLinks.find((s) => s.name === "GitHub")?.link;
  const skills = skillUsage()
    .flatMap((g) => g.skills)
    .sort((a, b) => b.projects.length - a.projects.length)
    .slice(0, 14);
  const selected = [
    ...featuredCaseStudies,
    ...Experiences.filter((e) => e.presentation === "story" && e.type === "Professional").slice(0, 3),
  ];
  const h2 = "meta border-b border-border pb-2 text-foreground";

  return (
    <div className="container max-w-[880px] pb-24 pt-32 md:pt-40 print:p-0">
      <div className="no-print mb-12 flex flex-wrap items-center gap-x-8 gap-y-3">
        <PrintButton className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-on-brand" />
        {pdf ? (
          <a href={pdf} className="text-[15px] text-brand hover:underline">
            Download the PDF
          </a>
        ) : null}
        <Link href="/about" className="text-[15px] text-muted-foreground hover:text-foreground">
          The longer version
        </Link>
      </div>

      <header>
        <h1 className="type-title">{profile.name}</h1>
        <p className="mt-2 text-[17px]">{profile.headline}</p>
        <p className="meta mt-3 flex flex-wrap gap-x-4">
          <a href={`mailto:${email}`}>{email}</a>
          <a href={siteConfig.url}>{siteConfig.url.replace("https://", "")}</a>
          {linkedin ? <a href={linkedin}>LinkedIn</a> : null}
          {github ? <a href={github}>GitHub</a> : null}
        </p>
      </header>

      <section className="mt-10 break-inside-avoid">
        <h2 className={h2}>Profile</h2>
        <div className="mt-3 space-y-2 text-[15px] leading-relaxed">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className={h2}>Experience</h2>
        <ul className="mt-3 space-y-4">
          {roles.map((r) => (
            <li key={r.company} className="grid break-inside-avoid gap-1 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-medium">{r.title ?? r.company}</p>
                {r.title ? <p className="text-[15px] text-muted-foreground">{r.company}</p> : null}
                {r.note ? <p className="text-[14px] text-muted-foreground">{r.note}</p> : null}
              </div>
              <p className="meta">{formatRange(r)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className={h2}>Selected work</h2>
        <ul className="mt-3 space-y-4">
          {selected.map((e) => (
            <li key={e.id} className="break-inside-avoid">
              <p className="font-medium">
                <Link href={`/work/${e.id}`}>{e.companyName}</Link>
                <span className="meta ml-3">{projectYears(e)}</span>
              </p>
              {e.role ? <p className="text-[14px] text-muted-foreground">{e.role}</p> : null}
              <p className="text-[15px]">{e.shortDescription}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className={h2}>Skills, with the number of listed projects that use them</h2>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px]">
          {skills.map((s) => (
            <li key={s.name}>
              <Link href={`/work?tech=${encodeURIComponent(skillLabel(s.name))}`}>{skillLabel(s.name)}</Link>{" "}
              <span className="meta">{s.projects.length}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-10 break-inside-avoid sm:grid-cols-2">
        <div>
          <h2 className={h2}>Education</h2>
          <ul className="mt-3 space-y-3">
            {educations.map((e) => (
              <li key={e.title}>
                <p className="font-medium">{e.title}</p>
                <p className="text-[14px] text-muted-foreground">{e.where}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={h2}>Contributions</h2>
          <ul className="mt-3 space-y-3">
            {contributionsUnsorted.map((c) => (
              <li key={c.repo}>
                <p className="font-medium">{c.repo}</p>
                <p className="text-[14px] text-muted-foreground">{c.contibutionDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
