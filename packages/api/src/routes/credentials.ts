import { Router } from 'express';

const router = Router();

router.get('/me', async (req, res) => {
    res.json([
        { id: 'cred-1', type: 'P.O.E', title: 'Swarm Architect', issuer: 'DreamNet Foundation', issuedAt: new Date() },
        { id: 'cred-2', type: 'P.O.W.K', title: 'Solidity Sage', issuer: 'Academy Warp', issuedAt: new Date() }
    ]);
});

export default router;
