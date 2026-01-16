"use server";

import { db } from "~/lib/db";
import { oaths } from "@dreamnet/shared";
import { eq } from "drizzle-orm";

"use server";

import { db } from "~/lib/db";
import { oaths } from "@dreamnet/shared";
import { eq } from "drizzle-orm";

export async function signOath(userId: string, username: string) {
    console.log(`📜 [Snail's Oath] Signing oath for ${username} (${userId})...`);

    try {
        // Insert or update the oath in the database
        await db.insert(oaths).values({
            userId,
            username,
            status: "active",
            signDate: new Date().toISOString(),
            kineticScore: "50", // Initial kinetic score
            lastPulseAt: new Date().toISOString()
        }).onConflictDoUpdate({
            target: oaths.userId,
            set: {
                username,
                status: "active",
                lastPulseAt: new Date().toISOString()
            }
        });

        return {
            success: true,
            message: "The Oath has been inscribed in the Snail's Ledger.",
            data: { userId, username, status: "active", kineticScore: 50 }
        };
    } catch (error: any) {
        console.error("❌ [Snail's Oath] Failed to sign:", error.message);
        return {
            success: false,
            message: "Failed to inscribe the Oath. The Ledger is unresponsive.",
            error: error.message
        };
    }
}
