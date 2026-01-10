# 🎮 Game Contracts Deployment

## ✅ GameRegistry Deployed!

**GameRegistry Contract:**
- Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`
- [View on BaseScan](https://basescan.org/address/0xB38005e10E376D5D43699B45E7fc2f06A8465a5D)
- TX: `0x36013742ea9bca7d44c8f60ab9fcbf1a67bceac2c828c6342589c8ccdf49b2a3`

## ⏳ GameAchievementNFT Pending

**Status:** Needs retry (nonce issue - pending transactions)

**To deploy:**
```bash
cd packages/base-mini-apps
pnpm hardhat run scripts/deploy-game-contracts.ts --network base
```

---

## 🎯 What GameRegistry Provides

### Features:
1. **Score Submission** - Players submit scores on-chain
2. **Leaderboards** - Top 100 players per game
3. **Achievements** - Unlock achievements based on scores
4. **Player Stats** - Track best scores, total games played
5. **Rank Tracking** - Get player's rank for each game

### Supported Games:
- Jaggy Stealth Run (GameType 0)
- Dream DNA Sequencer Game (GameType 1)
- Dream Lattice Game (GameType 2)
- Wormhole Escape (GameType 3)
- Dream Bet Arcade (GameType 4)
- Octopus Pattern Master (GameType 5)
- Labubu Pop Smash (GameType 6)
- Reaction Test Mini (GameType 7)
- Dream Snail Drift (GameType 8)
- Dream Cloud Builder (GameType 9)

---

## 🔧 Integration

### Frontend Hook Created:
- `packages/base-mini-apps/frontend/hooks/useGameRegistry.ts`

### Usage in Games:
```typescript
import { useGameRegistry, GameType } from '../hooks/useGameRegistry';

const { submitScore, getBestScore, getTopPlayers } = useGameRegistry();

// Submit score after game ends
await submitScore.write({
  args: [GameType.JaggyStealthRun, score, JSON.stringify({ level: 1 })],
});

// Get leaderboard
const { data: topPlayers } = getTopPlayers(GameType.JaggyStealthRun, 10);
```

---

## 📋 Next Steps

1. ✅ GameRegistry deployed
2. ⏳ Deploy GameAchievementNFT (retry needed)
3. ⏳ Integrate into game components
4. ⏳ Add leaderboard UI
5. ⏳ Add achievement display

---

**GameRegistry is live and ready to track scores for all 10 games!** 🎮

