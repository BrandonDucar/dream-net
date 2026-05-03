# startup-realworld-agents.ps1
# Start the complete DreamNet agent infrastructure with real-world interaction (Windows)

Write-Host "🚀 Starting DreamNet Agent Infrastructure..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# 1. Start infrastructure
Write-Host "1️⃣  Starting nervous system (Redis)..." -ForegroundColor Yellow
docker-compose up -d nerve

Write-Host "2️⃣  Starting event bus (NATS)..." -ForegroundColor Yellow
docker-compose up -d nats

Write-Host "3️⃣  Starting telemetry spine (Kafka)..." -ForegroundColor Yellow
docker-compose up -d zookeeper kafka kafka-ui kafka-rest

Write-Host "4️⃣  Starting container interface (Portainer)..." -ForegroundColor Yellow
docker-compose up -d local-manager

# 2. Start intelligence layer
Write-Host "5️⃣  Starting Ollama (LLM reasoning)..." -ForegroundColor Yellow
docker-compose up -d ollama

Write-Host "   ⏳ Waiting for Ollama to be healthy..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host "   📦 Pulling models..." -ForegroundColor Gray
docker exec dreamnet_ollama ollama pull llama2
docker exec dreamnet_ollama ollama pull mistral

# 3. Start orchestration
Write-Host "6️⃣  Starting Control Core (with healing + spawning)..." -ForegroundColor Yellow
docker-compose up -d control-core

Write-Host "   ⏳ Waiting for Control Core..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 4. Start Claw enhancement services
Write-Host "7️⃣  Starting ZeroClaw (auto-healing)..." -ForegroundColor Yellow
docker-compose up -d zeroclaw

Write-Host "8️⃣  Starting NanoClaw (rapid spawning)..." -ForegroundColor Yellow
docker-compose up -d nanoclaw

Write-Host "9️⃣  Starting NemoClaw (distributed consensus)..." -ForegroundColor Yellow
docker-compose up -d nemoclaw

# 5. Start real-world gateway
Write-Host "🔟 Starting Agent Gateway (real-world interface)..." -ForegroundColor Yellow
docker-compose up -d agent-gateway

Write-Host "1️⃣1️⃣  Starting Cloudflare Tunnel (internet exposure)..." -ForegroundColor Yellow
docker-compose up -d cloudflare-tunnel

# 6. Start monitoring
Write-Host "1️⃣2️⃣  Starting remaining services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "✅ DreamNet Agent Infrastructure Started!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

Write-Host ""
Write-Host "📊 DASHBOARDS:" -ForegroundColor Cyan
Write-Host "  • Portainer (Container UI):    http://localhost:9000"
Write-Host "  • Kafka UI (Event telemetry):  http://localhost:8080"
Write-Host "  • Control Core API:            http://localhost:3000/health"

Write-Host ""
Write-Host "🌐 AGENT REAL-WORLD INTERFACES:" -ForegroundColor Cyan
Write-Host "  • Webhook ingestion:           http://localhost:3205/webhooks/:eventType"
Write-Host "  • Agent dispatch:              http://localhost:3205/api/dispatch"
Write-Host "  • Agent spawning:              http://localhost:3205/api/spawn/agents"
Write-Host "  • LLM inference:               http://localhost:3205/api/llm/generate"
Write-Host "  • Real-time telemetry:         ws://localhost:3205/socket.io"

Write-Host ""
Write-Host "☁️  CLOUDFLARE TUNNEL:" -ForegroundColor Cyan
Write-Host "  • Status:                      docker logs dreamnet_cloudflare_tunnel"
Write-Host "  • Update domain in:            .env.cloudflare + cloudflare-tunnel-config.yml"

Write-Host ""
Write-Host "📖 FULL GUIDE:" -ForegroundColor Cyan
Write-Host "  • See: AGENT_REALWORLD_INTERACTION.md"

Write-Host ""
Write-Host "🔧 QUICK TEST:" -ForegroundColor Yellow
Write-Host "  curl -X POST http://localhost:3205/webhooks/test -d '{\"source\":\"test\"}'"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host ""
Write-Host "📡 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✨ Your agents are now live and ready for real-world interactions!" -ForegroundColor Green
