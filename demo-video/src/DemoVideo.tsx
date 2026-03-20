import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { IntroScene } from "./scenes/IntroScene";
import { StatementScene } from "./scenes/StatementScene";
import { HeroPosterScene } from "./scenes/HeroPosterScene";
import { GalleryScene } from "./scenes/GalleryScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { CtaScene } from "./scenes/CtaScene";

/**
 * 60 fps · 30 seconds = 1 800 frames.
 *
 *   Scene          Frames   Seconds
 *   ─────────────  ──────   ───────
 *   Intro            320     5.3
 *   Statement        300     5.0
 *   Hero Poster      340     5.7
 *   Gallery          320     5.3
 *   Features         280     4.7
 *   CTA              360     6.0
 *                  ──────
 *   Subtotal       1 920
 *   5 × 24 fade    − 120
 *   Total          1 800    30.0
 */

const T = 24;

export const DemoVideo: React.FC = () => {
  const timing = linearTiming({ durationInFrames: T });

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={320}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={300}>
        <StatementScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={340}>
        <HeroPosterScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={320}>
        <GalleryScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={280}>
        <FeaturesScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={360}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
