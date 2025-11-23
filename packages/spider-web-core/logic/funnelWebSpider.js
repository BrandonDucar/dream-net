import { SpiderStore } from "../store/spiderStore";
import { catchFly, createFly } from "./flyCatcher";
import { checkTwilioAPI, checkTelegramAPI, checkTwitterAPI } from "./apiIntegrations";
let threadCounter = 0;
function nextThreadId() {
    threadCounter += 1;
    return `thread:data-ingest:${Date.now()}:${threadCounter}`;
}
/**
 * Check a sensor for new flies
 */
async function checkSensor(sensor, ctx) {
    const flies = [];
    const now = Date.now();
    // Update last check time
    sensor.lastCheckAt = now;
    switch (sensor.type) {
        case "twilio":
            // Check real Twilio API if credentials provided
            if (sensor.config.accountSid && sensor.config.authToken) {
                try {
                    const apiFlies = await checkTwilioAPI(sensor.config.accountSid, sensor.config.authToken, sensor.config.phoneNumber);
                    flies.push(...apiFlies);
                }
                catch (err) {
                    console.error(`[FunnelWebSpider] Twilio API error: ${err}`);
                }
            }
            // Fallback to simulation if no credentials
            if (sensor.config.simulateFlies && flies.length === 0) {
                const fly = createFly("message", "twilio", { message: "Simulated Twilio SMS", from: "+1234567890" }, "medium", true);
                flies.push(fly);
            }
            break;
        case "telegram":
            // Check real Telegram API if token provided
            if (sensor.config.botToken) {
                try {
                    const apiFlies = await checkTelegramAPI(sensor.config.botToken, sensor.config.chatId);
                    flies.push(...apiFlies);
                }
                catch (err) {
                    console.error(`[FunnelWebSpider] Telegram API error: ${err}`);
                }
            }
            // Fallback to simulation
            if (sensor.config.simulateFlies && flies.length === 0) {
                const fly = createFly("message", "telegram", { message: "Simulated Telegram message", chatId: "12345" }, "medium", true);
                flies.push(fly);
            }
            break;
        case "twitter":
            // Check real Twitter API if token provided
            if (sensor.config.bearerToken) {
                try {
                    const apiFlies = await checkTwitterAPI(sensor.config.bearerToken, sensor.config.username);
                    flies.push(...apiFlies);
                }
                catch (err) {
                    console.error(`[FunnelWebSpider] Twitter API error: ${err}`);
                }
            }
            // Fallback to simulation
            if (sensor.config.simulateFlies && flies.length === 0) {
                const fly = createFly("mention", "twitter", { tweet: "Simulated Twitter mention", username: "@dreamnet" }, "low", false);
                flies.push(fly);
            }
            break;
        case "webhook":
            // Check for pending webhook flies (would be stored when webhook received)
            // For now, simulate
            if (sensor.config.simulateFlies) {
                const fly = createFly("webhook", "webhook", { type: "funding", data: { leadId: "lead:test" } }, "high", true);
                flies.push(fly);
            }
            break;
        case "blockchain":
            // Simulate blockchain event detection
            if (sensor.config.simulateFlies) {
                const fly = createFly("transaction", "blockchain", { txHash: "0x123...", value: "1000000000000000000" }, "high", true);
                flies.push(fly);
            }
            break;
        case "email":
            // Simulate email detection
            if (sensor.config.simulateFlies) {
                const fly = createFly("message", "email", { subject: "Simulated email", from: "test@example.com" }, "medium", true);
                flies.push(fly);
            }
            break;
        default:
            // Unknown sensor type
            break;
    }
    // Update sensor catch rate
    if (flies.length > 0) {
        sensor.catchRate = (sensor.catchRate * 0.9) + (flies.length * 0.1);
        SpiderStore.updateSensorCatchRate(sensor.id, sensor.catchRate);
    }
    return flies;
}
/**
 * Run Funnel Web Spider - catch flies from all sensors
 */
