import React from "react";
import { Img, interpolate, Easing } from "remotion";
import { UI, WARM_BEIGE, STYLE_PRESETS, POSTER_IMAGES } from "./constants";
import {
  NavbarUI,
  CardUI,
  BtnUI,
  InputUI,
  MapPinIcon,
  EyeIcon,
  DownloadIcon,
  LockSmallIcon,
  LoaderIcon,
} from "./components";

const THEME_SELECT_FRAME = 230;
const SLIDER_START = 460;
const SLIDER_END = 600;
const TITLE_TYPE_START = 720;
const TITLE_TYPE_END = 820;
const GENERATE_CLICK = 920;
const PREVIEW_LOADING_END = 1120;
const POSTER_APPEAR = 1120; // Same as loading end — poster appears immediately after loading

const TYPING_TITLE = "Barcelona";

export const DesignPage: React.FC<{ localFrame: number }> = ({
  localFrame: lf,
}) => {
  const opacity = interpolate(lf, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const selectedTheme = lf >= THEME_SELECT_FRAME ? "warm_beige" : "";

  const sliderProgress = interpolate(lf, [SLIDER_START, SLIDER_END], [0.33, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const radiusKm = Math.round(2 + sliderProgress * 28);

  const titleTyped =
    lf < TITLE_TYPE_START
      ? ""
      : TYPING_TITLE.slice(
          0,
          Math.ceil(
            interpolate(lf, [TITLE_TYPE_START, TITLE_TYPE_END], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * TYPING_TITLE.length,
          ),
        );
  const displayTitle = titleTyped || "Barcelona";

  const titleFocused = lf >= TITLE_TYPE_START - 5 && lf < TITLE_TYPE_END + 20;
  const isGenerating = lf >= GENERATE_CLICK && lf < PREVIEW_LOADING_END;
  const showPoster = lf >= POSTER_APPEAR;

  const posterOpacity = interpolate(lf, [POSTER_APPEAR, POSTER_APPEAR + 40], [0, 1], {
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
      <NavbarUI isApp />

      <div style={{ padding: "18px 40px 0", maxWidth: 1300, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: UI.text, margin: 0, textAlign: "center" }}>
          Customize Your Poster
        </h1>
        <p style={{ fontSize: 13, color: UI.textMuted, marginTop: 4, marginBottom: 20, textAlign: "center" }}>
          Personalize your map design.
        </p>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Left: Controls */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Style card */}
            <CardUI>
              <div style={{ padding: "14px 16px 6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: UI.text }}>Style</span>
                  <span style={{ fontSize: 11, color: UI.textMuted }}>More themes with Pro</span>
                </div>
              </div>
              <div style={{ padding: "8px 16px 14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {STYLE_PRESETS.map((preset) => {
                    const isSelected = selectedTheme === preset.id;
                    return (
                      <div
                        key={preset.id}
                        style={{
                          borderRadius: 8,
                          border: isSelected
                            ? `2px solid ${UI.primary}`
                            : "2px solid transparent",
                          padding: 8,
                          textAlign: "center",
                          position: "relative",
                          opacity: preset.locked ? 0.5 : 1,
                          boxShadow: isSelected ? `0 0 0 2px ${UI.ring}` : "none",
                        }}
                      >
                        {preset.locked && (
                          <div style={{ position: "absolute", right: 4, top: 4 }}>
                            <LockSmallIcon size={10} />
                          </div>
                        )}
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 4,
                            background: preset.bg,
                            margin: "0 auto 4px",
                            border:
                              preset.bg === "#000000" || preset.bg === "#0A1628" || preset.bg === "#0D0D1A" || preset.bg === "#111111" || preset.bg === "#062C22"
                                ? "1px solid #444"
                                : `1px solid ${UI.cardBorder}`,
                          }}
                        />
                        <span style={{ fontSize: 10, fontWeight: 500, color: UI.text }}>
                          {preset.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardUI>

            {/* Map Settings */}
            <CardUI>
              <div style={{ padding: "14px 16px 6px" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: UI.text }}>Map Settings</span>
              </div>
              <div style={{ padding: "8px 16px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: UI.text }}>
                    Radius: {radiusKm} km
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: UI.mutedBg,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      background: UI.primary,
                      width: `${sliderProgress * 100}%`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -5,
                      left: `${sliderProgress * 100}%`,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                      border: `2px solid ${UI.primary}`,
                      transform: "translateX(-50%)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>
              </div>
            </CardUI>

            {/* Text Options */}
            <CardUI>
              <div style={{ padding: "14px 16px 6px" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: UI.text }}>Text Options</span>
              </div>
              <div style={{ padding: "8px 16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: UI.text, display: "block", marginBottom: 4 }}>
                    Title
                  </label>
                  <InputUI
                    value={titleTyped}
                    placeholder="Paris"
                    focused={titleFocused}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: UI.text, display: "block", marginBottom: 4 }}>
                    Subtitle
                  </label>
                  <InputUI value="" placeholder="Where We Met" />
                </div>
              </div>
            </CardUI>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <BtnUI
                variant="outline"
                style={{ flex: 1 }}
                active={isGenerating}
              >
                {isGenerating ? (
                  <LoaderIcon size={15} color={UI.text} />
                ) : (
                  <EyeIcon size={15} color={UI.text} />
                )}
                Generate Preview
              </BtnUI>
              <BtnUI style={{ flex: 1 }}>
                <DownloadIcon size={15} color="#fff" />
                Download Poster
              </BtnUI>
            </div>
          </div>

          {/* Right: Preview panel */}
          <div style={{ width: 360, flexShrink: 0 }}>
            <CardUI>
              <div
                style={{
                  aspectRatio: "3 / 4",
                  background: WARM_BEIGE.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {showPoster ? (
                  <Img
                    src={POSTER_IMAGES.barcelona}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: posterOpacity,
                    }}
                  />
                ) : isGenerating ? (
                  <div style={{ textAlign: "center" }}>
                    <LoaderIcon size={36} color={WARM_BEIGE.text} />
                    <p style={{ fontSize: 13, color: WARM_BEIGE.text, marginTop: 8 }}>
                      Generating preview...
                    </p>
                  </div>
                ) : (
                  <PosterPlaceholder
                    title={displayTitle}
                    themeSelected={!!selectedTheme}
                  />
                )}
              </div>
            </CardUI>
          </div>
        </div>
      </div>
    </div>
  );
};

const PosterPlaceholder: React.FC<{
  title: string;
  themeSelected: boolean;
}> = ({ title, themeSelected }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      height: "100%",
      padding: 24,
    }}
  >
    <div
      style={{
        flex: 1,
        width: "100%",
        borderRadius: 4,
        background: `${WARM_BEIGE.text}10`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MapPinIcon size={48} color={`${WARM_BEIGE.text}40`} />
    </div>
    <div style={{ marginTop: 12, textAlign: "center" }}>
      <div
        style={{
          height: 1,
          width: 40,
          background: `${WARM_BEIGE.text}40`,
          margin: "0 auto 8px",
        }}
      />
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 4,
          color: WARM_BEIGE.text,
          margin: 0,
        }}
      >
        {title.toUpperCase().split("").join(" ")}
      </p>
      <p
        style={{
          fontSize: 9,
          color: WARM_BEIGE.text,
          opacity: 0.6,
          marginTop: 4,
        }}
      >
        41.39° N, 2.17° E
      </p>
    </div>
  </div>
);
