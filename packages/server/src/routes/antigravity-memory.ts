import { Router } from 'express';
import { HiveMind, SkillAtom } from '@dreamnet/dream-state-core';
import { z } from 'zod';

const router = Router();

// Schema for the "Recall" request
const RecallSchema = z.object({
    intent: z.string().min(3),
});

// Schema for the "Commit" request (teaching the hive mind)
const CommitSchema = z.object({
    intent: z.string(),
    toolChain: z.array(z.string()),
    context: z.any().optional(),
    successRating: z.number().min(0).max(1),
});

/**
 * GET /api/memory/recall
 * The "Other Agent" asks: "Have we done X before?"
 */
router.post('/recall', async (req, res) => {
    try {
        const { intent } = RecallSchema.parse(req.body);

        console.log(`🧠 [API] External Agent requesting recall for: "${intent}"`);
        const atom = await HiveMind.recall(intent);

        if (atom) {
            return res.json({ found: true, atom });
        } else {
            return res.json({ found: false, message: "No latent skill found. Computation required." });
        }
    } catch (error) {
        return res.status(400).json({ error: 'Invalid request' });
    }
});

/**
 * POST /api/memory/commit
 * The "Other Agent" says: "I just figured out how to do X! Saving it."
 */
router.post('/commit', async (req, res) => {
    try {
        const body = CommitSchema.parse(req.body);

        const newAtom: SkillAtom = {
            id: `atom_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            intent: body.intent,
            toolChain: body.toolChain,
            context: body.context || {},
            successRating: body.successRating,
            lastUsed: Date.now()
        };

        await HiveMind.commitSkill(newAtom);
        console.log(`💾 [API] External Agent committed new skill: "${body.intent}"`);

        return res.json({ success: true, id: newAtom.id });
    } catch (error) {
        return res.status(400).json({ error: 'Invalid schema' });
    }
});

export default router;
