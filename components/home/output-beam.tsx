// One beam out of the code window, split three ways, in a 360x360 box whose
// left edge sits on the window's right edge. Each branch has a thin core,
// a light cone that widens toward its device (`cone`), and a device whose
// screen lights up when a comet arrives.
const BRANCHES = [
  {
    d: "M0 180 C110 180 160 60 276 60",
    cone: "M0 180 C110 179 160 46 276 45 L276 75 C160 74 110 181 0 180 Z",
    screen: { x: 277.5, y: 50.5, width: 65, height: 31, rx: 5 },
  },
  {
    d: "M0 180 H296",
    cone: "M0 180 C100 179.5 200 166 296 165 L296 195 C200 194 100 180.5 0 180 Z",
    screen: { x: 298, y: 161, width: 24, height: 38, rx: 3 },
  },
  {
    d: "M0 180 C110 180 160 299 278 299",
    cone: "M0 180 C110 179 160 284 278 284 L278 314 C160 314 110 181 0 180 Z",
    screen: { x: 279.5, y: 280.5, width: 61, height: 37, rx: 3 },
  },
];

// Raw code riding the line in from the left, into the window. One speed
// and even spacing, so no token ever overtakes another.
const TOKENS = ["const", "=>", "SELECT *", "<div>", "async", "fn main()", "{ }", "useState", "JOIN", "await"];
const TOKEN_TRIP = 18;

// A comet takes the first 60% of each cycle to reach its device, then rests.
const CYCLE = 3.6;
const START = 3.2;

/**
 * The hero's "three outputs": code drifts in from the left, through the
 * window, and leaves as light that splits into web, mobile and desktop, the
 * three things `ships` lists in kalana.ts. SVG, CSS and SMIL only (see
 * .beam-* in globals.css): it themes with the accent, needs no JavaScript,
 * and reduced motion shows it drawn and still. Wide screens only.
 */
export function OutputBeam() {
  return (
    <div aria-hidden="true" data-testid="output-beam" className="pointer-events-none hidden xl:block">
      <div className="absolute right-full top-1/2 w-[50vw]">
        <div className="beam-line absolute inset-x-0 -top-px h-[3px] bg-linear-to-r from-transparent to-brand opacity-50 blur-[3px]" />
        <div className="beam-line h-px bg-linear-to-r from-transparent via-brand/40 to-brand" />
        <div className="beam-tokens beam-motion absolute inset-x-0 bottom-0 h-10 overflow-hidden">
          {TOKENS.map((t, i) => (
            <span
              key={t}
              className="beam-token absolute bottom-1.5 left-0 font-mono text-[10.5px] leading-4 whitespace-nowrap"
              style={
                {
                  "--dy": `${-(i % 3) * 6}px`,
                  animationDuration: `${TOKEN_TRIP}s`,
                  animationDelay: `${-(i * TOKEN_TRIP) / TOKENS.length}s`,
                  color: i % 3 === 0 ? "var(--brand)" : "var(--muted-foreground)",
                } as React.CSSProperties
              }
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 360 360" className="absolute left-full top-1/2 h-auto w-60 -translate-y-1/2 overflow-visible 2xl:w-90">
        <defs>
          <linearGradient id="beam-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
            <stop offset="0" style={{ stopColor: "var(--brand)" }} />
            <stop offset="1" style={{ stopColor: "var(--brand)", stopOpacity: 0.35 }} />
          </linearGradient>
          <linearGradient id="beam-cone" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
            <stop offset="0" style={{ stopColor: "var(--brand)", stopOpacity: 0.6 }} />
            <stop offset="0.5" style={{ stopColor: "var(--brand)", stopOpacity: 0.24 }} />
            <stop offset="1" style={{ stopColor: "var(--brand)", stopOpacity: 0.1 }} />
          </linearGradient>
          {/* User-space regions: the straight branch has a zero-height box. */}
          <filter id="beam-glow" filterUnits="userSpaceOnUse" x="-20" y="0" width="400" height="360">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="beam-soft" filterUnits="userSpaceOnUse" x="-20" y="0" width="400" height="360">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Light cones, brighter while the pointer is over the code window. */}
        <g className="opacity-80 transition-opacity duration-700 group-hover/hero:opacity-100">
          <g className="beam-device" fill="url(#beam-cone)" filter="url(#beam-soft)">
            {BRANCHES.map((b) => (
              <path key={b.d} d={b.cone} />
            ))}
          </g>
        </g>

        <g fill="none" stroke="url(#beam-fade)" strokeLinecap="round">
          <g filter="url(#beam-glow)" strokeWidth="6" opacity="0.45">
            {BRANCHES.map((b) => (
              <path key={b.d} d={b.d} pathLength={1} className="beam-branch" />
            ))}
          </g>
          {BRANCHES.map((b) => (
            <path key={b.d} d={b.d} pathLength={1} strokeWidth="1.25" className="beam-branch" />
          ))}
        </g>

        {/* The junction: a steady point with a ring that keeps pulsing out. */}
        <circle cx="0" cy="180" r="12" fill="var(--brand)" opacity="0.35" filter="url(#beam-glow)" className="beam-device" />
        <circle cx="0" cy="180" r="3" fill="var(--brand)" className="beam-device" />
        <circle cx="0" cy="180" r="3" fill="none" stroke="var(--brand)" strokeWidth="1" className="beam-motion">
          <animate attributeName="r" values="3;16" dur="2.4s" begin={`${START}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.4s" begin={`${START}s`} repeatCount="indefinite" />
        </circle>

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

        {/* Comets: a glowing head and tail run each branch in turn, and the
            device's screen lights up as it lands. */}
        <g className="beam-motion">
          {BRANCHES.map((b, i) => {
            const begin = `${START + i * (CYCLE / 3)}s`;
            const timing = { dur: `${CYCLE}s`, begin, repeatCount: "indefinite" } as const;
            return (
              <g key={b.d}>
                <rect {...b.screen} fill="var(--brand)" fillOpacity="0">
                  <animate attributeName="fill-opacity" values="0;0;0.45;0;0" keyTimes="0;0.58;0.63;0.95;1" {...timing} />
                </rect>
                {[
                  { width: 7, opacity: 0.45, filter: "url(#beam-glow)" },
                  { width: 2.25, opacity: 1, filter: undefined },
                ].map((tail) => (
                  <path
                    key={tail.width}
                    d={b.d}
                    pathLength={1}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth={tail.width}
                    strokeOpacity={tail.opacity}
                    strokeLinecap="round"
                    strokeDasharray="0.14 1"
                    strokeDashoffset="0.14"
                    filter={tail.filter}
                  >
                    {/* Leading edge in step with the head; parked past the end while it rests. */}
                    <animate attributeName="stroke-dashoffset" values="0.14;-0.86;-1;-1" keyTimes="0;0.6;0.62;1" {...timing} />
                  </path>
                ))}
                <g opacity="0">
                  <animateMotion path={b.d} keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear" {...timing} />
                  <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.58;0.61;1" {...timing} />
                  <circle r="6" fill="var(--brand)" opacity="0.6" filter="url(#beam-glow)" />
                  <circle r="2.4" fill="var(--brand)" />
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
