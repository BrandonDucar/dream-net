/**
 * Valhalla Routing Integration
 * 
 * Integrates Valhalla advanced routing engine for DreamNet Travel vertical
 */

import axios, { AxiosInstance } from "axios";

export interface ValhallaConfig {
  apiUrl: string;
}

export interface RouteRequest {
  locations: Array<{ lat: number; lon: number }>;
  costing: "auto" | "pedestrian" | "bicycle" | "bus" | "taxi";
  directionsOptions?: {
    units?: "kilometers" | "miles";
    language?: string;
  };
}

export interface Route {
  shape: string; // Encoded polyline
  distance: number; // meters
  time: number; // seconds
  legs: Array<{
    distance: number;
    time: number;
    maneuvers: Array<{
      type: number;
      instruction: string;
      distance: number;
      time: number;
    }>;
  }>;
}

/**
 * Valhalla Router
 * 
 * Wraps Valhalla routing engine for advanced routing
 */
export class ValhallaRouter {
  private client: AxiosInstance;
  private config: ValhallaConfig;

  constructor(config: ValhallaConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
    });
  }

  /**
   * Get route
   */
  async getRoute(request: RouteRequest): Promise<Route | null> {
    try {
      const response = await this.client.post("/route", {
        locations: request.locations.map(loc => ({
          lat: loc.lat,
          lon: loc.lon,
        })),
        costing: request.costing,
        directions_options: request.directionsOptions,
      });

      const trip = response.data.trip;
      return {
        shape: trip.shape,
        distance: trip.summary.length,
        time: trip.summary.time,
        legs: trip.legs.map((leg: any) => ({
          distance: leg.length,
          time: leg.time,
          maneuvers: leg.maneuvers.map((m: any) => ({
            type: m.type,
            instruction: m.instruction,
            distance: m.length,
            time: m.time,
          })),
        })),
      };
    } catch (error: any) {
      console.error("[ValhallaRouter] Failed to get route:", error.message);
      return null;
    }
  }

  /**
   * Get optimized route (TSP)
   */
  async getOptimizedRoute(
    locations: Array<{ lat: number; lon: number }>,
    costing: RouteRequest["costing"] = "auto"
  ): Promise<Route | null> {
    try {
      const response = await this.client.post("/optimized_route", {
        locations: locations.map(loc => ({ lat: loc.lat, lon: loc.lon })),
        costing,
      });

      const trip = response.data.trip;
      return {
        shape: trip.shape,
        distance: trip.summary.length,
        time: trip.summary.time,
        legs: trip.legs.map((leg: any) => ({
          distance: leg.length,
          time: leg.time,
          maneuvers: leg.maneuvers.map((m: any) => ({
            type: m.type,
            instruction: m.instruction,
            distance: m.length,
            time: m.time,
          })),
        })),
        })),
      };
    } catch (error: any) {
      console.error("[ValhallaRouter] Failed to get optimized route:", error.message);
      return null;
    }
  }
}

