import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import {
  TOTAL_FRAMES,
  BROWSER,
  MAIN,
  PAGE,
  DEMO_BG,
  POSTER_IMAGES,
  ANNOTATION_Y,
  interpZoom,
  interpCursor,
  getAnnotation,
  contentToScreen,
  type ZoomKF,
  type CursorKF,
  type AnnotationKF,
} from "./demo/constants";
import {
  MacBrowserChrome,
  AnimatedCursor,
  TextAnnotation,
  LogoSVG,
} from "./demo/components";
import { LandingPage } from "./demo/LandingPage";
import { LocationPage } from "./demo/LocationPage";
import { DesignPage } from "./demo/DesignPage";
import { ResultPage } from "./demo/ResultPage";

const FADE_IN = 120;
const FADE_OUT = 180;

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <Audio
        src={staticFile("background-music.mp3")}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, FADE_IN], [0, 0.2], {
            extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(
            f,
            [TOTAL_FRAMES - FADE_OUT, TOTAL_FRAMES],
            [0.2, 0],
            { extrapolateLeft: "clamp" },
          );
          return Math.min(fadeIn, fadeOut);
        }}
      />

      <Sequence from={MAIN.introStart} durationInFrames={MAIN.introEnd + 60}>
        <IntroScene />
      </Sequence>

      <Sequence
        from={MAIN.browserStart}
        durationInFrames={MAIN.browserEnd - MAIN.browserStart}
      >
        <BrowserScene />
      </Sequence>

      <Sequence
        from={MAIN.ctaStart}
        durationInFrames={MAIN.ctaEnd - MAIN.ctaStart}
      >
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// --------------- INTRO ---------------

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const gridOffset = frame * 0.08;

  const logoOpacity = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoY = interpolate(frame, [30, 80], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const tagOpacity = interpolate(frame, [70, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [70, 120], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const lineWidth = interpolate(frame, [90, 150], [0, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const subOpacity = interpolate(frame, [120, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [260, 340], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${DEMO_BG.bg} 0%, ${DEMO_BG.bgWarm} 50%, ${DEMO_BG.bg} 100%)`,
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      <MapBackground offset={gridOffset} frame={frame} />

      {/* Warm glows */}
      <Glow x="25%" y="35%" size={700} color="rgba(74, 124, 143, 0.06)" />
      <Glow x="75%" y="65%" size={500} color="rgba(198, 122, 74, 0.06)" />

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 20,
          }}
        >
          <LogoSVG size={60} />
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: DEMO_BG.text,
              letterSpacing: -1,
            }}
          >
            Poster Armory
          </span>
        </div>

        <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)` }}>
          <p
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: DEMO_BG.textSecondary,
              margin: 0,
              textAlign: "center",
            }}
          >
            Create custom map posters in minutes
          </p>
        </div>

        <div
          style={{
            width: lineWidth,
            height: 3,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${DEMO_BG.accent}, rgba(198, 122, 74, 0.8))`,
            marginTop: 20,
            marginBottom: 16,
          }}
        />

        <div style={{ opacity: subOpacity }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: DEMO_BG.accent,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            See how it works
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Map-like grid pattern for browser scene */
const MapGridPattern: React.FC<{
  offset?: number;
  opacity?: number;
}> = ({ offset = 0, opacity = 0.05 }) => (
  <div
    style={{
      position: "absolute",
      inset: -80,
      opacity,
      backgroundImage: `
        linear-gradient(${DEMO_BG.accent} 1px, transparent 1px),
        linear-gradient(90deg, ${DEMO_BG.accent} 1px, transparent 1px),
        linear-gradient(rgba(74, 124, 143, 0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(74, 124, 143, 0.4) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px, 60px 60px, 15px 15px, 15px 15px",
      backgroundPosition: `${offset}px ${offset * 0.5}px, ${offset}px ${offset * 0.5}px, ${offset * 0.2}px ${offset * 0.1}px, ${offset * 0.2}px ${offset * 0.1}px`,
    }}
  />
);

/** Sleek map-themed background for intro and CTA — grid, blurred posters, globe accent */
const MapBackground: React.FC<{
  offset?: number;
  frame?: number;
}> = ({ offset = 0, frame = 0 }) => (
  <>
    {/* Blurred map poster collage — world-map feel */}
    <div
      style={{
        position: "absolute",
        inset: -100,
        opacity: 0.04,
        filter: "blur(80px)",
      }}
    >
      <Img
        src={POSTER_IMAGES.barcelona}
        style={{
          position: "absolute",
          left: "15%",
          top: "25%",
          width: 400,
          height: 533,
          objectFit: "cover",
          transform: `translate(${Math.sin(frame / 200) * 20}px, ${Math.cos(frame / 180) * 15}px)`,
        }}
      />
      <Img
        src={POSTER_IMAGES.tokyo}
        style={{
          position: "absolute",
          right: "20%",
          top: "30%",
          width: 350,
          height: 467,
          objectFit: "cover",
          transform: `translate(${Math.cos(frame / 220) * -15}px, ${Math.sin(frame / 190) * 20}px)`,
        }}
      />
      <Img
        src={POSTER_IMAGES.venice}
        style={{
          position: "absolute",
          left: "25%",
          bottom: "20%",
          width: 300,
          height: 400,
          objectFit: "cover",
          transform: `translate(${Math.sin(frame / 240) * 18}px, ${Math.cos(frame / 210) * -12}px)`,
        }}
      />
      <Img
        src={POSTER_IMAGES.singapore}
        style={{
          position: "absolute",
          right: "15%",
          bottom: "25%",
          width: 320,
          height: 427,
          objectFit: "cover",
          transform: `translate(${Math.cos(frame / 260) * -20}px, ${Math.sin(frame / 230) * -15}px)`,
        }}
      />
    </div>

    {/* Latitude/longitude grid — sleek map projection feel */}
    <div
      style={{
        position: "absolute",
        inset: -80,
        opacity: 0.08,
        backgroundImage: `
          linear-gradient(${DEMO_BG.accent} 1px, transparent 1px),
          linear-gradient(90deg, ${DEMO_BG.accent} 1px, transparent 1px),
          linear-gradient(rgba(74, 124, 143, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(74, 124, 143, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
        backgroundPosition: `${offset}px ${offset * 0.5}px, ${offset}px ${offset * 0.5}px, ${offset * 0.3}px ${offset * 0.15}px, ${offset * 0.3}px ${offset * 0.15}px`,
      }}
    />

    {/* Subtle globe/circle accent — map projection aesthetic */}
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 900,
        height: 900,
        marginLeft: -450,
        marginTop: -450,
        borderRadius: "50%",
        border: `1px solid rgba(74, 124, 143, 0.12)`,
        opacity: 0.6,
        transform: `scale(${1 + Math.sin(frame / 300) * 0.02})`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 600,
        height: 600,
        marginLeft: -300,
        marginTop: -300,
        borderRadius: "50%",
        border: `1px solid rgba(74, 124, 143, 0.08)`,
        opacity: 0.5,
      }}
    />
  </>
);

const Glow: React.FC<{
  x: string;
  y: string;
  size: number;
  color: string;
}> = ({ x, y, size, color }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      filter: "blur(50px)",
      pointerEvents: "none",
    }}
  />
);

// --------------- BROWSER WALKTHROUGH ---------------

// Content-space positions (1660×840) — calibrated from rendered frames.
// DESIGN page: slider, title, generate — cursor was still high, lowered further.
//
// LANDING:  CTA button cx≈330, cy≈565
// LOCATION: City cx=687 cy=315, Country cx=973 cy=315
//           Find btn cx=619 cy=435, Next btn cx=1008 cy=570
// DESIGN:   Classic swatch cx=313 cy=218, Slider cy=620, Title cy=740, Generate cy=855
// RESULT:   Poster cx=830 cy=262, Downloads cx=830 cy=620

const ZOOM_KF: ZoomKF[] = [
  // Landing page — overview, then zoom to CTA button
  { f: 0, s: 1, cx: 830, cy: 420 },
  { f: 240, s: 1, cx: 830, cy: 420 },
  { f: 320, s: 1.5, cx: 410, cy: 530 },
  { f: 440, s: 1.5, cx: 410, cy: 530 },
  { f: 520, s: 1, cx: 830, cy: 420 },
  // Location — zoom to form card inputs
  { f: 590, s: 1, cx: 830, cy: 420 },
  { f: 660, s: 1.4, cx: 750, cy: 350 },
  { f: 1000, s: 1.4, cx: 750, cy: 350 },
  { f: 1060, s: 1.35, cx: 750, cy: 450 },
  { f: 1180, s: 1.35, cx: 750, cy: 450 },
  { f: 1230, s: 1.25, cx: 900, cy: 545 },
  { f: 1340, s: 1.25, cx: 900, cy: 545 },
  { f: 1400, s: 1, cx: 830, cy: 420 },
  // Design — zoom to theme grid
  { f: 1460, s: 1, cx: 830, cy: 420 },
  { f: 1560, s: 1.5, cx: 450, cy: 240 },
  { f: 1740, s: 1.5, cx: 450, cy: 240 },
  { f: 1820, s: 1.5, cx: 500, cy: 620 },
  { f: 2020, s: 1.5, cx: 500, cy: 620 },
  { f: 2080, s: 1.5, cx: 500, cy: 740 },
  { f: 2260, s: 1.5, cx: 500, cy: 740 },
  { f: 2310, s: 1.3, cx: 500, cy: 800 },
  { f: 2440, s: 1.3, cx: 500, cy: 800 },
  { f: 2520, s: 1, cx: 830, cy: 420 },
  { f: 2860, s: 1, cx: 830, cy: 420 },
  // Result — zoom to poster preview
  { f: 2920, s: 1, cx: 830, cy: 380 },
  { f: 3000, s: 1.3, cx: 830, cy: 280 },
  { f: 3200, s: 1.3, cx: 830, cy: 280 },
  { f: 3280, s: 1.25, cx: 830, cy: 580 },
  { f: 3480, s: 1.25, cx: 830, cy: 580 },
  { f: 3560, s: 1, cx: 830, cy: 420 },
];

const CURSOR_KF: CursorKF[] = [
  // --- Landing page ---
  { f: 0, cx: 1200, cy: 350, hidden: true },
  { f: 180, cx: 1200, cy: 350 },
  { f: 330, cx: 330, cy: 565 },
  { f: 360, cx: 330, cy: 565 },
  { f: 380, cx: 330, cy: 565, click: true },
  { f: 500, cx: 330, cy: 565, hidden: true },

  // --- Location page ---
  { f: 620, cx: 600, cy: 290, hidden: true },
  { f: 680, cx: 687, cy: 315 },
  { f: 696, cx: 687, cy: 315 },
  { f: 700, cx: 687, cy: 315, click: true },
  { f: 790, cx: 687, cy: 315 },
  { f: 850, cx: 973, cy: 315 },
  { f: 866, cx: 973, cy: 315 },
  { f: 870, cx: 973, cy: 315, click: true },
  { f: 950, cx: 973, cy: 315 },
  { f: 1010, cx: 619, cy: 435 },
  { f: 1016, cx: 619, cy: 435 },
  { f: 1020, cx: 619, cy: 435, click: true },
  { f: 1130, cx: 619, cy: 435 },
  { f: 1200, cx: 619, cy: 435 },
  { f: 1270, cx: 1008, cy: 570 },
  { f: 1276, cx: 1008, cy: 570 },
  { f: 1280, cx: 1008, cy: 570, click: true },
  { f: 1390, cx: 1008, cy: 570, hidden: true },

  // --- Design page ---
  { f: 1480, cx: 313, cy: 218, hidden: true },
  { f: 1560, cx: 313, cy: 218 },
  { f: 1616, cx: 313, cy: 218 },
  { f: 1620, cx: 313, cy: 218, click: true },
  { f: 1710, cx: 313, cy: 218 },
  { f: 1820, cx: 501, cy: 620 },
  { f: 1846, cx: 501, cy: 620 },
  { f: 1850, cx: 501, cy: 620, click: true },
  { f: 1940, cx: 678, cy: 620 },
  { f: 2000, cx: 678, cy: 620 },
  { f: 2080, cx: 638, cy: 740 },
  { f: 2106, cx: 638, cy: 740 },
  { f: 2110, cx: 638, cy: 740, click: true },
  { f: 2200, cx: 638, cy: 740 },
  { f: 2280, cx: 427, cy: 855 },
  { f: 2306, cx: 427, cy: 855 },
  { f: 2310, cx: 427, cy: 855, click: true },
  { f: 2640, cx: 427, cy: 855 },
  { f: 2860, cx: 427, cy: 855, hidden: true },

  // --- Result page ---
  { f: 2940, cx: 830, cy: 400, hidden: true },
  { f: 3040, cx: 830, cy: 262 },
  { f: 3280, cx: 830, cy: 620 },
  { f: 3480, cx: 830, cy: 620 },
  { f: 3580, cx: 830, cy: 620, hidden: true },
];

const ANNOTATIONS: AnnotationKF[] = [
  { start: 100, end: 500, text: "posterarmory.com" },
  { start: 600, end: 980, text: "Step 1 — Pick any location in the world" },
  { start: 1040, end: 1340, text: "Location found instantly" },
  { start: 1500, end: 1740, text: "Step 2 — Choose from 17 hand-crafted themes" },
  { start: 1820, end: 2040, text: "Adjust the map radius" },
  { start: 2080, end: 2280, text: "Add your custom text" },
  { start: 2320, end: 2700, text: "Preview your poster in real-time" },
  { start: 2920, end: 3240, text: "Step 3 — Download print-ready files" },
  { start: 3300, end: 3560, text: "PNG, PDF, and SVG formats available" },
];

function getPageUrl(frame: number): string {
  if (frame < PAGE.location.start) return "posterarmory.com";
  if (frame < PAGE.design.start) return "posterarmory.com/app";
  if (frame < PAGE.result.start) return "posterarmory.com/app/design";
  return "posterarmory.com/download";
}

function getPageOpacity(
  frame: number,
  pageStart: number,
  pageEnd: number,
): number {
  const fadeIn = interpolate(frame, [pageStart, pageStart + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [pageEnd - 40, pageEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
}

const BrowserScene: React.FC = () => {
  const frame = useCurrentFrame();

  const browserInOpacity = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const browserInY = interpolate(frame, [0, 50], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const browserOutOpacity = interpolate(frame, [3580, 3660], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const browserOutY = interpolate(frame, [3580, 3660], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const browserOpacity = Math.min(browserInOpacity, browserOutOpacity);
  const browserY = browserInY + browserOutY;

  const zoom = interpZoom(ZOOM_KF, frame);
  const cursor = interpCursor(CURSOR_KF, frame);
  const annotation = getAnnotation(ANNOTATIONS, frame);
  const url = getPageUrl(frame);

  const vw = BROWSER.contentWidth;
  const vh = BROWSER.contentHeight;
  const tx = vw / 2 - zoom.cx * zoom.s;
  const ty = vh / 2 - zoom.cy * zoom.s;

  const cursorScreen = contentToScreen(cursor.cx, cursor.cy, zoom);

  const showLanding =
    frame >= PAGE.landing.start - 10 && frame <= PAGE.landing.end + 15;
  const showLocation =
    frame >= PAGE.location.start - 10 && frame <= PAGE.location.end + 15;
  const showDesign =
    frame >= PAGE.design.start - 10 && frame <= PAGE.design.end + 15;
  const showResult =
    frame >= PAGE.result.start - 10 && frame <= PAGE.result.end + 15;

  const gridOffset = frame * 0.12;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${DEMO_BG.bg} 0%, ${DEMO_BG.bgWarm} 100%)`,
      }}
    >
      <MapGridPattern offset={gridOffset} opacity={0.05} />
      <div
        style={{
          position: "absolute",
          left: BROWSER.x,
          top: BROWSER.y,
          opacity: browserOpacity,
          transform: `translateY(${browserY}px)`,
        }}
      >
        <MacBrowserChrome url={url}>
          <div
            style={{
              width: BROWSER.contentWidth,
              height: BROWSER.contentHeight,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                transformOrigin: "0 0",
                transform: `translate(${tx}px, ${ty}px) scale(${zoom.s})`,
                width: BROWSER.contentWidth,
                height: BROWSER.contentHeight,
                position: "relative",
              }}
            >
              {showLanding && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: getPageOpacity(frame, PAGE.landing.start, PAGE.landing.end),
                  }}
                >
                  <LandingPage localFrame={frame - PAGE.landing.start} />
                </div>
              )}
              {showLocation && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: getPageOpacity(frame, PAGE.location.start, PAGE.location.end),
                  }}
                >
                  <LocationPage localFrame={frame - PAGE.location.start} />
                </div>
              )}
              {showDesign && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: getPageOpacity(frame, PAGE.design.start, PAGE.design.end),
                  }}
                >
                  <DesignPage localFrame={frame - PAGE.design.start} />
                </div>
              )}
              {showResult && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: getPageOpacity(frame, PAGE.result.start, PAGE.result.end),
                  }}
                >
                  <ResultPage localFrame={frame - PAGE.result.start} />
                </div>
              )}
            </div>
          </div>
        </MacBrowserChrome>
      </div>

      <AnimatedCursor
        x={cursorScreen.x}
        y={cursorScreen.y}
        clicking={!!cursor.click}
        visible={!cursor.hidden}
      />

      <TextAnnotation
        text={annotation.text}
        opacity={annotation.opacity * browserOpacity}
        y={ANNOTATION_Y}
      />
    </AbsoluteFill>
  );
};

