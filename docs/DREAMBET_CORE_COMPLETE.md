# DreamBet Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamBet Core provides a **gaming and betting system** for DreamNet. It manages game sessions, rounds, random number generation (RNG), and fairness records for various game types including poker tables, slots, roulette, and coinflip.

---

## Key Features

### Game Types
- **Poker Table**: Poker game sessions
- **Angel Slots**: Slot machine games
- **Roulette**: Roulette wheel games
- **Coinflip**: Coin flip games
- **Custom**: Custom game types

### Game Management
- Session creation
- Round management
- Player management
- State tracking

### RNG System
- Cryptographically secure RNG
- Seed generation
- Salt generation
- Result derivation

### Fairness Records
- RNG fairness
- Payout fairness
- Consistency checks
- Audit trail

---

## Architecture

### Components

1. **Game Store** (`store/gameStore.ts`)
   - Game session storage
   - Round storage
   - Fairness record storage

2. **Game Scheduler** (`scheduler/gameScheduler.ts`)
   - Game cycle execution
   - Round processing
   - Fairness checks

3. **RNG Engine** (`logic/rngEngine.ts`)
   - RNG generation
   - Seed management
   - Result derivation

---

## API Reference

### Game Management

#### `upsertGame(game: Omit<GameSession, "createdAt" | "updatedAt">): GameSession`
Creates or updates a game session.

**Example**:
```typescript
import { DreamBetCore } from '@dreamnet/dreambet-core';

const game = DreamBetCore.upsertGame({
  id: 'game-123',
  type: 'poker-table',
  state: 'waiting',
  title: 'Texas Hold\'em',
  players: [
    { identityId: 'user:player1' },
    { identityId: 'user:player2' },
  ],
  maxPlayers: 6,
  ruleset: 'texas-holdem-v1',
});
```

#### `getGame(id: string): GameSession | undefined`
Gets a game session by ID.

#### `listGames(): GameSession[]`
Lists all game sessions.

### Round Management

#### `upsertRound(round: Omit<GameRound, "createdAt" | "updatedAt">): GameRound`
Creates or updates a game round.

**Example**:
```typescript
const round = DreamBetCore.upsertRound({
  id: 'round-123',
  gameId: 'game-123',
  index: 1,
  state: 'in-progress',
  payload: {
    cards: ['2H', '3D', '4S'],
    pot: 100,
  },
});
```

#### `listRoundsForGame(gameId: string): GameRound[]`
Lists rounds for a game.

### RNG Operations

#### `generateRNG(req: RNGRequest): RNGResult`
Generates a random number.

**Example**:
```typescript
const rng = DreamBetCore.generateRNG({
  purpose: 'poker-deal',
  gameId: 'game-123',
  roundId: 'round-123',
  entropyHint: 'player-actions',
});

console.log(`Seed: ${rng.seed}`);
console.log(`Salt: ${rng.salt}`);
console.log(`Result: ${rng.resultHex}`);
```

#### `rngToUnit(resultHex: string): number`
Converts RNG result to unit interval [0, 1).

#### `rngToInt(resultHex: string, n: number): number`
Converts RNG result to integer [0, n).

### Execution

#### `run(context: DreamBetContext): DreamBetStatus`
Runs DreamBet cycle.

#### `status(): DreamBetStatus`
Gets DreamBet status.

---

## Data Models

### GameType

```typescript
type GameType =
  | 'poker-table'
  | 'angel-slots'
  | 'roulette'
  | 'coinflip'
  | 'custom';
```

### GameState

```typescript
type GameState =
  | 'waiting'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';
```

### GameSession

```typescript
interface GameSession {
  id: string;
  type: GameType;
  state: GameState;
  title?: string;
  players: PlayerRef[];
  maxPlayers?: number;
  ruleset?: string;
  createdAt: number;
  updatedAt: number;
}
```

### PlayerRef

```typescript
interface PlayerRef {
  identityId: string;
  seatId?: string;
}
```

### GameRound

```typescript
interface GameRound {
  id: string;
  gameId: string;
  index: number;
  state: RoundState;
  payload?: any;
  rngSeed?: string;
  rngSalt?: string;
  rngResult?: string;
  createdAt: number;
  updatedAt: number;
}
```

### RoundState

