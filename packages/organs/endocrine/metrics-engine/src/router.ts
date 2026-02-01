
import { Router } from 'express';
import { getMetricsHistory, recordMetric } from './index.js';

export const createMetricsRouter = () => {
    const router = Router();

    router.get('/history', (req, res) => {
        const { name, limit } = req.query;
        const metrics = getMetricsHistory({
            name: name ? String(name) : undefined,
            limit: limit ? Number(limit) : 50
        });
        res.json(metrics);
    });

    router.post('/', (req, res) => {
        const { name, value, tags } = req.body;
        if (name && value !== undefined) {
            recordMetric({ name, value, tags });
            res.json({ success: true });
        } else {
            res.status(400).json({ error: "Missing name or value" });
        }
    });

    return router;
};
