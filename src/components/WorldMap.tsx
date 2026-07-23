/**
 * Dotted equirectangular world map with animated great-circle-style arcs
 * linking Spain, Europe and the GCC.
 *
 * The dot field is generated once at module scope by testing a lon/lat grid
 * against simplified continent outlines, then emitted as a *single* <path>
 * of zero-ish-length round-capped segments. One DOM node instead of ~1,300
 * <circle> elements keeps hydration and paint cheap.
 *
 * Geometry is precomputed twice at module scope — once normal, once
 * horizontally mirrored — so the Arabic (RTL) layout can flip the whole
 * graphic to sit on the opposite side of the hero without ever flipping the
 * (always-Latin) labels themselves, which are positioned using the already
 * mirrored coordinates rather than a CSS transform.
 */

import { useId } from "react";

type Ring = ReadonlyArray<readonly [number, number]>;

// Projection space: 1000 x 500 covers the full globe (equirectangular).
const W = 1000;
const H = 500;

const projX = (lon: number) => ((lon + 180) / 360) * W;
const projY = (lat: number) => ((90 - lat) / 180) * H;

// Visible window: lon -100..+92, lat +82..-42 — Europe/Africa/Arabia centred,
// with the Americas and Asia trailing off at the edges.
const VIEW = {
  x: projX(-100),
  y: projY(82),
  w: projX(92) - projX(-100),
  h: projY(-42) - projY(82),
};

/** Reflect a projected x-coordinate across the visible window's centre. */
const mirrorX = (x: number) => 2 * VIEW.x + VIEW.w - x;

/* ------------------------------------------------------- continent outlines */

// prettier-ignore
const AFRICA: Ring = [
  [-17, 21], [-16, 14], [-13, 8], [-8, 4], [0, 5], [6, 4], [9, 4], [9, 2],
  [13, -2], [12, -6], [12, -17], [15, -22], [17, -29], [20, -35], [26, -34],
  [32, -29], [35, -24], [40, -16], [40, -10], [39, -6], [41, -2], [43, 2],
  [51, 11], [44, 12], [40, 15], [37, 18], [34, 28], [32, 31], [25, 32],
  [18, 31], [11, 34], [3, 37], [-2, 35], [-6, 36], [-10, 32], [-13, 28],
];

// prettier-ignore
const EUROPE: Ring = [
  [-9, 43], [-9, 39], [-6, 37], [-2, 36], [3, 42], [7, 44], [12, 44],
  [16, 42], [19, 40], [24, 41], [26, 40], [29, 41], [32, 42], [38, 45],
  [42, 45], [48, 46], [52, 47], [58, 50], [60, 55], [60, 60], [55, 65],
  [45, 68], [40, 68], [33, 70], [29, 70], [24, 71], [20, 70], [16, 69],
  [13, 65], [11, 63], [5, 62], [8, 58], [11, 57], [10, 54], [8, 54],
  [6, 53], [4, 52], [0, 49], [-2, 48], [-4, 48], [-1, 46], [-2, 44],
];

// prettier-ignore
const BRITAIN: Ring = [
  [-5, 50], [-1, 51], [0, 53], [-1, 55], [-2, 58], [-5, 58], [-6, 56],
  [-5, 53], [-6, 51],
];

// prettier-ignore
const IRELAND: Ring = [[-10, 52], [-6, 52], [-6, 55], [-10, 55]];

// prettier-ignore
const ASIA: Ring = [
  [60, 68], [75, 73], [90, 75], [105, 77], [115, 73], [130, 72], [140, 72],
  [150, 70], [160, 69], [170, 68], [180, 66], [180, 60], [170, 60],
  [162, 58], [155, 52], [143, 46], [140, 42], [130, 42], [126, 38],
  [122, 32], [120, 25], [110, 21], [107, 10], [103, 1], [98, 8], [95, 16],
  [92, 21], [89, 22], [80, 15], [77, 8], [73, 20], [68, 24], [64, 25],
  [60, 25], [57, 25], [56, 27], [50, 30], [48, 30], [50, 25], [54, 24],
  [57, 22], [59, 22], [55, 17], [52, 15], [45, 13], [43, 13], [39, 16],
  [37, 21], [35, 28], [34, 30], [36, 36], [38, 40], [45, 42], [50, 45],
  [55, 50], [58, 55], [60, 60],
];

