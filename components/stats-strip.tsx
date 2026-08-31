import { siteStats } from "@/lib/stats";

const items = [
  { value: siteStats.projects, label: "Projects" },
  { value: siteStats.clients, label: "Clients" },
  { value: siteStats.technologies, label: "Technologies" },
];

export function StatsStrip() {
  return (
    <ul
      data-testid="stats-strip"
      className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
    >
      {items.map((item) => (
        <li key={item.label} className="text-center">
          <span className="type-card text-brand">{item.value}</span>{" "}
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
