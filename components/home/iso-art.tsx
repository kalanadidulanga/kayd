import { ArrowUpDown, Bell, Cloud, CodeXml, User, Users } from "lucide-react";
import { FaWindows } from "react-icons/fa";
import { SiReact } from "react-icons/si";

/*
 * Isometric illustrations for the "What I do" bento. Every colour is mixed
 * from var(--brand) and var(--surface), so the art follows the accent picker
 * and both themes. SVG only, no JavaScript; motion is CSS (.iso-float) and
 * SMIL, both off under reduced motion (.beam-motion, see globals.css).
 *
 * World axes: x runs right-down, y runs left-down, z runs up. The faces a
 * viewer sees are the top, the +y face ("front", lower left) and the +x
 * face ("side", lower right).
 */

const C = 0.866;
const S = 0.5;
type V = [number, number, number];

const sx = ([x, y]: V) => (x - y) * C;
const sy = ([x, y, z]: V) => (x + y) * S - z;
const pt = (v: V) => `${sx(v).toFixed(1)},${sy(v).toFixed(1)}`;
const pts = (...vs: V[]) => vs.map(pt).join(" ");
const path = (...vs: V[]) => "M" + vs.map(pt).join(" L");

/** Maps local (u right, v down) onto the +y face whose top edge is at z. */
const onFront = (x: number, y: number, z: number) =>
  `matrix(${C} ${S} 0 1 ${((x - y) * C).toFixed(1)} ${((x + y) * S - z).toFixed(1)})`;
/** Maps local (u along x, v along y) onto a top face at height z. */
const onTop = (x: number, y: number, z: number) =>
  `matrix(${C} ${S} ${-C} ${S} ${((x - y) * C).toFixed(1)} ${((x + y) * S - z).toFixed(1)})`;

const TONE = {
  top: "color-mix(in oklab, var(--brand) 32%, var(--surface))",
  front: "color-mix(in oklab, var(--brand) 16%, var(--surface))",
  side: "color-mix(in oklab, var(--brand) 8%, var(--surface))",
  lit: "color-mix(in oklab, var(--brand) 55%, var(--surface))",
  screen: "color-mix(in oklab, var(--brand) 10%, var(--background))",
  edge: "color-mix(in oklab, var(--brand) 55%, transparent)",
  faint: "color-mix(in oklab, var(--brand) 25%, transparent)",
  rim: "color-mix(in oklab, var(--brand) 85%, var(--foreground))",
};

function Box({ at: [x, y, z], size: [w, d, h], lit = false }: { at: V; size: V; lit?: boolean }) {
  return (
    <g stroke={TONE.edge} strokeWidth={0.8} strokeLinejoin="round">
      <polygon points={pts([x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z])} fill={TONE.front} />
      <polygon points={pts([x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z])} fill={TONE.side} />
      <polygon points={pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])} fill={lit ? TONE.lit : TONE.top} />
      {/* The two edges nearest the viewer catch the light. */}
      <polyline points={pts([x, y + d, z + h], [x + w, y + d, z + h], [x + w, y, z + h])} fill="none" stroke={TONE.rim} strokeWidth={1.1} />
    </g>
  );
}

/** A low slab with a soft glowing rim, for things to stand on. */
function Plinth({ at, size, glow }: { at: V; size: V; glow: string }) {
  const [x, y, z] = at;
  const [w, d] = size;
  return (
    <g>
      <polygon
        points={pts([x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z])}
        fill="none"
        stroke="var(--brand)"
        strokeWidth={3}
        opacity={0.35}
        filter={`url(#${glow})`}
      />
      <Box at={at} size={size} />
    </g>
  );
}

function Cylinder({ at: [x, y, z], r, h, bands = [], glow }: { at: V; r: number; h: number; bands?: number[]; glow: string }) {
  const cx = sx([x, y, 0]);
  const top = sy([x, y, z + h]);
  const bottom = sy([x, y, z]);
  const rx = r * 1.2247;
  const ry = r * 0.7071;
  const arc = (yy: number) => `M${(cx - rx).toFixed(1)},${yy.toFixed(1)} A${rx.toFixed(1)},${ry.toFixed(1)} 0 0 0 ${(cx + rx).toFixed(1)},${yy.toFixed(1)}`;
  return (
    <g stroke={TONE.edge} strokeWidth={0.8}>
      <path d={`${arc(bottom)} L${(cx + rx).toFixed(1)},${top.toFixed(1)} L${(cx - rx).toFixed(1)},${top.toFixed(1)} Z`} fill={TONE.front} />
      {bands.map((t) => (
        <g key={t}>
          <path d={arc(sy([x, y, z + t]))} fill="none" stroke="var(--brand)" strokeWidth={4} opacity={0.5} filter={`url(#${glow})`} />
          <path d={arc(sy([x, y, z + t]))} fill="none" stroke="var(--brand)" strokeWidth={1.6} />
        </g>
      ))}
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={TONE.top} />
    </g>
  );
}

