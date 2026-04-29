import { Kafka, Message, Producer, Consumer } from 'kafkajs';
import { connect, NatsConnection, JSONCodec } from 'nats';
import express from 'express';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Schema for validation
const SensorSchema = z.object({
  sensorType: z.string(),
  value: z.number(),
  timestamp: z.string(),
  port: z.string().optional(),
});

const CommandSchema = z.object({
  action: z.string(),
  speed: z.number().optional(),
  duration: z.number().optional(),
  userId: z.string().optional(),
});

const stats = {
  kafkaToNats: 0,
  natsToKafka: 0,
  startTime: new Date(),
  lastError: null as string | null,
};

async function startBridge() {
  const KAFKA_BROKERS = process.env.KAFKA_BOOTSTRAP_SERVERS?.split(',') || ['localhost:9092'];
  const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

  console.log('🦾 Starting DreamNet Event Bridge (The Spine)...');
  console.log(`📍 Kafka: ${KAFKA_BROKERS}`);
  console.log(`📍 NATS: ${NATS_URL}`);

  // 0. Start Health Server
  const app = express();
  app.get('/health', (req, res) => {
    res.json({
      status: 'active',
      uptime: Math.floor((Date.now() - stats.startTime.getTime()) / 1000),
      relays: stats,
      config: {
        kafka: KAFKA_BROKERS,
        nats: NATS_URL
      }
    });
  });
  app.listen(3010, '0.0.0.0', () => {
    console.log('🏥 Health server on port 3010');
  });

  // 1. Initialize NATS
  let nats: NatsConnection;
  try {
    nats = await connect({ servers: NATS_URL });
    console.log('✅ Connected to NATS Spine');
  } catch (err) {
    console.error('❌ Failed to connect to NATS:', err);
    process.exit(1);
  }
  const jc = JSONCodec();

  // 2. Initialize Kafka
  const kafka = new Kafka({
    clientId: 'dreamnet-spine',
    brokers: KAFKA_BROKERS,
  });

  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: 'dreamnet-bridge-group' });

  try {
    await producer.connect();
    await consumer.connect();
    console.log('✅ Connected to Kafka Broker');
  } catch (err) {
    console.error('❌ Failed to connect to Kafka:', err);
    process.exit(1);
  }

  // ========== RELAY: KAFKA (SENSORS) -> NATS (DREAMNET) ==========
  
  await consumer.subscribe({ topic: 'robot-sensors', fromBeginning: false });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;
      
      try {
        const rawData = JSON.parse(message.value.toString());
        const validated = SensorSchema.safeParse(rawData);
        
        if (validated.success) {
          const payload = validated.data;
          const natsSubject = `dreamnet.robot.sensors.${payload.sensorType}`;
          
          nats.publish(natsSubject, jc.encode({
            ...payload,
            source: 'kafka-bridge',
            relay_timestamp: new Date().toISOString()
          }));
          
          stats.kafkaToNats++;
          console.log(`[RELAY] Kafka -> NATS: ${natsSubject} (${payload.value})`);
        }
      } catch (err: any) {
        stats.lastError = err.message;
        console.error('[RELAY ERROR] Failed to forward sensor data:', err);
      }
    },
  });

  // ========== RELAY: NATS (COMMANDS) -> KAFKA (ROBOT) ==========

  const commandSub = nats.subscribe('dreamnet.robot.commands.>');
  (async () => {
    for await (const msg of commandSub) {
      try {
        const rawData = jc.decode(msg.data);
        const validated = CommandSchema.safeParse(rawData);
        
        if (validated.success) {
          const payload = validated.data;
          
          await producer.send({
            topic: 'robot-commands',
            messages: [
              { 
                key: payload.userId || 'system', 
                value: JSON.stringify({
                  ...payload,
                  timestamp: new Date().toISOString(),
                  source: 'nats-bridge'
                }) 
              },
            ],
          });
          
          stats.natsToKafka++;
          console.log(`[RELAY] NATS -> Kafka: robot-commands (${payload.action})`);
        }
      } catch (err: any) {
        stats.lastError = err.message;
        console.error('[RELAY ERROR] Failed to forward command data:', err);
      }
    }
  })();

  // Handle shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down Spine...');
    await consumer.disconnect();
    await producer.disconnect();
    await nats.drain();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startBridge().catch(console.error);
