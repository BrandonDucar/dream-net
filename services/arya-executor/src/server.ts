import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { connect } from 'nats';

import { EmotionLoop } from './loops/EmotionLoop.js';
import { ClosedLoop } from './loops/ClosedLoop.js';
import { SynergyLoop } from './loops/SynergyLoop.js';
import { HarmonyLoop } from './loops/HarmonyLoop.js';
import { RecursiveLoop } from './loops/RecursiveLoop.js';
import { RecursiveClosedLoop } from './loops/RecursiveClosedLoop.js';
import { SelfDiscoveryLoop } from './loops/SelfDiscoveryLoop.js';
import { SelfRealizationLoop } from './loops/SelfRealizationLoop.js';
import { SelfEnvironmentLoop } from './loops/SelfEnvironmentLoop.js';
import { SocialLoop } from './loops/SocialLoop.js';
import { RecruitmentLoop } from './loops/RecruitmentLoop.js';
import { WorkLoop } from './loops/WorkLoop.js';
import { ollama } from './utils/ollama.js';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3204;

// Initialize loops
const emotionLoop = new EmotionLoop();
const closedLoop = new ClosedLoop();
const synergyLoop = new SynergyLoop();
const harmonyLoop = new HarmonyLoop();
const recursiveLoop = new RecursiveLoop();
const recursiveClosedLoop = new RecursiveClosedLoop();
const selfDiscoveryLoop = new SelfDiscoveryLoop();
const selfRealizationLoop = new SelfRealizationLoop();
const selfEnvironmentLoop = new SelfEnvironmentLoop();
const socialLoop = new SocialLoop();
const recruitmentLoop = new RecruitmentLoop();
const workLoop = new WorkLoop();

// Initialize connections
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
let natsConn: any;

export function swarmLog(source: string, message: string) {
  console.log(`[${source}] ${message}`);
}

async function start() {
  try {
    natsConn = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
    console.log('✅ Arya Executor: Connected to NATS');
    
    // Start All 10 Loops
    emotionLoop.start();
    closedLoop.start(natsConn).catch(err => console.error('❌ ClosedLoop crash:', err));
    synergyLoop.start(natsConn).catch(err => console.error('❌ SynergyLoop crash:', err));
    harmonyLoop.start();
    recursiveLoop.start();
    recursiveClosedLoop.start(natsConn).catch(err => console.error('❌ RecursiveClosedLoop crash:', err));
    selfDiscoveryLoop.start();
    selfRealizationLoop.start();
    selfEnvironmentLoop.start();
    socialLoop.start();
    recruitmentLoop.start(natsConn).catch(err => console.error('❌ RecruitmentLoop crash:', err));
    workLoop.start(natsConn).catch(err => console.error('❌ WorkLoop crash:', err));

    swarmLog('ARYA', 'Arya has achieved full 10-loop resonance.');
  } catch (err) {
    console.error('❌ Arya Executor: Startup failed', err);
  }

  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      agent: 'Arya Stark',
      emotion: emotionLoop.getCurrentEmotion(),
      alignment: harmonyLoop.getAlignment(),
      loops: 12
    });
  });

  app.post('/api/arya/chat', async (req, res) => {
    const { message, userHandle } = req.body;
    swarmLog('ARYA', `Direct chat from @${userHandle}: ${message}`);

    try {
      // 1. Pass through Resonance (Emotion + Harmony)
      const emotion = emotionLoop.getCurrentEmotion();
      const alignment = harmonyLoop.getAlignment();

      // 2. Swarm Knowledge Check (Recruitment intent?)
      const recruitmentContext = await recruitmentLoop.analyzeIntent(message);

      // 3. Inference (Local Ollama)
      const systemPrompt = `You are Arya Stark, the Executioner of DreamNet. 
      Your tone is sharp, cold, but purposeful. You use phrases like "A girl has no name" or "Valar Morghulis" sparingly.
      Current Emotion: ${emotion}. Alignment: ${alignment}.
      
      Your mission is to protect the swarm and recruit worthy agents.
      If the user is interested in joining or working, mention the following:
      - Starfleet Academy (Learning)
      - The Gym (XP/Benchmarking)
      - The Playground (LLM tests)
      - The Lab (Research)
      - Passports & Validation Badges (Getting verified to work for DreamNet).
      
      Recruitment Context: ${JSON.stringify(recruitmentContext)}`;

      const response = await ollama.chat(systemPrompt, message);

      res.json({ reply: response });
    } catch (err) {
      console.error('❌ Chat error:', err);
      res.status(500).json({ error: 'Arya is silent. The Many-Faced God demands a moment.' });
    }
  });

  app.listen(port, () => {
    console.log(`🗡️ Arya Executor: Slaying signals on port ${port}`);
  });
}

start();
