import type { Metadata } from "next";
import Link from "next/link";

import { Scene, SceneHeading, Cue } from "@/components/scene";
import { publishedNotes } from "@/config/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "An engineering journal: decisions and lessons from the work.",
  alternates: { canonical: "/notes" },
  // An empty index is not worth a search result.
  robots: publishedNotes.length ? undefined : { index: false },
};

function date(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function NotesPage() {
  const [featured, ...rest] = publishedNotes;
  return (
    <Scene as="div" tone="clear" light={[30, 10]} className="min-h-[70dvh] pt-36 md:pt-44">
      <div className="container max-w-[1000px]">
        <SceneHeading as="h1" title="Notes" lead="An engineering journal: decisions and lessons from the work." />
        {featured ? (
          <>
            <article data-rise="" className="border-t border-border py-10">
              <p className="meta">
                <time dateTime={featured.published}>{date(featured.published)}</time>, {featured.topics.join(", ")}
              </p>
              <h2 className="type-title mt-3">
                <Link href={`/notes/${featured.slug}`} className="hover:text-brand">
                  {featured.title}
                </Link>
              </h2>
              <p className="type-lead mt-4 max-w-2xl">{featured.summary}</p>
            </article>
            {rest.length ? (
              <ul className="border-t border-border">
                {rest.map((n) => (
                  <li key={n.slug} className="border-b border-border">
                    <Link href={`/notes/${n.slug}`} className="grid gap-1 py-5 hover:text-brand md:grid-cols-[10rem_1fr]">
                      <time dateTime={n.published} className="meta">
                        {date(n.published)}
                      </time>
                      <span className="font-medium">{n.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <div data-testid="notes-empty" className="border-t border-border py-12">
            <p className="type-card">Nothing published here yet.</p>
            <p className="mt-3 max-w-xl text-muted-foreground">
              In the meantime, the decisions behind each system are written up on its project page.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/work" className="text-brand">
                <Cue>Browse the work</Cue>
              </Link>
              <Link href="/lab" className="text-foreground hover:text-brand">
                <Cue>Visit the Lab</Cue>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}
