import { NextResponse } from "next/server";

const windows = new Map<string, number[]>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60_000;
const MAX_WINDOW = 300_000;

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - MAX_WINDOW;
  for (const [key, timestamps] of Array.from(windows)) {
    const valid = timestamps.filter((t: number) => t > cutoff);
    if (valid.length === 0) windows.delete(key);
    else windows.set(key, valid);
  }
}

/**
 * Returns a 429 NextResponse if the user has exceeded the limit,
 * or null if the request is allowed.
 */
export function applyRateLimit(
  userId: string,
  endpoint: string,
  opts?: { windowMs?: number; max?: number }
): NextResponse | null {
  cleanup();
  const windowMs = opts?.windowMs ?? 60_000;
  const max = opts?.max ?? 20;
  const key = `${endpoint}:${userId}`;
  const now = Date.now();
  const timestamps = windows.get(key) || [];
  const valid = timestamps.filter((t) => t > now - windowMs);

  if (valid.length >= max) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) },
      }
    );
  }

  valid.push(now);
  windows.set(key, valid);
  return null;
}
