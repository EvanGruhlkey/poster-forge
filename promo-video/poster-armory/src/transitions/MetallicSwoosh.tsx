import React from "react";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { interpolate } from "remotion";

const MetallicSwooshPresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress }) => {
  const isEntering = presentationDirection === "entering";

  const pos = interpolate(presentationProgress, [0, 1], [-20, 120]);

  const opacity = isEntering
    ? interpolate(presentationProgress, [0, 0.4, 1], [0, 1, 1])
    : interpolate(presentationProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {children}
      {isEntering && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              105deg,
              transparent ${pos - 14}%,
              rgba(255,255,255,0.0) ${pos - 9}%,
              rgba(255,255,255,0.15) ${pos - 5}%,
              rgba(200,218,240,0.5) ${pos - 2}%,
              rgba(255,255,255,0.85) ${pos}%,
              rgba(210,225,245,0.5) ${pos + 2}%,
              rgba(255,255,255,0.15) ${pos + 5}%,
              rgba(255,255,255,0.0) ${pos + 9}%,
              transparent ${pos + 14}%
            )`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export const metallicSwoosh = (): TransitionPresentation<
  Record<string, never>
> => {
  return { component: MetallicSwooshPresentation, props: {} };
};
