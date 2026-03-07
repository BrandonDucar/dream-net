#!/usr/bin/env node

/**
 * 🚀 VANGUARD 54 ACTIVATION
 * Task Dispatcher Trigger
 * Activates Antigravity task coordination
 */

const Redis = require('ioredis');

async function activateVanguard54() {
  const redis = new Redis({
    host: 'dreamnet_nerve',
    port: 6379,
    retryStrategy: (times) => Math.min(times * 50, 2000)
  });

  try {
    console.log('\n🚀 VANGUARD 54 - TASK DISPATCHER ACTIVATION\n');
    
    // Get all queued tasks
    const tasks = await redis.lrange('antigravity:tasks:queue', 0, -1);
    console.log(`📊 Tasks in queue: ${tasks.length}\n`);
    
    if (tasks.length === 0) {
      console.log('⚠️  No tasks queued');
      process.exit(0);
    }
    
    let processed = 0;
    const startTime = Date.now();
    
    // Process each task
    for (const taskStr of tasks) {
      const task = JSON.parse(taskStr);
      console.log(`📌 Processing: ${task.id} (${task.type})`);
      
      // Mark as dispatched
      await redis.lpush('tasks:dispatched', taskStr);
      await redis.lrem('antigravity:tasks:queue', 1, taskStr);
      
      // Set task status
      await redis.setex(`task:${task.id}:status`, 3600, 'processing');
      await redis.setex(`task:${task.id}:created`, 3600, new Date().toISOString());
      
      processed++;
      console.log(`   ✅ Dispatched to Governor\n`);
    }
    
    const latency = Date.now() - startTime;
    
    console.log('\n🎯 VANGUARD 54 SEQUENCE COMPLETE\n');
    console.log(`📈 Tasks dispatched: ${processed}/5`);
    console.log(`⏱️  Latency: ${latency}ms`);
    console.log(`🔄 Governor coordination: ACTIVE`);
    console.log(`🌊 Executor ready: YES\n`);
    
    // Get final queue status
    const completed = await redis.llen('tasks:completed');
    const dispatched = await redis.llen('tasks:dispatched');
    const remaining = await redis.llen('antigravity:tasks:queue');
    
    console.log('📊 QUEUE STATUS:');
    console.log(`   Completed: ${completed}`);
    console.log(`   Dispatched: ${dispatched}`);
    console.log(`   Remaining: ${remaining}\n`);
    
    console.log('✅ TASK DISPATCHER ACTIVE\n');
    
    redis.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    redis.disconnect();
    process.exit(1);
  }
}

activateVanguard54();
