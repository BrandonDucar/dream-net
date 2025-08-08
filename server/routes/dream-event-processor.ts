import { Router } from 'express';
import { DREAMKEEPER_CORE } from '../../lib/dreamkeeperCore';
import { DreamDefenseNet } from '../../lib/defenseBots';
import { SurgeonAgent } from '../../lib/aiSurgeonAgents';
import { EvolutionEngine } from '../../lib/evolutionEngine';

const router = Router();

interface DreamEvent {
  event: string;
  timestamp: string;
  initiator: string;
  metadata: {
    title: string;
    emotions: string[];
    [key: string]: any;
  };
}

// Process incoming dream events
router.post('/dream-event', (req, res) => {
  try {
    const dreamEvent: DreamEvent = req.body;
    
    console.log(`📥 Processing dream event: ${dreamEvent.event} from ${dreamEvent.initiator}`);
    
    // Process through DREAMKEEPER Core
    DREAMKEEPER_CORE.processDreamEvent(dreamEvent);
    
    // Check for security threats
    DreamDefenseNet.analyzeDreamEvent(dreamEvent);
    
    // Schedule surgeon analysis if needed
    if (dreamEvent.metadata.emotions?.includes('chaos')) {
      SurgeonAgent.scheduleDreamAnalysis(dreamEvent);
    }
    
    // Trigger evolution analysis
    if (dreamEvent.event === 'dream_submitted') {
      EvolutionEngine.analyzeNewDream(dreamEvent);
    }
    
    res.json({
      status: 'processed',
      dreamId: `dream_${Date.now()}`,
      systems_notified: ['dreamkeeper', 'defense', 'surgeon', 'evolution'],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing dream event:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process dream event'
    });
  }
});

// Get recent dream events
router.get('/dream-events', (req, res) => {
  const recentEvents = DREAMKEEPER_CORE.getDreamEvents();
  res.json({
    events: recentEvents,
    count: recentEvents.length,
    last_updated: new Date().toISOString()
  });
});

export default router;