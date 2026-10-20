import { cn } from "@/lib/utils";

type Tone = "canvas" | "deep" | "clear";
type Texture = "none" | "grid" | "contour" | "field";
type Edge = "open" | "fog";

/**
 * One scene of a page. It never paints a rectangle: its atmosphere is a large
 * radial light at `light` (x/y percentages) that fades out at both edges, so
 * the next scene continues the same field. `deep` deepens the field through
 * a 20 to 35vh gradient bridge instead of a hard band; `overlap` starts the
 * scene before the previous one visually ends; `thread` carries one fine
 * line through it at the given x, handing the eye on to the next scene.
 */
export function Scene({
  id,
  as: Tag = "section",
  tone = "canvas",
  light = [70, 30],
  texture = "none",
  edge = "open",
  overlap = false,
  thread,
  className,
  children,
  ...rest
}: {
  id?: string;
  as?: "section" | "header" | "div" | "footer" | "article";
  tone?: Tone;
  light?: [number, number];
  texture?: Texture;
  edge?: Edge;
  overlap?: boolean;
  /** x position of the thread, e.g. "8%" or "calc(50% - 600px)" */
  thread?: string;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      id={id}
      data-scene=""
      data-tone={tone}
      data-edge={edge}
      data-overlap={overlap || undefined}
      className={cn("scene scroll-mt-24 py-24 md:py-40", className)}
      style={{ "--lx": `${light[0]}%`, "--ly": `${light[1]}%` } as React.CSSProperties}
      {...rest}
    >
      <div aria-hidden="true" className="scene-atmos">
        {texture !== "none" ? <div className="scene-texture" data-texture={texture} /> : null}
      </div>
      {thread ? <span aria-hidden="true" className="thread hidden md:block" style={{ left: thread }} /> : null}
      {children}
    </Tag>
  );
}

/** A scene heading: a large title, an optional lead, and an optional link aside. */
export function SceneHeading({
  title,
  soft,
  lead,
  action,
  as: Heading = "h2",
  className,
}: {
  title: string;
  /** A second phrase in the lighter weight of the same family. */
  soft?: string;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      data-rise={Heading === "h1" ? "load" : ""}
      className={cn("mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="max-w-4xl">
        <Heading className={Heading === "h1" ? "type-display" : "type-section"}>
          {title}
          {soft ? (
            <>
              {" "}
              <span className="type-soft">{soft}</span>
            </>
          ) : null}
        </Heading>
        {lead ? <div className="type-lead mt-6 max-w-2xl">{lead}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** A text link with a fine directional cue that leans forward on hover. */
export function Cue({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("group/cue inline-flex items-center gap-3 font-medium", className)}>
      {children}
      <span
        aria-hidden="true"
        className="relative h-px w-6 bg-current transition-[width] duration-300 ease-cine group-hover/cue:w-9 after:absolute after:-top-[3px] after:right-0 after:h-[7px] after:w-[7px] after:rotate-45 after:border-r after:border-t after:border-current"
      />
    </span>
  );
}
