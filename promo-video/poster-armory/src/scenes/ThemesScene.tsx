import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, THEMES } from "../constants";
import { useEntrance, useSpring, SPRING } from "../animations";
import { LightBackground, SubtleGrid, WarmGlow } from "../components";

export const ThemesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const headerStyle = useEntrance(3, 18);

  const countTarget = 17;
  const countValue = Math.min(
    countTarget,
    Math.round(
      interpolate(frame, [10, 40], [0, countTarget], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }),
    ),
  );

  return (
    <AbsoluteFill>
      <LightBackground>
        <SubtleGrid />
        <WarmGlow top="50%" left="50%" size={1000} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <div style={headerStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: 90,
                  fontWeight: 900,
                  color: COLORS.accent,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {countValue}
              </span>
              <h2
                style={{
                  fontSize: 58,
                  fontWeight: 800,
                  color: COLORS.text,
                  margin: 0,
                }}
              >
                Hand-Crafted Themes
              </h2>
            </div>
            <p
              style={{
                fontSize: 24,
                color: COLORS.textSecondary,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              From minimal to dramatic — find your style
            </p>
          </div>

          {/* Theme swatches grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginTop: 50,
              justifyContent: "center",
              maxWidth: 1200,
            }}
          >
            {THEMES.map((theme, i) => {
              const delay = 12 + i * 3;
              const p = useSpring(delay, SPRING.snappy, 15);
              const swatchScale = interpolate(p, [0, 1], [0, 1]);
              const swatchOpacity = p;

              return (
                <div
                  key={i}
                  style={{
                    opacity: swatchOpacity,
                    transform: `scale(${swatchScale})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 16,
                      backgroundColor: theme.color,
                      boxShadow: `0 6px 20px ${theme.color}44, 0 2px 6px rgba(0,0,0,0.1)`,
                      border:
                        theme.color === "#1a1a1a"
                          ? "1px solid #333"
                          : `1px solid ${theme.color}88`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.textSecondary,
                      textAlign: "center",
                      maxWidth: 100,
                    }}
                  >
                    {theme.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </LightBackground>
    </AbsoluteFill>
  );
};
