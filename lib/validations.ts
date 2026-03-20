import { z } from "zod";

export const locationSchema = z.object({
  city: z.string().min(1, "City is required").max(200),
  country: z.string().min(1, "Country is required").max(200),
  location_text: z.string().max(500).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
});

export const posterConfigSchema = z.object({
  style_id: z.enum([
    "warm_beige", "terracotta", "noir", "blueprint", "midnight_blue",
    "ocean", "forest", "sunset", "autumn", "emerald",
    "copper_patina", "japanese_ink", "pastel_dream", "monochrome_blue",
    "neon_cyberpunk", "contrast_zones", "gradient_roads",
  ]),
  city: z.string().min(1).max(200),
  country: z.string().max(200).default(""),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  distance: z.number().min(1000).max(50000),
  width: z.number().min(3).max(20),
  height: z.number().min(3).max(20),
  orientation: z.enum(["portrait", "landscape", "square"]),
  show_labels: z.boolean(),
  show_water: z.boolean(),
  show_parks: z.boolean(),
  major_roads_only: z.boolean(),
  show_border: z.boolean(),
  title: z.string().max(200),
  subtitle: z.string().max(200),
  date_line: z.string().max(100),
  format: z.enum(["png", "pdf", "svg"]),
});

export const createJobSchema = z.object({
  config: posterConfigSchema,
  is_preview: z.boolean().default(false),
});

export type LocationInput = z.infer<typeof locationSchema>;
export type PosterConfigInput = z.infer<typeof posterConfigSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
