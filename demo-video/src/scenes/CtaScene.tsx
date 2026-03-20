import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { Particles, Vignette, AmbientGlow } from "../components";
import {
  useCinematicEntrance,
  useSubtleEntrance,
  useFloat,
  SPRING,
} from "../animations";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

export const CtaScene: React.FC = () => {
  const pinStyle = useSubtleEntrance(10, 60);
  const pinFloat = useFloat(55, 4);

  const headlineStyle = useCinematicEntrance(30, 100);
  const buttonStyle = useCinematicEntrance(100, 80, SPRING.gentle);
  const urlStyle = useSubtleEntrance(150, 60);

  const breathe = useFloat(80, 2);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${COLORS.navyDeep} 0%, ${COLORS.bg} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <AmbientGlow
        color="rgba(74, 124, 143, 0.1)"
        size={800}
        top="40%"
        blur={100}
      />
      <Particles />
      <Vignette intensity={0.45} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          position: "relative",
          transform: `translateY(${breathe}px)`,
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
            width={44}
            height={44}
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

        {/* Headline */}
        <div style={headlineStyle}>
          <h2
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: COLORS.text,
              margin: 0,
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-3px",
            }}
          >
            Start Creating Today
          </h2>
        </div>

        {/* Button */}
        <div style={buttonStyle}>
          <div
            style={{
              backgroundColor: COLORS.text,
              color: COLORS.navy,
              fontSize: 22,
              fontWeight: 600,
              padding: "20px 56px",
              borderRadius: 14,
              boxShadow: "0 16px 50px rgba(0, 0, 0, 0.4)",
              letterSpacing: "-0.3px",
            }}
          >
            Create Your Poster
          </div>
        </div>

        {/* URL */}
        <div style={urlStyle}>
          <p
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.textSecondary,
              margin: 0,
              letterSpacing: "2px",
            }}
          >
            posterarmory.com
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
