import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";
import { DemoVideo } from "./DemoVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={1050}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={4500}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
