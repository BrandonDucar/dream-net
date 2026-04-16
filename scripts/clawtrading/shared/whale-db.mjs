/**
 * shared/whale-db.mjs
 *
 * Whale Scrubber — Persistent storage for tracking the biggest traders
 * across every market (crypto, equities, options, forex, on-chain).
 *
 * Tables:
 *   whale_traders       — known big trader profiles (name, alias, wallets, style)
 *   whale_trades        — every scraped trade event (market, instrument, size, side)
 *   whale_simulations   — results from Mirofish and Tartarian sim engines
 *   whale_signals       — actionable signals derived from whale activity
 */
import pkg from "pg";
const { Pool } = pkg;
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });

let pool = null;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    pool.on("error", (err) => console.error("[WHALE-DB] Pool error:", err.message));
  }
  return pool;
}

export async function initWhaleDB() {
  const p = getPool();
  if (!p) { console.warn("[WHALE-DB] No DATABASE_URL — persistence disabled"); return false; }
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS whale_traders (
        id            BIGSERIAL PRIMARY KEY,
        alias         TEXT NOT NULL UNIQUE,       -- "BELFORT", "SBF", "DRUNKENMILLER"
        real_name     TEXT,
        style         TEXT,                       -- "pump_dump", "momentum", "macro", "arb", "quant"
        markets       TEXT[],                     -- ["crypto","equities","options","forex"]
        known_wallets TEXT[],                     -- on-chain addresses if known
        known_brokers TEXT[],                     -- off-chain: "Robinhood", "Interactive Brokers"
        bio           TEXT,
        risk_level    TEXT DEFAULT 'extreme',      -- "tame", "aggressive", "extreme", "unhinged"
        active        BOOLEAN DEFAULT true,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS whale_trades (
        id            BIGSERIAL PRIMARY KEY,
        trader_alias  TEXT NOT NULL,
        market        TEXT NOT NULL,              -- "crypto","equities","options","forex","nft","onchain"
        instrument    TEXT NOT NULL,              -- "BTC","TSLA","SPY 500C","MATIC","BAYC"
        side          TEXT NOT NULL,              -- "BUY","SELL","LONG","SHORT","LIQUIDATE"
        size_usd      NUMERIC,
        price         NUMERIC,
        dex_or_venue  TEXT,                       -- "Binance","Uniswap","NYSE","CBOE"
        tx_hash       TEXT,                       -- on-chain only
        source        TEXT,                       -- "onchain","twitter","arkham","nansen","manual","whale_alert"
        confidence    NUMERIC DEFAULT 0.8,
        raw_data      JSONB,
        traded_at     TIMESTAMPTZ,
        scraped_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS whale_simulations (
        id            BIGSERIAL PRIMARY KEY,
        trader_alias  TEXT NOT NULL,
        sim_engine    TEXT NOT NULL,              -- "mirofish","tartarian","genie"
        input_trades  JSONB,                      -- array of whale_trade ids or snapshot
        result        JSONB,                      -- full sim output
        pattern       TEXT,                       -- top detected pattern
        forecast      TEXT,                       -- what sim predicts next
        confidence    NUMERIC,
        ran_at        TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS whale_signals (
        id            BIGSERIAL PRIMARY KEY,
        trader_alias  TEXT NOT NULL,
        signal_type   TEXT NOT NULL,              -- "FOLLOW","FADE","WATCH","ALERT"
        instrument    TEXT,
        reasoning     TEXT,
        strength      NUMERIC,
        source_sim    TEXT,                       -- which sim generated this
        expires_at    TIMESTAMPTZ,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_whale_trades_alias ON whale_trades(trader_alias);
      CREATE INDEX IF NOT EXISTS idx_whale_trades_market ON whale_trades(market);
      CREATE INDEX IF NOT EXISTS idx_whale_trades_traded_at ON whale_trades(traded_at DESC);
    `);
    console.log("[WHALE-DB] Tables ready");
    return true;
  } catch (err) {
    console.error("[WHALE-DB] Init error:", err.message);
    return false;
  }
}

export async function upsertTrader(trader) {
  const p = getPool(); if (!p) return;
  const { alias, realName, style, markets, knownWallets, knownBrokers, bio, riskLevel } = trader;
  try {
    await p.query(`
      INSERT INTO whale_traders (alias, real_name, style, markets, known_wallets, known_brokers, bio, risk_level, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
      ON CONFLICT (alias) DO UPDATE SET
        real_name=EXCLUDED.real_name, style=EXCLUDED.style, markets=EXCLUDED.markets,
        known_wallets=EXCLUDED.known_wallets, bio=EXCLUDED.bio, updated_at=NOW()
    `, [alias, realName, style, markets, knownWallets || [], knownBrokers || [], bio, riskLevel || "extreme"]);
  } catch (err) { console.error("[WHALE-DB] upsertTrader:", err.message); }
}

export async function logWhaleTrade(trade) {
  const p = getPool(); if (!p) return null;
  try {
    const { rows } = await p.query(`
      INSERT INTO whale_trades (trader_alias, market, instrument, side, size_usd, price, dex_or_venue, tx_hash, source, confidence, raw_data, traded_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id
    `, [trade.traderAlias, trade.market, trade.instrument, trade.side, trade.sizeUsd,
        trade.price, trade.venue, trade.txHash, trade.source, trade.confidence ?? 0.8,
        JSON.stringify(trade.rawData ?? {}), trade.tradedAt ? new Date(trade.tradedAt) : new Date()]);
    return rows[0]?.id;
  } catch (err) { console.error("[WHALE-DB] logWhaleTrade:", err.message); return null; }
}

export async function logSimulation({ traderAlias, simEngine, inputTrades, result, pattern, forecast, confidence }) {
  const p = getPool(); if (!p) return;
  try {
    await p.query(`
      INSERT INTO whale_simulations (trader_alias, sim_engine, input_trades, result, pattern, forecast, confidence)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `, [traderAlias, simEngine, JSON.stringify(inputTrades), JSON.stringify(result), pattern, forecast, confidence]);
  } catch (err) { console.error("[WHALE-DB] logSimulation:", err.message); }
}

export async function logWhaleSignal({ traderAlias, signalType, instrument, reasoning, strength, sourceSim, expiresAt }) {
  const p = getPool(); if (!p) return;
  try {
    await p.query(`
      INSERT INTO whale_signals (trader_alias, signal_type, instrument, reasoning, strength, source_sim, expires_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `, [traderAlias, signalType, instrument, reasoning, strength, sourceSim, expiresAt ? new Date(expiresAt) : null]);
  } catch (err) { console.error("[WHALE-DB] logWhaleSignal:", err.message); }
}

export async function getTraderHistory(alias, limit = 100) {
  const p = getPool(); if (!p) return [];
  try {
    const { rows } = await p.query(
      `SELECT * FROM whale_trades WHERE trader_alias=$1 ORDER BY traded_at DESC LIMIT $2`,
      [alias, limit]
    );
    return rows;
  } catch { return []; }
}

export async function getActiveSignals() {
  const p = getPool(); if (!p) return [];
  try {
    const { rows } = await p.query(
      `SELECT * FROM whale_signals WHERE (expires_at IS NULL OR expires_at > NOW()) ORDER BY created_at DESC LIMIT 50`
    );
    return rows;
  } catch { return []; }
}

export async function getAllTraders() {
  const p = getPool(); if (!p) return [];
  try {
    const { rows } = await p.query(`SELECT * FROM whale_traders WHERE active=true ORDER BY alias`);
    return rows;
  } catch { return []; }
}
