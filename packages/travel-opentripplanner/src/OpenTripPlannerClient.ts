/**
 * OpenTripPlanner Integration
 * 
 * Integrates OpenTripPlanner multi-modal trip planning for DreamNet Travel vertical
 */

import axios, { AxiosInstance } from "axios";

export interface OpenTripPlannerConfig {
  apiUrl: string;
  routerId?: string;
}

export interface TripPlanRequest {
  from: {
    lat: number;
    lon: number;
    name?: string;
  };
  to: {
    lat: number;
    lon: number;
    name?: string;
  };
  date?: string;
  time?: string;
  arriveBy?: boolean;
  modes?: string[];
  maxWalkDistance?: number;
}

export interface TripPlan {
  plan: {
    from: {
      name: string;
      lat: number;
      lon: number;
    };
    to: {
      name: string;
      lat: number;
      lon: number;
    };
    itineraries: Itinerary[];
  };
}

export interface Itinerary {
  duration: number;
  startTime: number;
  endTime: number;
  walkTime: number;
  transitTime: number;
  waitingTime: number;
  walkDistance: number;
  legs: Leg[];
}

export interface Leg {
  mode: "WALK" | "TRANSIT" | "BICYCLE" | "CAR" | "BUS" | "RAIL" | "SUBWAY" | "TRAM";
  from: {
    name: string;
    lat: number;
    lon: number;
    departureTime?: number;
  };
  to: {
    name: string;
    lat: number;
    lon: number;
    arrivalTime?: number;
  };
  distance?: number;
  duration?: number;
  route?: {
    shortName?: string;
    longName?: string;
  };
  trip?: {
    tripHeadsign?: string;
  };
}

/**
 * OpenTripPlanner Client
 * 
 * Wraps OpenTripPlanner API for multi-modal trip planning
 */
export class OpenTripPlannerClient {
  private client: AxiosInstance;
  private config: OpenTripPlannerConfig;

  constructor(config: OpenTripPlannerConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
    });
  }

  /**
   * Plan a trip
   */
  async planTrip(request: TripPlanRequest): Promise<TripPlan | null> {
    try {
      const params: any = {
        fromPlace: `${request.from.lat},${request.from.lon}`,
        toPlace: `${request.to.lat},${request.to.lon}`,
        mode: request.modes?.join(",") || "TRANSIT,WALK",
        maxWalkDistance: request.maxWalkDistance || 800,
      };

      if (request.date) params.date = request.date;
      if (request.time) params.time = request.time;
      if (request.arriveBy !== undefined) params.arriveBy = request.arriveBy;

      const routerId = this.config.routerId || "default";
      const response = await this.client.get(`/otp/routers/${routerId}/plan`, {
        params,
      });

      return response.data;
    } catch (error: any) {
      console.error("[OpenTripPlannerClient] Failed to plan trip:", error.message);
      return null;
    }
  }

  /**
   * Get routing information
   */
  async getRoute(
    from: { lat: number; lon: number },
    to: { lat: number; lon: number },
    mode: string = "TRANSIT,WALK"
  ): Promise<Itinerary[] | null> {
    const plan = await this.planTrip({ from, to, modes: [mode] });
    return plan?.plan.itineraries || null;
  }

  /**
   * Get nearby stops/stations
   */
  async getNearbyStops(
    lat: number,
    lon: number,
    radius: number = 500
  ): Promise<any[]> {
    try {
      const routerId = this.config.routerId || "default";
      const response = await this.client.get(`/otp/routers/${routerId}/index/stops`, {
        params: {
          lat,
          lon,
          radius,
        },
      });

      return response.data || [];
    } catch (error: any) {
      console.error("[OpenTripPlannerClient] Failed to get nearby stops:", error.message);
      return [];
    }
  }

  /**
   * Get route information
   */
  async getRouteInfo(routeId: string): Promise<any | null> {
    try {
      const routerId = this.config.routerId || "default";
      const response = await this.client.get(`/otp/routers/${routerId}/index/routes/${routeId}`);

      return response.data || null;
    } catch (error: any) {
      console.error("[OpenTripPlannerClient] Failed to get route info:", error.message);
      return null;
    }
  }
}

