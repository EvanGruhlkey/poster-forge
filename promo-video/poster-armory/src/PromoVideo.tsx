import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { metallicSwoosh } from "./transitions/MetallicSwoosh";
import { IntroScene } from "./scenes/IntroScene";
import { PainPointScene } from "./scenes/PainPointScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { CitiesScene } from "./scenes/CitiesScene";
import { ThemesScene } from "./scenes/ThemesScene";
import { CtaScene } from "./scenes/CtaScene";

/**
 * 30 fps · 35 seconds = 1050 frames.
 *
 *   Scene           Frames   Seconds
 *   ─────────────   ──────   ───────
 *   Intro             126     4.2
 *   Pain Point        195     6.5
 *   Solution          225     7.5
 *   Cities            156     5.2
 *   Themes            186     6.2
 *   CTA               222     7.4
 *                   ──────
 *   Subtotal        1 110
 *   5 × 12 trans    −  60
 *   Total           1 050    35.0
 */

const T = 12;
const TOTAL = 1050;
const FPS = 30;
const FADE_IN_FRAMES = 2 * FPS;
const FADE_OUT_FRAMES = 3 * FPS;

export const PromoVideo: React.FC = () => {
  const timing = linearTiming({ durationInFrames: T });

  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("background-music.mp3")}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, FADE_IN_FRAMES], [0, 0.35], {
            extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(
            f,
            [TOTAL - FADE_OUT_FRAMES, TOTAL],
            [0.35, 0],
            { extrapolateLeft: "clamp" },
          );
          return Math.min(fadeIn, fadeOut);
        }}
      />
      <TransitionSeries>
        {/* 1. Intro / Hook */}
        <TransitionSeries.Sequence durationInFrames={126}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {/* Metallic swoosh → Pain Point (only swoosh) */}
        <TransitionSeries.Transition
          presentation={metallicSwoosh()}
          timing={timing}
        />

        {/* 2. Pain Point */}
        <TransitionSeries.Sequence durationInFrames={195}>
          <PainPointScene />
        </TransitionSeries.Sequence>

        {/* Fade → Solution */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={timing}
        />

        {/* 3. Solution - 3 Steps */}
        <TransitionSeries.Sequence durationInFrames={225}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        {/* Fade → Cities */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={timing}
        />

        {/* 4. Any City, Any Memory */}
        <TransitionSeries.Sequence durationInFrames={156}>
          <CitiesScene />
        </TransitionSeries.Sequence>

        {/* Fade → Themes */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={timing}
        />

        {/* 5. 17 Themes */}
        <TransitionSeries.Sequence durationInFrames={186}>
          <ThemesScene />
        </TransitionSeries.Sequence>

        {/* Fade → CTA */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={timing}
        />

        {/* 6. CTA */}
        <TransitionSeries.Sequence durationInFrames={222}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
