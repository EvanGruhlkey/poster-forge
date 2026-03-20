import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, POSTER_IMAGES } from "../constants";
import { useEntrance, useFloat, useSpring, SPRING } from "../animations";
import { LightBackground, SubtleGrid, WarmGlow } from "../components";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const float1 = useFloat(65, 5, 0);
  const float2 = useFloat(50, 4, 20);
  const float3 = useFloat(75, 6, 45);

  const headerStyle = useEntrance(5, 20);
  const urlStyle = useEntrance(18, 18);
  const buttonStyle = useEntrance(28, 18);

  const buttonGlow = interpolate(
    Math.sin(frame / 25),
    [-1, 1],
    [0.3, 0.6],
  );

  const posterP = useSpring(8, SPRING.gentle, 25);
  const posterOpacity = posterP;
  const posterScale = interpolate(posterP, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill>
      <LightBackground>
        <SubtleGrid />
        <WarmGlow top="50%" left="50%" size={1200} />
        <WarmGlow
          top="30%"
          left="20%"
          color={COLORS.terracottaLight}
          size={600}
        />
        <WarmGlow
          top="70%"
          left="80%"
          color={COLORS.accentLight}
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
          {/* Left: CTA content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              zIndex: 2,
            }}
          >
            <div style={headerStyle}>
              <h2
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: COLORS.text,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Ready to create
                <br />
                <span style={{ color: COLORS.accent }}>your poster?</span>
              </h2>
            </div>

            <div style={{ ...urlStyle, marginTop: 28 }}>
              <p
                style={{
                  fontSize: 28,
                  color: COLORS.textSecondary,
                  margin: 0,
                }}
              >
                Start designing at
              </p>
            </div>

            <div style={{ ...buttonStyle, marginTop: 24 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 44px",
                  borderRadius: 16,
                  backgroundColor: COLORS.accent,
                  color: "#ffffff",
                  fontSize: 32,
                  fontWeight: 700,
                  boxShadow: `0 8px 32px rgba(74, 124, 143, ${buttonGlow}), 0 2px 8px rgba(0,0,0,0.1)`,
                }}
              >
                posterarmory.com
              </div>
            </div>

            <div
              style={{
                marginTop: 30,
                opacity: interpolate(frame, [38, 55], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(frame, [38, 55], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
              }}
            >
              <p
                style={{
                  fontSize: 22,
                  color: COLORS.textMuted,
                  margin: 0,
                }}
              >
                Plans starting at $5/month
              </p>
            </div>
          </div>

          {/* Right: Floating poster trio */}
          <div
            style={{
              flex: 0.8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 650,
              opacity: posterOpacity,
              transform: `scale(${posterScale})`,
            }}
          >
            {/* Left poster */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-130%, -55%) translateY(${float3}px) rotate(-5deg)`,
                zIndex: 0,
                opacity: 0.75,
              }}
            >
              <PosterCard
                src={POSTER_IMAGES.venice}
                width={190}
                height={253}
                tiltY={-8}
              />
            </div>

            {/* Center poster (hero) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateY(${float1}px)`,
                zIndex: 2,
              }}
            >
              <PosterCard
                src={POSTER_IMAGES.marrakech}
                width={270}
                height={360}
                tiltY={-3}
              />
            </div>

            {/* Right poster */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(30%, -45%) translateY(${float2}px) rotate(4deg)`,
                zIndex: 1,
              }}
            >
              <PosterCard
                src={POSTER_IMAGES.singapore}
                width={195}
                height={260}
                tiltY={8}
              />
            </div>
          </div>
        </div>
      </LightBackground>
    </AbsoluteFill>
  );
};

const PosterCard: React.FC<{
  src: string;
  width: number;
  height: number;
  tiltY?: number;
}> = ({ src, width, height, tiltY = 0 }) => (
  <div style={{ perspective: 900 }}>
    <div
      style={{
        width,
        height,
        borderRadius: 8,
        overflow: "hidden",
        transform: `rotateY(${tiltY}deg) rotateX(3deg)`,
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.16), 0 8px 20px rgba(0,0,0,0.10)",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  </div>
);