/** A thin upright panel facing front, with content drawn in its own plane. */
function Panel({
  at: [x, y, z],
  w,
  h,
  lit = false,
  children,
}: {
  at: V;
  w: number;
  h: number;
  lit?: boolean;
  children?: React.ReactNode;
}) {
  const d = 5;
  return (
    <g>
      <Box at={[x, y, z]} size={[w, d, h]} />
      <g transform={onFront(x, y + d, z + h)}>
        <rect x={3} y={3} width={w - 6} height={h - 6} rx={4} fill={lit ? TONE.lit : TONE.screen} stroke={TONE.faint} strokeWidth={0.8} />
        {children}
      </g>
    </g>
  );
}

/** A panel that hovers and bobs slowly, with a soft shadow on the floor. */
function Floating({ at, w, h, delay = 0, children }: { at: V; w: number; h: number; delay?: number; children?: React.ReactNode }) {
  const [x, y] = at;
  return (
    <g>
      <ellipse cx={sx([x + w / 2, y, 0])} cy={sy([x + w / 2, y + 3, 0])} rx={w * 0.45} ry={w * 0.16} fill="var(--brand)" opacity={0.12} />
      <g className="iso-float" style={{ animationDelay: `${delay}s` }}>
        <Panel at={at} w={w} h={h}>
          {children}
        </Panel>
      </g>
    </g>
  );
}

