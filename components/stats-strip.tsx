import { siteStats } from "@/lib/stats";

const items = [
  { value: siteStats.projectsShipped, label: "Projects shipped" },
  { value: siteStats.clients, label: "Clients" },
  { value: siteStats.technologies, label: "Technologies" },
];

export function StatsStrip() {
  return (
    <dl
      data-testid="stats-strip"
      className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
    >
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <dt className="sr-only">{item.label}</dt>
          <dd>
            <span className="type-card text-brand">{item.value}</span>{" "}
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
