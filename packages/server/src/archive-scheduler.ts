#!/usr/bin/env tsx
/**
 * Archive Scheduler
 * 
 * Runs every 6 hours to check for dreams or cocoons with no updates for over 7 days.
 * Automatically sets their stage to "Archived" and logs the activity.
 */

import { storage } from './storage.js';
import { notificationEngine } from './notification-engine.js';

const INACTIVITY_DAYS = parseInt(process.env.INACTIVITY_DAYS_BEFORE_ARCHIVE || '7');
const SCHEDULE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

let schedulerTimeout: NodeJS.Timeout | null = null;

async function runArchiveProcess(): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`🗄️  [${timestamp}] Starting archive process...`);
  console.log(`⏰ Checking for items inactive for ${INACTIVITY_DAYS}+ days`);

  try {
    const result = await storage.archiveInactiveItems(INACTIVITY_DAYS);
    
    console.log(`📊 Archive Results:`);
    console.log(`   Dreams archived: ${result.archivedDreams}`);
    console.log(`   Cocoons archived: ${result.archivedCocoons}`);
    
    if (result.archivedDreams > 0 || result.archivedCocoons > 0) {
      console.log(`✅ Archive process completed successfully`);
      
      // TODO: In a real system, you might want to:
      // - Send summary notification to admin
      // - Log to external monitoring system
      // - Update metrics dashboard
      
    } else {
      console.log(`ℹ️  No items needed archiving`);
    }
    
  } catch (error) {
    console.error(`❌ Archive process failed:`, error);
    
    // TODO: In a real system, you might want to:
    // - Send alert to admin
    // - Log error to monitoring system
    // - Retry with exponential backoff
  }
  
  const nextRun = new Date(Date.now() + SCHEDULE_INTERVAL);
  console.log(`⏰ Next archive check scheduled for: ${nextRun.toISOString()}`);
}

export function startArchiveScheduler(): void {
  console.log(`🚀 Starting archive scheduler...`);
  console.log(`📅 Will run every 6 hours`);
  console.log(`⚙️  Inactivity threshold: ${INACTIVITY_DAYS} days`);
  
  // Run immediately on start
  runArchiveProcess();
  
  // Schedule recurring runs
  schedulerTimeout = setInterval(runArchiveProcess, SCHEDULE_INTERVAL);
  
  console.log(`✅ Archive scheduler started successfully`);
}

export function stopArchiveScheduler(): void {
  if (schedulerTimeout) {
    clearInterval(schedulerTimeout);
    schedulerTimeout = null;
    console.log(`🛑 Archive scheduler stopped`);
  }
}

// Manual trigger function for testing/admin use
export async function triggerArchiveNow(): Promise<{ archivedDreams: number; archivedCocoons: number }> {
  console.log(`🔧 Manual archive trigger activated`);
  const result = await storage.archiveInactiveItems(INACTIVITY_DAYS);
  console.log(`📊 Manual archive completed: ${result.archivedDreams} dreams, ${result.archivedCocoons} cocoons`);
  return result;
}

// Status function
export function getSchedulerStatus(): {
  running: boolean;
  inactivityDays: number;
  intervalHours: number;
  nextRunEstimate?: Date;
} {
  return {
    running: schedulerTimeout !== null,
    inactivityDays: INACTIVITY_DAYS,
    intervalHours: 6,
    nextRunEstimate: schedulerTimeout ? new Date(Date.now() + SCHEDULE_INTERVAL) : undefined
  };
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n🛑 Received SIGINT, stopping archive scheduler...`);
  stopArchiveScheduler();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n🛑 Received SIGTERM, stopping archive scheduler...`);
  stopArchiveScheduler();
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  console.log(`
📦 Dream Network Archive Scheduler
==================================
Configuration:
- Inactivity threshold: ${INACTIVITY_DAYS} days
- Check interval: 6 hours
- Environment: ${process.env.NODE_ENV || 'development'}

Starting scheduler...
  `);
  
  startArchiveScheduler();
  
  // Keep process alive
  process.stdin.resume();
}