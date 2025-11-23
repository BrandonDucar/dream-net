/**
 * AUTO-SEO: Zero-touch SEO optimization for all content
 * Automatically optimizes ALL content without manual calls
 */
import type { SEOContentType, SEOPlatform } from "../types";
/**
 * Auto-optimize content based on context
 * This runs automatically - no manual calls needed
 */
export declare function autoOptimizeContent(contentType: SEOContentType, contentId: string, title: string, description: string, platform?: SEOPlatform, userLocation?: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}): {
    optimizedTitle: string;
    optimizedDescription: string;
    seoScore: number;
    keywords: string[];
    geofences: string[];
    metaTags: string[];
};
/**
 * Extract location from request headers/IP
 */
export declare function extractLocationFromRequest(req: any): {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
};
/**
 * Auto-optimize dream content
 */
export declare function autoOptimizeDream(dreamId: string, title: string, description: string, userLocation?: any): {
    optimizedTitle: string;
    optimizedDescription: string;
    seoScore: number;
    keywords: string[];
    geofences: string[];
    metaTags: string[];
};
/**
 * Auto-optimize social post
 */
export declare function autoOptimizeSocialPost(postId: string, platform: SEOPlatform, text: string, userLocation?: any): {
    optimizedTitle: string;
    optimizedDescription: string;
    seoScore: number;
    keywords: string[];
    geofences: string[];
    metaTags: string[];
};
/**
 * Auto-optimize product
 */
export declare function autoOptimizeProduct(productId: string, name: string, description: string, platform?: SEOPlatform, userLocation?: any): {
    optimizedTitle: string;
    optimizedDescription: string;
    seoScore: number;
    keywords: string[];
    geofences: string[];
    metaTags: string[];
};
