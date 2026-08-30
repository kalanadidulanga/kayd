import Link from "next/link";
import Image from "next/image";

import KayD from "@/public/avatar.svg";
import SkillsCard from "@/components/skills-card";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { featuredSkills } from "@/config/skills";
import { Icons } from "@/components/icons";
import { pagesConfig } from "@/config/pages";
import { featuredExperiences } from "@/config/experience";
import ProjectCard from "@/components/project-card";
import { ClientLogos } from "@/components/client-logos";
import { featuredContributions } from "@/config/contributions";
import ContributionCard from "@/components/contribution-card";
import { siteConfig } from "@/config/site";
import Educations from "@/components/educations";
import { featuredEducations } from "@/config/educations";
import { SocialLinks } from "@/config/socials";
import CustomTooltip from "@/components/custom-tooltip";
import { NowBlock } from "@/components/now-block";
import { SelectedWork } from "@/components/case-study";
import { Testimonials } from "@/components/testimonials";
import { StatsStrip } from "@/components/stats-strip";
import { SectionHeader } from "@/components/section-header";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 mb-0 md:pb-12 md:pt-20 h-full flex items-center">
        <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.linkedin}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on LinkedIn
          </Link>
          {/* <div className="max-w-[16rem]"> */}
          <Image
            src={KayD}
            height={100}
            width={100}
            sizes="100vw"
            className="bg-primary rounded-full mb-0 h-auto md:mb-2 w-[60%] max-w-[16rem] border-8 border-primary dark:border-white dark:bg-white"
            alt="Kalana Didulanga"
          />
          {/* </div> */}
          <h1 className="type-display">Kalana Didulanga</h1>
          <h3 className="type-card text-muted-foreground">
            Full Stack Software Engineer | KayD
          </h3>

          <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Kalana Didulanga is a Full Stack Software Engineer specializing in
            frontend development with the MERN stack. He also builds native
            mobile apps and Windows software, delivering dynamic, scalable
            digital solutions.
          </p>
          <div className="flex flex-col  mt-10 items-center justify-center sm:flex-row sm:space-x-4 gap-3">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Icons.gitHub className="w-4 h-4 mr-2" /> GitHub
            </Link>
            <Link
              href={"/contact"}
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                })
              )}
            >
              <Icons.contact className="w-4 h-4 mr-2" /> Contact
            </Link>
          </div>
          <div className="mt-10">
            <StatsStrip />
          </div>
          <Icons.chevronDown className="h-6 w-6 mt-10" />
        </div>
      </section>
      <NowBlock />
      <SelectedWork />
      <section
        id="experience"
        className="space-y-6 dark:bg-transparent py-10 my-14"
      >
        <SectionHeader
          index="03"
          label="Experience"
          title={pagesConfig.experience.title}
          description={pagesConfig.experience.description}
        />
        <div className="mx-auto grid justify-center gap-4  md:w-full lg:grid-cols-3 place-items-center">
          {featuredExperiences.map((exp) => (
            <ProjectCard key={exp.id} project={exp} />
          ))}
        </div>
        <ClientLogos />
        <Link href="/experience" className="flex justify-center">
          <Button variant={"outline"} className="rounded-xl">
            <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
          </Button>
        </Link>
      </section>

      <section
        id="about"
        className="container space-y-6 dark:bg-transparent py-10 my-14"
      >
        <SectionHeader
          index="04"
          label="About"
          title={pagesConfig.aboutme.title}
          description={pagesConfig.aboutme.description}
        />

        <div className=" flex items-center justify-center gap-5">
          {SocialLinks.map((item, ind) => (
            <CustomTooltip icon={item.icon} text={item.username} key={ind}>
              <Link
                href={item.link}
                target="_blank"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "h-10 w-10 p-2"
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            </CustomTooltip>
          ))}
        </div>
        <Link href="/contact" className="flex justify-center">
          <Button variant={"outline"} className="rounded-xl">
            Contact Me
          </Button>
        </Link>
      </section>

      <section
        id="skills"
        className="container space-y-6 bg-slate-50 dark:bg-transparent py-10"
      >
        <SectionHeader
          index="05"
          label="Skills"
          title={pagesConfig.skills.title}
          description={pagesConfig.skills.description}
        />
        <SkillsCard skills={featuredSkills} />
        <Link href="/skills" className="flex justify-center">
          <Button variant={"outline"} className="rounded-xl">
            <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
          </Button>
        </Link>
        {/* <div className="mx-auto text-center md:max-w-232">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            See all the relevant skills.
          </p>
        </div> */}
      </section>
      <Testimonials />

      <section
        id="educations"
        className="container space-y-6 bg-slate-50 dark:bg-transparent py-10 my-14"
      >
        <SectionHeader
          index="07"
          label="Education"
          title={pagesConfig.educations.title}
          description={pagesConfig.educations.description}
        />
        <div className="mx-auto justify-center gap-4  md:w-full lg:grid-cols-3">
          <Educations educations={featuredEducations} />
        </div>
        <Link href="/educations" className="flex justify-center">
          <Button variant={"outline"} className="rounded-xl">
            <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
          </Button>
        </Link>
      </section>

      <section
        id="contributions"
        className="container space-y-6 bg-slate-50 dark:bg-transparent py-10 mt-14"
      >
        <SectionHeader
          index="08"
          label="Contributions"
          title={pagesConfig.contributions.title}
          description={pagesConfig.contributions.description}
        />
        <div className="mx-auto justify-center gap-4  md:w-full lg:grid-cols-3">
          <ContributionCard contributions={featuredContributions} />
        </div>
        <Link href="/contributions" className="flex justify-center">
          <Button variant={"outline"} className="rounded-xl">
            <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
          </Button>
        </Link>
        {/* <div className="mx-auto text-center md:max-w-232">
                    <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        See all the relevant skills.
                    </p>
                </div> */}
      </section>
    </>
  );
}
