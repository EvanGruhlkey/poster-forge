import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const SPRING = {
  smooth: { damping: 18, stiffness: 80 },
  gentle: { damping: 22, stiffness: 60 },
  snappy: { damping: 24, stiffness: 170 },
  bouncy: { damping: 10, stiffness: 100 },
} as const;

type SpringConfig = { damping: number; stiffness: number; mass?: number };

export function useEntrance(
  delay = 0,
  duration = 30,
  config: SpringConfig = SPRING.smooth,
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay, config, durationInFrames: duration });

  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
  };
}

export function useSlideIn(
  direction: "left" | "right" | "up" | "down" = "up",
  delay = 0,
  distance = 60,
  config: SpringConfig = SPRING.smooth,
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay, config, durationInFrames: 30 });

  const axes = {
    left: [`translateX(${interpolate(p, [0, 1], [-distance, 0])}px)`, p],
    right: [`translateX(${interpolate(p, [0, 1], [distance, 0])}px)`, p],
    up: [`translateY(${interpolate(p, [0, 1], [distance, 0])}px)`, p],
    down: [`translateY(${interpolate(p, [0, 1], [-distance, 0])}px)`, p],
  } as const;

  const [transform, opacity] = axes[direction];
  return { opacity: opacity as number, transform };
}

export function useFadeIn(delay = 0, duration = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
}

export function useFloat(speed = 60, amplitude = 4, phase = 0) {
  const frame = useCurrentFrame();
  return Math.sin((frame + phase) / speed) * amplitude;
}

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

export function useScaleIn(delay = 0, config: SpringConfig = SPRING.snappy) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay, config, durationInFrames: 25 });
  return {
    opacity: p,
    transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
  };
}
