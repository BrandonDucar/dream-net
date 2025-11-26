import { useState, useEffect } from "react";
import type { RegionContent } from "../../../packages/dreamnet-geofence-core/index";

export function useGeofence() {
  const [content, setContent] = useState<RegionContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<string>("global");

  useEffect(() => {
    fetch("/api/geofence/content")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch geofence content: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setContent(data.content);
        setRegion(data.detectedRegion);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return {
    content,
    region,
    loading,
    error,
  };
}

