import React from "react";
import { Img, interpolate, Easing } from "remotion";
import { UI, WARM_BEIGE, POSTER_IMAGES } from "./constants";
import {
  NavbarUI,
  CardUI,
  CheckCircleIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  LockSmallIcon,
} from "./components";

const PROGRESS_END = 200;
const DONE_FRAME = 240;

const PROGRESS_STAGES = [
  { threshold: 0, label: "Fetching map data..." },
  { threshold: 30, label: "Processing roads and features..." },
  { threshold: 55, label: "Rendering map layers..." },
  { threshold: 75, label: "Applying theme and styling..." },
  { threshold: 90, label: "Generating files..." },
];

function getStageLabel(progress: number) {
  let label = PROGRESS_STAGES[0].label;
  for (const stage of PROGRESS_STAGES) {
    if (progress >= stage.threshold) label = stage.label;
  }
  return label;
}

export const ResultPage: React.FC<{ localFrame: number }> = ({
  localFrame: lf,
}) => {
  const opacity = interpolate(lf, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progress = Math.min(
    100,
    Math.round(
      interpolate(lf, [10, PROGRESS_END], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }),
    ),
  );
  const isDone = lf >= DONE_FRAME;

  const doneOpacity = interpolate(lf, [DONE_FRAME, DONE_FRAME + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const FILES = [
    { label: "PNG 24x36", icon: "img", allowed: true },
    { label: "PDF", icon: "file", allowed: true },
    { label: "SVG", icon: "file", allowed: false },
  ];

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

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px 40px 0",
          maxWidth: 640,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <button
          style={{
            alignSelf: "flex-start",
            background: "none",
            border: "none",
            fontSize: 13,
            color: UI.textMuted,
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        {/* Poster preview */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 220,
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${UI.cardBorder}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            <Img
              src={POSTER_IMAGES.barcelona}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Status card */}
        <CardUI style={{ width: "100%" }}>
          <div style={{ padding: "24px 20px", textAlign: "center" }}>
            {isDone ? (
              <div style={{ opacity: doneOpacity }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <CheckCircleIcon size={32} color="#22c55e" />
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: UI.text,
                    margin: 0,
                  }}
                >
                  Download Your Poster
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: UI.textMuted,
                    marginTop: 4,
                    marginBottom: 20,
                  }}
                >
                  Your print-ready files are here!
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {FILES.map((file, i) => {
                    const fileOpacity = interpolate(
                      lf,
                      [DONE_FRAME + 30 + i * 20, DONE_FRAME + 60 + i * 20],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    );
                    return (
                      <div
                        key={file.label}
                        style={{
                          opacity: fileOpacity,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          borderRadius: 8,
                          border: `1px solid ${UI.cardBorder}`,
                          padding: "10px 14px",
                          textAlign: "left",
                          ...(file.allowed
                            ? {}
                            : { opacity: fileOpacity * 0.5 }),
                        }}
                      >
                        {file.icon === "img" ? (
                          <ImageIcon size={18} />
                        ) : (
                          <FileTextIcon size={18} />
                        )}
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: UI.text,
                              margin: 0,
                            }}
                          >
                            {file.label}
                          </p>
                          {!file.allowed && (
                            <p
                              style={{
                                fontSize: 11,
                                color: UI.textMuted,
                                margin: 0,
                              }}
                            >
                              Upgrade to Pro+ to unlock
                            </p>
                          )}
                        </div>
                        {file.allowed ? (
                          <DownloadIcon size={16} />
                        ) : (
                          <LockSmallIcon size={14} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: "20px 0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={UI.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      transform: `rotate(${lf * 6}deg)`,
                    }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: UI.text,
                    margin: "0 0 4px",
                  }}
                >
                  Generating...
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: UI.textMuted,
                    margin: "0 0 20px",
                  }}
                >
                  Your poster is being created.
                </p>

                <div style={{ maxWidth: 360, margin: "0 auto" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: UI.textMuted }}>
                      {getStageLabel(progress)}
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        color: UI.text,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: UI.mutedBg,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 4,
                        background: UI.primary,
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardUI>
      </div>
    </div>
  );
};
