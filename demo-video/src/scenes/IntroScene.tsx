import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { Particles, Vignette, AmbientGlow } from "../components";
import {
  useCinematicEntrance,
  useSubtleEntrance,
  useFloat,
  useLineReveal,
  useFade,
} from "../animations";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

export const IntroScene: React.FC = () => {
  const glowOpacity = useFade(20, 80);

  const pinStyle = useCinematicEntrance(40, 90);
  const pinFloat = useFloat(55, 4);

  const titleStyle = useCinematicEntrance(90, 100);
  const lineWidth = useLineReveal(150, 120, 60);
  const subtitleStyle = useSubtleEntrance(170, 60);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {/* Ambient atmosphere */}
      <div style={{ opacity: glowOpacity }}>
        <AmbientGlow
          color="rgba(74, 124, 143, 0.1)"
          size={900}
          blur={100}
        />
      </div>
      <Particles />
      <Vignette intensity={0.5} />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          position: "relative",
        }}
      >
        {/* Map Pin */}
        <div
          style={{
            ...pinStyle,
            transform: `${pinStyle.transform} translateY(${pinFloat}px)`,
          }}
        >
          <svg
            width={56}
            height={56}
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        {/* Title */}
        <div style={titleStyle}>
          <h1
            style={{
              fontSize: 110,
              fontWeight: 700,
              color: COLORS.text,
              letterSpacing: "-4px",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Poster Armory
          </h1>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            backgroundColor: COLORS.accent,
            borderRadius: 1,
            opacity: 0.7,
          }}
        />

        {/* Subtitle */}
        <div style={subtitleStyle}>
          <p
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: COLORS.textSecondary,
              letterSpacing: "8px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Custom Map Art
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
