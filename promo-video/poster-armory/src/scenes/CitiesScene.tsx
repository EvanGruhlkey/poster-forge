import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import { COLORS, CITY_POSTERS } from "../constants";
import { useEntrance, useFloat, useSpring, SPRING } from "../animations";
import { LightBackground, WarmGlow } from "../components";

const SHOWCASE = CITY_POSTERS.slice(0, 6);

export const CitiesScene: React.FC = () => {
  const headerStyle = useEntrance(3, 18);

  return (
    <AbsoluteFill>
      <LightBackground>
        <WarmGlow top="40%" left="30%" size={700} />
        <WarmGlow
          top="60%"
          left="70%"
          color={COLORS.terracottaLight}
          size={500}
        />

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
            <h2
              style={{
                fontSize: 58,
                fontWeight: 800,
                color: COLORS.text,
                textAlign: "center",
                margin: 0,
              }}
            >
              Any City.{" "}
              <span style={{ color: COLORS.accent }}>Any Memory.</span>
            </h2>
            <p
              style={{
                fontSize: 26,
                color: COLORS.textSecondary,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Thousands of cities around the world
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 30,
              marginTop: 50,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {SHOWCASE.map((poster, i) => {
              const delay = 10 + i * 6;
              const p = useSpring(delay, SPRING.gentle, 20);
              const floatY = useFloat(55, 4, i * 35);

              const cardOpacity = p;
              const slideX = interpolate(p, [0, 1], [60, 0]);
              const cardScale = interpolate(p, [0, 1], [0.88, 1]);

              const tiltY = (i - 2.5) * 3;

              return (
                <div
                  key={i}
                  style={{
                    opacity: cardOpacity,
                    transform: `translateX(${slideX}px) translateY(${floatY}px) scale(${cardScale})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ perspective: 800 }}>
                    <div
                      style={{
                        width: 220,
                        height: 293,
                        borderRadius: 8,
                        overflow: "hidden",
                        transform: `rotateY(${tiltY}deg) rotateX(2deg)`,
                        boxShadow:
                          "0 20px 50px rgba(0,0,0,0.14), 0 6px 16px rgba(0,0,0,0.08)",
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <Img
                        src={poster.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: 14 }}>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: COLORS.text,
                        margin: 0,
                      }}
                    >
                      {poster.city}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: COLORS.textSecondary,
                        margin: 0,
                      }}
                    >
                      {poster.theme}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </LightBackground>
    </AbsoluteFill>
  );
};
