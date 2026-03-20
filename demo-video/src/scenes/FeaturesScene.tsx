import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS, THEMES } from "../constants";
import { Vignette, AmbientGlow } from "../components";
import { useCinematicEntrance, useFade, useFadeOut, useFloat } from "../animations";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

/* ── Single word that appears and fades ───────────────────────────── */

const WordReveal: React.FC<{ word: string }> = ({ word }) => {
  const style = useCinematicEntrance(0, 70);
  const fadeOut = useFadeOut(50, 30);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ ...style, opacity: style.opacity * fadeOut }}>
        <span
          style={{
            fontSize: 120,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: "-4px",
            fontFamily,
          }}
        >
          {word}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ── Themes reveal at the end ─────────────────────────────────────── */

const ThemesReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const titleStyle = useCinematicEntrance(0, 70);

  const stripOffset = interpolate(frame, [0, 120], [100, -200], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {/* Flowing color strip */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: stripOffset,
          display: "flex",
          gap: 10,
        }}
      >
        {THEMES.map((t, i) => {
          const floatY = useFloat(40 + i * 3, 3, i * 25);
          return (
            <div
              key={t.name}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: t.color,
                boxShadow: `0 4px 20px ${t.color}44`,
                flexShrink: 0,
                transform: `translateY(${floatY}px)`,
              }}
            />
          );
        })}
      </div>

      {/* Text */}
      <div style={{ textAlign: "center", ...titleStyle }}>
        <span
          style={{
            fontSize: 130,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: "-5px",
            lineHeight: 1,
          }}
        >
          17
        </span>
        <p
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.textSecondary,
            margin: "8px 0 0",
            letterSpacing: "-1px",
          }}
        >
          Themes
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ── Main scene ───────────────────────────────────────────────────── */

export const FeaturesScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily }}>
      <AmbientGlow color="rgba(74, 124, 143, 0.06)" size={800} blur={100} />

      {/* Word-by-word reveals */}
      <Sequence from={0} durationInFrames={85} premountFor={10}>
        <WordReveal word="Pick." />
      </Sequence>

      <Sequence from={75} durationInFrames={85} premountFor={10}>
        <WordReveal word="Customize." />
      </Sequence>

      <Sequence from={150} durationInFrames={85} premountFor={10}>
        <WordReveal word="Print." />
      </Sequence>

      {/* Themes reveal at the end */}
      <Sequence from={210} durationInFrames={120} premountFor={10}>
        <ThemesReveal />
      </Sequence>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};
