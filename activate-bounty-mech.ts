import { BountyMechSuit } from "./packages/nerve/src/spine/workers/BountyMechSuit";
import { SessionKeyManager } from "./packages/nerve/src/spine/services/SessionKeyManager";
import { NERVE_BUS } from "./packages/nerve/src/bus";
import { v4 as uuidv4 } from "uuid";

async function main() {
    const mechSuit = new BountyMechSuit();
    const sessionManager = new SessionKeyManager();
    const correlationId = uuidv4();

    console.log(`🌌 [DreamNet Sovereign] Initializing Bounty Mech Suit... (ID: ${correlationId})`);

    // 🔥 Verification: Subscribe to Nerve Bus to see audit trail
    NERVE_BUS.subscribeAll((event: any) => {
        console.log(`📡 [NerveBus Audit] Event Observed: ${event.eventType} | Actor: ${event.actor?.agentId || event.actor?.callerId || "System"}`);
    });

    // 1. Activate Pilot (Real Identity from .env)
    const pilotPk = process.env.METAMASK_PRIVATE_KEY || "";
    if (!pilotPk) throw new Error("MECH_SUIT_ERROR: Missing METAMASK_PRIVATE_KEY in .env");

    const pilot = await mechSuit.activatePilot(pilotPk, correlationId);

    // 2. Register Session (Handshake simulation)
    const sessionId = "SESSION_RH_001";
    sessionManager.registerSession({
        sessionId,
        grantee: pilot.address,
        granter: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // User address
        expiresAt: Date.now() + 3600000, // 1 hour
        permissions: [
            {
                targetContract: "0xRESEARCHHUB_CONTRACT",
                maxGasLimit: "0.1",
                allowedMethods: ["claimRSCBounty", "stakeRSC"],
            }
        ]
    }, correlationId);

    // 3. Autonomous Execution
    console.log("🦾 [MechSuit] Commencing Mission: BOUNTY_EXTRACTION...");

    const isAuthorized = await sessionManager.verifyIntent(sessionId, "0xRESEARCHHUB_CONTRACT", "claimRSCBounty", correlationId);

    if (isAuthorized) {
        const result = await mechSuit.claimRSCBounty("5101", "150", pilot.address, correlationId);
        console.log(`✅ [MechSuit] Mission Success: ${result.missionId}`);

        await mechSuit.stakeRSC("50", pilot.address, correlationId);
    } else {
        console.error("🛑 [MechSuit] Mission REJECTED: Unauthorized Intent.");
    }
}

main().catch(console.error);
