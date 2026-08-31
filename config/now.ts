/**
 * What Kalana is building right now. One sentence.
 *
 * An empty string means the section does not render. That is deliberate:
 * an unfilled section shows nothing rather than a placeholder.
 *
 * updatedAt is a hand written literal and must never be new Date(). That
 * evaluates at build time, so every deploy would claim this was written
 * today, which is a fabricated freshness date.
 */
export const now = {
  text: "",
  updatedAt: new Date("2026-08-01"),
};
