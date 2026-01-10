"use server";

import { db } from "~/lib/db";
import * as Shared from "@dreamnet/shared";
const { oaths, chakraSensors, metabolicScraps, nutrientExtractionLedger } = Shared as any;
import { eq, desc } from "drizzle-orm";

export async function signOath(userId: string, username: string) {
    console.log(`[REAL] Signing oath for ${username} (${userId})`);

    try {
        if (!process.env.DATABASE_URL && !process.env.NEXT_PUBLIC_DATABASE_URL) {
            throw new Error("DATABASE_URL not configured");
        }

        const existing = await (db.select().from(oaths as any).where(eq((oaths as any).userId, userId)).limit(1) as any);

        if (existing && existing.length > 0) {
            return {
                success: true,
                message: "Oath already signed",
                data: existing[0]
            };
        }

        const [newOath] = await (db.insert(oaths as any).values({
            userId,
            username,
            status: "active" as any,
            kineticScore: 50
        }).returning() as any);

        return {
            success: true,
            message: "Oath signed successfully",
            data: newOath
        };
    } catch (error) {
        console.error("Failed to sign oath:", error);
        return {
            success: false,
            message: "Connection delay or configuration issue. The Snail remembers, but the vault is slow.",
            error: String(error)
        };
    }
}

export async function getChakraStatus(userId: string) {
    try {
        const sensors = await (db.select().from(chakraSensors as any).where(eq((chakraSensors as any).userId, userId)) as any);
        return { success: true, data: sensors };
    } catch (error) {
        console.error("Failed to fetch chakra status:", error);
        return { success: false, error: String(error) };
    }
}

export async function alignChakras(userId: string, resonance: number) {
    try {
        // Simple mock of third-eye alignment
        const [updated] = await (db.insert(chakraSensors as any).values({
            userId,
            chakraType: "third_eye" as any,
            resonancePercentage: resonance,
        }).onConflictDoUpdate({
            target: [(chakraSensors as any).userId, (chakraSensors as any).chakraType] as any,
            set: { resonancePercentage: resonance, lastAlignmentAt: new Date() }
        }).returning() as any);

        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to align chakras:", error);
        return { success: false, error: String(error) };
    }
}

export async function getMetabolicScraps() {
    try {
        const scraps = await (db.select().from(metabolicScraps as any).orderBy(desc((metabolicScraps as any).createdAt)).limit(5) as any);
        return { success: true, data: scraps };
    } catch (error) {
        console.error("Failed to fetch metabolic scraps:", error);
        return { success: false, error: String(error) };
    }
}

export async function siftWaste(scrapId: string) {
    try {
        // High-level "sifting" logic: finding "gold" in the debt
        const [extraction] = await (db.insert(nutrientExtractionLedger as any).values({
            scrapId,
            extractedNutrient: "Condensed Architectural Pattern (Found in tech debt)",
            reusabilityScore: 85,
            targetOrgan: "Industrial"
        }).returning() as any);

        return { success: true, data: extraction };
    } catch (error) {
        console.error("Failed to sift waste:", error);
        return { success: false, error: String(error) };
    }
}
