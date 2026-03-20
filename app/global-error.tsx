"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "1rem",
          textAlign: "center",
          backgroundColor: "#faf9f7",
          color: "#1e293b",
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#64748b" }}>
          A critical error occurred. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            padding: "0.5rem 1.5rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.375rem",
            cursor: "pointer",
            backgroundColor: "#fff",
            fontSize: "0.875rem",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
