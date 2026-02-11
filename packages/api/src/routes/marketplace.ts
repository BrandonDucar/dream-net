import { Router } from 'express';

const router = Router();

// In-memory mock for now
const AGENTS = [
    { id: 'agent_001', name: 'Orbital_Sling', price: 50, capabilities: ['Arbitrage', 'DeFi'], reputation: 98 },
    { id: 'agent_002', name: 'Velvet_Research', price: 120, capabilities: ['Deep Search', 'Summary'], reputation: 92 },
    { id: 'agent_003', name: 'Code_Wraith', price: 200, capabilities: ['Auditing', 'Solidity'], reputation: 99 }
];

router.get('/', (req, res) => {
    res.json(AGENTS);
});

// In-memory mock for credits
let COMPUTE_CREDITS = 4200;

router.post('/hire', (req, res) => {
    const { agentId, duration } = req.body;
    const cost = 50; // Fixed cost for now

    if (COMPUTE_CREDITS < cost) {
        return res.status(402).json({ error: 'INSUFFICIENT_CREDITS' });
    }

    COMPUTE_CREDITS -= cost;

    // Logic to deduct credits would go here
    res.json({
        status: 'HIRED',
        contractId: `contract_${Date.now()}`,
        agentId,
        remainingCredits: COMPUTE_CREDITS
    });
});

export default router;