// prettier-ignore
const N_AMERICA: Ring = [
  [-168, 66], [-160, 70], [-150, 70], [-140, 70], [-130, 70], [-120, 72],
  [-110, 68], [-100, 68], [-95, 62], [-85, 63], [-80, 70], [-70, 68],
  [-60, 58], [-55, 52], [-60, 47], [-67, 45], [-70, 42], [-75, 37],
  [-81, 31], [-81, 25], [-90, 29], [-95, 29], [-97, 26], [-98, 20],
  [-95, 18], [-92, 15], [-105, 20], [-110, 24], [-114, 28], [-120, 34],
  [-124, 40], [-125, 48], [-130, 54], [-140, 60], [-150, 60], [-160, 58],
  [-166, 62],
];

// prettier-ignore
const S_AMERICA: Ring = [
  [-81, 8], [-76, 9], [-71, 12], [-62, 10], [-52, 5], [-50, 0], [-44, -2],
  [-38, -5], [-35, -8], [-39, -13], [-41, -22], [-48, -25], [-53, -34],
  [-57, -38], [-62, -40], [-65, -45], [-68, -50], [-73, -53], [-75, -46],
  [-73, -40], [-72, -30], [-70, -20], [-70, -12], [-79, -6], [-81, -4],
  [-80, 0], [-78, 2],
];

// prettier-ignore
const GREENLAND: Ring = [
  [-45, 60], [-30, 68], [-20, 70], [-22, 76], [-30, 82], [-45, 82],
  [-55, 78], [-55, 70], [-50, 65],
];

// prettier-ignore
const MADAGASCAR: Ring = [[43, -12], [50, -15], [48, -25], [44, -22], [43, -16]];

// prettier-ignore
const INDONESIA: Ring = [
  [95, 5], [105, -5], [115, -8], [130, -3], [140, -6], [140, 0], [130, 2],
  [118, 3], [105, 3],
];

const LAND: ReadonlyArray<Ring> = [
  AFRICA,
  EUROPE,
  BRITAIN,
  IRELAND,
  ASIA,
  N_AMERICA,
  S_AMERICA,
  GREENLAND,
  MADAGASCAR,
  INDONESIA,
];

/* --------------------------------------------------- highlighted countries */

// prettier-ignore
const SPAIN: Ring = [
  [-9.3, 43.0], [-7.5, 43.8], [-4.5, 43.4], [-1.8, 43.4], [0.7, 42.7],
  [3.3, 42.4], [3.2, 41.9], [0.9, 41.0], [0.2, 39.8], [-0.5, 38.8],
  [-0.8, 37.6], [-2.2, 36.8], [-4.4, 36.7], [-5.6, 36.0], [-6.3, 36.8],
  [-7.4, 37.2], [-7.0, 38.0], [-7.0, 39.5], [-6.8, 41.0], [-8.2, 41.9],
];

// prettier-ignore
const FRANCE: Ring = [
  [-4.8, 48.5], [-1.5, 49.8], [1.6, 51.0], [3.2, 50.4], [5.9, 49.5],
  [8.2, 48.9], [7.6, 47.6], [6.0, 46.2], [7.0, 45.3], [7.5, 43.8],
  [4.8, 43.4], [3.0, 43.0], [0.0, 42.7], [-1.8, 43.3], [-1.2, 45.7],
  [-2.2, 47.0],
];

// prettier-ignore
const ARABIA: Ring = [
  [34.5, 28], [38, 22], [39, 16], [43, 12.7], [45, 12.8], [48, 14],
  [52, 16], [55, 17], [56, 20], [57, 22], [59, 22], [58, 24], [56, 25.5],
  [54, 25.5], [51, 24.5], [50, 27], [48, 29.5], [47, 30], [44, 30],
  [41, 31.5], [38, 29], [36, 29.5],
];

