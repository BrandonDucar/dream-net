#!/usr/bin/env bash
set -e
corepack enable
pnpm -v || npm i -g pnpm
pnpm install --frozen-lockfile || npm install