/** A path along the floor with a glow and a dot of data running it. */
function Wire({ d, glow, dur = 3.2, offset = 0 }: { d: string; glow: string; dur?: number; offset?: number }) {
  return (
    <g fill="none">
      <path d={d} stroke="var(--brand)" strokeWidth={4} opacity={0.18} filter={`url(#${glow})`} />
      <path d={d} stroke="var(--brand)" strokeWidth={1.1} opacity={0.55} />
      <circle r={2.3} fill="var(--brand)" stroke="none" className="beam-motion">
        <animateMotion path={d} dur={`${dur}s`} begin={`${-offset}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function Art({ id, viewBox, className, children }: { id: string; viewBox: string; className?: string; children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} className={className} overflow="visible">
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={4} />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };

/** Web platforms: a database and a server stack feeding an API, under a cloud. */
export function WebArt({ className }: { className?: string }) {
  const g = "iso-glow-web";
  return (
    <Art id={g} viewBox="0 0 470 300" className={className}>
      <g transform="translate(235 125)">
        <Wire glow={g} d={path([20, 175, 0], [70, 175, 0], [70, 105, 0], [84, 105, 0])} />
        <Wire glow={g} d={path([180, 85, 0], [236, 85, 0], [236, 48, 0], [236, 48, 46])} dur={2.6} offset={1.2} />

        <Plinth at={[-62, 122, 0]} size={[84, 84, 6]} glow={g} />
        <Cylinder at={[-20, 164, 6]} r={30} h={66} bands={[20, 44]} glow={g} />

        <Plinth at={[80, 30, 0]} size={[104, 104, 8]} glow={g} />
        {[0, 1, 2].map((i) => {
          const z = 8 + i * 33;
          return (
            <g key={i}>
              <Box at={[94, 44, z]} size={[76, 76, 28]} />
              <g transform={onFront(94, 120, z + 28)}>
                <circle cx={9} cy={14} r={2.2} fill="var(--brand)" className="iso-blink" style={{ animationDelay: `${i * 0.6}s` }} />
                <circle cx={17} cy={14} r={2.2} fill="var(--brand)" opacity={0.45} />
                <rect x={30} y={12} width={38} height={4} rx={2} fill={TONE.faint} />
              </g>
            </g>
          );
        })}
        <Box at={[94, 44, 107]} size={[76, 76, 6]} lit />

        <Floating at={[102, 76, 148]} w={60} h={46} delay={0.4}>
          <Cloud x={13} y={6} width={34} height={34} color="var(--brand)" strokeWidth={1.8} />
          <ArrowUpDown x={23} y={16} width={14} height={14} color="var(--brand)" strokeWidth={2.4} />
        </Floating>

        <Floating at={[204, 40, 52]} w={80} h={64} delay={1.1}>
          <circle cx={11} cy={11} r={2} fill="var(--brand)" />
          <circle cx={18} cy={11} r={2} fill="var(--brand)" opacity={0.6} />
          <circle cx={25} cy={11} r={2} fill="var(--brand)" opacity={0.35} />
          <text x={10} y={38} fontSize={17} fontWeight={600} fill="var(--brand)" style={mono}>
            API
          </text>
          <rect x={10} y={46} width={50} height={3.5} rx={1.75} fill={TONE.faint} />
          <rect x={10} y={53} width={34} height={3.5} rx={1.75} fill={TONE.faint} />
        </Floating>
      </g>
    </Art>
  );
}

/** The project count: a stack of code windows, the front one lit. */
export function StackArt({ className }: { className?: string }) {
  const g = "iso-glow-stack";
  return (
    <Art id={g} viewBox="0 0 300 210" className={className}>
      <g transform="translate(120 70)">
        <Plinth at={[-10, -20, 0]} size={[150, 120, 6]} glow={g} />
        {[3, 2, 1, 0].map((i) => (
          <g key={i} className="iso-float" style={{ animationDelay: `${i * 0.25}s` }}>
            <Panel at={[12 + i * 14, 70 - i * 22, 12 + i * 4]} w={92} h={72} lit={i === 0}>
              <circle cx={10} cy={10} r={1.8} fill="var(--brand)" />
              <circle cx={16} cy={10} r={1.8} fill="var(--brand)" opacity={0.6} />
              {i === 0 ? (
                <CodeXml x={30} y={20} width={32} height={32} color="var(--background)" strokeWidth={2.2} />
              ) : (
                <>
                  <rect x={10} y={22} width={60} height={3.5} rx={1.75} fill={TONE.faint} />
                  <rect x={10} y={30} width={44} height={3.5} rx={1.75} fill={TONE.faint} />
                  <rect x={10} y={38} width={52} height={3.5} rx={1.75} fill={TONE.faint} />
                </>
              )}
            </Panel>
          </g>
        ))}
      </g>
    </Art>
  );
}

/** Mobile: a phone face up with the time and a chart, another behind it. */
export function MobileArt({ className }: { className?: string }) {
  const g = "iso-glow-mobile";
  return (
    <Art id={g} viewBox="0 0 300 230" className={className}>
      <g transform="translate(130 70)">
        <Plinth at={[-20, 0, 0]} size={[180, 140, 5]} glow={g} />

        <Panel at={[90, 24, 5]} w={56} h={114}>
          <circle cx={13} cy={14} r={5} fill={TONE.top} stroke={TONE.edge} strokeWidth={0.8} />
          <circle cx={13} cy={27} r={5} fill={TONE.top} stroke={TONE.edge} strokeWidth={0.8} />
          <circle cx={25} cy={20} r={5} fill={TONE.top} stroke={TONE.edge} strokeWidth={0.8} />
        </Panel>

        <Panel at={[20, 80, 5]} w={58} h={118} lit>
          <rect x={6} y={6} width={46} height={106} rx={7} fill={TONE.screen} />
          <text x={29} y={30} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--foreground)" style={mono}>
            9:41
          </text>
          <path d="M12 72 L20 64 L27 68 L35 56 L46 60" fill="none" stroke="var(--brand)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={12} y={82} width={34} height={4} rx={2} fill={TONE.faint} />
          <rect x={12} y={90} width={24} height={4} rx={2} fill={TONE.faint} />
          <rect x={20} y={104} width={18} height={2.5} rx={1.25} fill={TONE.edge} />
        </Panel>

        <Floating at={[-34, 100, 62]} w={32} h={34} delay={0.3}>
          <Bell x={6} y={7} width={20} height={20} color="var(--brand)" strokeWidth={2} />
        </Floating>
        <Floating at={[122, 112, 34]} w={36} h={36} delay={1}>
          <SiReact x={7} y={7} size={22} color="var(--brand)" />
        </Floating>
      </g>
    </Art>
  );
}

/** Desktop: a laptop with code on screen and a Windows tile beside it. */
export function DesktopArt({ className }: { className?: string }) {
  const g = "iso-glow-desktop";
  const keys = Array.from({ length: 4 * 10 }, (_, i) => i);
  return (
    <Art id={g} viewBox="0 0 300 250" className={className}>
      <g transform="translate(122 86)">
        <Plinth at={[-6, 20, 0]} size={[176, 130, 4]} glow={g} />
        <Box at={[12, 44, 4]} size={[146, 96, 7]} />
        <g transform={onTop(12, 44, 11)}>
          {keys.map((i) => (
            <rect key={i} x={10 + (i % 10) * 12.6} y={10 + Math.floor(i / 10) * 11} width={10} height={8.5} rx={1.5} fill={TONE.side} stroke={TONE.faint} strokeWidth={0.6} />
          ))}
          <rect x={46} y={60} width={54} height={28} rx={3} fill={TONE.side} stroke={TONE.faint} strokeWidth={0.6} />
        </g>
        <Panel at={[12, 34, 11]} w={146} h={96}>
          <rect x={10} y={10} width={18} height={76} rx={2} fill={TONE.faint} opacity={0.5} />
          {[60, 84, 48, 72, 90, 56, 38].map((w, i) => (
            <rect key={i} x={36} y={13 + i * 10} width={w} height={4} rx={2} fill={i % 3 === 0 ? "var(--brand)" : TONE.faint} opacity={i % 3 === 0 ? 0.8 : 1} />
          ))}
        </Panel>
        <Floating at={[168, 22, 74]} w={42} h={44} delay={0.7}>
          <FaWindows x={10} y={11} size={22} color="var(--brand)" />
        </Floating>
      </g>
    </Art>
  );
}

/** Teams: a lit hub wired to the four developers around it. */
export function TeamsArt({ className }: { className?: string }) {
  const g = "iso-glow-teams";
  const hub: V = [90, 78, 0];
  const reach = 88;
  const nodes: V[] = [
    [hub[0] - reach, hub[1], 0],
    [hub[0], hub[1] - reach, 0],
    [hub[0], hub[1] + reach, 0],
    [hub[0] + reach, hub[1], 0],
  ];
  const n = 34;
  // Icons stand upright on a top face, like markers, rather than lying flat.
  const marker = ([x, y]: V, z: number, size: number) => ({ x: sx([x, y, 0]) - size / 2, y: sy([x, y, z]) - size * 0.8 });
  return (
    <Art id={g} viewBox="0 0 300 230" className={className}>
      <g transform="translate(150 54)">
        {nodes.map(([x, y], i) => (
          <Wire
            key={i}
            glow={g}
            d={path([hub[0] + Math.sign(x - hub[0]) * 30, hub[1] + Math.sign(y - hub[1]) * 30, 0], [x - Math.sign(x - hub[0]) * (n / 2), y - Math.sign(y - hub[1]) * (n / 2), 0])}
            dur={2.4 + i * 0.4}
            offset={i * 0.7}
          />
        ))}
        {nodes.map((c, i) => {
          const m = marker(c, 12, 18);
          return (
            <g key={i} className="iso-float" style={{ animationDelay: `${i * 0.5}s` }}>
              <Box at={[c[0] - n / 2, c[1] - n / 2, 0]} size={[n, n, 12]} />
              <User x={m.x} y={m.y} width={18} height={18} color="var(--brand)" strokeWidth={2.2} />
            </g>
          );
        })}
        <Plinth at={[hub[0] - 38, hub[1] - 38, 0]} size={[76, 76, 6]} glow={g} />
        <polygon
          points={pts([hub[0] - 28, hub[1] - 28, 34], [hub[0] + 28, hub[1] - 28, 34], [hub[0] + 28, hub[1] + 28, 34], [hub[0] - 28, hub[1] + 28, 34])}
          fill="var(--brand)"
          opacity={0.3}
          filter={`url(#${g})`}
        />
        <Box at={[hub[0] - 28, hub[1] - 28, 6]} size={[56, 56, 28]} lit />
        {(() => {
          const m = marker(hub, 34, 30);
          return <Users x={m.x} y={m.y + 6} width={30} height={30} color="var(--background)" strokeWidth={2.2} />;
        })()}
      </g>
      <g transform="translate(226 14)">
        <rect width={66} height={24} rx={6} fill={TONE.screen} stroke={TONE.edge} />
        <text x={33} y={16} textAnchor="middle" fontSize={11} fill="var(--brand)" style={mono}>
          C-Lento
        </text>
      </g>
    </Art>
  );
}
