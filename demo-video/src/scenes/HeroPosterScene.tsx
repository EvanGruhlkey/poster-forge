import { AbsoluteFill, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS, POSTER_IMAGES } from "../constants";
import { Vignette, AmbientGlow } from "../components";
import {
  useCinematicEntrance,
  useSubtleEntrance,
  useSlowZoom,
} from "../animations";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export const HeroPosterScene: React.FC = () => {
  const posterEntrance = useCinematicEntrance(0, 100);
  const zoom = useSlowZoom(1.0, 1.06);
  const labelStyle = useSubtleEntrance(100, 60);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {/* Warm glow behind the poster */}
      <AmbientGlow
        color="rgba(212, 184, 150, 0.08)"
        size={800}
        top="45%"
        blur={100}
      />

      {/* Poster with Ken Burns zoom */}
      <div
        style={{
          ...posterEntrance,
          transform: `${posterEntrance.transform} scale(${zoom})`,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 40px 120px rgba(0, 0, 0, 0.7)",
          }}
        >
          <Img
            src={POSTER_IMAGES.barcelona}
            style={{
              width: 420,
              height: 560,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          textAlign: "center",
          ...labelStyle,
        }}
      >
        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.text,
            margin: 0,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Barcelona
        </p>
        <p
          style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            margin: "6px 0 0",
            letterSpacing: "1px",
          }}
        >
          Warm Beige
        </p>
      </div>

      <Vignette intensity={0.6} />
    </AbsoluteFill>
  );
};
