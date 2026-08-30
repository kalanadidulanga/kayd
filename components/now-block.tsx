import { now } from "@/config/now";
import { SectionHeader } from "@/components/section-header";

export function NowBlock() {
  if (now.text.trim() === "") return null;

  const updated = now.updatedAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section id="now" className="container py-16 md:py-24">
      <SectionHeader index="01" label="Now" title="What I am building" />
      <div className="mt-8 max-w-2xl">
        <p className="text-lg leading-relaxed sm:text-xl">{now.text}</p>
        <p className="type-label mt-6 text-muted-foreground">Updated {updated}</p>
      </div>
    </section>
  );
}
