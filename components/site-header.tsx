"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { openPalette } from "@/components/command-palette";
import { routesConfig } from "@/config/routes";

/** Past this many pixels the navigation folds into its compact rail. */
const COMPACT_AT = 96;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * One navigation object with three states, written to data-nav: "top", wide
 * and nearly transparent inside the first scene; "compact", a floating glass
 * rail once the page has moved; "receded", the rail a little smaller and
 * quieter while the reader scrolls down. It never leaves the screen. The
 * state is written straight to the element, so scrolling never re-renders
 * React. On phones the same object opens into the menu sheet.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [navigations, setNavigations] = React.useState(0);

  // Close the menu and draw the route line on navigation (React 19 idiom:
  // adjust state in render rather than in an effect).
  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
    setNavigations((n) => n + 1);
  }

  const { scrollY } = useScroll();
  const apply = React.useCallback((y: number, prev: number) => {
    const el = ref.current;
    if (!el) return;
    el.dataset.nav = y < COMPACT_AT ? "top" : y > prev + 2 ? "receded" : y < prev - 2 ? "compact" : el.dataset.nav === "top" ? "compact" : el.dataset.nav;
  }, []);
  useMotionValueEvent(scrollY, "change", (y) => apply(y, scrollY.getPrevious() ?? y));
  // A reload mid-page starts compact, not in the hero state.
  React.useEffect(() => apply(window.scrollY, window.scrollY), [apply]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = routesConfig.mainNav;
  const contact = items[items.length - 1];
  const pages = items.slice(0, -1);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 no-print">
      {navigations > 0 ? <span key={navigations} aria-hidden="true" className="route-line" /> : null}
      <div
        ref={ref}
        data-nav="top"
        data-open={open || undefined}
        className={cn(
          "group/nav pointer-events-auto mx-auto mt-0 flex max-w-[1400px] flex-wrap items-center border border-transparent px-5 transition-[max-width,margin,padding,background-color,border-color,border-radius,opacity,transform,box-shadow] duration-[550ms] ease-cine md:px-8 xl:px-16",
          "h-auto min-h-20",
          // compact and receded: a floating glass rail
          "data-[nav=compact]:glass data-[nav=receded]:glass data-[nav=compact]:shadow-soft",
          "data-[nav=compact]:mt-3 data-[nav=receded]:mt-2 data-[nav=compact]:min-h-14 data-[nav=receded]:min-h-12",
          "data-[nav=compact]:max-w-[calc(100%-1.5rem)] data-[nav=receded]:max-w-[calc(100%-1.5rem)] md:data-[nav=compact]:max-w-[46rem] md:data-[nav=receded]:max-w-[44rem]",
          "data-[nav=compact]:rounded-[28px] data-[nav=receded]:rounded-[28px] data-[nav=compact]:border-border-strong data-[nav=receded]:border-border",
          "data-[nav=compact]:px-4 data-[nav=receded]:px-4 md:data-[nav=compact]:px-5 md:data-[nav=receded]:px-5",
          "data-[nav=receded]:opacity-[0.88]",
          // the phone menu grows out of the same object
          "data-[open]:glass data-[open]:mt-3 data-[open]:max-w-[calc(100%-1.5rem)] data-[open]:rounded-[28px] data-[open]:border-border-strong data-[open]:px-4 data-[open]:shadow-soft"
        )}
      >
        <Link href="/" aria-label="KayD, home" className="mr-auto py-3 text-foreground">
          <Logo
            className="text-[1.75rem] transition-[font-size] duration-[550ms] ease-cine group-data-[nav=receded]/nav:text-2xl"
            tailClassName="max-w-[3em] transition-[max-width,opacity] duration-[550ms] ease-cine group-data-[nav=compact]/nav:max-w-0 group-data-[nav=compact]/nav:opacity-0 group-data-[nav=receded]/nav:max-w-0 group-data-[nav=receded]/nav:opacity-0"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center md:flex">
          <ul className="flex items-center gap-7 transition-[gap] duration-[550ms] ease-cine group-data-[nav=compact]/nav:gap-5 group-data-[nav=receded]/nav:gap-5">
            {pages.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/link relative py-2 text-[15px] transition-colors hover:text-foreground",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brand transition-transform duration-300 ease-cine",
                        active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-50"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-2 flex items-center gap-1 md:ml-7">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search the site"
            aria-keyshortcuts="Control+K Meta+K"
            className="inline-flex h-9 items-center gap-2 rounded-full px-2.5 text-muted-foreground transition-colors hover:bg-brand-soft hover:text-foreground"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            <kbd className="hidden font-mono text-[11px] lg:inline">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <Link
            href={contact.href}
            aria-current={isActive(pathname, contact.href) ? "page" : undefined}
            className="ml-2 hidden py-2 text-[15px] text-brand md:inline-flex"
          >
            <span className="group/cue inline-flex items-center gap-2.5 font-medium">
              {contact.title}
              <span aria-hidden="true" className="relative h-px w-4 bg-current transition-[width] duration-300 ease-cine group-hover/cue:w-6 after:absolute after:-top-[3px] after:right-0 after:h-[7px] after:w-[7px] after:rotate-45 after:border-r after:border-t after:border-current" />
            </span>
          </Link>
          <button
            type="button"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-brand-soft md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>

        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!open}
          className="w-full pb-4 pt-2 md:hidden"
        >
          <ul className="border-t border-border pt-2">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="type-card flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-brand-soft"
                  >
                    {item.title}
                    {active ? <span aria-hidden="true" className="h-px w-6 bg-brand" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
