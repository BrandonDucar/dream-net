/**
 * AUTO-SEO: Zero-touch SEO optimization for all content
 * Automatically optimizes ALL content without manual calls
 */

import { AISEOCore } from "../index";
import type { SEOContentType, SEOPlatform } from "../types";

/**
 * Auto-optimize content based on context
 * This runs automatically - no manual calls needed
 */
export function autoOptimizeContent(
  contentType: SEOContentType,
  contentId: string,
  title: string,
  description: string,
  platform: SEOPlatform = "web",
  userLocation?: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  }
): {
  optimizedTitle: string;
  optimizedDescription: string;
  seoScore: number;
  keywords: string[];
  geofences: string[];
  metaTags: string[];
} {
  // 1. Auto-optimize with SEO
  const seoOptimization = AISEOCore.optimizeContent(
    contentType,
    contentId,
    platform,
    title,
    description
  );

  // 2. Auto-apply geofencing if location provided
  let geofences: string[] = [];
  if (userLocation) {
    const matchingGeofences = AISEOCore.checkGeofence(userLocation);
    geofences = matchingGeofences.map((g) => g.id);

    // Apply geofence rules
    if (geofences.length > 0) {
      const rules = AISEOCore.applyGeofenceRules(geofences, contentType, platform);
      
      // Apply customizations from rules
      for (const rule of rules) {
        if (rule.action === "customize" && rule.customizations) {
          // Could customize title/description based on location
          // For now, just track that geofence matched
        }
      }
    }
  }

  return {
    optimizedTitle: seoOptimization.title,
    optimizedDescription: seoOptimization.description,
    seoScore: seoOptimization.score,
    keywords: seoOptimization.keywords.map((k) => k.keyword),
    geofences,
    metaTags: seoOptimization.metaTags,
  };
}

/**
 * Extract location from request headers/IP
 */
export function extractLocationFromRequest(req: any): {
  country?: string;
  region?: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
} {
  const location: any = {};

  // Check for explicit location headers
  if (req.headers["x-user-country"]) {
    location.country = req.headers["x-user-country"];
  }
  if (req.headers["x-user-region"]) {
    location.region = req.headers["x-user-region"];
  }
  if (req.headers["x-user-city"]) {
    location.city = req.headers["x-user-city"];
  }

  // Check for IP-based location (if available)
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
  if (ip) {
    // In production, would use IP geolocation service
    // For now, return empty (can be enhanced)
  }

  return location;
}

/**
 * Auto-optimize dream content
 */
export function autoOptimizeDream(
  dreamId: string,
  title: string,
  description: string,
  userLocation?: any
) {
  return autoOptimizeContent("post", dreamId, title, description, "web", userLocation);
}

/**
 * Auto-optimize social post
 */
export function autoOptimizeSocialPost(
  postId: string,
  platform: SEOPlatform,
  text: string,
  userLocation?: any
) {
  return autoOptimizeContent("post", postId, platform, text, text, userLocation);
}

/**
 * Auto-optimize product
 */
export function autoOptimizeProduct(
  productId: string,
  name: string,
  description: string,
  platform: SEOPlatform = "web",
  userLocation?: any
) {
  return autoOptimizeContent("product", productId, platform, name, description, userLocation);
}

