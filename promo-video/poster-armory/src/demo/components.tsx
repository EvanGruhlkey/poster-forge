import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { UI, BROWSER } from "./constants";

export const LogoSVG: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: size, height: size }}
  >
    <path
      d="M32 4L54 12V28C54 42 44 52 32 60C20 52 10 42 10 28V12L32 4Z"
      fill="#17324D"
    />
    <path
      d="M32 18C27.6 18 24 21.6 24 26C24 32 32 42 32 42C32 42 40 32 40 26C40 21.6 36.4 18 32 18Z"
      fill="#F4F1EA"
    />
    <circle cx="32" cy="26" r="3" fill="#17324D" />
  </svg>
);

export const MacBrowserChrome: React.FC<{
  url: string;
  children: React.ReactNode;
}> = ({ url, children }) => (
  <div
    style={{
      width: BROWSER.width,
      height: BROWSER.height,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow:
        "0 25px 80px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.08)",
      border: "1px solid #d4d4d8",
      background: "#ffffff",
    }}
  >
    <div
      style={{
        height: BROWSER.titleBar,
        background: "linear-gradient(180deg, #fafafa 0%, #ececec 100%)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid #d4d4d8",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {[
          ["#ff5f57", "#e5443f"],
          ["#fdbc40", "#dda032"],
          ["#33c748", "#2aad3e"],
        ].map(([bg, bd], i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: bg,
              border: `1px solid ${bd}`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: 6,
            padding: "4px 16px",
            fontSize: 13,
            color: "#555",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <LockIcon />
          {url}
        </div>
      </div>
    </div>
    <div
      style={{
        width: BROWSER.contentWidth,
        height: BROWSER.contentHeight,
        overflow: "hidden",
        position: "relative",
        background: UI.pageBg,
      }}
    >
      {children}
    </div>
  </div>
);

const LockIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#999"
    strokeWidth="2.5"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const AnimatedCursor: React.FC<{
  x: number;
  y: number;
  clicking: boolean;
  visible: boolean;
}> = ({ x, y, clicking, visible }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 100,
        transition: "transform 0.05s ease",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        style={{
          filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.25))",
          transform: clicking ? "scale(0.8)" : "scale(1)",
        }}
      >
        <path
          d="M6 3l16 10-7 2-4 7z"
          fill="white"
          stroke="#222"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {clicking && (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `2px solid ${UI.primary}`,
            background: "rgba(23, 50, 77, 0.08)",
            transform: "translate(-8px, -8px)",
          }}
        />
      )}
    </div>
  );
};

export const TextAnnotation: React.FC<{
  text: string;
  opacity: number;
  y?: number;
}> = ({ text, opacity, y = 952 }) => {
  if (!text || opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        opacity,
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: "#1a1a2e",
          textAlign: "center",
          letterSpacing: 0.3,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};

export const NavbarUI: React.FC<{ isApp?: boolean }> = ({
  isApp = false,
}) => (
  <div
    style={{
      height: 56,
      borderBottom: `1px solid ${UI.cardBorder}`,
      background: "rgba(250, 248, 245, 0.95)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <LogoSVG size={22} />
      <span style={{ fontSize: 16, fontWeight: 700, color: UI.text }}>
        Poster Armory
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <span
        style={{ fontSize: 13, fontWeight: 500, color: UI.textMuted }}
      >
        Pricing
      </span>
      {isApp && (
        <span
          style={{ fontSize: 13, fontWeight: 500, color: UI.textMuted }}
        >
          My Library
        </span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: `1px solid ${UI.cardBorder}`,
          borderRadius: 6,
          padding: "5px 10px",
          fontSize: 13,
          fontWeight: 500,
          color: UI.text,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: UI.mutedBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 600,
            color: UI.textMuted,
          }}
        >
          E
        </div>
        My Account
      </div>
    </div>
  </div>
);

export const CardUI: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style = {} }) => (
  <div
    style={{
      background: UI.card,
      borderRadius: 8,
      border: `1px solid ${UI.cardBorder}`,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const BtnUI: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  variant = "primary",
  size = "md",
  active = false,
  disabled = false,
  style = {},
}) => {
  const pad =
    size === "sm"
      ? "5px 10px"
      : size === "lg"
        ? "10px 22px"
        : "7px 14px";
  const fs = size === "sm" ? 13 : size === "lg" ? 15 : 14;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 8,
        fontWeight: 500,
        fontSize: fs,
        padding: pad,
        opacity: disabled ? 0.5 : 1,
        ...(variant === "primary"
          ? {
              background: active ? "#1a4060" : UI.primary,
              color: "#ffffff",
              border: "none",
            }
          : {
              background: "#ffffff",
              color: UI.text,
              border: `1px solid ${UI.cardBorder}`,
            }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const InputUI: React.FC<{
  value: string;
  placeholder?: string;
  focused?: boolean;
  style?: React.CSSProperties;
}> = ({ value, placeholder = "", focused = false, style = {} }) => (
  <div
    style={{
      height: 36,
      borderRadius: 6,
      border: focused
        ? `2px solid ${UI.primary}`
        : `1px solid ${UI.inputBorder}`,
      background: "#ffffff",
      padding: "0 10px",
      display: "flex",
      alignItems: "center",
      fontSize: 14,
      color: value ? UI.text : UI.textFaint,
      boxShadow: focused ? `0 0 0 2px ${UI.ring}` : "none",
      ...style,
    }}
  >
    {value || placeholder}
    {focused && (
      <BlinkingCaret />
    )}
  </div>
);

const BlinkingCaret: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = Math.floor(frame / 12) % 2 === 0;
  return (
    <div
      style={{
        width: 1.5,
        height: 16,
        background: visible ? UI.text : "transparent",
        marginLeft: 1,
      }}
    />
  );
};

export const MapPinIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = UI.textMuted }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const CheckIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = UI.primary }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const DownloadIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = UI.textMuted }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const EyeIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const LockSmallIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 12, color = UI.textMuted }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const ChevronRightIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const CheckCircleIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = "#22c55e" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const LoaderIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = UI.primary }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      style={{ transform: `rotate(${frame * 8}deg)` }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export const FileTextIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = UI.textMuted }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export const ImageIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color = UI.textMuted }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
