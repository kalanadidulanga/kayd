import Link from "next/link";

import { Logo } from "@/components/logo";
import { SocialLinks } from "@/config/socials";
import { routesConfig } from "@/config/routes";
import { profile } from "@/config/profile";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-band">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo className="text-5xl text-foreground" />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">
            {profile.name}, full stack engineer. Built with Next.js, Motion and Lenis.
          </p>
        </div>
        <div>
          <p className="eyebrow">Site</p>
          <ul className="mt-5 space-y-3 text-sm">
            {routesConfig.mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-5 space-y-3 text-sm">
            {SocialLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  {...(item.link.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
                  className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name === "Gmail" ? "Email" : item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
