"use client";

import { useEffect, useRef, useState } from "react";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermark?: boolean;
}

export function ProtectedImage({
  src,
  alt,
  className,
  watermark = true,
}: ProtectedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        setBlurred(true);
      } else {
        setTimeout(() => setBlurred(false), 300);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) ||
        (e.ctrlKey && e.key === "PrintScreen")
      ) {
        setBlurred(true);
        setTimeout(() => setBlurred(false), 1500);
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="protected-image-container relative select-none"
      style={{ lineHeight: 0 }}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          pointerEvents: "none",
          filter: blurred ? "blur(30px)" : "none",
          transition: "filter 0.15s ease-out",
        }}
      />

      {watermark && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
          style={{ pointerEvents: "none" }}
        >
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-12 -rotate-[30deg] scale-150 opacity-[0.06]">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-sm font-bold tracking-widest text-foreground"
              >
                POSTER ARMORY
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 z-20"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
