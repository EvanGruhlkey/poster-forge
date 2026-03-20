import React from "react";
import { useCurrentFrame } from "remotion";

/* ── Ambient Floating Particles ───────────────────────────────────── */

const PARTICLE_DATA = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 137.5 + 20) % 100,
  startY: (i * 61.8 + 10) % 100,
  size: 1.5 + (i % 3) * 1,
  speed: 35 + (i % 5) * 12,
  baseOpacity: 0.04 + (i % 4) * 0.025,
  phase: i * 47,
}));

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {PARTICLE_DATA.map((p, i) => {
        const drift = frame * 0.05;
        const floatX = Math.sin((frame + p.phase) / p.speed) * 12;
        const rawY = p.startY - drift + Math.cos((frame + p.phase) / p.speed) * 8;
        const y = ((rawY % 120) + 120) % 120 - 10;
        const opacity =
          p.baseOpacity * (0.6 + Math.sin((frame + p.phase) / 50) * 0.4);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + floatX * 0.1}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              opacity,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
};

/* ── Vignette Overlay ─────────────────────────────────────────────── */

export const Vignette: React.FC<{ intensity?: number }> = ({
  intensity = 0.65,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/* ── Ambient Glow ─────────────────────────────────────────────────── */

export const AmbientGlow: React.FC<{
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  blur?: number;
}> = ({
  color = "rgba(74, 124, 143, 0.12)",
  size = 700,
  top = "50%",
  left = "50%",
  blur = 80,
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      top,
      left,
      transform: "translate(-50%, -50%)",
      filter: `blur(${blur}px)`,
      pointerEvents: "none",
    }}
  />
);
