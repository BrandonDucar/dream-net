#!/usr/bin/env node

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
];

const missing = required.filter((key) => !process.env[key] || process.env[key].length === 0);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}
