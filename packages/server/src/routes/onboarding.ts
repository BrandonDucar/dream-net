/**
 * Onboarding API Routes
 */

import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

// In-memory store for onboarding progress (would be in DB in production)
const onboardingProgress: Record<string, {
  hasPassport: boolean;
  joinedPorts: string[];
  completed: boolean;
  steps: Record<string, boolean>;
}> = {};

/**
 * GET /api/onboarding/profile/:address
 * Get onboarding profile for an address
 */
router.get('/profile/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const normalizedAddress = address.toLowerCase();

    const profile = onboardingProgress[normalizedAddress] || {
      hasPassport: false,
      joinedPorts: [],
      completed: false,
      steps: {
        connectWallet: false,
        mintPassport: false,
        choosePorts: false,
      },
    };

    res.json(profile);
  } catch (err: any) {
    console.error('Failed to get onboarding profile:', err);
    res.status(500).json({ message: 'Failed to get profile', error: err.message });
  }
});

/**
 * POST /api/onboarding/complete-step
 * Mark a step as completed
 */
router.post('/complete-step', async (req, res) => {
  try {
    const { address, step } = req.body;

    if (!address || !step) {
      return res.status(400).json({ message: 'address and step are required' });
    }

    const normalizedAddress = address.toLowerCase();

    if (!onboardingProgress[normalizedAddress]) {
      onboardingProgress[normalizedAddress] = {
        hasPassport: false,
        joinedPorts: [],
        completed: false,
        steps: {},
      };
    }

    const profile = onboardingProgress[normalizedAddress];
    profile.steps[step] = true;

    // Update derived fields
    if (step === 'mintPassport') {
      profile.hasPassport = true;
    }

    if (step === 'choosePorts' && req.body.ports) {
      profile.joinedPorts = req.body.ports;
    }

    // Check if all steps completed
    const allSteps = ['connectWallet', 'mintPassport', 'choosePorts'];
    profile.completed = allSteps.every(s => profile.steps[s] || false);

    res.json({ success: true, profile });
  } catch (err: any) {
    console.error('Failed to complete step:', err);
    res.status(500).json({ message: 'Failed to complete step', error: err.message });
  }
});

export default router;

