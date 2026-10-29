/**
 * Notes: an engineering journal. Real, published notes only. Dates are
 * hand-written literals ("YYYY-MM-DD"), never computed at build time, which
 * would claim a fresh date on every deploy.
 *
 * Every fact in these notes is one already documented for the project in
 * config/experience.ts. The notes explain the reasoning; they add no new
 * numbers, outcomes or claims.
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

export const notes: Note[] = [
  {
    slug: "one-ledger-for-every-report",
    title: "One ledger for every report",
    summary: "Why the hotel system's revenue reports read from the general ledger, and why reconciliation runs as a dry run first.",
    published: "2026-10-29",
    topics: ["Accounting", "Architecture"],
    related: ["hotel-management-system"],
    body: [
      { type: "p", text: "A hotel system has many places that know about money: reservations, the front office, the restaurant and bar, stock, and the accounts. When each report adds up its own numbers, two reports can describe the same night differently, and nobody can say which one is right." },
      { type: "p", text: "Most of my work on the hotel system has been in that part: accounting, reports and reservations." },
      { type: "h2", id: "single-source", text: "The ledger is the source" },
      { type: "p", text: "The general ledger became the single source for revenue reports, with tests. A report is a view of the ledger, not a second calculation, so it cannot drift away from the accounts." },
      { type: "p", text: "Two smaller decisions follow from the same idea. Journal entries sit under vouchers, and opening balances link to ledger entities, so every figure can be traced back to where it came from." },
      { type: "h2", id: "dry-run", text: "Reconcile as a dry run first" },
      { type: "p", text: "Reconciliation scripts for debtors, agents and creditors run as a dry run first, followed by a trial balance check. On a system that is already running at hotels, a script that changes balances should show what it would do before it does it." },
      { type: "h2", id: "cost-at-issue", text: "Cost when stock is issued" },
      { type: "p", text: "Inventory cost is recognised when stock is issued rather than when it is bought. A kitchen buys in bulk and uses it over days, so cost belongs to the day the stock is actually used." },
    ],
  },
  {
    slug: "say-what-you-cannot-compute",
    title: "Say what you cannot compute",
    summary: "In Kendara, the checks the app cannot calculate are reported as unknown instead of being guessed.",
    published: "2026-10-29",
    topics: ["Product", "AI"],
    related: ["kendara"],
    body: [
      { type: "p", text: "Kendara builds a Vedic birth chart from birth details, or from a photo of a Sri Lankan kendaraya, and writes a reading in Sinhala, English or Tamil. It is easy for software like this to sound certain about everything. I wanted it to be honest about where its knowledge stops." },
      { type: "h2", id: "unknown", text: "Unknown is an answer" },
      { type: "p", text: "Marriage matching (porondam) has 20 checks. Kendara computes 12 of them, and reports the rest as unknown rather than guessing them. An empty answer that says so is more useful than a confident one that is made up." },
      { type: "h2", id: "inputs", text: "Get the inputs right first" },
      { type: "p", text: "The chart itself comes from the Swiss Ephemeris with the Lahiri ayanamsa and whole-sign houses, and the historical Sri Lankan time zone is resolved for each birth instant, because Sri Lanka's time zone has changed over the years." },
      { type: "p", text: "When the input is a photo, the AI reads it into an editable table first, so the reader can check and correct it before anything is calculated." },
      { type: "h2", id: "guarded", text: "Guard the model" },
      { type: "p", text: "Readings come from Gemini models behind a fallback chain and an output guard. The model writes the words; the calculation stays in code." },
    ],
  },
  {
    slug: "a-second-way-to-run-the-clock",
    title: "A second way to run the clock",
    summary: "SLA timers on the Uniguru operations platform run as scheduled jobs, with a fallback for the clock itself.",
    published: "2026-10-29",
    topics: ["Reliability", "Architecture"],
    related: ["operations-crm-platform"],
    body: [
      { type: "p", text: "The Uniguru operations platform holds a consultancy's lead pipeline, admissions, partners and staff work in one place. Some of that work has deadlines: a lead should be followed up within its SLA, and a breach should be recorded when it is not." },
      { type: "h2", id: "jobs", text: "Clocks as scheduled jobs" },
      { type: "p", text: "SLA clocks run as scheduled jobs on Vercel and record breaches. If the job that measures time stops running, the platform quietly stops noticing late work, which is the one thing it is there to notice." },
      { type: "p", text: "So the SLA clock has a GitHub Actions fallback. One scheduler can fail without the clock stopping." },
      { type: "h2", id: "permissions", text: "Checks in more than one place" },
      { type: "p", text: "The same thinking applies to access. Every user has a system role, roles map to permission groups, and each route and server action checks the permissions it needs, on top of row-level security in Postgres." },
    ],
  },
  {
    slug: "an-app-with-no-backend",
    title: "An app with no backend",
    summary: "KayD Invoice Studio keeps everything in the browser. That choice moves some hard problems into the client.",
    published: "2026-10-29",
    topics: ["Frontend", "Product"],
    related: ["kayd-invoice-studio"],
    body: [
      { type: "p", text: "KayD Invoice Studio lets you create, save and export invoices without an account. There is no login and no backend: everything stays in the browser's storage." },
      { type: "h2", id: "storage", text: "Storage needs a schema too" },
      { type: "p", text: "Without a server, the browser is the database, so it gets treated like one. Local storage is versioned, with migration, and conflicts between open tabs are detected." },
      { type: "p", text: "Because the data never leaves the browser, there are JSON backups to move it elsewhere, and a restore that validates the file before it is used." },
      { type: "h2", id: "pdf", text: "PDFs in the browser" },
      { type: "p", text: "PDFs are generated in the browser, as A4 pages with pagination and repeated headers. Sinhala and other non-Latin scripts get a print fallback, so an invoice in any language can still be saved." },
    ],
  },
];

export const publishedNotes: Note[] = [...notes].sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
