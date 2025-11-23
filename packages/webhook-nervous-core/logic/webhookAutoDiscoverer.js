/**
 * Webhook Auto-Discoverer
 * ZERO-TOUCH: Automatically discovers and registers webhooks
 * Like API keys - no manual setup needed
 */
import { createNeuron } from "./nervousSystem";
import { createAntibody } from "./immuneSystem";
/**
 * Auto-discover webhooks from environment variables
 */
export function autoDiscoverWebhooksFromEnv() {
    const discovered = [];
    // Common webhook URL patterns
    const webhookPatterns = [
        /WEBHOOK.*URL/i,
        /.*WEBHOOK.*/i,
        /DISCORD.*WEBHOOK/i,
        /SLACK.*WEBHOOK/i,
        /TELEGRAM.*WEBHOOK/i,
        /GITHUB.*WEBHOOK/i,
        /STRIPE.*WEBHOOK/i,
        /TWILIO.*WEBHOOK/i,
        /SENDGRID.*WEBHOOK/i,
        /.*_HOOK/i,
        /.*_CALLBACK/i,
        /.*_NOTIFY/i,
    ];
    // Scan all environment variables
    for (const [key, value] of Object.entries(process.env)) {
        if (!value || !value.startsWith("http"))
            continue;
        // Check if it matches webhook patterns
        const isWebhook = webhookPatterns.some((pattern) => pattern.test(key));
        if (isWebhook) {
            try {
                const url = new URL(value);
                // Determine neuron type
                let type = "motor"; // Outgoing by default
                if (key.includes("INCOMING") || key.includes("RECEIVE")) {
                    type = "sensory";
                }
                // Extract name from env var
                const name = key
                    .replace(/_WEBHOOK.*/i, "")
                    .replace(/_URL.*/i, "")
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase());
                const neuron = createNeuron(name, value, type, {
                    threshold: 0.5,
                    adaptation: 0.1,
                    neurotransmitter: "excitatory",
                });
                discovered.push(neuron);
                console.log(`[WebhookAutoDiscoverer] 🔍 Auto-discovered webhook: ${name} (${type})`);
            }
            catch (error) {
                // Invalid URL, skip
            }
        }
    }
    return discovered;
}
/**
 * Auto-discover webhooks from config files
 */
export function autoDiscoverWebhooksFromConfig() {
    const discovered = [];
    // Check common config files
    const configFiles = [
        ".env",
        ".env.local",
        ".env.production",
        "config.json",
        "webhooks.json",
        "webhook-config.json",
    ];
    for (const configFile of configFiles) {
        try {
            const fs = require("fs");
            const path = require("path");
            const configPath = path.join(process.cwd(), configFile);
            if (fs.existsSync(configPath)) {
                const content = fs.readFileSync(configPath, "utf-8");
                // Try to parse as JSON
                try {
                    const config = JSON.parse(content);
                    discoverFromConfigObject(config, discovered);
                }
                catch {
                    // Not JSON, might be .env format
                    if (configFile.startsWith(".env")) {
                        // Already handled by env scanner
                    }
                }
            }
        }
        catch (error) {
            // File doesn't exist or can't read, continue
        }
    }
    return discovered;
}
/**
 * Discover webhooks from config object
 */
function discoverFromConfigObject(config, discovered) {
    const scanObject = (obj, prefix = "") => {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "string" && value.startsWith("http")) {
                // Found a webhook URL
                const name = fullKey
                    .replace(/webhook/gi, "")
                    .replace(/url/gi, "")
                    .replace(/[._-]/g, " ")
                    .trim()
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || "Webhook";
                const neuron = createNeuron(name, value, "motor", {
                    threshold: 0.5,
                    adaptation: 0.1,
                });
                discovered.push(neuron);
                console.log(`[WebhookAutoDiscoverer] 🔍 Auto-discovered webhook from config: ${name}`);
            }
            else if (typeof value === "object" && value !== null) {
                scanObject(value, fullKey);
            }
        }
    };
    scanObject(config);
}
/**
 * Auto-discover all webhooks from all sources
 */
export function autoDiscoverAllWebhooks() {
    const discovered = [];
    // Discover from environment
    const envWebhooks = autoDiscoverWebhooksFromEnv();
    discovered.push(...envWebhooks);
    // Discover from config files
    const configWebhooks = autoDiscoverWebhooksFromConfig();
    discovered.push(...configWebhooks);
    // Remove duplicates (by URL)
    const unique = new Map();
    for (const neuron of discovered) {
        if (!unique.has(neuron.url)) {
            unique.set(neuron.url, neuron);
        }
    }
    return Array.from(unique.values());
}
/**
 * Auto-create default antibodies (security rules)
 */
export function autoCreateDefaultAntibodies() {
    // SQL Injection protection
    createAntibody("SQL Injection Detector", "(?i)(union|select|insert|delete|drop|exec|script)", "block", { memory: true, effectiveness: 0.95 });
    // XSS protection
    createAntibody("XSS Detector", "(?i)(<script|javascript:|onerror=|onload=)", "block", { memory: true, effectiveness: 0.9 });
    // Rate limit detection
    createAntibody("Rate Limit Detector", "(?i)(rate.?limit|too.?many|429)", "alert", { memory: true, effectiveness: 0.8 });
    // Timeout detection
    createAntibody("Timeout Detector", "(?i)(timeout|timed.?out|504|408)", "alert", { memory: true, effectiveness: 0.85 });
    console.log(`[WebhookAutoDiscoverer] 🛡️  Auto-created default security antibodies`);
}
