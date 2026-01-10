import crypto from "crypto";
import type { Request } from "express";
import { StarbridgeTopic } from "./types";

const DEFAULT_ALLOWED_UNSIGNED_TOPICS = new Set<StarbridgeTopic>([StarbridgeTopic.System]);

function constantTimeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getHmacSecret() {
  return process.env.STARBRIDGE_HMAC_SECRET || process.env.HMAC_SECRET || "";
}

export function verifyIngress(req: Request): boolean {
  const secret = getHmacSecret();
  const body = req.body ?? {};
  const topic = (body.topic ?? "") as StarbridgeTopic;

  if (!secret) {
    console.warn("[StarBridge] HMAC secret is not configured. Allowing ingress but this is unsafe for production.");
    return true;
  }

  if (DEFAULT_ALLOWED_UNSIGNED_TOPICS.has(topic)) {
    return true;
  }

  const signature = req.headers["x-dream-sig"];
  if (!signature || typeof signature !== "string") {
    return false;
  }

  const payload = JSON.stringify(body);
  const computed = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return constantTimeCompare(signature, computed);
}
