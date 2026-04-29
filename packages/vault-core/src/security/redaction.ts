import type { VaultSensitivity } from "../types.js";

const SECRET_NAME_PATTERN =
  /\b[A-Z][A-Z0-9_]*(?:API_KEY|ACCESS_KEY|SECRET_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY|SIGNER_UUID|DATABASE_URL|WEBHOOK_URL|BEARER|CREDENTIALS)[A-Z0-9_]*\b/g;

const SECRET_ASSIGNMENT_PATTERN =
  /\b([A-Z][A-Z0-9_]*(?:API_KEY|ACCESS_KEY|SECRET_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY|SIGNER_UUID|DATABASE_URL|WEBHOOK_URL|BEARER|CREDENTIALS)[A-Z0-9_]*)\s*[:=]\s*(['"]?)[^\s"',}]+/gi;

const LONG_TOKEN_PATTERN =
  /\b(?:gho|ghp|sk|xoxb|xoxp|ya29|AIza|eyJ)[A-Za-z0-9._\-]{18,}\b/g;

const PRIVATE_KEY_BLOCK_PATTERN =
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g;

export interface RedactionResult {
  redactedText: string;
  secretNames: string[];
  sensitivity: VaultSensitivity;
  redactionCount: number;
}

export function redactSensitiveText(text: string): RedactionResult {
  const secretNames = findSecretNames(text);
  let redactionCount = 0;

  let redactedText = text.replace(PRIVATE_KEY_BLOCK_PATTERN, () => {
    redactionCount++;
    return "[REDACTED_PRIVATE_KEY_BLOCK]";
  });

  redactedText = redactedText.replace(SECRET_ASSIGNMENT_PATTERN, (_match, name: string, quote: string) => {
    redactionCount++;
    return `${name}=${quote}[REDACTED]`;
  });

  redactedText = redactedText.replace(LONG_TOKEN_PATTERN, () => {
    redactionCount++;
    return "[REDACTED_TOKEN]";
  });

  return {
    redactedText,
    secretNames,
    sensitivity: classifySensitivity(text, secretNames, redactionCount),
    redactionCount,
  };
}

export function findSecretNames(text: string): string[] {
  const names = new Set<string>();
  for (const match of text.matchAll(SECRET_NAME_PATTERN)) {
    names.add(match[0]);
  }
  return Array.from(names).sort();
}

export function classifySensitivity(
  text: string,
  secretNames = findSecretNames(text),
  redactionCount = 0,
): VaultSensitivity {
  const lower = text.toLowerCase();

  if (redactionCount > 0 || secretNames.length > 0 || lower.includes("private key")) {
    return "secret_metadata";
  }

  if (
    lower.includes("wallet") ||
    lower.includes("passport") ||
    lower.includes("sovereign") ||
    lower.includes("god vault") ||
    lower.includes("credential")
  ) {
    return "confidential";
  }

  if (
    lower.includes("internal") ||
    lower.includes("operator") ||
    lower.includes("deployment") ||
    lower.includes("infrastructure")
  ) {
    return "internal";
  }

  return "public";
}
