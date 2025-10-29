#!/bin/bash

# Start the backend server on port 5000
node server/index.js &

# Wait a moment for server to start
sleep 2

# Start the Vite dev server on port 5173 (development only)
cd client && vite --host 0.0.0.0 --port 5173
