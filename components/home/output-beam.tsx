// Branch paths in a 360x360 box whose left edge sits on the code window's
// right edge: one beam out of the code, split three ways.
const BRANCHES = [
  "M0 180 C110 180 160 60 276 60",
  "M0 180 H296",
  "M0 180 C110 180 160 299 278 299",
];

/**
 * The hero's "three outputs": a beam runs in from the left, through the code
 * window, and splits into web, mobile and desktop, the same three things
 * `ships` lists in kalana.ts. SVG and CSS only (see .beam-* in globals.css),
 * so it themes with the accent, needs no JavaScript, and reduced motion
 * shows it already drawn. Wide screens only: narrower ones have no gutter.
 */
export function OutputBeam() {
  return (
    <div aria-hidden="true" data-testid="output-beam" className="pointer-events-none hidden xl:block">
      <div className="absolute right-full top-1/2 w-[50vw]">
        <div className="beam-line absolute inset-x-0 -top-px h-[3px] bg-linear-to-r from-transparent to-brand opacity-60 blur-[3px]" />
        <div className="beam-line h-px bg-linear-to-r from-transparent to-brand" />
      </div>

      <svg viewBox="0 0 360 360" className="absolute left-full top-1/2 h-auto w-60 -translate-y-1/2 overflow-visible 2xl:w-90">
        <defs>
          <linearGradient id="beam-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
            <stop offset="0" style={{ stopColor: "var(--brand)" }} />
            <stop offset="1" style={{ stopColor: "var(--brand)", stopOpacity: 0.35 }} />
          </linearGradient>
          {/* User-space region: the straight branch has a zero-height box. */}
          <filter id="beam-glow" filterUnits="userSpaceOnUse" x="-20" y="0" width="400" height="360">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <g fill="none" stroke="url(#beam-fade)" strokeLinecap="round">
          <g filter="url(#beam-glow)" strokeWidth="6" opacity="0.5">
            {BRANCHES.map((d) => (
              <path key={d} d={d} pathLength={1} className="beam-branch" />
            ))}
          </g>
          {BRANCHES.map((d) => (
            <path key={d} d={d} pathLength={1} strokeWidth="1.5" className="beam-branch" />
          ))}
          {BRANCHES.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              stroke="var(--brand)"
              strokeWidth="2.5"
              className="beam-pulse"
              style={{ animationDelay: `${3 + i * 0.45}s` }}
            />
          ))}
        </g>
        <circle cx="0" cy="180" r="3" fill="var(--brand)" className="beam-device" />

        <g fill="var(--surface)" fillOpacity="0.6" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.25" className="beam-device text-foreground">
          {/* Web: a browser window. */}
          <rect x="276" y="38" width="68" height="44" rx="6" />
          <path d="M276 50 H344" />
          <g fill="currentColor" fillOpacity="0.5" stroke="none">
            <circle cx="283" cy="44" r="1.6" />
            <circle cx="289" cy="44" r="1.6" />
            <circle cx="295" cy="44" r="1.6" />
          </g>
          <rect x="284" y="58" width="40" height="4" rx="2" fill="var(--brand)" fillOpacity="0.7" stroke="none" />
          <path d="M284 70 H316" strokeOpacity="0.25" />
          {/* Mobile: a phone. */}
          <rect x="296" y="154" width="28" height="52" rx="6" />
          <path d="M306 159 H314 M305 200 H315" strokeOpacity="0.35" />
          {/* Desktop: a monitor on a stand. */}
          <rect x="278" y="279" width="64" height="40" rx="4" />
          <path d="M310 319 V327 M298 327 H322" />
          <rect x="286" y="288" width="22" height="4" rx="2" fill="var(--brand)" fillOpacity="0.7" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
