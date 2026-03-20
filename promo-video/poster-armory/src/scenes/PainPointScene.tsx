import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../constants";
import { useEntrance, useSlideIn } from "../animations";
import { LightBackground, WarmGlow } from "../components";

const PAIN_ITEMS = [
  { icon: "💸", text: "Expensive design commissions" },
  { icon: "🎨", text: "Complex software required" },
  { icon: "⏰", text: "Hours of learning curves" },
];

export const PainPointScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineStyle = useEntrance(3, 18);

  const strikeWidth = interpolate(frame, [40, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const butOpacity = interpolate(frame, [65, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const butY = interpolate(frame, [65, 80], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill>
      <LightBackground>
        <WarmGlow top="40%" left="50%" size={900} color="rgba(220, 38, 38, 0.06)" />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 120px",
          }}
        >
          <div style={headlineStyle}>
            <h2
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: COLORS.text,
                textAlign: "center",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Custom map art used to
              <br />
              require{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ color: "#dc2626" }}>design skills</span>
                <div
                  style={{
                    position: "absolute",
                    top: "55%",
                    left: 0,
                    width: `${strikeWidth}%`,
                    height: 4,
                    backgroundColor: "#dc2626",
                    borderRadius: 2,
                  }}
                />
              </span>
            </h2>
          </div>

          {/* Pain point items */}
          <div
            style={{
              display: "flex",
              gap: 50,
              marginTop: 60,
              justifyContent: "center",
            }}
          >
            {PAIN_ITEMS.map((item, i) => {
              const itemStyle = useSlideIn("up", 18 + i * 8, 40);
              return (
                <div
                  key={i}
                  style={{
                    ...itemStyle,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      backgroundColor: "rgba(220, 38, 38, 0.06)",
                      border: "1px solid rgba(220, 38, 38, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 22,
                      color: COLORS.textSecondary,
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* "But what if..." tease */}
          <div
            style={{
              marginTop: 60,
              opacity: butOpacity,
              transform: `translateY(${butY}px)`,
            }}
          >
            <p
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: COLORS.accent,
                textAlign: "center",
              }}
            >
              What if it only took 3 steps?
            </p>
          </div>
        </div>
      </LightBackground>
    </AbsoluteFill>
  );
};
