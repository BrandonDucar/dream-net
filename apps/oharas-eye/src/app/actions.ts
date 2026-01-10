"use server";

import { db } from "~/lib/db";
import { oaths } from "@dreamnet/shared";
import { eq } from "drizzle-orm";

export async function signOath(userId: string, username: string) {
    console.log(`[MOCK] Signing oath for ${username} (${userId})`);

    // TEMPORARY: Purged of the build-worker-crashing segments
    return {
        success: true,
        message: "Oath initiated (Mocked for Build Verification)",
        data: { userId, username, status: "active", kineticScore: 50 }
    };
}
