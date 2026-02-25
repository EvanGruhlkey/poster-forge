"use client";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProtectedImage({ src, alt, className }: ProtectedImageProps) {
  return (
    <div className="relative select-none" style={{ lineHeight: 0 }}>
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ pointerEvents: "none" }}
      />
      {/* Transparent overlay to block direct interaction with the image */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