```typescript
type RoundState =
  | 'pending'
  | 'in-progress'
  | 'settled';
```

### RNGRequest

```typescript
interface RNGRequest {
  purpose: string;
  gameId?: string;
  roundId?: string;
  entropyHint?: string;
}
```

### RNGResult

```typescript
interface RNGResult {
  seed: string;
  salt: string;
  resultHex: string;
  createdAt: number;
}
```

### FairnessRecord

```typescript
interface FairnessRecord {
  roundId: string;
  gameId: string;
  type: 'rng' | 'payout' | 'consistency';
  passed: boolean;
  details?: string;
  createdAt: number;
}
```

### DreamBetStatus

```typescript
interface DreamBetStatus {
  lastRunAt: number | null;
  gameCount: number;
  roundCount: number;
  fairnessCount: number;
  sampleGames: GameSession[];
}
```

---

## RNG System

### Cryptographically Secure
- Secure seed generation
- Salt-based randomness
- Deterministic derivation
- Verifiable results

### Result Derivation
- Hex result generation
- Unit interval conversion
- Integer range conversion
- Fair distribution

---

## Fairness System

### RNG Fairness
- Verify RNG quality
- Check distribution
- Validate randomness
- Audit RNG usage

### Payout Fairness
- Verify payouts
- Check calculations
- Validate outcomes
- Audit payouts

### Consistency Checks
- Verify game consistency
- Check state transitions
- Validate rules
- Audit consistency

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: Player identity
- **Reputation Lattice**: Player reputation
- **Field Layer**: Risk/trust fields
- **Neural Mesh**: Game patterns

### External Systems
- **Payment Systems**: Betting/payouts
- **Analytics**: Game analytics
- **Audit Systems**: Fairness audits

---

## Usage Examples

### Create Game Session

```typescript
const game = DreamBetCore.upsertGame({
  id: `game-${Date.now()}`,
  type: 'poker-table',
  state: 'waiting',
  title: 'Texas Hold\'em Tournament',
  players: [
    { identityId: 'user:player1', seatId: 'seat-1' },
    { identityId: 'user:player2', seatId: 'seat-2' },
  ],
  maxPlayers: 6,
  ruleset: 'texas-holdem-v1',
});
```

### Generate RNG

```typescript
const rng = DreamBetCore.generateRNG({
  purpose: 'deal-cards',
  gameId: game.id,
  roundId: 'round-1',
  entropyHint: 'player-shuffle',
});

// Convert to unit interval
const unit = DreamBetCore.rngToUnit(rng.resultHex);
console.log(`Random unit: ${unit}`);

// Convert to integer range
const cardIndex = DreamBetCore.rngToInt(rng.resultHex, 52);
console.log(`Card index: ${cardIndex}`);
```

### Create Round

```typescript
const round = DreamBetCore.upsertRound({
  id: `round-${Date.now()}`,
  gameId: game.id,
  index: 1,
  state: 'in-progress',
  rngSeed: rng.seed,
  rngSalt: rng.salt,
  rngResult: rng.resultHex,
  payload: {
    cards: ['2H', '3D', '4S', '5C', '6H'],
    pot: 100,
    currentBet: 10,
  },
});
```

### List Games

```typescript
const games = DreamBetCore.listGames();
games.forEach(game => {
  console.log(`${game.type}: ${game.title}`);
  console.log(`State: ${game.state}`);
  console.log(`Players: ${game.players.length}/${game.maxPlayers || 'unlimited'}`);
});
```

---

## Best Practices

1. **Game Management**
   - Use appropriate game types
   - Set clear rulesets
   - Track game state
   - Manage players carefully

2. **RNG Usage**
   - Use RNG for all randomness
   - Store RNG metadata
   - Verify RNG fairness
   - Audit RNG usage

3. **Fairness**
   - Record all fairness checks
   - Verify outcomes
   - Audit consistently
   - Maintain transparency

---

## Security Considerations

1. **RNG Security**
   - Use cryptographically secure RNG
   - Protect RNG seeds
   - Verify RNG quality
   - Audit RNG usage

2. **Game Security**
   - Validate game state
   - Protect game data
   - Prevent manipulation
   - Audit game actions

3. **Fairness Security**
   - Record all checks
   - Verify fairness
   - Prevent tampering
   - Maintain audit trail

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

