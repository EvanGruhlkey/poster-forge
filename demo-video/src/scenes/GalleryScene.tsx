import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS, POSTER_IMAGES } from "../constants";
import { Vignette, AmbientGlow } from "../components";
import { useCinematicEntrance, useFloat, useFade } from "../animations";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

const POSTERS = [
  { src: POSTER_IMAGES.tokyo, city: "Tokyo", x: 140, y: 180, w: 220, h: 295, blur: 2 },
  { src: POSTER_IMAGES.marrakech, city: "Marrakech", x: 420, y: 120, w: 260, h: 350, blur: 0 },
  { src: POSTER_IMAGES.venice, city: "Venice", x: 760, y: 90, w: 340, h: 455, blur: 0 },
  { src: POSTER_IMAGES.dubai, city: "Dubai", x: 1180, y: 130, w: 260, h: 350, blur: 0 },
  { src: POSTER_IMAGES.singapore, city: "Singapore", x: 1510, y: 190, w: 220, h: 295, blur: 2 },
];

export const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const titleStyle = useCinematicEntrance(0, 80);
  const subtitleOpacity = useFade(30, 50);

  const driftX = interpolate(frame, [0, 320], [0, -40], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily,
        overflow: "hidden",
      }}
    >
      <AmbientGlow color="rgba(74, 124, 143, 0.06)" size={1200} blur={120} />

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 28,
          width: "100%",
          textAlign: "center",
          zIndex: 10,
          ...titleStyle,
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: COLORS.text,
            margin: 0,
            letterSpacing: "-1.5px",
          }}
        >
          Every City, Every Style
        </h2>
        <p
          style={{
            fontSize: 18,
            color: COLORS.textSecondary,
            marginTop: 10,
            opacity: subtitleOpacity,
          }}
        >
          Thousands of cities. 17 hand-crafted themes.
        </p>
      </div>

      {/* Poster layout with depth */}
      {POSTERS.map((poster, i) => {
        const entrance = useCinematicEntrance(20 + i * 16, 90);
        const floatY = useFloat(50 + i * 10, 4, i * 55);
        const parallaxSpeed = poster.blur > 0 ? 0.3 : 0.6;
        const posterDrift = driftX * parallaxSpeed;

        return (
          <div
            key={poster.city}
            style={{
              position: "absolute",
              left: poster.x + posterDrift,
              top: poster.y,
              ...entrance,
              transform: `${entrance.transform} translateY(${floatY}px)`,
              filter: poster.blur > 0 ? `blur(${poster.blur}px)` : undefined,
            }}
          >
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              }}
            >
              <Img
                src={poster.src}
                style={{
                  width: poster.w,
                  height: poster.h,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        );
      })}

      <Vignette intensity={0.55} />
    </AbsoluteFill>
  );
};
