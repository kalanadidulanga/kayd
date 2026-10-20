/**
 * Notes: an engineering journal. Real, published notes only. Dates are
 * hand-written literals ("YYYY-MM-DD"), never computed at build time, which
 * would claim a fresh date on every deploy.
 */
export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "figure"; src: string; alt: string; width: number; height: number; caption: string };

export interface Note {
  slug: string;
  title: string;
  summary: string;
  published: string;
  updated?: string;
  topics: string[];
  /** Project ids from config/experience.ts. */
  related?: string[];
  body: NoteBlock[];
}

export const notes: Note[] = [];

/**
 * A layout fixture for `pnpm dev` only, so the article page can be checked
 * before the first real note exists. It never builds into production.
 */
const fixtures: Note[] = [
  {
    slug: "layout-fixture",
    title: "Layout fixture: how a note renders",
    summary: "Development only. Shows the reading column, headings, a code block and the related project.",
    published: "2026-10-20",
    topics: ["Fixture"],
    related: ["kayd-invoice-studio"],
    body: [
      { type: "p", text: "This paragraph sits in the reading column. It exists only in development builds." },
      { type: "h2", id: "code", text: "A code block" },
      { type: "code", lang: "ts", code: 'export const notes: Note[] = [];\n// Real notes go here.' },
      { type: "h2", id: "end", text: "The end of the note" },
      { type: "p", text: "Related work and the next note follow below." },
    ],
  },
];

export const publishedNotes: Note[] = [
  ...notes,
  ...(process.env.NODE_ENV === "development" ? fixtures : []),
].sort((a, b) => b.published.localeCompare(a.published));
