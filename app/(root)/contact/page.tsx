import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Scene } from "@/components/scene";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialLinks } from "@/config/socials";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a project, a role, a collaboration, or anything else.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const email = SocialLinks.find((s) => s.link.startsWith("mailto:"))!.link.replace("mailto:", "");
  return (
    <Scene as="div" light={[50, 70]} className="min-h-[100dvh] overflow-x-clip pt-36 md:pt-44">
      {/* The clearing: paths converging on one light, behind the form. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 top-0 -z-10 mx-auto max-w-5xl overflow-hidden">
        <Image src="/visuals/contact-clearing.webp" alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="art object-cover object-bottom opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_70%,#000,transparent)]" />
        {/* A dark green veil keeps the form at full contrast. */}
        <div className="absolute inset-0 bg-background/55" />
      </div>
      <div className="container grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 data-rise="load" className="type-display">
            Tell me what needs to work better.
          </h1>
          <p data-rise="load" className="type-lead mt-7 max-w-md">
            A product idea, an operational problem, an engineering role, a collaboration, or simply hello.
          </p>
          <div data-rise="load" className="mt-12">
            <h2 className="meta">Or directly</h2>
            <ul className="mt-4 space-y-3">
              {SocialLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    {...(item.link.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
                    className="inline-flex items-center gap-3 text-muted-foreground transition-colors [overflow-wrap:anywhere] hover:text-brand"
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.link.startsWith("mailto:") ? email : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div data-rise="load" className="lg:col-span-6 lg:col-start-7">
          <ContactForm email={email} />
        </div>
      </div>
    </Scene>
  );
}
