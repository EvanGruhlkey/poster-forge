"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, ChevronRight, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function PickLocationPage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [locationText, setLocationText] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [found, setFound] = useState(false);

  async function handleFindLocation() {
    if (!city && !locationText) {
      toast.error("Please enter a city name or location.");
      return;
    }
    setLoading(true);

    try {
      const query = locationText || `${city}, ${country}`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { "User-Agent": "PosterArmory/1.0" } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        setLat(parseFloat(result.lat).toFixed(4));
        setLon(parseFloat(result.lon).toFixed(4));

        if (!city && result.display_name) {
          const parts = result.display_name.split(",");
          setCity(parts[0]?.trim() || "");
          setCountry(parts[parts.length - 1]?.trim() || "");
        }

        setFound(true);
        toast.success(`Found: ${result.display_name}`);
      } else {
        toast.error("Location not found. Try a different search.");
      }
    } catch {
      toast.error("Failed to look up location. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (!city || !lat || !lon) {
      toast.error("Please find a location first.");
      return;
    }
    const params = new URLSearchParams({
      city,
      country,
      lat,
      lon,
    });
    const draftId = crypto.randomUUID();
    router.push(`/app/design/${draftId}?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Pick Your Location</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the city or address you want to map.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
          <CardDescription>
            Search by city name or paste coordinates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Paris"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="France"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Or search by address / place name</Label>
            <Input
              id="location"
              placeholder="e.g. Eiffel Tower, Paris"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </div>

          <Button
            onClick={handleFindLocation}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            Find Location
          </Button>

          {/* Advanced: manual lat/lon */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            />
            Advanced: Enter coordinates manually
          </button>

          {showAdvanced && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  placeholder="48.8566"
                  value={lat}
                  onChange={(e) => {
                    setLat(e.target.value);
                    if (e.target.value && lon) setFound(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lon">Longitude</Label>
                <Input
                  id="lon"
                  placeholder="2.3522"
                  value={lon}
                  onChange={(e) => {
                    setLon(e.target.value);
                    if (lat && e.target.value) setFound(true);
                  }}
                />
              </div>
            </div>
          )}

          {found && lat && lon && (
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <span className="font-medium">{city || "Location"}</span>
              {country && <span className="text-muted-foreground">, {country}</span>}
              <span className="ml-2 text-muted-foreground">
                ({lat}, {lon})
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleNext} disabled={!found} size="lg">
          Next: Customize Design
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
