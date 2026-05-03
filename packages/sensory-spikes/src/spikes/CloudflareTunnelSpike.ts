import { randomUUID } from "node:crypto";

export interface TunnelStatus {
  id: string;
  name: string;
  status: "active" | "down" | "degraded";
  latencyMs: number;
  lastCheckedAt: string;
}

export class CloudflareTunnelSpike {
  private tunnels: Map<string, TunnelStatus> = new Map();

  constructor() {
    this.initializeTunnels();
  }

  private initializeTunnels() {
    // Default tunnels for input/output pipelines
    this.registerTunnel("ingress-nexus", "Nexus Ingress Tunnel");
    this.registerTunnel("egress-dreamnet", "DreamNet Egress Tunnel");
    this.registerTunnel("alpha-sync-tunnel", "Alpha Sync Pipeline Tunnel");
  }

  public registerTunnel(name: string, description: string) {
    const id = randomUUID();
    this.tunnels.set(id, {
      id,
      name,
      status: "active",
      latencyMs: Math.floor(Math.random() * 50) + 10,
      lastCheckedAt: new Date().toISOString()
    });
    console.log(`📡 [CloudflareTunnelSpike] Registered tunnel: ${name}`);
  }

  public getStatus(): TunnelStatus[] {
    return Array.from(this.tunnels.values());
  }

  public async run(): Promise<void> {
    // Simulate tunnel health checks
    for (const tunnel of this.tunnels.values()) {
      tunnel.latencyMs = Math.floor(Math.random() * 50) + 10;
      tunnel.lastCheckedAt = new Date().toISOString();
      // 1% chance of degradation for simulation
      if (Math.random() < 0.01) {
        tunnel.status = "degraded";
      } else {
        tunnel.status = "active";
      }
    }
  }
}

export const cloudflareTunnelSpike = new CloudflareTunnelSpike();
