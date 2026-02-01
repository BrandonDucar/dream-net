/**
 * Cloud Function: EnvKeeper Sync
 * 
 * Syncs environment variables from Secret Manager
 * Triggered by Cloud Scheduler (every 10 minutes)
 * 
 * Deploy: gcloud functions deploy envkeeperSync --runtime nodejs20 --trigger-http
 */

import { CloudFunctionsFramework } from '@google-cloud/functions-framework';
import type { HttpFunction } from '@google-cloud/functions-framework';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export const envkeeperSync: HttpFunction = async (req, res) => {
  try {
    console.log('🔐 [EnvKeeper] Starting sync...');
    
    const client = new SecretManagerServiceClient();
    const projectId = process.env.GCP_PROJECT_ID || 'aqueous-tube-470317-m6';
    
    // List all secrets
    const [secrets] = await client.listSecrets({
      parent: `projects/${projectId}`,
    });
    
    const synced: string[] = [];
    
    for (const secret of secrets) {
      const secretName = secret.name?.split('/').pop();
      if (!secretName) continue;
      
      try {
        // Get latest version
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
        });
        
        const value = version.payload?.data?.toString();
        if (value) {
          // Set environment variable
          process.env[secretName] = value;
          synced.push(secretName);
        }
      } catch (error) {
        console.warn(`Failed to sync secret ${secretName}:`, error);
      }
    }
    
    console.log(`🔐 [EnvKeeper] Synced ${synced.length} secrets`);
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      secretsSynced: synced.length,
      secrets: synced,
    });
  } catch (error: any) {
    console.error('🔐 [EnvKeeper] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

CloudFunctionsFramework.http('envkeeperSync', envkeeperSync);

