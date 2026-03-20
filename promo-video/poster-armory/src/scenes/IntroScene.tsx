import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, POSTER_IMAGES } from "../constants";
import { useEntrance, useFloat } from "../animations";
import { LightBackground, SubtleGrid, WarmGlow } from "../components";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const float1 = useFloat(70, 6, 0);
  const float2 = useFloat(55, 5, 30);

  const logoStyle = useEntrance(4, 18);
  const taglineStyle = useEntrance(12, 20);
  const subtitleStyle = useEntrance(22, 18);
  const lineWidth = interpolate(frame, [15, 35], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const posterOpacity = interpolate(frame, [8, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const posterScale = interpolate(frame, [8, 28], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill>
      <LightBackground>
        <SubtleGrid />
        <WarmGlow top="30%" left="70%" size={800} />
        <WarmGlow
          top="70%"
          left="25%"
          color={COLORS.terracottaLight}
          size={500}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 100px",
          }}
        >
          {/* Left: Text */}
          <div style={{ flex: 1, zIndex: 1 }}>
            <div style={logoStyle}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 6,
                  color: COLORS.accent,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Poster Armory
              </div>
            </div>

            <div style={taglineStyle}>
              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: COLORS.text,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Transform Your
                <br />
                Memories into
                <br />
                <span style={{ color: COLORS.accent }}>Custom Map Art</span>
              </h1>
            </div>

            <div
              style={{
                width: lineWidth,
                height: 3,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.terracotta})`,
                marginTop: 24,
                marginBottom: 20,
              }}
            />

            <div style={subtitleStyle}>
              <p
                style={{
                  fontSize: 28,
                  color: COLORS.textSecondary,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Beautiful map posters in minutes.
                <br />
                No design skills needed.
              </p>
            </div>
          </div>

          {/* Right: Floating poster mockups */}
          <div
            style={{
              flex: 0.7,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 600,
              opacity: posterOpacity,
              transform: `scale(${posterScale})`,
            }}
          >
            {/* Front poster - offset left */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-75%, -55%) translateY(${float1}px) rotate(-3deg)`,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 260,
                  height: 347,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow:
                    "0 30px 70px rgba(0,0,0,0.18), 0 10px 25px rgba(0,0,0,0.12)",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <Img
                  src={POSTER_IMAGES.barcelona}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>

            {/* Back poster - offset right */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-15%, -40%) translateY(${float2}px) rotate(4deg)`,
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 220,
                  height: 293,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 50px rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.08)",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <Img
                  src={POSTER_IMAGES.tokyo}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </LightBackground>
    </AbsoluteFill>
  );
};
