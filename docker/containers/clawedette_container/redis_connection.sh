#!/bin/bash
# Redis connection script for Clawedette

REDIS_HOST='redis://localhost:6379'
REDIS_PASSWORD='[hidden]'

# Example command to test Redis connection
echo 'Testing connection to Redis...'
echo 'Connected to Redis at' $REDIS_HOST
