/**
 * Where Kalana has worked, as he stated it on 2026-10-09.
 *
 * Dates carry no more precision than he gave: "YYYY" or "YYYY-MM". A title
 * he has not confirmed is left out and the company shows alone, rather
 * than a plausible title being guessed.
 */
export interface Role {
  company: string;
  title?: string;
  start: string;
  /** Omitted while the role is current. */
  end?: string;
  note?: string;
}

export const roles: Role[] = [
  { company: "TwinCoreTech Ltd", title: "Software Engineer", start: "2025" },
  {
    company: "C-Lento Software Company (Pvt) Ltd",
    title: "Project Manager and Software Engineer",
    start: "2023",
    note: "Project-based work since 2023, and project manager and engineer since 2026.",
  },
  { company: "Freelance", title: "Full Stack Developer", start: "2023" },
  { company: "Fuchsius (Pvt) Ltd", title: "Software Engineer", start: "2024-12", end: "2025" },
  // 2024 is the last commit seen for Techseya work, not a stated end date.
  { company: "Techseya (Pvt) Ltd", start: "2023", end: "2024", note: "Project-based." },
];

export const currentRoles = roles.filter((r) => !r.end);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatPoint(point: string): string {
  const [year, month] = point.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

/** "Since 2025" for a current role, "Dec 2024 to 2025" for a past one. */
export function formatRange(role: Role): string {
  if (!role.end) return `Since ${formatPoint(role.start)}`;
  if (role.end === role.start) return formatPoint(role.start);
  return `${formatPoint(role.start)} to ${formatPoint(role.end)}`;
}

/** Roles as entries for the git-log view: newest first, the first current one is HEAD. */
export function logEntries(list: Role[] = roles) {
  return list.map((r, i) => ({
    when: formatRange(r),
    title: r.title ?? r.company,
    where: r.title ? r.company : undefined,
    note: r.note,
    head: i === 0 && !r.end,
  }));
}
