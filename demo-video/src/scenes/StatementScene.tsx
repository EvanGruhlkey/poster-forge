import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { Particles, Vignette, AmbientGlow } from "../components";
import { useCinematicEntrance, useFloat } from "../animations";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

export const StatementScene: React.FC = () => {
  const line1 = useCinematicEntrance(10, 90);
  const line2 = useCinematicEntrance(80, 90);
  const breathe = useFloat(70, 2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <AmbientGlow
        color="rgba(74, 124, 143, 0.08)"
        size={1000}
        top="45%"
        blur={120}
      />
      <Particles />
      <Vignette intensity={0.4} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          transform: `translateY(${breathe}px)`,
        }}
      >
        {/* Line 1 */}
        <div style={line1}>
          <h2
            style={{
              fontSize: 86,
              fontWeight: 600,
              color: COLORS.text,
              letterSpacing: "-3px",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Your Memories.
          </h2>
        </div>

        {/* Line 2 — delayed, accent color */}
        <div style={line2}>
          <h2
            style={{
              fontSize: 86,
              fontWeight: 600,
              color: COLORS.accent,
              letterSpacing: "-3px",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Reimagined.
          </h2>
        </div>
      </div>
    </AbsoluteFill>
  );
};
