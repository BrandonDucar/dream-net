import { Router } from 'express';

const router = Router();

// Get evolution vault data
router.get('/api/evolution-vault/:vaultId', async (req, res) => {
  try {
    const { vaultId } = req.params;
    
    // Sample evolution vault data - in production this would come from database
    const evolutionVault = {
      vaultId: vaultId,
      type: "Evolution Vault",
      linkedDreamId: "dream001",
      goal: 25000,
      current: 12400,
      contributors: ["0xBrandon", "0xTina", "0xFlutter"],
      autoUnlockEnabled: true,
      milestones: [
        {"target": 10000, "unlock": "Visual Skin Upgrade"},
        {"target": 20000, "unlock": "Dream Animation"},
        {"target": 25000, "unlock": "Cloud Integration"}
      ],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    res.json(evolutionVault);
  } catch (error: any) {
    console.error('Evolution vault fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch evolution vault data' });
  }
});

// Update evolution vault contribution
router.post('/api/evolution-vault/:vaultId/contribute', async (req, res) => {
  try {
    const { vaultId } = req.params;
    const { amount, contributorWallet } = req.body;

    if (!amount || !contributorWallet) {
      return res.status(400).json({ error: 'Amount and contributor wallet are required' });
    }

    // In production, this would update the database
    // For now, return success response
    const updatedVault = {
      vaultId: vaultId,
      type: "Evolution Vault", 
      linkedDreamId: "dream001",
      goal: 25000,
      current: 12400 + amount,
      contributors: ["0xBrandon", "0xTina", "0xFlutter", contributorWallet],
      autoUnlockEnabled: true,
      milestones: [
        {"target": 10000, "unlock": "Visual Skin Upgrade"},
        {"target": 20000, "unlock": "Dream Animation"},
        {"target": 25000, "unlock": "Cloud Integration"}
      ],
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Contribution successful',
      vault: updatedVault,
      transaction: {
        amount,
        contributorWallet,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Evolution vault contribution error:', error);
    res.status(500).json({ error: 'Failed to process contribution' });
  }
});

// Get all evolution vaults
router.get('/api/evolution-vaults', async (req, res) => {
  try {
    // Sample data - in production this would query the database
    const evolutionVaults = [
      {
        vaultId: "vault_019",
        type: "Evolution Vault",
        linkedDreamId: "dream001",
        goal: 25000,
        current: 12400,
        contributors: ["0xBrandon", "0xTina", "0xFlutter"],
        autoUnlockEnabled: true,
        milestones: [
          {"target": 10000, "unlock": "Visual Skin Upgrade"},
          {"target": 20000, "unlock": "Dream Animation"},
          {"target": 25000, "unlock": "Cloud Integration"}
        ]
      },
      {
        vaultId: "vault_020",
        type: "Evolution Vault",
        linkedDreamId: "dream002",
        goal: 15000,
        current: 8750,
        contributors: ["0xCreator", "0xBuilder"],
        autoUnlockEnabled: false,
        milestones: [
          {"target": 5000, "unlock": "Basic Features"},
          {"target": 10000, "unlock": "Advanced Tools"},
          {"target": 15000, "unlock": "Premium Access"}
        ]
      }
    ];

    res.json(evolutionVaults);
  } catch (error: any) {
    console.error('Evolution vaults fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch evolution vaults' });
  }
});

export default router;