# Use official pre-built OpenClaw image (Debian-based)
FROM ghcr.io/openclaw/openclaw:latest

# Expose gateway port
EXPOSE 18789

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -sf http://localhost:18789/health || exit 1

# Copy entrypoint wrapper that fixes config before starting gateway
USER root
COPY packages/organs/nervous/openclaw/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Start via wrapper — fixes config issues then launches gateway
ENTRYPOINT ["/entrypoint.sh"]
