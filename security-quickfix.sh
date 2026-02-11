#!/bin/bash
set -e

echo "🔒 DreamNet Security Quick-Fix Script"
echo "========================================"
echo ""

# Pull updated images with security patches
echo "📦 Pulling updated images..."
docker pull redis:alpine
docker pull nats:alpine  
docker pull quay.io/coreos/etcd:latest
docker pull qdrant/qdrant:latest
docker pull portainer/portainer-ce:latest

echo ""
echo "✅ Image updates complete"
echo ""

# Identify containers needing restart
echo "🔍 Identifying containers needing restart..."
CONTAINERS_TO_RESTART=$(docker ps --format "{{.Names}}" | grep -E "redis|nats|etcd|qdrant|portainer")

if [ -z "$CONTAINERS_TO_RESTART" ]; then
  echo "ℹ️  No containers currently running from updated images"
else
  echo "📋 Containers to restart:"
  echo "$CONTAINERS_TO_RESTART"
  echo ""
  
  read -p "🚨 Restart these containers now? (y/N): " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Restarting containers..."
    for container in $CONTAINERS_TO_RESTART; do
      echo "  - Restarting $container..."
      docker restart $container
    done
    echo "✅ Container restarts complete"
  else
    echo "⏸️  Skipping container restarts (manual restart required)"
  fi
fi

echo ""
echo "🛡️ Generating docker-socket-proxy configuration..."
cat > docker-socket-proxy.yml << 'EOF'
version: '3.8'

services:
  docker-socket-proxy:
    image: tecnativa/docker-socket-proxy:latest
    container_name: docker-socket-proxy
    environment:
      - CONTAINERS=1
      - IMAGES=1
      - INFO=1
      - NETWORKS=1
      - VOLUMES=1
      - POST=0  # Disable write operations
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - docker-proxy
    restart: unless-stopped

networks:
  docker-proxy:
    driver: bridge
EOF

echo "✅ Created docker-socket-proxy.yml"
echo ""

echo "🔐 Generating security hardening template..."
cat > docker-compose.security-hardened.yml << 'EOF'
version: '3.8'

# Security Hardening Template
# Apply these settings to your containers:

x-security-defaults: &security-defaults
  security_opt:
    - no-new-privileges:true
  cap_drop:
    - ALL
  cap_add:
    - CHOWN
    - SETUID
    - SETGID
  read_only: true
  tmpfs:
    - /tmp:noexec,nosuid,nodev

services:
  example-hardened-service:
    <<: *security-defaults
    image: your-image:latest
    user: "1000:1000"  # Non-root user
    volumes:
      - data-volume:/data:ro  # Read-only where possible
EOF

echo "✅ Created docker-compose.security-hardened.yml"
echo ""

echo "📊 Security Quick-Fix Summary:"
echo "=============================="
echo "✅ Updated 5 base images (redis, nats, etcd, qdrant, portainer)"
echo "✅ Generated docker-socket-proxy.yml"
echo "✅ Generated security hardening template"
echo ""
echo "📝 Next Steps:"
echo "1. Review vulnerability-scan-report.md for detailed findings"
echo "2. Restart containers when ready (or rerun script with 'y' at prompt)"
echo "3. Deploy docker-socket-proxy: docker compose -f docker-socket-proxy.yml up -d"
echo "4. Apply security hardening template to custom images"
echo "5. Rebuild custom dream-net images with updated dependencies"
echo ""
echo "⏱️  Estimated time for full hardening: 5-6 hours"
echo "🔒 Security quick-fix complete!"
