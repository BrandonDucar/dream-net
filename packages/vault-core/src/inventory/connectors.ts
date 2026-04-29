import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

const CONNECTORS = [
  { id: "notion", label: "Notion", env: ["NOTION_API_KEY", "NOTION_TOKEN"] },
  { id: "slack", label: "Slack", env: ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN", "SLACK_WEBHOOK_URL"] },
  { id: "linear", label: "Linear", env: ["LINEAR_API_KEY"] },
  { id: "zapier", label: "Zapier", env: ["ZAPIER_WEBHOOK_URL", "ZAPIER_API_KEY"] },
  { id: "openai", label: "OpenAI", env: ["OPENAI_API_KEY"] },
  { id: "gmail", label: "Gmail", env: ["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN", "GMAIL_USER"] },
  { id: "neon", label: "Neon/Postgres", env: ["DATABASE_URL", "NEON_DATABASE_URL", "PGHOST"] },
  { id: "vercel", label: "Vercel", env: ["VERCEL_TOKEN", "VERCEL_TEAM_ID"] },
  { id: "google-cloud", label: "Google Cloud", env: ["GOOGLE_APPLICATION_CREDENTIALS", "GCP_PROJECT_ID", "GCP_ACCESS_TOKEN"] },
  { id: "neynar", label: "Neynar/Farcaster", env: ["NEYNAR_API_KEY", "FARCASTER_SIGNER_UUID"] },
  { id: "discord", label: "Discord", env: ["DISCORD_BOT_TOKEN", "DISCORD_WEBHOOK_URL"] },
  { id: "telegram", label: "Telegram", env: ["TELEGRAM_BOT_TOKEN", "SOVEREIGN_TELEGRAM_ID"] },
  { id: "tiktok", label: "TikTok", env: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"] },
  { id: "mailchimp", label: "Mailchimp", env: ["MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX"] },
  { id: "polymarket", label: "Polymarket", env: ["POLYMARKET_API_KEY"] },
  { id: "uniswap", label: "Uniswap", env: ["UNISWAP_API_KEY", "ALCHEMY_API_KEY"] },
];

export const connectorsJob = createJob(
  "connectors",
  "External connector auth-state inventory",
  "connector",
  "scanConnectors",
  ["connectors", "auth-state", "secret-metadata"],
);

export async function scanConnectors(_options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "connector",
    name: "DreamNet external connectors",
    system: "env",
    scope: "process.env",
    authState: "not_required",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: connectorsJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  for (const connector of CONNECTORS) {
    const present = connector.env.filter((name) => Boolean(process.env[name]));
    const missing = connector.env.filter((name) => !process.env[name]);
    const available = present.length > 0;

    const object = createObject({
      sourceId: source.id,
      kind: available ? "integration" : "secret_reference",
      externalId: connector.id,
      uri: `env://${connector.id}`,
      title: connector.label,
      contentHash: sha256Hex(JSON.stringify({ id: connector.id, present, missing })),
      tags: ["connector", connector.id, available ? "auth-present" : "auth-missing"],
      sensitivity: "secret_metadata",
      indexedAt: startedAt,
      metadata: {
        presentSecretNames: present,
        missingSecretNames: missing,
        authState: available ? "available" : "missing",
      },
    });
    result.objects.push(object);

    if (!available) {
      result.events.push(
        createEvent({
          type: "connector_auth_missing",
          severity: "warn",
          sourceId: source.id,
          objectId: object.id,
          message: `${connector.label} auth is not available in this runtime`,
          createdAt: startedAt,
          details: { connector: connector.id, acceptedSecretNames: connector.env },
        }),
      );
    }
  }

  result.finishedAt = new Date().toISOString();
  return result;
}
