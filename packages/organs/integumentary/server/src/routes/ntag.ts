
import express from 'express';
import { NtagService } from '../services/NtagService.js';

const router = express.Router();
const ntagService = new NtagService();

/**
 * GET /api/ntag/verify
 * 
 * Input: ?e=[encrypted_data]&c=[cmac]
 */
router.get('/verify', (req, res) => {
    try {
        const { e, c } = req.query;

        if (!e || typeof e !== 'string') {
            res.status(400).json({ success: false, error: 'Missing encrypted data (e)' });
            return;
        }

        // CMAC optional for simplified MVP, but good practice
        const cmac = (c as string) || '';

        const result = ntagService.verify(e, cmac);

        if (result.isValid) {
            console.log(`[NTAG] Verified Chip: ${result.uid} (Count: ${result.counter})`);

            // Temporal Advantage Integration
            const { TemporalKernel } = await import('../../immune/shield-core/logic/temporalKernel.js');

            // For demo: Generate a deterministic birth timestamp based on the UID
            // In prod: This would be fetched from the Asset DB
            const birthTime = Date.now() - (result.counter * 1000000); // Higher counter = older asset for demo purposes

            const ripening = TemporalKernel.calculateRipening({
                id: result.uid,
                owner: "0xBRANDON...",
                birthTimestamp: birthTime,
                metabolicInteractionCount: result.counter,
                lastMetabolicSync: Date.now(),
                phase: 'Pulse',
                purity: 0
            });

            res.json({
                success: true,
                data: {
                    uid: result.uid,
                    tapCount: result.counter,
                    temporal: {
                        phase: ripening.phase,
                        purity: ripening.purity
                    },
                    linkedAsset: {
                        name: "DreamNet Sovereign Hoodie",
                        type: "physical_twin",
                        rarity: ripening.phase === 'Sovereign' ? 'Legendary' : 'Prime',
                        owner: "0xBRANDON..."
                    }
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Cryptographic Verification Failed' });
            return;
        }

    } catch (error) {
        console.error('NTAG Route Error:', error);
        res.status(500).json({ success: false, error: 'Internal Verification Error' });
        return;
    }
});

export default router;
