import React from "react";
import { Img, interpolate, Easing } from "remotion";
import { UI, POSTER_IMAGES } from "./constants";
import {
  NavbarUI,
  BtnUI,
  CheckCircleIcon,
} from "./components";

export const LandingPage: React.FC<{ localFrame: number }> = ({
  localFrame,
}) => {
  const opacity = interpolate(localFrame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background: UI.pageBg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavbarUI />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          maxWidth: 1300,
          margin: "0 auto",
          width: "100%",
          gap: 60,
        }}
      >
        {/* Left: text */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: UI.text,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Transform Your Memories
            <br />
            into{" "}
            <span
              style={{
                color: UI.primary,
                textDecoration: "underline",
                textDecorationColor: "rgba(23, 50, 77, 0.3)",
                textUnderlineOffset: 4,
              }}
            >
              Custom Map Art
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: UI.textMuted,
              marginTop: 16,
              marginBottom: 18,
              lineHeight: 1.5,
            }}
          >
            Create beautiful map posters in minutes.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {[
              "Personalize any location",
              "Choose from stylish themes",
              "Instantly download print ready files",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: UI.textMuted,
                }}
              >
                <CheckCircleIcon size={15} color={UI.primary} />
                {item}
              </div>
            ))}
          </div>

          <BtnUI size="lg">Create Your Poster</BtnUI>
        </div>

        {/* Right: poster */}
        <div style={{ flex: 0.7, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 300,
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${UI.cardBorder}`,
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Img
              src={POSTER_IMAGES.barcelona}
              style={{
                width: "100%",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
