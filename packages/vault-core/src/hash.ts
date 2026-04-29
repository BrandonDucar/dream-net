import { createHash } from "node:crypto";

export function sha256Hex(input: string | Uint8Array): string {
  return createHash("sha256").update(input).digest("hex");
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

export function createVaultId(prefix: string, ...parts: Array<string | number | undefined | null>): string {
  const body = parts.filter((part) => part !== undefined && part !== null).join("|");
  return `${prefix}_${sha256Hex(body).slice(0, 24)}`;
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return Object.keys(object)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortValue(object[key]);
        return acc;
      }, {});
  }

  return value;
}
