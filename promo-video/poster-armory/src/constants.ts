export const COLORS = {
  bg: "#fafaf8",
  bgWarm: "#f5f0eb",
  bgCard: "#ffffff",
  bgAccent: "#f0ece6",

  text: "#1a1a2e",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",

  accent: "#4a7c8f",
  accentLight: "rgba(74, 124, 143, 0.12)",
  accentGlow: "rgba(74, 124, 143, 0.25)",

  terracotta: "#c67a4a",
  terracottaLight: "rgba(198, 122, 74, 0.15)",

  border: "#e2e0dc",
  shadow: "rgba(0, 0, 0, 0.08)",
};

const GH_RAW =
  "https://raw.githubusercontent.com/EvanGruhlkey/poster-forge/main/posters";

export const POSTER_IMAGES = {
  barcelona: `${GH_RAW}/barcelona_warm_beige_20260118_140048.png`,
  marrakech: `${GH_RAW}/marrakech_terracotta_20260118_143253.png`,
  venice: `${GH_RAW}/venice_blueprint_20260118_140505.png`,
  dubai: `${GH_RAW}/dubai_midnight_blue_20260118_140807.png`,
  tokyo: `${GH_RAW}/tokyo_japanese_ink_20260118_142446.png`,
  sanFrancisco: `${GH_RAW}/san_francisco_sunset_20260118_144726.png`,
  singapore: `${GH_RAW}/singapore_neon_cyberpunk_20260118_153328.png`,
  seattle: `${GH_RAW}/seattle_emerald_20260124_162244.png`,
};

export const THEMES = [
  { name: "Warm Beige", color: "#d4b896" },
  { name: "Terracotta", color: "#c67a4a" },
  { name: "Noir", color: "#1a1a1a" },
  { name: "Blueprint", color: "#2e5090" },
  { name: "Ocean", color: "#1a6b8a" },
  { name: "Midnight Blue", color: "#1a2744" },
  { name: "Forest", color: "#2d5a27" },
  { name: "Sunset", color: "#e8734a" },
  { name: "Autumn", color: "#c45d2e" },
  { name: "Emerald", color: "#2d6b4f" },
  { name: "Copper Patina", color: "#5a8a6a" },
  { name: "Japanese Ink", color: "#3a3a3a" },
  { name: "Pastel Dream", color: "#b8a0d4" },
  { name: "Mono Blue", color: "#4a6b8a" },
  { name: "Neon Cyberpunk", color: "#ff00ff" },
  { name: "Contrast Zones", color: "#2a2a4a" },
  { name: "Gradient Roads", color: "#6a4c93" },
];

export const CITY_POSTERS = [
  { city: "Barcelona", theme: "Warm Beige", image: POSTER_IMAGES.barcelona },
  { city: "Marrakech", theme: "Terracotta", image: POSTER_IMAGES.marrakech },
  { city: "Venice", theme: "Blueprint", image: POSTER_IMAGES.venice },
  { city: "Dubai", theme: "Midnight", image: POSTER_IMAGES.dubai },
  { city: "Tokyo", theme: "Japanese Ink", image: POSTER_IMAGES.tokyo },
  { city: "San Francisco", theme: "Sunset", image: POSTER_IMAGES.sanFrancisco },
  { city: "Singapore", theme: "Cyberpunk", image: POSTER_IMAGES.singapore },
  { city: "Seattle", theme: "Emerald", image: POSTER_IMAGES.seattle },
];
