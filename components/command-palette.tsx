"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

const OPEN_EVENT = "kayd:palette";

/** Opens the palette from anywhere, such as the search button in the navigation. */
export function openPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export type PaletteItem = { group: string; label: string; hint?: string; href: string };
type Entry = PaletteItem | { group: string; label: string; hint?: string; run: () => string | void };

function matches(entry: Entry, query: string) {
  const text = `${entry.label} ${entry.hint ?? ""} ${entry.group}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => text.includes(term));
}

/**
 * Ctrl/Cmd + K: one personal index of pages, projects, technologies and a
 * few safe actions. A combobox over a listbox, so arrow keys, Enter and
 * screen readers all work; links navigate, actions report what they did.
 */
export function CommandPalette({ items, email }: { items: PaletteItem[]; email: string }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const actions: Entry[] = [
    {
      group: "Actions",
      label: "Copy email address",
      hint: email,
      run: () => {
        navigator.clipboard?.writeText(email);
        return `Copied ${email}`;
      },
    },
    {
      group: "Actions",
      label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      run: () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return "Theme switched";
      },
    },
  ];
  const results = [...items, ...actions].filter((e) => matches(e, query)).slice(0, 40);
  const current = Math.min(active, Math.max(results.length - 1, 0));

  function choose(entry: Entry | undefined) {
    if (!entry) return;
    if ("href" in entry) {
      setOpen(false);
      router.push(entry.href);
    } else {
      setStatus(entry.run() ?? "");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      const next = (current + step + results.length) % Math.max(results.length, 1);
      setActive(next);
      document.getElementById(`palette-${next}`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[current]);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setQuery("");
          setActive(0);
          setStatus("");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="glass shadow-soft fixed left-1/2 top-[12vh] z-[71] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl border border-border-strong data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"
        >
          <Dialog.Title className="sr-only">Search the site</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-5">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={results.length ? `palette-${current}` : undefined}
              aria-label="Search pages, projects and technologies"
              placeholder="Search pages, projects, technologies"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
                setStatus("");
              }}
              onKeyDown={onKeyDown}
              className="h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul id="palette-list" role="listbox" aria-label="Results" className="max-h-[min(60vh,28rem)] overflow-y-auto p-2" data-lenis-prevent>
            {results.map((entry, i) => (
              <li
                key={`${entry.group}-${entry.label}`}
                id={`palette-${i}`}
                role="option"
                aria-selected={i === current}
                onPointerMove={() => i !== current && setActive(i)}
                onClick={() => choose(entry)}
                className={cn(
                  "flex cursor-pointer items-baseline justify-between gap-4 rounded-2xl px-3 py-2.5",
                  i === current && "bg-brand-soft"
                )}
              >
                <span className="min-w-0 truncate">
                  {entry.label}
                  {entry.hint ? <span className="ml-2 text-sm text-muted-foreground">{entry.hint}</span> : null}
                </span>
                <span className="meta shrink-0">{entry.group}</span>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="px-3 py-6 text-muted-foreground">
                Nothing matches &ldquo;{query}&rdquo;. Try a technology, such as Supabase, or a page name.
              </li>
            ) : null}
          </ul>
          <p role="status" className="min-h-0 px-5 text-sm text-brand empty:hidden [&:not(:empty)]:pb-4">
            {status}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
