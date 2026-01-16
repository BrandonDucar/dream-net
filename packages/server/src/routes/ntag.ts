
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

            // In a real app, we would look up this UID in a DB to see what Asset it maps to.
            // For now, we map it to a DreamNet Asset based on the Counter (just for fun/demo)

            res.json({
                success: true,
                data: {
                    uid: result.uid,
                    tapCount: result.counter,
                    // Mock mapping logic
                    linkedAsset: {
                        name: "DreamNet Sovereign Hoodie",
                        type: "physical_twin",
                        rarity: "legendary",
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
