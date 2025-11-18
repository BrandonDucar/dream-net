import "dotenv/config";

const required = ["DATABASE_URL"];
const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.log("Missing env:", missing);
  process.exitCode = 1;
} else {
  console.log("All required env vars present.");
}


