import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

/* ── Spring Presets (60 fps, cinematic) ───────────────────────────── */

export const SPRING = {
  /** Very slow, buttery settle — hero text, large reveals */
  cinematic: { damping: 200, stiffness: 40 },
  /** Smooth, no overshoot — standard text and backgrounds */
  smooth: { damping: 200, stiffness: 80 },
  /** Gentle settle — cards, images */
  gentle: { damping: 34, stiffness: 65 },
  /** Controlled snap — icons, small UI */
  snappy: { damping: 26, stiffness: 170 },
} as const;

type SpringConfig = { damping: number; stiffness: number; mass?: number };

/* ── Cinematic Entrance ───────────────────────────────────────────── */

/**
 * Apple-style dramatic entrance.
 * Y: 50 → 0, scale: 0.85 → 1, opacity: 0 → 1.
 * Much more dramatic than a typical UI entrance.
 */
export function useCinematicEntrance(
  delay = 0,
  duration = 80,
  config: SpringConfig = SPRING.cinematic,
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame, fps, delay, config, durationInFrames: duration });

  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
  };
}

/* ── Subtle Entrance (for secondary elements) ─────────────────────── */

export function useSubtleEntrance(
  delay = 0,
  duration = 60,
  config: SpringConfig = SPRING.smooth,
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame, fps, delay, config, durationInFrames: duration });

  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
  };
}

/* ── Ken Burns slow zoom ──────────────────────────────────────────── */

/**
 * Continuous slow scale over the full scene duration.
 * Apple's signature "the image is alive" effect.
 */
export function useSlowZoom(startScale = 1.0, endScale = 1.06) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
}

/* ── Micro-float ──────────────────────────────────────────────────── */

export function useFloat(speed = 50, amplitude = 4, phase = 0) {
  const frame = useCurrentFrame();
  return Math.sin((frame + phase) / speed) * amplitude;
}

/* ── Eased fade ───────────────────────────────────────────────────── */

export function useFade(delay = 0, duration = 60) {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
}

/* ── Fade out ─────────────────────────────────────────────────────── */

export function useFadeOut(start: number, duration = 40) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
}

/* ── Generic spring ───────────────────────────────────────────────── */

export function useSpring(
  delay = 0,
  config: SpringConfig = SPRING.smooth,
  duration?: number,
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame,
    fps,
    delay,
    config,
    ...(duration !== undefined ? { durationInFrames: duration } : {}),
  });
}

/* ── Line / underline reveal ──────────────────────────────────────── */

export function useLineReveal(delay = 0, maxWidth = 140, duration = 60) {
  const p = useSpring(delay, SPRING.smooth, duration);
  return interpolate(p, [0, 1], [0, maxWidth]);
}
