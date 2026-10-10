"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { EASE } from "@/components/reveal";
import { routesConfig } from "@/config/routes";
import { siteConfig } from "@/config/site";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** A floating glass pill that the page scrolls under. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close the menu on navigation (React 19 idiom: adjust state in render).
  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = routesConfig.mainNav;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 md:top-4">
      <motion.div
        data-reveal=""
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="glass shadow-soft pointer-events-auto mx-auto flex w-fit items-center gap-1 rounded-full border border-border-strong py-1.5 pl-4 pr-1.5"
      >
        <Link href="/" aria-label="KayD, home" className="mr-2 text-foreground">
          <Logo className="text-2xl" />
        </Link>

        <nav aria-label="Main" className="hidden items-center md:flex">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-brand-soft hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="ml-1 hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-brand-soft hover:text-foreground sm:inline-flex"
        >
          <Icons.gitHub className="h-4.25 w-4.25" />
        </Link>
        <ThemeToggle className="ml-1" />
        <Link
          href="/contact"
          className="ml-1 hidden h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform duration-200 ease-cine active:scale-[0.97] sm:inline-flex"
        >
          Let&apos;s talk
        </Link>
        <button
          type="button"
          className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-strong md:hidden"
          aria-expanded={open}
          aria-controls={open ? "mobile-menu" : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Icons.close className="h-4 w-4" /> : <Icons.menu className="h-4 w-4" />}
          <span className="sr-only">Menu</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass shadow-soft pointer-events-auto mx-auto mt-2 max-w-sm origin-top rounded-3xl border border-border-strong p-2 md:hidden"
          >
            <ul>
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="type-card block rounded-2xl px-4 py-3 hover:bg-brand-soft"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
