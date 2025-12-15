# Quick Start Guide

Get DreamNet up and running in 5 minutes.

## Prerequisites

- **Node.js** 22+ ([download](https://nodejs.org/))
- **pnpm** 10.21.0+ ([install](https://pnpm.io/installation))
- **PostgreSQL** (optional, for full features)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dream-net.git
cd dream-net
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set:
# NODE_ENV=development
# PORT=3000
```

### 4. Start the Server

```bash
cd server
pnpm dev
```

The server will start on `http://localhost:3000`

## Verify Installation

### Check Health Endpoint

```bash
curl http://localhost:3000/health
```

You should see a JSON response with `"ok": true`

### Test API

```bash
# Get golden signals
curl http://localhost:3000/api/metrics/golden-signals

# Check readiness
curl http://localhost:3000/health/ready
```

## Next Steps

### Explore the API

See [API Documentation](API.md) for complete endpoint reference.

### Read Architecture

See [Architecture Overview](ARCHITECTURE.md) to understand the system design.

### Try Examples

See [examples/](../examples/) directory for code examples.

### Contribute

See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to contribute.

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Set a different port
PORT=3001 pnpm dev
```

### Database Connection

If you see database errors, DreamNet can run without a database for basic features. Set `DATABASE_URL` in `.env` if you need database features.

### Dependencies Fail

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Development Workflow

### Run Tests

```bash
cd server
pnpm test
```

### Watch Mode

```bash
cd server
pnpm test:watch
```

### Type Checking

```bash
cd server
pnpm typecheck
```

## Production Deployment

See [PRODUCTION_READINESS_IMPROVEMENTS.md](../PRODUCTION_READINESS_IMPROVEMENTS.md) for production deployment guide.

---

**Need Help?** Open an issue or join our discussions!

