#!/bin/bash
# startup-realworld-agents.sh
# Start the complete DreamNet agent infrastructure with real-world interaction

set -e

echo "🚀 Starting DreamNet Agent Infrastructure..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Start infrastructure
echo "1️⃣  Starting nervous system (Redis)..."
docker-compose up -d nerve

echo "2️⃣  Starting event bus (NATS)..."
docker-compose up -d nats

echo "3️⃣  Starting telemetry spine (Kafka)..."
docker-compose up -d zookeeper kafka kafka-ui kafka-rest

echo "4️⃣  Starting container interface (Portainer)..."
docker-compose up -d local-manager

# 2. Start intelligence layer
echo "5️⃣  Starting Ollama (LLM reasoning)..."
docker-compose up -d ollama

echo "   ⏳ Waiting for Ollama to be healthy..."
sleep 10

echo "   📦 Pulling models..."
docker exec dreamnet_ollama ollama pull llama2 &
docker exec dreamnet_ollama ollama pull mistral &
wait

# 3. Start orchestration
echo "6️⃣  Starting Control Core (with healing + spawning)..."
docker-compose up -d control-core

echo "   ⏳ Waiting for Control Core..."
sleep 5

# 4. Start Claw enhancement services
echo "7️⃣  Starting ZeroClaw (auto-healing)..."
docker-compose up -d zeroclaw

echo "8️⃣  Starting NanoClaw (rapid spawning)..."
docker-compose up -d nanoclaw

echo "9️⃣  Starting NemoClaw (distributed consensus)..."
docker-compose up -d nemoclaw

# 5. Start real-world gateway
echo "🔟 Starting Agent Gateway (real-world interface)..."
docker-compose up -d agent-gateway

echo "1️⃣1️⃣  Starting Cloudflare Tunnel (internet exposure)..."
docker-compose up -d cloudflare-tunnel

# 6. Start monitoring
echo "1️⃣2️⃣  Starting remaining services..."
docker-compose up -d

echo ""
echo "✅ DreamNet Agent Infrastructure Started!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 DASHBOARDS:"
echo "  • Portainer (Container UI):    http://localhost:9000"
echo "  • Kafka UI (Event telemetry):  http://localhost:8080"
echo "  • Control Core API:            http://localhost:3000/health"
echo ""
echo "🌐 AGENT REAL-WORLD INTERFACES:"
echo "  • Webhook ingestion:           http://localhost:3205/webhooks/:eventType"
echo "  • Agent dispatch:              http://localhost:3205/api/dispatch"
echo "  • Agent spawning:              http://localhost:3205/api/spawn/agents"
echo "  • LLM inference:               http://localhost:3205/api/llm/generate"
echo "  • Real-time telemetry:         ws://localhost:3205/socket.io"
echo ""
echo "☁️  CLOUDFLARE TUNNEL:"
echo "  • Status:                      docker logs dreamnet_cloudflare_tunnel"
echo "  • Update domain in:            .env.cloudflare + cloudflare-tunnel-config.yml"
echo ""
echo "📖 FULL GUIDE:"
echo "  • See: AGENT_REALWORLD_INTERACTION.md"
echo ""
echo "🔧 QUICK TEST:"
echo "  curl -X POST http://localhost:3205/webhooks/test -d '{\"source\":\"test\"}'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 7. Show status
echo ""
echo "📡 Service Status:"
docker-compose ps --services --filter "status=running"

echo ""
echo "✨ Your agents are now live and ready for real-world interactions!"
