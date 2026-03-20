import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";

/**
 * 60 fps · 1920×1080 · 30 seconds = 1 800 frames.
 */
export const RemotionRoot = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={1800}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};
