/**
 * AUTO-SEO Middleware
 * Automatically applies SEO optimization and geofencing to ALL content
 * Zero-touch - works globally for all routes
 */

import { Request, Response, NextFunction } from "express";
import { autoOptimizeContent, extractLocationFromRequest } from "@dreamnet/ai-seo-core";
import { AISEOCore } from "@dreamnet/ai-seo-core";
import { NERVE_BUS } from "@dreamnet/nerve/bus";
import { createAiSeoEvent } from "@dreamnet/nerve/factory";

/**
 * Middleware that auto-optimizes content before it's saved
 * Detects content creation endpoints and applies SEO automatically
 */
export function autoSEOMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only apply to POST/PUT requests (content creation/updates)
  if (req.method !== "POST" && req.method !== "PUT") {
    return next();
  }

  // Detect content type from route
  const path = req.path.toLowerCase();
  let contentType: "post" | "product" | "page" = "post";
  let platform: "web" | "twitter" | "farcaster" | "instagram" | "tiktok" | "youtube" | "linkedin" = "web";

  if (path.includes("/dream") || path.includes("/post")) {
    contentType = "post";
  } else if (path.includes("/product") || path.includes("/shop")) {
    contentType = "product";
  } else if (path.includes("/page")) {
    contentType = "page";
  }

  // Detect platform from headers or path
  if (path.includes("/twitter") || req.headers["x-platform"] === "twitter") {
    platform = "twitter";
  } else if (path.includes("/farcaster") || req.headers["x-platform"] === "farcaster") {
    platform = "farcaster";
  } else if (path.includes("/instagram") || req.headers["x-platform"] === "instagram") {
    platform = "instagram";
  } else if (path.includes("/tiktok") || req.headers["x-platform"] === "tiktok") {
    platform = "tiktok";
  } else if (path.includes("/youtube") || req.headers["x-platform"] === "youtube") {
    platform = "youtube";
  } else if (path.includes("/linkedin") || req.headers["x-platform"] === "linkedin") {
    platform = "linkedin";
  }

  // Extract user location
  const userLocation = extractLocationFromRequest(req);

  // Intercept response to auto-optimize content
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    // Auto-optimize if content was created/updated
    if (body && (body.dream || body.post || body.product || body.content)) {
      const content = body.dream || body.post || body.product || body.content;
      
      if (content && (content.title || content.name || content.text)) {
        const title = content.title || content.name || content.text || "";
        const description = content.description || content.text || "";
        const contentId = content.id || `content:${Date.now()}`;

        try {
          // Auto-optimize
          const optimized = autoOptimizeContent(
            contentType,
            contentId,
            title,
            description,
            platform,
            userLocation
          );

          // Attach SEO data to response
          if (!body.seo) {
            body.seo = {};
          }
          body.seo.optimized = {
            title: optimized.optimizedTitle,
            description: optimized.optimizedDescription,
            score: optimized.seoScore,
            keywords: optimized.keywords,
            geofences: optimized.geofences,
            metaTags: optimized.metaTags,
          };

          // Update content with optimized values (if not already set)
          if (content.title && !content.seoOptimizedTitle) {
            content.seoOptimizedTitle = optimized.optimizedTitle;
          }
          if (content.description && !content.seoOptimizedDescription) {
            content.seoOptimizedDescription = optimized.optimizedDescription;
          }
          if (!content.seoKeywords) {
            content.seoKeywords = optimized.keywords;
          }
          if (!content.geofences) {
            content.geofences = optimized.geofences;
          }

          console.log(`[AutoSEO] ✅ Auto-optimized ${contentType} ${contentId} (Score: ${optimized.seoScore}/100)`);
        } catch (error) {
          console.warn(`[AutoSEO] ⚠️  Auto-optimization failed:`, error);
          // Don't fail the request if SEO fails
        }
      }
    }

    return originalJson(body);
  };

  next();
}

/**
 * Express middleware that auto-optimizes request body before processing
 */
export function autoSEORequestMiddleware(req: Request, res: Response, next: NextFunction) {
  // Apply to ALL POST/PUT requests - auto-detect content
  // This ensures SEO applies to EVERYTHING automatically
  
  if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") {
    return next();
  }

  // Auto-detect if this is content creation by checking for common fields
  const hasContentFields = 
    req.body &&
    (
      req.body.title ||
      req.body.name ||
      req.body.dreamName ||
      req.body.text ||
      req.body.description ||
      req.body.content ||
      req.body.dreamContent ||
      req.body.post ||
      req.body.product
    );

  if (!hasContentFields) {
    return next();
  }

  // Extract location
  const userLocation = extractLocationFromRequest(req);

  // Auto-optimize request body
  if (req.body) {
    const title = req.body.title || req.body.name || req.body.dreamName || "";
    const description = req.body.description || req.body.text || "";
    
    if (title || description) {
      try {
        // Determine content type
        let contentType: "post" | "product" | "page" = "post";
        if (req.path.includes("/product")) contentType = "product";
        if (req.path.includes("/page")) contentType = "page";

        // Determine platform
        let platform: "web" | "twitter" | "farcaster" | "instagram" | "tiktok" | "youtube" | "linkedin" = "web";
        if (req.headers["x-platform"]) {
          platform = req.headers["x-platform"] as any;
        }

        const contentId = req.body.id || `content:${Date.now()}`;
        
        // Auto-optimize
        const optimized = autoOptimizeContent(
          contentType,
          contentId,
          title,
          description,
          platform,
          userLocation
        );

        // Attach optimized data to request body
        req.body.seoOptimized = {
          title: optimized.optimizedTitle,
          description: optimized.optimizedDescription,
          score: optimized.seoScore,
          keywords: optimized.keywords,
          geofences: optimized.geofences,
          metaTags: optimized.metaTags,
        };

        // Optionally replace title/description with optimized versions
        // (Can be made configurable)
        if (process.env.AUTO_SEO_REPLACE === "true") {
          req.body.title = optimized.optimizedTitle;
          req.body.description = optimized.optimizedDescription;
        }

        // Add SEO metadata
        req.body.seoKeywords = optimized.keywords;
        req.body.geofences = optimized.geofences;
        req.body.seoScore = optimized.seoScore;

        console.log(`[AutoSEO] 🔍 Auto-optimized request for ${contentType} (Score: ${optimized.seoScore}/100)`);
        
        // Publish Nerve Event for SEO application
        try {
          const traceId = (req as any).traceId;
          const callerIdentity = (req as any).callerIdentity;
          const nerveEvent = createAiSeoEvent({
            traceId,
            routeId: req.path,
            seoScore: optimized.seoScore,
            keywords: optimized.keywords,
            geofencesApplied: optimized.geofences,
            geo: userLocation,
            tierId: callerIdentity?.tierId,
            defaultSampleRate: 0.2,
          });
          NERVE_BUS.publish(nerveEvent);
        } catch (error) {
          // Don't break request pipeline if Nerve event fails
          console.error(`[AutoSEO] Failed to publish Nerve event:`, error);
        }
      } catch (error) {
        console.warn(`[AutoSEO] ⚠️  Request optimization failed:`, error);
        // Continue even if optimization fails
      }
    }
  }

  next();
}

