import { createHash } from "crypto";
import type { PosterConfig } from "./types";

export function computeConfigHash(config: PosterConfig): string {
  const normalized = JSON.stringify(config, Object.keys(config).sort());
  return createHash("sha256").update(normalized).digest("hex");
}
