import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { COLORS } from "./constants";

export const LightBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(145deg, ${COLORS.bg} 0%, ${COLORS.bgWarm} 50%, ${COLORS.bg} 100%)`,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const SubtleGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = frame * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        inset: -40,
        opacity: 0.035,
        backgroundImage: `
          linear-gradient(${COLORS.accent} 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.accent} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        transform: `translate(${offset}px, ${offset * 0.5}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

export const WarmGlow: React.FC<{
  top?: string;
  left?: string;
  color?: string;
  size?: number;
}> = ({
  top = "50%",
  left = "50%",
  color = COLORS.accentLight,
  size = 600,
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
      filter: "blur(60px)",
      pointerEvents: "none",
    }}
  />
);

export const FloatingDots: React.FC = () => {
  const frame = useCurrentFrame();

  const dots = Array.from({ length: 12 }, (_, i) => ({
    x: (i * 137.5 + 20) % 100,
    y: (i * 61.8 + 10) % 100,
    size: 3 + (i % 3) * 2,
    speed: 40 + (i % 4) * 15,
    phase: i * 47,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {dots.map((d, i) => {
        const floatY = Math.sin((frame + d.phase) / d.speed) * 8;
        const floatX = Math.cos((frame + d.phase) / d.speed) * 4;
        const opacity = 0.08 + Math.sin((frame + d.phase) / 50) * 0.04;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${d.x + floatX * 0.1}%`,
              top: `${d.y + floatY * 0.1}%`,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              backgroundColor: COLORS.accent,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export const AccentLine: React.FC<{
  width: number;
  color?: string;
  height?: number;
}> = ({ width, color = COLORS.accent, height = 3 }) => (
  <div
    style={{
      width,
      height,
      borderRadius: height,
      background: `linear-gradient(90deg, ${color}, transparent)`,
    }}
  />
);

export const PosterMockup: React.FC<{
  src: string;
  width?: number;
  height?: number;
  tiltX?: number;
  tiltY?: number;
  shadow?: boolean;
}> = ({ src, width = 280, height = 373, tiltX = 5, tiltY = -8, shadow = true }) => (
  <div
    style={{
      width,
      height,
      perspective: 1000,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        boxShadow: shadow
          ? "0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)"
          : "none",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  </div>
);
