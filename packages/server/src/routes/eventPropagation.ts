import type { Express } from "express";

export async function registerEventPropagationRoutes(app: Express) {
  
  // Initialize Event Propagation Agent
  const { default: EventPropagationAgent } = await import('../agents/EventPropagationAgent.js');
  const eventPropagationAgent = new EventPropagationAgent();
  
  // Make it globally accessible
  (global as any).eventPropagationAgent = eventPropagationAgent;

  // API Routes for Event Propagation
  app.post('/api/events/propagate', async (req, res) => {
    try {
      const eventData = req.body;
      const eventId = await eventPropagationAgent.propagateEvent(eventData);
      
      res.json({
        success: true,
        eventId: eventId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Event propagation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  app.get('/api/events/status', (req, res) => {
    try {
      const status = eventPropagationAgent.getStatus();
      res.json({
        success: true,
        status: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  app.get('/api/events/health', (req, res) => {
    try {
      const status = eventPropagationAgent.getStatus();
      const isHealthy = status.agent.status === 'active' && 
                       status.team.filter(m => m.status === 'active').length >= 4 &&
                       status.swarm.total >= 8;

      res.json({
        success: true,
        healthy: isHealthy,
        status: status.agent.status,
        teamHealth: status.team.filter(m => m.status === 'active').length,
        swarmSize: status.swarm.total
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Event system integration
  app.post('/api/events/broadcast', async (req, res) => {
    try {
      const { type, data, priority = 'normal', targets = ['all'] } = req.body;
      
      const eventId = await eventPropagationAgent.propagateEvent({
        type: type,
        source: 'api-broadcast',
        data: data,
        priority: priority,
        targets: targets
      });

      res.json({
        success: true,
        message: 'Event broadcast initiated',
        eventId: eventId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  console.log('🎯 [EventPropagationAgent] API routes registered');
  console.log('🚀 [EventPropagationAgent] System deployed and operational');
}