// --------------- CTA ---------------

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();

  const gridOffset = frame * 0.12;
  const float1 = Math.sin(frame / 60) * 6;
  const float3 = Math.sin((frame + 60) / 70) * 7;
  const float4 = Math.sin((frame + 15) / 55) * 4;

  const enterOpacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headOpacity = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headY = interpolate(frame, [20, 80], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const lineWidth = interpolate(frame, [60, 120], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const urlOpacity = interpolate(frame, [80, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(frame, [80, 130], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const tagOpacity = interpolate(frame, [120, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const posterOpacity = interpolate(frame, [30, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const posterScale = interpolate(frame, [30, 100], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const btnGlow = interpolate(Math.sin(frame / 40), [-1, 1], [0.25, 0.5]);

  const exitOpacity = interpolate(frame, [520, 620], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${DEMO_BG.bg} 0%, ${DEMO_BG.bgWarm} 50%, ${DEMO_BG.bg} 100%)`,
        opacity: Math.min(enterOpacity, exitOpacity),
        overflow: "hidden",
      }}
    >
      <MapBackground offset={gridOffset} frame={frame} />

      {/* Warm glows */}
      <Glow x="20%" y="40%" size={800} color="rgba(74, 124, 143, 0.05)" />
      <Glow x="80%" y="60%" size={600} color="rgba(198, 122, 74, 0.05)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 100px",
        }}
      >
        {/* Left: CTA text */}
        <div style={{ flex: 1, zIndex: 1 }}>
          <div
            style={{
              opacity: headOpacity,
              transform: `translateY(${headY}px)`,
            }}
          >
            <h2
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: DEMO_BG.text,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Ready to create
              <br />
              <span style={{ color: DEMO_BG.accent }}>your poster?</span>
            </h2>
          </div>

          <div
            style={{
              width: lineWidth,
              height: 3,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${DEMO_BG.accent}, rgba(198, 122, 74, 0.8))`,
              marginTop: 22,
              marginBottom: 22,
            }}
          />

          <div
            style={{
              opacity: urlOpacity,
              transform: `translateY(${urlY}px)`,
            }}
          >
            <p
              style={{
                fontSize: 22,
                color: DEMO_BG.textSecondary,
                margin: "0 0 16px",
              }}
            >
              Start designing at
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "18px 40px",
                borderRadius: 14,
                background: DEMO_BG.accent,
                color: "#ffffff",
                fontSize: 30,
                fontWeight: 700,
                boxShadow: `0 8px 32px rgba(74, 124, 143, ${btnGlow}), 0 2px 8px rgba(0,0,0,0.1)`,
              }}
            >
              posterarmory.com
            </div>
          </div>

          <div style={{ opacity: tagOpacity, marginTop: 24 }}>
            <p
              style={{
                fontSize: 18,
                color: DEMO_BG.textSecondary,
                margin: 0,
              }}
            >
              No design skills needed.
            </p>
          </div>
        </div>

        {/* Right: Floating poster gallery */}
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
          <PosterFloat
            src={POSTER_IMAGES.venice}
            w={175}
            h={233}
            x="-125%"
            y="-50%"
            float={float3}
            rotate={-6}
            z={0}
            op={1}
          />
          <PosterFloat
            src={POSTER_IMAGES.singapore}
            w={175}
            h={233}
            x="25%"
            y="-50%"
            float={float4}
            rotate={6}
            z={0}
            op={1}
          />
          <PosterFloat
            src={POSTER_IMAGES.barcelona}
            w={280}
            h={373}
            x="-50%"
            y="-50%"
            float={float1}
            rotate={0}
            z={2}
            op={1}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PosterFloat: React.FC<{
  src: string;
  w: number;
  h: number;
  x: string;
  y: string;
  float: number;
  rotate: number;
  z: number;
  op: number;
}> = ({ src, w, h, x, y, float: f, rotate, z, op }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(${x}, ${y}) translateY(${f}px) rotate(${rotate}deg)`,
      zIndex: z,
      opacity: op,
    }}
  >
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e2e0dc",
      }}
    >
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  </div>
);
