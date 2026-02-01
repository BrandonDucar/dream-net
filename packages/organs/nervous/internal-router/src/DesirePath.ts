/**
 * Desire Path Router (Guerrilla Urbanism) 🏙️
 * Hijacked Wisdom: Urban Planning (Desire Lines)
 * 
 * Philosophy: Don't pave where you think they go; pave where they walk.
 * Mechanism: Tracks route frequency. High-traffic routes get "Paved" (Shortcuted/Cached).
 */

import { Request, Response, NextFunction } from 'express';

interface PathStats {
    hits: number;
    avgLatency: number;
    paved: boolean; // Is this a recognized shortcut?
}

const desireMap: Map<string, PathStats> = new Map();

export const desirePathMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const start = Date.now();

    // Log the step (Footprint)
    if (!desireMap.has(path)) {
        desireMap.set(path, { hits: 0, avgLatency: 0, paved: false });
    }

    const stats = desireMap.get(path)!;
    stats.hits++;

    // Check if this is a "Paved" path (Optimized)
    if (stats.paved) {
        res.setHeader('X-Route-Optimization', 'DESIRE_PATH_SHORTCUT');
    }

    // Self-Optimization Logic: If walked enough, pave it.
    if (!stats.paved && stats.hits > 100) {
        console.log(`[🏙️ Urbanism] Desire Path Detected: ${path}. Paving shortcut...`);
        stats.paved = true;
        // In a real system, this would register a more direct handler or aggressive cache
    }

    res.on('finish', () => {
        const duration = Date.now() - start;
        stats.avgLatency = (stats.avgLatency * (stats.hits - 1) + duration) / stats.hits;
    });

    next();
};

export const getDesireMap = () => Object.fromEntries(desireMap);
