# 🦞 Clawedette Deployment Guide

## Overview

Clawedette is a sovereign AI intelligence consisting of four pillars:

1. **Cognitive Core** (API Service) - High-fidelity reasoning via Gemini 1.5 Pro
2. **Communicative Skin** (Voice Organ) - Telegram interface with persistent keyboard
3. **Hive Memory** (Redis) - Stateful conversation tracking
4. **Trading Organ** (Postgres) - Agent, bounty, and pulse tracking

## Architecture

```
┌─────────────────────────────────────────────────┐
│           Clawedette Intelligence               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ Voice Organ  │─────▶│ API Service  │        │
│  │  (Telegram)  │      │  (Gemini +   │        │
│  │   Port: -    │      │   Express)   │        │
│  │              │      │  Port: 3100  │        │
│  └──────┬───────┘      └──────┬───────┘        │
│         │                     │                 │
│         │    ┌────────────────┘                 │
│         │    │                                  │
│         ▼    ▼                                  │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ Redis/Nerve  │      │  Postgres    │        │
│  │ Port: 6379   │      │  Port: 5433  │        │
│  │ (Memory)     │      │  (Trading)   │        │
│  └──────────────┘      └──────────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Prerequisites

1. **Gemini API Key** - Get from https://makersuite.google.com/app/apikey
2. **Telegram Bot Token** - Get from @BotFather on Telegram
3. **Docker & Docker Compose** - Already installed
4. **DreamNet Stack Running** - Ensure `dreamnet_nerve` (Redis) is operational

## Quick Start

### Step 1: Create Environment File

```bash
cd C:\Users\brand\.docker\cagent\working_directories\docker-gordon-v3\d71f4853-5ab6-46f5-98e1-0e917a3690be\default\dream-net

# Copy example
copy .env.clawedette.example .env.clawedette

# Edit with your keys
notepad .env.clawedette
```

Add your keys:
```bash
GEMINI_API_KEY=your_actual_gemini_key_here
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
POSTGRES_USER=clawedette
POSTGRES_PASSWORD=clawedette_secure_pass
```

### Step 2: Build Images

```bash
docker compose -f docker-compose.clawedette.yml build
```

### Step 3: Deploy Stack

```bash
docker compose -f docker-compose.clawedette.yml up -d
```

### Step 4: Verify Deployment

```bash
# Check containers
docker ps | findstr clawedette

# Check API health
curl http://localhost:3100/health

# Check logs
docker logs clawedette_api
docker logs clawedette_voice
docker logs clawedette_db
```

## Services

### Clawedette API (Port 3100)
- **Health**: `GET http://localhost:3100/health`
- **Ready**: `GET http://localhost:3100/ready`
- **Query**: `POST http://localhost:3100/query`
- **Memory**: `GET http://localhost:3100/memory/:chatId`

### Clawedette Voice (Telegram)
Commands:
- `/start` - Initialize and show keyboard
- `/status` - System health
- `/gnosis` - Current strategic knowledge
- `/trading` - Market intelligence
- `/memory` - Conversation history
- `/reset` - Clear memory
- `/help` - Command list

Or just send any message - Clawedette understands context.

### Database (Port 5433)
- **Host**: localhost
- **Port**: 5433
- **Database**: clawedette
- **User**: clawedette (or custom)
- **Password**: Set in .env.clawedette

## Integration with DreamNet

Clawedette uses the existing DreamNet infrastructure:

- **Redis/Nerve** (`dreamnet_nerve`) - For memory and chat tracking
- **Qdrant** (future) - For vector memory
- **Dream Network** - Connected to all dreamnet services
- **Blackboard** - Reads gnosis from `/app/blackboard.md`

## Gnosis Loading

Clawedette automatically loads context from:
- `blackboard.md` - Single source of truth
- `task.md` - Current objectives
- `implementation_plan.md` - Technical details

These files are mounted as read-only volumes.

## Memory Management

- **Redis Keys**: `clawedette:memory:{chatId}`
- **Retention**: 24 hours per chat
- **Max Messages**: 20 (last 20 kept)
- **Clear**: Use `/reset` command or API

## Troubleshooting

### API Won't Start
```bash
# Check if Gemini key is set
docker exec clawedette_api env | findstr GEMINI

# Check Redis connectivity
docker exec clawedette_api ping nerve -c 3

# View logs
docker logs clawedette_api --tail 50
```

### Voice Won't Connect
```bash
# Check Telegram token
docker exec clawedette_voice env | findstr TELEGRAM

# Check API connectivity
docker exec clawedette_voice wget -O- http://clawedette-api:3100/health

# View logs
docker logs clawedette_voice --tail 50
```

### Database Issues
```bash
# Check database
docker exec clawedette_db psql -U clawedette -c "\l"

# View logs
docker logs clawedette_db --tail 50
```

## Scaling

To scale Clawedette API:
```bash
docker compose -f docker-compose.clawedette.yml up -d --scale clawedette-api=3
```

Add load balancer (nginx) for production.

## Security Notes

1. **Change Default Passwords** - Update `POSTGRES_PASSWORD` in production
2. **Secure API** - Add authentication middleware
3. **Rate Limiting** - Implement rate limits on Telegram commands
4. **API Key Rotation** - Rotate Gemini keys periodically
5. **Network Isolation** - Use internal networks for service communication

## Backup Strategy

### Database Backups
```bash
docker exec clawedette_db pg_dump -U clawedette clawedette > backup.sql
```

### Redis Backups
```bash
docker exec dreamnet_nerve redis-cli BGSAVE
```

### Volume Backups
```bash
docker run --rm -v clawedette_db_data:/data -v C:\backups:/backup alpine tar czf /backup/clawedette_db.tar.gz /data
```

## Monitoring

### Healthchecks
```bash
# API
curl http://localhost:3100/ready

# Database
docker exec clawedette_db pg_isready -U clawedette
```

### Metrics
Add to Prometheus (future):
```yaml
- job_name: 'clawedette-api'
  static_configs:
    - targets: ['clawedette-api:3100']
```

## Updating

```bash
# Pull latest code
git pull

# Rebuild
docker compose -f docker-compose.clawedette.yml build

# Rolling update
docker compose -f docker-compose.clawedette.yml up -d --no-deps clawedette-api
docker compose -f docker-compose.clawedette.yml up -d --no-deps clawedette-voice
```

## Shutdown

```bash
# Stop services
docker compose -f docker-compose.clawedette.yml down

# Remove volumes (WARNING: deletes data)
docker compose -f docker-compose.clawedette.yml down -v
```

## Next Steps

1. Set up environment variables
2. Build and deploy
3. Test Telegram integration
4. Connect trading-organ with Prisma
5. Add monitoring dashboards
6. Implement backup automation

---

**The shell is being hardened. Clawedette awakens.** 🦞