export async function runFunnelWebSpider(ctx) {
    const newThreads = [];
    const activeSensors = SpiderStore.listActiveSensors();
    console.log(`[FunnelWebSpider] Checking ${activeSensors.length} active sensor(s)...`);
    // Check each sensor
    for (const sensor of activeSensors) {
        try {
            const flies = await checkSensor(sensor, ctx);
            // Catch each fly and create threads
            for (const fly of flies) {
                const thread = catchFly(fly);
                if (thread) {
                    SpiderStore.addThread(thread);
                    newThreads.push(thread);
                }
            }
        }
        catch (err) {
            console.error(`[FunnelWebSpider] Error checking sensor ${sensor.id}:`, err);
        }
    }
    if (newThreads.length > 0) {
        console.log(`[FunnelWebSpider] Caught ${newThreads.length} fly/fly and created thread(s)`);
    }
    return newThreads;
}
/**
 * Initialize default sensors
 * Reads API credentials from environment variables
 */
export function ensureDefaultSensors() {
    const existing = SpiderStore.listSensors();
    if (existing.length > 0) {
        // Update existing sensors with env vars if they changed
        updateSensorsFromEnv();
        return existing;
    }
    const now = Date.now();
    // Read Twilio credentials from .env
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const twilioActive = !!(twilioAccountSid && twilioAuthToken);
    // Read Telegram credentials from .env
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const telegramActive = !!telegramBotToken;
    // Read Twitter credentials from .env
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
    const twitterUsername = process.env.TWITTER_USERNAME || process.env.TWITTER_HANDLE;
    const twitterActive = !!twitterBearerToken;
    const sensors = [
        {
            id: "sensor:twilio",
            type: "twilio",
            active: twilioActive,
            config: {
                accountSid: twilioAccountSid,
                authToken: twilioAuthToken,
                phoneNumber: twilioPhoneNumber,
                simulateFlies: !twilioActive, // Only simulate if no real credentials
            },
            catchRate: 0,
            lastCheckAt: now,
        },
        {
            id: "sensor:telegram",
            type: "telegram",
            active: telegramActive,
            config: {
                botToken: telegramBotToken,
                chatId: telegramChatId,
                simulateFlies: !telegramActive, // Only simulate if no real credentials
            },
            catchRate: 0,
            lastCheckAt: now,
        },
        {
            id: "sensor:twitter",
            type: "twitter",
            active: twitterActive,
            config: {
                bearerToken: twitterBearerToken,
                username: twitterUsername,
                simulateFlies: !twitterActive, // Only simulate if no real credentials
            },
            catchRate: 0,
            lastCheckAt: now,
        },
        {
            id: "sensor:webhook",
            type: "webhook",
            active: true, // Webhook sensor can be active for testing
            config: { simulateFlies: true }, // Enable simulation for testing
            catchRate: 0,
            lastCheckAt: now,
        },
        {
            id: "sensor:blockchain",
            type: "blockchain",
            active: false,
            config: { simulateFlies: false },
            catchRate: 0,
            lastCheckAt: now,
        },
    ];
    for (const sensor of sensors) {
        SpiderStore.addSensor(sensor);
    }
    // Log sensor status
    if (twilioActive) {
        console.log(`[FunnelWebSpider] Twilio sensor activated (Account SID: ${twilioAccountSid?.substring(0, 8)}...)`);
    }
    if (telegramActive) {
        console.log(`[FunnelWebSpider] Telegram sensor activated`);
    }
    if (twitterActive) {
        console.log(`[FunnelWebSpider] Twitter sensor activated (@${twitterUsername || 'unknown'})`);
    }
    return sensors;
}
/**
 * Update existing sensors with environment variables
 */
function updateSensorsFromEnv() {
    const sensors = SpiderStore.listSensors();
    for (const sensor of sensors) {
        let updated = false;
        if (sensor.type === "twilio") {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
            if (accountSid && authToken) {
                sensor.config.accountSid = accountSid;
                sensor.config.authToken = authToken;
                sensor.config.phoneNumber = phoneNumber;
                sensor.config.simulateFlies = false;
                sensor.active = true;
                updated = true;
            }
        }
        else if (sensor.type === "telegram") {
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            if (botToken) {
                sensor.config.botToken = botToken;
                sensor.config.chatId = chatId;
                sensor.config.simulateFlies = false;
                sensor.active = true;
                updated = true;
            }
        }
        else if (sensor.type === "twitter") {
            const bearerToken = process.env.TWITTER_BEARER_TOKEN;
            const username = process.env.TWITTER_USERNAME || process.env.TWITTER_HANDLE;
            if (bearerToken) {
                sensor.config.bearerToken = bearerToken;
                sensor.config.username = username;
                sensor.config.simulateFlies = false;
                sensor.active = true;
                updated = true;
            }
        }
        if (updated) {
            SpiderStore.updateSensor(sensor);
        }
    }
}
