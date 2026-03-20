import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../constants";
import { useEntrance, useSpring, SPRING } from "../animations";
import { LightBackground, SubtleGrid, WarmGlow } from "../components";

const STEPS = [
  {
    num: 1,
    title: "Pick a Location",
    desc: "Search any city, address, or coordinates",
    color: COLORS.accent,
  },
  {
    num: 2,
    title: "Customize Your Design",
    desc: "Choose themes, adjust radius, add your text",
    color: COLORS.terracotta,
  },
  {
    num: 3,
    title: "Download & Print",
    desc: "Get print-ready PNG, PDF, or SVG files",
    color: "#22c55e",
  },
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const headerStyle = useEntrance(3, 18);

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
            padding: "0 100px",
          }}
        >
          <div style={headerStyle}>
            <h2
              style={{
                fontSize: 58,
                fontWeight: 800,
                color: COLORS.text,
                textAlign: "center",
                margin: 0,
                marginBottom: 40,
              }}
            >
              Three simple steps.{" "}
              <span style={{ color: COLORS.accent }}>That's it.</span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: 40, alignItems: "stretch", justifyContent: "center" }}>
            {STEPS.map((step, i) => {
              const delay = 12 + i * 12;
              const p = useSpring(delay, SPRING.gentle, 25);

              const cardOpacity = p;
              const cardY = interpolate(p, [0, 1], [50, 0]);
              const cardScale = interpolate(p, [0, 1], [0.88, 1]);

              const checkDelay = delay + 18;
              const checkP = useSpring(checkDelay, SPRING.bouncy, 15);
              const checkScale = interpolate(checkP, [0, 1], [0, 1]);

              const lineProgress =
                i < 2
                  ? interpolate(
                      frame,
                      [delay + 15, delay + 30],
                      [0, 100],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.out(Easing.quad),
                      },
                    )
                  : 0;

              return (
                <React.Fragment key={i}>
                  <div
                    style={{
                      opacity: cardOpacity,
                      transform: `translateY(${cardY}px) scale(${cardScale})`,
                      width: 340,
                      padding: "48px 36px",
                      borderRadius: 20,
                      backgroundColor: COLORS.bgCard,
                      boxShadow: `0 12px 40px ${COLORS.shadow}, 0 2px 8px rgba(0,0,0,0.04)`,
                      border: `1px solid ${COLORS.border}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: step.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#ffffff",
                        transform: `scale(${checkScale})`,
                      }}
                    >
                      {step.num}
                    </div>

                    <h3
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: COLORS.text,
                        margin: 0,
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 20,
                        color: COLORS.textSecondary,
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>

                  {i < 2 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: 60,
                      }}
                    >
                      <div
                        style={{
                          height: 3,
                          width: `${lineProgress}%`,
                          backgroundColor: COLORS.accent,
                          borderRadius: 3,
                          opacity: 0.4,
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </LightBackground>
    </AbsoluteFill>
  );
};
