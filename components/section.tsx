import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

/** A full-width band; `band` gives it the alternate background. */
export function Section({
  id,
  band = false,
  className,
  children,
}: {
  id?: string;
  band?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-24 md:py-36",
        band && "border-y border-border bg-band",
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

/**
 * Mono eyebrow, a large tight title that may end in an italic serif
 * phrase, an optional lead, and an optional link on the right.
 */
export function SectionHeading({
  eyebrow,
  title,
  serif,
  lead,
  action,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  serif?: string;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    // A page title is on screen at load: it plays at once, not on scroll.
    <Reveal
      immediate={Heading === "h1"}
      className={cn(
        "mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
        <Heading className={Heading === "h1" ? "type-hero" : "type-section"}>
          {title}
          {serif ? (
            <>
              {" "}
              <span className="serif-accent text-muted-foreground">{serif}</span>
            </>
          ) : null}
        </Heading>
        {lead ? <p className="type-lead mt-6 max-w-2xl">{lead}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}

/** "See all ›" style link with an arrow that nudges on hover. */
export function ArrowLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group inline-flex items-center gap-2 font-medium", className)}>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-cine group-hover:translate-x-1"
      >
        →
      </span>
    </span>
  );
}
