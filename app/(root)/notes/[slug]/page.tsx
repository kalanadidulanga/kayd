import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Scene } from "@/components/scene";
import { Experiences } from "@/config/experience";
import { publishedNotes } from "@/config/notes";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNotes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = publishedNotes.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: { type: "article", title: `${note.title} | KayD`, description: note.summary, publishedTime: note.published },
  };
}

function date(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** A note: a calm 740px reading column. A table of contents appears only for long notes. */
export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const index = publishedNotes.findIndex((n) => n.slug === slug);
  if (index === -1) notFound();
  const note = publishedNotes[index];
  const next = publishedNotes[index + 1];
  const headings = note.body.filter((b) => b.type === "h2");
  const related = (note.related ?? []).flatMap((id) => Experiences.filter((e) => e.id === id));

  return (
    <Scene as="article" tone="clear" light={[50, 0]} className="pt-36 md:pt-44">
      <div className="container">
        <div className="mx-auto max-w-[740px]">
          <Link href="/notes" className="text-[15px] text-muted-foreground hover:text-foreground">
            ← All notes
          </Link>
          <h1 className="type-display mt-10">{note.title}</h1>
          <p className="type-lead mt-6">{note.summary}</p>
          <p className="meta mt-6">
            <time dateTime={note.published}>{date(note.published)}</time>
            {note.updated ? (
              <>
                , updated <time dateTime={note.updated}>{date(note.updated)}</time>
              </>
            ) : null}
            , {note.topics.join(", ")}
          </p>

          {headings.length >= 4 ? (
            <nav aria-label="Contents" className="mt-10 border-l border-border-strong pl-5">
              <ul className="space-y-1.5 text-[15px]">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-muted-foreground hover:text-brand">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="mt-12 space-y-6 text-[18px] leading-[1.75]">
            {note.body.map((b, i) => {
              switch (b.type) {
                case "p":
                  return <p key={i}>{b.text}</p>;
                case "h2":
                  return (
                    <h2 key={i} id={b.id} className="type-title scroll-mt-28 pt-6">
                      {b.text}
                    </h2>
                  );
                case "code":
                  return (
                    <pre key={i} tabIndex={0} aria-label={`${b.lang} code`} className="overflow-x-auto rounded-xl border border-border-strong bg-field p-5 font-mono text-[14px] leading-relaxed">
                      <code>{b.code}</code>
                    </pre>
                  );
                case "figure":
                  return (
                    <figure key={i}>
                      <Image src={b.src} alt={b.alt} width={b.width} height={b.height} sizes="740px" className="h-auto w-full rounded-lg border border-border" />
                      <figcaption className="meta mt-3">{b.caption}</figcaption>
                    </figure>
                  );
              }
            })}
          </div>

          {related.length || next ? (
            <footer className="mt-20 grid gap-10 border-t border-border pt-10 md:grid-cols-2">
              {related.length ? (
                <div>
                  <h2 className="meta">Related work</h2>
                  <ul className="mt-3 space-y-2">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link href={`/work/${r.id}`} className="text-brand hover:underline">
                          {r.companyName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {next ? (
                <div>
                  <h2 className="meta">Next note</h2>
                  <Link href={`/notes/${next.slug}`} className="mt-3 block font-medium hover:text-brand">
                    {next.title}
                  </Link>
                </div>
              ) : null}
            </footer>
          ) : null}
        </div>
      </div>
    </Scene>
  );
}
