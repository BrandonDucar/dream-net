#!/bin/bash
set -e

# Enable corepack and prepare pnpm
corepack enable pnpm
corepack prepare pnpm@10.21.0 --activate

# Install dependencies
pnpm install

# Build the application
pnpm build

