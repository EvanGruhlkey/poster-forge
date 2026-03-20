import { Easing, interpolate } from "remotion";

export const FPS = 60;
export const TOTAL_FRAMES = 4500; // 75 sec at 60fps

const GH_RAW =
  "https://raw.githubusercontent.com/EvanGruhlkey/poster-forge/main/posters";

export const POSTER_IMAGES = {
  barcelona: `${GH_RAW}/barcelona_warm_beige_20260118_140048.png`,
  marrakech: `${GH_RAW}/marrakech_terracotta_20260118_143253.png`,
  venice: `${GH_RAW}/venice_blueprint_20260118_140505.png`,
  tokyo: `${GH_RAW}/tokyo_japanese_ink_20260118_142446.png`,
  sanFrancisco: `${GH_RAW}/san_francisco_sunset_20260118_144726.png`,
  singapore: `${GH_RAW}/singapore_neon_cyberpunk_20260118_153328.png`,
};

export const UI = {
  pageBg: "#faf8f5",
  card: "#ffffff",
  cardBorder: "#e5e2dd",
  primary: "#17324D",
  primaryFg: "#f4f1ea",
  text: "#1a1a2e",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
  inputBorder: "#d1d5db",
  mutedBg: "#f1f5f9",
  success: "#22c55e",
  ring: "rgba(23, 50, 77, 0.2)",
} as const;

export const DEMO_BG = {
  bg: "#fafaf8",
  bgWarm: "#f5f0eb",
  accent: "#4a7c8f",
  text: "#1a1a2e",
  textSecondary: "#64748b",
} as const;

export const WARM_BEIGE = { bg: "#F5F0E8", text: "#6B5B4F" } as const;

export const STYLE_PRESETS: readonly {
  id: string;
  name: string;
  bg: string;
  locked?: boolean;
}[] = [
  { id: "warm_beige", name: "Classic", bg: "#F5F0E8" },
  { id: "terracotta", name: "Terracotta", bg: "#F5EDE4" },
  { id: "noir", name: "Noir", bg: "#000000" },
  { id: "blueprint", name: "Blueprint", bg: "#1A3A5C" },
  { id: "ocean", name: "Ocean", bg: "#F0F8FA" },
  { id: "midnight_blue", name: "Night", bg: "#0A1628", locked: true },
  { id: "forest", name: "Forest", bg: "#F0F4F0", locked: true },
  { id: "sunset", name: "Sunset", bg: "#FDF5F0", locked: true },
  { id: "autumn", name: "Autumn", bg: "#FBF7F0", locked: true },
  { id: "emerald", name: "Emerald", bg: "#062C22", locked: true },
  { id: "copper_patina", name: "Copper", bg: "#E8F0F0", locked: true },
  { id: "japanese_ink", name: "Ink", bg: "#FAF8F5", locked: true },
  { id: "pastel_dream", name: "Pastel", bg: "#FAF7F2", locked: true },
  { id: "mono_blue", name: "Mono Blue", bg: "#F5F8FA", locked: true },
  { id: "cyberpunk", name: "Cyberpunk", bg: "#0D0D1A", locked: true },
  { id: "contrast", name: "Contrast", bg: "#111111", locked: true },
  { id: "gradient", name: "Gradient", bg: "#FAF8F5", locked: true },
];

export const BROWSER = {
  x: 130,
  y: 44,
  width: 1660,
  height: 880,
  titleBar: 40,
  contentWidth: 1660,
  contentHeight: 840,
} as const;

export const ANNOTATION_Y = 952;

export const MAIN = {
  introStart: 0,
  introEnd: 300,
  browserStart: 260,
  browserEnd: 3920,
  ctaStart: 3880,
  ctaEnd: 4500,
} as const;

export const BROWSER_DUR = MAIN.browserEnd - MAIN.browserStart; // 1830

export const PAGE = {
  landing: { start: 60, end: 590 },
  location: { start: 530, end: 1440 },
  design: { start: 1390, end: 2900 },
  result: { start: 2850, end: 3620 },
} as const;

// --- Keyframe helpers ---

export interface ZoomKF {
  f: number;
  s: number;
  cx: number;
  cy: number;
}

export interface CursorKF {
  f: number;
  cx: number;
  cy: number;
  click?: boolean;
  hidden?: boolean;
}

export interface AnnotationKF {
  start: number;
  end: number;
  text: string;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function interpZoom(keyframes: ZoomKF[], frame: number) {
  if (frame <= keyframes[0].f)
    return { s: keyframes[0].s, cx: keyframes[0].cx, cy: keyframes[0].cy };
  const last = keyframes[keyframes.length - 1];
  if (frame >= last.f) return { s: last.s, cx: last.cx, cy: last.cy };

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { s: lerp(a.s, b.s, t), cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t) };
    }
  }
  return { s: last.s, cx: last.cx, cy: last.cy };
}

export function interpCursor(keyframes: CursorKF[], frame: number) {
  if (keyframes.length === 0) return { cx: 0, cy: 0, click: false, hidden: true };
  if (frame <= keyframes[0].f) return { ...keyframes[0], click: false };
  const last = keyframes[keyframes.length - 1];
  if (frame >= last.f) return { cx: last.cx, cy: last.cy, click: false, hidden: last.hidden };

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {
        easing: Easing.inOut(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const isClick = b.click && frame >= b.f - 4 && frame <= b.f + 6;
      return {
        cx: lerp(a.cx, b.cx, t),
        cy: lerp(a.cy, b.cy, t),
        click: isClick,
        hidden: a.hidden,
      };
    }
  }
  return { cx: last.cx, cy: last.cy, click: false, hidden: last.hidden };
}

export function getAnnotation(keyframes: AnnotationKF[], frame: number) {
  for (const kf of keyframes) {
    if (frame >= kf.start && frame <= kf.end) {
      const fadeIn = interpolate(frame, [kf.start, kf.start + 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const fadeOut = interpolate(frame, [kf.end - 30, kf.end], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { text: kf.text, opacity: Math.min(fadeIn, fadeOut) };
    }
  }
  return { text: "", opacity: 0 };
}

export function contentToScreen(
  cx: number,
  cy: number,
  zoom: { s: number; cx: number; cy: number },
) {
  const vw = BROWSER.contentWidth;
  const vh = BROWSER.contentHeight;
  const tx = vw / 2 - zoom.cx * zoom.s;
  const ty = vh / 2 - zoom.cy * zoom.s;

  return {
    x: BROWSER.x + cx * zoom.s + tx,
    y: BROWSER.y + BROWSER.titleBar + cy * zoom.s + ty,
  };
}
