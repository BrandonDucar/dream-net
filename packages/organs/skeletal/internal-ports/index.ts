/**
 * @dreamnet/internal-ports — Internal Port Registry
 * 
 * Maps internal service names to ports and protocols.
 */

export const PORTS = {
  CLAWEDETTE_API: 7777,
  SOVEREIGN_BRIDGE: 7778,
  SPIKE_RUNNER: 7779,
  TOOL_GYM: 7780,
  MOLTBOT_GATEWAY: 3000,
  REDIS: 6379,
  POSTGRES: 5432,
  REDPANDA: 9092,
  QDRANT: 6333,
} as const;

export type PortName = keyof typeof PORTS;

export function getPort(name: PortName): number { return PORTS[name]; }
export function getUrl(name: PortName, host = 'localhost'): string {
  const port = PORTS[name];
  return `http://${host}:${port}`;
}

export function listPorts(): { name: string; port: number }[] {
  return Object.entries(PORTS).map(([name, port]) => ({ name, port }));
}

export default { PORTS, getPort, getUrl, listPorts };
