#!/bin/sh
# OpenClaw entrypoint — fix permissions + config before starting gateway

OCDIR="/home/node/.openclaw"
CONFIG="$OCDIR/openclaw.json"

# Fix volume ownership (volumes mount as root, OpenClaw runs as node)
chown -R node:node "$OCDIR" 2>/dev/null || true
# Ensure required subdirectories exist with correct ownership
for d in workspace canvas cron; do
  mkdir -p "$OCDIR/$d" 2>/dev/null || true
  chown node:node "$OCDIR/$d" 2>/dev/null || true
done

# Fix known config issues if the file exists
if [ -f "$CONFIG" ]; then
  echo "[entrypoint] Fixing OpenClaw config..."
  node -e "
    const fs = require('fs');
    try {
      const c = JSON.parse(fs.readFileSync('$CONFIG','utf8'));
      let changed = false;
      if (c.agents && c.agents.default) { delete c.agents.default; changed = true; }
      if (c.gateway && c.gateway.auth) { delete c.gateway.auth; changed = true; }
      if (changed) {
        fs.writeFileSync('$CONFIG', JSON.stringify(c, null, 2));
        console.log('[entrypoint] Config fixed');
      } else {
        console.log('[entrypoint] Config OK');
      }
    } catch(e) { console.log('[entrypoint] Config fix skipped:', e.message); }
  "
fi

# Drop to node user and start the gateway
exec su -s /bin/sh node -c "node /app/openclaw.mjs gateway --port 18789 --verbose --allow-unconfigured"
