"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Download, Eye, MapPin } from "lucide-react";
import { toast } from "sonner";
import { STYLE_PRESETS, type PosterConfig, DEFAULT_CONFIG } from "@/lib/types";
import { ProtectedImage } from "@/components/protected-image";

export default function CustomizePosterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const city = searchParams.get("city") || "";
  const country = searchParams.get("country") || "";
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const [config, setConfig] = useState<PosterConfig>({
    ...DEFAULT_CONFIG,
    city,
    country,
    lat,
    lon,
    title: city,
    subtitle: "",
    date_line: "",
    style_id: "classic",
    distance: 10000,
    show_labels: true,
    show_water: true,
    show_parks: true,
  });

  const [previewLoading, setPreviewLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateConfig = useCallback(
    (updates: Partial<PosterConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  async function handleGeneratePreview() {
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, is_preview: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create preview job");
      }

      const { jobId } = await res.json();
      toast.success("Preview generation started!");

      // Poll for completion
      const poll = setInterval(async () => {
        const status = await fetch(`/api/jobs/${jobId}`).then((r) => r.json());
        if (status.status === "done") {
          clearInterval(poll);
          setPreviewUrl(status.downloadUrls?.preview || null);
          setPreviewLoading(false);
        } else if (status.status === "failed") {
          clearInterval(poll);
          toast.error(status.error || "Preview generation failed");
          setPreviewLoading(false);
        }
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
      setPreviewLoading(false);
    }
  }

  async function handleDownloadPoster() {
    setGenerateLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, is_preview: false }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 403) {
          toast.error(err.error || "You need an active plan to generate posters.", {
            action: {
              label: "Choose Plan",
              onClick: () => router.push("/app/billing"),
            },
            duration: 8000,
          });
          setGenerateLoading(false);
          return;
        }
        throw new Error(err.error || "Failed to create job");
      }

      const { jobId } = await res.json();
      toast.success("Poster generation started! Redirecting to download page...");
      router.push(`/download/${jobId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
      setGenerateLoading(false);
    }
  }

  const currentStyle = STYLE_PRESETS[config.style_id] || STYLE_PRESETS.classic;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Customize Your Poster</h1>
        <p className="mt-2 text-muted-foreground">
          Personalize your map design.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Controls */}
        <div className="space-y-6">
          {/* Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {Object.entries(STYLE_PRESETS).map(([id, preset]) => (
                  <button
                    key={id}
                    onClick={() => updateConfig({ style_id: id })}
                    className={`rounded-lg border-2 p-3 text-center transition-all ${
                      config.style_id === id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/20"
                    }`}
                  >
                    <div
                      className="mx-auto mb-2 h-8 w-8 rounded"
                      style={{ backgroundColor: preset.bgColor }}
                    />
                    <span className="text-xs font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Map Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Radius: {(config.distance / 1000).toFixed(0)} km</Label>
                <Slider
                  value={[config.distance]}
                  onValueChange={([v]) => updateConfig({ distance: v })}
                  min={2000}
                  max={30000}
                  step={1000}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  {
                    key: "show_labels" as const,
                    label: "Labels",
                  },
                  {
                    key: "show_water" as const,
                    label: "Water",
                  },
                  {
                    key: "show_parks" as const,
                    label: "Parks",
                  },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <Label>{label}</Label>
                    <Switch
                      checked={config[key]}
                      onCheckedChange={(v) => updateConfig({ [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Text Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Paris"
                  value={config.title}
                  onChange={(e) => updateConfig({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="Where We Met"
                  value={config.subtitle}
                  onChange={(e) => updateConfig({ subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  placeholder="August 2022"
                  value={config.date_line}
                  onChange={(e) => updateConfig({ date_line: e.target.value })}
                />
              </div>

              <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
                {lat >= 0 ? lat.toFixed(4) : Math.abs(lat).toFixed(4)}&deg;{" "}
                {lat >= 0 ? "N" : "S"},{" "}
                {Math.abs(lon).toFixed(4)}&deg;{" "}
                {lon >= 0 ? "E" : "W"}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGeneratePreview}
              disabled={previewLoading}
              className="flex-1"
            >
              {previewLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              Generate Preview
            </Button>
            <Button
              onClick={handleDownloadPoster}
              disabled={generateLoading}
              className="flex-1"
            >
              {generateLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Poster
            </Button>
          </div>
        </div>

        {/* Preview panel */}
        <div className="lg:sticky lg:top-24">
          <Card className="overflow-hidden">
            <div
              className="aspect-[3/4] flex items-center justify-center"
              style={{ backgroundColor: currentStyle.bgColor }}
            >
              {previewUrl ? (
                <ProtectedImage
                  src={previewUrl}
                  alt="Poster preview"
                  className="h-full w-full object-contain"
                />
              ) : previewLoading ? (
                <div className="text-center">
                  <Loader2
                    className="mx-auto h-10 w-10 animate-spin"
                    style={{ color: currentStyle.textColor }}
                  />
                  <p
                    className="mt-2 text-sm"
                    style={{ color: currentStyle.textColor }}
                  >
                    Generating preview...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center p-8 w-full h-full">
                  <div
                    className="flex-1 w-full rounded flex items-center justify-center"
                    style={{
                      backgroundColor: `${currentStyle.textColor}10`,
                    }}
                  >
                    <MapPin
                      className="h-16 w-16"
                      style={{ color: `${currentStyle.textColor}30` }}
                    />
                  </div>
                  <div className="mt-4 text-center space-y-1">
                    <div
                      className="h-px w-12 mx-auto"
                      style={{
                        backgroundColor: `${currentStyle.textColor}40`,
                      }}
                    />
                    <p
                      className="text-base font-bold tracking-[0.15em]"
                      style={{ color: currentStyle.textColor }}
                    >
                      {config.title
                        ? config.title.toUpperCase().split("").join(" ")
                        : "YOUR CITY"}
                    </p>
                    {config.subtitle && (
                      <p
                        className="text-xs"
                        style={{ color: currentStyle.textColor }}
                      >
                        {config.subtitle}
                      </p>
                    )}
                    <p
                      className="text-[10px] opacity-60"
                      style={{ color: currentStyle.textColor }}
                    >
                      {lat.toFixed(4)}&deg; {lat >= 0 ? "N" : "S"},{" "}
                      {Math.abs(lon).toFixed(4)}&deg; {lon >= 0 ? "E" : "W"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