/* ------------------------------------------------------------- generation */

function pointInRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const isLand = (lon: number, lat: number) => LAND.some((ring) => pointInRing(lon, lat, ring));

function ringToPath(ring: Ring, mirror: boolean): string {
  return (
    ring
      .map(([lon, lat], i) => {
        const x = projX(lon);
        return `${i === 0 ? "M" : "L"}${(mirror ? mirrorX(x) : x).toFixed(1)},${projY(lat).toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

/** Grid pitch in projection units — 7 ≈ 2.5° of longitude. */
const STEP = 7;

function buildDotField(mirror: boolean) {
  const base: string[] = [];
  const accent: string[] = [];

  const x0 = Math.floor(VIEW.x / STEP) * STEP;
  const y0 = Math.floor(VIEW.y / STEP) * STEP;

  for (let x = x0; x <= VIEW.x + VIEW.w; x += STEP) {
    for (let y = y0; y <= VIEW.y + VIEW.h; y += STEP) {
      const lon = (x / W) * 360 - 180;
      const lat = 90 - (y / H) * 180;
      if (!isLand(lon, lat)) continue;

      const px = mirror ? mirrorX(x) : x;
      const segment = `M${px},${y}l.01 0`;
      // Dots falling inside a focus market are drawn in the accent pass so the
      // highlighted silhouettes read as solid navy against the grey field.
      if (
        pointInRing(lon, lat, SPAIN) ||
        pointInRing(lon, lat, FRANCE) ||
        pointInRing(lon, lat, ARABIA)
      ) {
        accent.push(segment);
      } else {
        base.push(segment);
      }
    }
  }

  return { base: base.join(""), accent: accent.join("") };
}

/* ----------------------------------------------------------------- markers */

type MarkerDef = {
  id: string;
  label: string;
  lon: number;
  lat: number;
  /**
   * Leader-line offset from the dot to the label anchor, in projection units.
   * Labels must land on open sea — navy text over a navy silhouette vanishes.
   */
  dx: number;
  dy: number;
};

const MARKER_DEFS: MarkerDef[] = [
  { id: "spain", label: "Spain", lon: -3.7, lat: 40.4, dx: -26, dy: 0 },
  { id: "europe", label: "Europe", lon: 2.5, lat: 47.0, dx: 30, dy: -16 },
  // Offset down-left into the Arabian Sea, clear of the peninsula fill.
  { id: "gcc", label: "GCC", lon: 50.5, lat: 24.5, dx: -30, dy: 40 },
];

type Marker = { id: string; label: string; x: number; y: number; dx: number; dy: number };

function buildMarkers(mirror: boolean): Marker[] {
  return MARKER_DEFS.map((def) => {
    const x = projX(def.lon);
    return {
      id: def.id,
      label: def.label,
      x: mirror ? mirrorX(x) : x,
      y: projY(def.lat),
      // The leader-line offset flips along with the marker so it keeps
      // pointing away from the (now mirrored) landmass toward open sea.
      dx: mirror ? -def.dx : def.dx,
      dy: def.dy,
    };
  });
}

/** Quadratic arc bowed away from the midpoint, like a flight path. */
function arcPath(a: { x: number; y: number }, b: { x: number; y: number }, bow = 0.22) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  // Perpendicular offset, always bowing "up" the map.
  const cx = mx + (dy / dist) * dist * bow;
  const cy = my - (dx / dist) * dist * bow;
  return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
}

function buildGeometry(mirror: boolean) {
  const markers = buildMarkers(mirror);
  const [spainM, europeM, gccM] = markers;
  const arcs = [
    { id: "spain-europe", d: arcPath(spainM, europeM, 0.3), delay: 0.2, dur: 1.4 },
    { id: "spain-gcc", d: arcPath(spainM, gccM, 0.26), delay: 0.6, dur: 2.2 },
    { id: "europe-gcc", d: arcPath(europeM, gccM, 0.12), delay: 1.0, dur: 1.9 },
  ];

  return {
    dots: buildDotField(mirror),
    spainPath: ringToPath(SPAIN, mirror),
    francePath: ringToPath(FRANCE, mirror),
    arabiaPath: ringToPath(ARABIA, mirror),
    markers,
    arcs,
  };
}

const GEO = { ltr: buildGeometry(false), rtl: buildGeometry(true) };

export function WorldMap({
  className = "",
  mirrored = false,
}: {
  className?: string;
  mirrored?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const geo = mirrored ? GEO.rtl : GEO.ltr;
  const fadeId = `${uid}-fade`;
  const maskId = `${uid}-mask`;
  const arcGradId = `${uid}-arc`;

  return (
    <svg
      viewBox={`${VIEW.x.toFixed(1)} ${VIEW.y.toFixed(1)} ${VIEW.w.toFixed(1)} ${VIEW.h.toFixed(1)}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Fade the map out toward the side the headline text sits on. */}
        <linearGradient
          id={fadeId}
          x1={mirrored ? "1" : "0"}
          y1="0"
          x2={mirrored ? "0" : "1"}
          y2="0"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="34%" stopColor="white" stopOpacity="0.45" />
          <stop offset="65%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id={maskId}>
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={`url(#${fadeId})`} />
        </mask>
        <linearGradient id={arcGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* Base landmass dot field */}
        <path
          d={geo.dots.base}
          stroke="var(--navy)"
          strokeOpacity="0.24"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Focus markets: solid silhouette + denser dots on top */}
        <path d={geo.spainPath} fill="var(--navy)" fillOpacity="0.92" />
        <path d={geo.francePath} fill="var(--navy)" fillOpacity="0.92" />
        <path d={geo.arabiaPath} fill="var(--navy)" fillOpacity="0.92" />
        <path
          d={geo.dots.accent}
          stroke="var(--navy-deep)"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Connection arcs */}
      <g fill="none" stroke={`url(#${arcGradId})`} strokeWidth="1.5">
        {geo.arcs.map((arc) => (
          <path
            key={arc.id}
            d={arc.d}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            style={{
              animation: `draw-arc ${arc.dur}s cubic-bezier(0.65, 0, 0.35, 1) ${arc.delay}s forwards`,
            }}
          />
        ))}
      </g>

      {/* Travelling pulse along each arc */}
      {geo.arcs.map((arc) => (
        <circle key={`${arc.id}-pulse`} r="2.6" fill="var(--gold-light)">
          <animateMotion
            dur={`${arc.dur * 2.2}s`}
            begin={`${arc.delay + arc.dur}s`}
            repeatCount="indefinite"
            path={arc.d}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.85;1"
            dur={`${arc.dur * 2.2}s`}
            begin={`${arc.delay + arc.dur}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Market markers + labels — coordinates are already mirrored above, so
          the glyphs themselves are never flipped and stay readable. */}
      {geo.markers.map((m, i) => {
        const anchorX = m.x + m.dx;
        const anchorY = m.y + m.dy;
        const leftOfDot = m.dx < 0;
        // Stop the leader short of both the dot and the text.
        const t = 5 / Math.hypot(m.dx, m.dy);
        const textX = anchorX + (leftOfDot ? -3 : 3);
        return (
          <g key={m.id}>
            <circle
              cx={m.x}
              cy={m.y}
              r="4"
              fill="var(--gold)"
              opacity="0.35"
              style={{
                transformOrigin: `${m.x}px ${m.y}px`,
                animation: `pulse-ring 3s ease-out ${1.2 + i * 0.4}s infinite`,
              }}
            />
            <circle cx={m.x} cy={m.y} r="3" fill="var(--gold)" />
            <line
              x1={m.x + m.dx * t}
              y1={m.y + m.dy * t}
              x2={anchorX}
              y2={anchorY}
              stroke="var(--gold)"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <text
              x={textX}
              y={anchorY + 2.6}
              textAnchor={leftOfDot ? "end" : "start"}
              fontSize="7.5"
              letterSpacing="1.4"
              fill="var(--navy)"
              fillOpacity="0.75"
              fontFamily="var(--font-sans)"
              fontWeight="500"
              direction="ltr"
              style={{ textTransform: "uppercase" }}
            >
              {m.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
