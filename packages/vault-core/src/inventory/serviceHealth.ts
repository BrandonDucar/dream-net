import http from "node:http";
import net from "node:net";
import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

const TCP_CHECKS = [
  { id: "redis", host: "127.0.0.1", port: 6379, label: "Redis nerve" },
  { id: "nats", host: "127.0.0.1", port: 4222, label: "NATS event bus" },
  { id: "kafka", host: "127.0.0.1", port: 9092, label: "Kafka message bus" },
  { id: "zookeeper", host: "127.0.0.1", port: 2181, label: "Zookeeper" },
  { id: "portainer", host: "127.0.0.1", port: 9000, label: "Portainer" },
];

const HTTP_CHECKS = [
  { id: "nats-monitor", url: "http://127.0.0.1:8222/varz", label: "NATS monitor" },
];

export const serviceHealthJob = createJob("health", "NUC heartbeat health checks", "nuc", "scanServiceHealth", [
  "heartbeat",
  "redis",
  "nats",
  "kafka",
]);

export async function scanServiceHealth(_options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "nuc",
    name: "NUC heartbeat checks",
    system: "local-network",
    scope: "127.0.0.1",
    authState: "not_required",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: serviceHealthJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  for (const check of TCP_CHECKS) {
    const health = await checkTcp(check.host, check.port, 1_500);
    const object = createObject({
      sourceId: source.id,
      kind: "health_check",
      externalId: check.id,
      uri: `tcp://${check.host}:${check.port}`,
      title: check.label,
      contentHash: sha256Hex(JSON.stringify(health)),
      tags: ["health", "tcp", health.ok ? "reachable" : "unreachable"],
      sensitivity: "internal",
      indexedAt: startedAt,
      metadata: health,
    });
    result.objects.push(object);

    if (!health.ok) {
      result.events.push(
        createEvent({
          type: "heartbeat_tcp_unreachable",
          severity: "warn",
          sourceId: source.id,
          objectId: object.id,
          message: `${check.label} is unreachable on ${check.host}:${check.port}`,
          createdAt: startedAt,
          details: health,
        }),
      );
    }
  }

  for (const check of HTTP_CHECKS) {
    const health = await checkHttp(check.url, 2_000);
    const object = createObject({
      sourceId: source.id,
      kind: "health_check",
      externalId: check.id,
      uri: check.url,
      title: check.label,
      contentHash: sha256Hex(JSON.stringify(health)),
      tags: ["health", "http", health.ok ? "reachable" : "unreachable"],
      sensitivity: "internal",
      indexedAt: startedAt,
      metadata: health,
    });
    result.objects.push(object);

    if (!health.ok) {
      result.events.push(
        createEvent({
          type: "heartbeat_http_unreachable",
          severity: "warn",
          sourceId: source.id,
          objectId: object.id,
          message: `${check.label} is unreachable`,
          createdAt: startedAt,
          details: health,
        }),
      );
    }
  }

  result.finishedAt = new Date().toISOString();
  return result;
}

function checkTcp(host: string, port: number, timeoutMs: number): Promise<Record<string, unknown> & { ok: boolean }> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const started = Date.now();
    const done = (ok: boolean, error?: string) => {
      socket.destroy();
      resolve({ ok, host, port, latencyMs: Date.now() - started, error });
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false, "timeout"));
    socket.once("error", (error) => done(false, error.message));
  });
}

function checkHttp(url: string, timeoutMs: number): Promise<Record<string, unknown> & { ok: boolean }> {
  return new Promise((resolve) => {
    const started = Date.now();
    const request = http.get(url, { timeout: timeoutMs }, (response) => {
      response.resume();
      response.once("end", () => {
        resolve({
          ok: Boolean(response.statusCode && response.statusCode >= 200 && response.statusCode < 500),
          url,
          statusCode: response.statusCode,
          latencyMs: Date.now() - started,
        });
      });
    });
    request.once("timeout", () => {
      request.destroy();
      resolve({ ok: false, url, latencyMs: Date.now() - started, error: "timeout" });
    });
    request.once("error", (error) => {
      resolve({ ok: false, url, latencyMs: Date.now() - started, error: error.message });
    });
  });
}
