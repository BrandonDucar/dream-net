/**
 * Cloud Function: DreamKeeper Health Check
 * 
 * Runs DreamKeeper health diagnostics
 * Triggered by Cloud Scheduler (every 5 minutes)
 * 
 * Deploy: gcloud functions deploy dreamkeeperHealth --runtime nodejs20 --trigger-http
 */

import { CloudFunctionsFramework } from '@google-cloud/functions-framework';
import type { HttpFunction } from '@google-cloud/functions-framework';

export const dreamkeeperHealth: HttpFunction = async (req, res) => {
  try {
    console.log('🏥 [DreamKeeper] Starting health check...');
    
    // Import DreamKeeper agent
    const { DreamKeeperAgent } = await import('../../server/core/agents/dreamkeeper');
    
    // Run health check
    const result = await DreamKeeperAgent.run(
      { log: console.log, env: process.env },
      { action: 'health-check', target: 'dreamnet' }
    );
    
    console.log('🏥 [DreamKeeper] Health check complete');
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: any) {
    console.error('🏥 [DreamKeeper] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

CloudFunctionsFramework.http('dreamkeeperHealth', dreamkeeperHealth);

