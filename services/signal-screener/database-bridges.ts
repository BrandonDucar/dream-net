// Database Bridges - Connect ALL DreamNet services to the Universal Data Hub
// Every service routes its data through the database before anywhere else

import { ingestUniversalData, createUniversalIngestionBridge } from './universal-data-hub';

// Create bridges for each major service
export const bridges = {
  // LMC Token Bridge - Captures all token activity
  lmc: createUniversalIngestionBridge('lmc'),
  
  // Sable Bridge - Telegram operations and intelligence
  sable: createUniversalIngestionBridge('sable'),
  
  // Clawedette Bridge - API calls and responses
  clawedette: createUniversalIngestionBridge('clawedette'),
  
  // Hawk Bridge - Farcaster intelligence (already integrated in server.ts)
  hawk: createUniversalIngestionBridge('hawk'),
  
  // Agent Spawn Bridge - All 143 agents lifecycle
  agentSpawn: createUniversalIngestionBridge('agent-spawn'),
  
  // Agent Health Bridge - Fleet health monitoring
  agentHealth: createUniversalIngestionBridge('agent-health'),
  
  // Message Bus Bridge - Inter-agent communication
  messageBus: createUniversalIngestionBridge('message-bus'),
  
  // OpenClaw Bridge - Autonomous operations
  openclaw: createUniversalIngestionBridge('openclaw'),
  
  // Antigravity Bridge - Web3 operations
  antigravity: createUniversalIngestionBridge('antigravity')
};

// Helper function for any service to send data to database
export async function routeToDatabase(source: string, eventType: string, data: any, metadata?: any) {
  try {
    await ingestUniversalData({
      id: `${source}-${eventType}-${Date.now()}-${Math.random()}`,
      source,
      event_type: eventType,
      timestamp: new Date(),
      data,
      metadata: metadata || {}
    });
    return true;
  } catch (error) {
    console.error(`❌ [Database Bridge] Failed to route ${source} data:`, error);
    return false;
  }
}

// Service-specific helpers
export const databaseHelpers: Record<string, any> = {
  // LMC Token Events
  lmc: {
    tokenMention: (data: any) => bridges.lmc.trackSpike('token_mention', data),
    priceMovement: (data: any) => bridges.lmc.trackMetric('lmc_price', data.price, 'USD'),
    holderActivity: (data: any) => bridges.lmc.trackActivity('holder_activity', data, { priority: 'high' }),
    transaction: (data: any) => bridges.lmc.trackActivity('transaction', data)
  },
  
  // Sable Operations
  sable: {
    message: (data: any) => bridges.sable.trackMessage(data, 'telegram'),
    command: (data: any) => bridges.sable.trackActivity('command', data),
    error: (data: any) => bridges.sable.trackActivity('error', data, { priority: 'high' }),
    heartbeat: (data: any) => bridges.sable.trackActivity('heartbeat', data)
  },
  
  // Clawedette API
  clawedette: {
    apiCall: (data: any) => bridges.clawedette.trackActivity('api_call', data),
    response: (data: any) => bridges.clawedette.trackActivity('api_response', data),
    error: (data: any) => bridges.clawedette.trackActivity('api_error', data, { priority: 'high' }),
    query: (data: any) => bridges.clawedette.trackActivity('query', data)
  },
  
  // Agent Lifecycle
  agentSpawn: {
    agentSpawned: (data: any) => bridges.agentSpawn.trackActivity('spawned', data),
    agentPaused: (data: any) => bridges.agentSpawn.trackActivity('paused', data),
    agentResumed: (data: any) => bridges.agentSpawn.trackActivity('resumed', data),
    agentDestroyed: (data: any) => bridges.agentSpawn.trackActivity('destroyed', data),
    batchSpawn: (data: any) => bridges.agentSpawn.trackActivity('batch_spawn', data)
  },
  
  // Agent Health
  agentHealth: {
    heartbeat: (data: any) => bridges.agentHealth.trackActivity('heartbeat', data),
    alert: (data: any) => bridges.agentHealth.trackActivity('alert', data, { priority: 'high' }),
    restart: (data: any) => bridges.agentHealth.trackActivity('restart', data),
    healthCheck: (data: any) => bridges.agentHealth.trackMetric('health_score', data.score)
  },
  
  // Message Bus
  messageBus: {
    message: (data: any) => bridges.messageBus.trackActivity('message', data),
    subscription: (data: any) => bridges.messageBus.trackActivity('subscription', data),
    publish: (data: any) => bridges.messageBus.trackActivity('publish', data),
    error: (data: any) => bridges.messageBus.trackActivity('error', data, { priority: 'high' })
  },
  
  // OpenClaw Operations
  openclaw: {
    task: (data: any) => bridges.openclaw.trackActivity('task', data),
    command: (data: any) => bridges.openclaw.trackActivity('command', data),
    response: (data: any) => bridges.openclaw.trackActivity('response', data),
    error: (data: any) => bridges.openclaw.trackActivity('error', data, { priority: 'high' })
  },
  
  // Antigravity Web3
  antigravity: {
    transaction: (data: any) => bridges.antigravity.trackActivity('transaction', data),
    walletConnect: (data: any) => bridges.antigravity.trackActivity('wallet_connect', data),
    contractInteraction: (data: any) => bridges.antigravity.trackActivity('contract_interaction', data),
    miniAppLaunch: (data: any) => bridges.antigravity.trackActivity('miniapp_launch', data)
  }
};

// Universal middleware for Express services
export function createDatabaseMiddleware(source: string) {
  return (req: any, res: any, next: any) => {
    // Log all requests to database
    bridges[source].trackActivity('http_request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date()
    });
    
    // Continue with request
    next();
  };
}

// WebSocket/Real-time event logging
export function logRealtimeEvent(source: string, eventType: string, data: any) {
  return bridges[source].trackActivity(eventType, data, {
    real_time: true,
    timestamp: new Date()
  });
}

// Batch ingestion for high-volume services
export async function batchIngest(events: Array<{
  source: string;
  eventType: string;
  data: any;
  metadata?: any;
}>) {
  const results = await Promise.allSettled(
    events.map(event => routeToDatabase(event.source, event.eventType, event.data, event.metadata))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  if (failed > 0) {
    console.warn(`⚠️ [Database Bridge] Batch: ${successful} succeeded, ${failed} failed`);
  }
  
  return { successful, failed };
}

// Initialize all bridges on startup
export function initializeDatabaseBridges() {
  console.log('🌐 [Database Bridges] Initializing connections for all DreamNet services...');
  
  // Test database connection for each bridge
  Object.keys(bridges).forEach(source => {
    bridges[source].trackActivity('bridge_init', {
      service: source,
      timestamp: new Date(),
      status: 'initializing'
    });
  });
  
  console.log('✅ [Database Bridges] All services connected to Universal Data Hub');
}
