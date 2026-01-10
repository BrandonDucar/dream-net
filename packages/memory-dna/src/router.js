import { Router } from 'express';
import { vectorStore } from './store/VectorStore.js';
export const createDnaRouter = () => {
    const router = Router();
    router.post('/memories', async (req, res) => {
        try {
            const { text, metadata } = req.body;
            if (!text)
                return res.status(400).json({ error: "Missing text" });
            const id = await vectorStore.addMemory(text, metadata || {});
            res.json({ success: true, id });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    router.get('/memories/search', async (req, res) => {
        try {
            const { q, limit } = req.query;
            if (!q)
                return res.status(400).json({ error: "Missing query parameter 'q'" });
            const results = await vectorStore.search(String(q), Number(limit) || 5);
            res.json({ results });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    return router;
};
