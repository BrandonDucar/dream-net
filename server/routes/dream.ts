import { Router } from 'express';
import { dreamNetworkEngine } from '../services/DreamNetworkEngine.js';

const router = Router();

// Dream state endpoints
router.get('/state', (req, res) => {
  try {
    const dreamState = dreamNetworkEngine.getDreamState();
    res.json({ success: true, state: dreamState });
  } catch (error) {
    console.error('Error fetching dream state:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dream state' });
  }
});

router.get('/seeds', (req, res) => {
  try {
    const seeds = dreamNetworkEngine.getDreamSeeds();
    res.json({ success: true, seeds });
  } catch (error) {
    console.error('Error fetching dream seeds:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dream seeds' });
  }
});

router.get('/nightmare-network', (req, res) => {
  try {
    const network = dreamNetworkEngine.getNightmareNetwork();
    res.json({ success: true, network });
  } catch (error) {
    console.error('Error fetching nightmare network:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch nightmare network' });
  }
});

router.get('/dimensions', (req, res) => {
  try {
    const dimensions = dreamNetworkEngine.getDreamDimensions();
    res.json({ success: true, dimensions });
  } catch (error) {
    console.error('Error fetching dream dimensions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dream dimensions' });
  }
});

router.get('/archetypal-forces', (req, res) => {
  try {
    const forces = dreamNetworkEngine.getArchetypalForces();
    res.json({ success: true, forces });
  } catch (error) {
    console.error('Error fetching archetypal forces:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch archetypal forces' });
  }
});

router.get('/status', (req, res) => {
  try {
    const status = dreamNetworkEngine.getStatus();
    res.json({ success: true, status });
  } catch (error) {
    console.error('Error fetching dream network status:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dream network status' });
  }
});

// Dream control endpoints
router.post('/seed', (req, res) => {
  try {
    const seedData = req.body;
    const newSeed = dreamNetworkEngine.addDreamSeed(seedData);
    res.json({ success: true, seed: newSeed });
  } catch (error) {
    console.error('Error adding dream seed:', error);
    res.status(500).json({ success: false, error: 'Failed to add dream seed' });
  }
});

router.post('/phase', (req, res) => {
  try {
    const { phase } = req.body;
    dreamNetworkEngine.setDreamPhase(phase);
    res.json({ success: true, message: `Dream phase set to ${phase}` });
  } catch (error) {
    console.error('Error setting dream phase:', error);
    res.status(500).json({ success: false, error: 'Failed to set dream phase' });
  }
});

// Creator Studio endpoints
const dreams: Array<{
  id: string;
  name: string;
  description: string;
  tags: string[];
  primaryPorts: string[];
  creator: string;
  createdAt: string;
}> = [];

router.post('/', (req, res) => {
  try {
    const { name, description, tags, primaryPorts, creator } = req.body;

    if (!name || !description || !creator) {
      return res.status(400).json({ success: false, error: 'name, description, and creator are required' });
    }

    const dream = {
      id: `dream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      tags: tags || [],
      primaryPorts: primaryPorts || [],
      creator: creator.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    dreams.push(dream);
    res.json({ success: true, dream });
  } catch (error) {
    console.error('Error creating dream:', error);
    res.status(500).json({ success: false, error: 'Failed to create dream' });
  }
});

router.get('/created-by/:address', (req, res) => {
  try {
    const { address } = req.params;
    const normalizedAddress = address.toLowerCase();
    const userDreams = dreams.filter(d => d.creator === normalizedAddress);
    res.json({ success: true, dreams: userDreams });
  } catch (error) {
    console.error('Error fetching dreams:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dreams' });
  }
});

export default router;