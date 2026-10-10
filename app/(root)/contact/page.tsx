import React from "react";
import { Metadata } from "next";
import Link from "next/link";

import { Section, SectionHeading } from "@/components/section";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/config/socials";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a project, a role, or anything else.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section className="relative overflow-hidden pt-36 md:pt-48">
      <div aria-hidden="true" className="glow absolute -left-40 top-0 h-[520px] w-[620px]" />
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Contact,"
        serif="let's talk."
        lead="A project, a role, or a question: send a message."
      />
      <div className="grid gap-14 md:grid-cols-[1fr_auto] md:gap-20">
        <Reveal>
          <div className="shadow-soft max-w-2xl rounded-3xl border border-border-strong bg-surface p-6 md:p-10">
            <ContactForm />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <aside>
            <h2 className="eyebrow">Or directly</h2>
            <ul className="mt-5 space-y-3.5">
              {SocialLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    {...(item.link.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
                    className="inline-flex items-center gap-3 text-muted-foreground transition-colors [overflow-wrap:anywhere] hover:text-brand"
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.name === "Gmail" ? item.link.replace("mailto:", "") : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
