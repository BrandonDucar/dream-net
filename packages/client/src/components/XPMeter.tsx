interface XPMeterProps {
  level: number;
  xp: number;
  className?: string;
  rewardUnlocked?: boolean;
  rewardText?: string;
  isDream?: boolean;
}

function getNextThreshold(level: number): number {
  const levels = [0, 100, 250, 500, 1000, 2000, 4000, 8000];
  return levels[level] || levels[levels.length - 1];
}

function getLevelReward(level: number): string | null {
  const rewards: Record<number, string> = {
    2: "Agent Fusion Unlocked",
    3: "Advanced Missions Available",
    4: "God Mode Console Access",
    5: "Dream Architect Badge",
    6: "Network Guardian Status",
    7: "Legendary Agent Creator",
    8: "Dream Network Master"
  };
  return rewards[level] || null;
}

export default function XPMeter({ level, xp, className = "", rewardUnlocked = false, rewardText, isDream = false }: XPMeterProps) {
  const nextThreshold = getNextThreshold(level);
  const currentLevelXP = level > 1 ? getNextThreshold(level - 1) : 0;
  const progressXP = xp - currentLevelXP;
  const progressMax = nextThreshold - currentLevelXP;
  const reward = getLevelReward(level);
  
  return (
    <div className={`xp-meter neon-meter ${className}`}>
      <style jsx>{`
        .neon-meter {
          border: 2px solid #00ffff;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.75);
          box-shadow: 0 0 10px #00ffff;
          border-radius: 8px;
        }
        .neon-meter progress {
          width: 100%;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #1a1a1a;
          border: 1px solid #333;
        }
        .neon-meter progress::-webkit-progress-value {
          background-color: #00ffff;
          box-shadow: 0 0 8px #00ffff;
        }
        .neon-meter progress::-webkit-progress-bar {
          background-color: #1a1a1a;
        }
        .neon-meter progress::-moz-progress-bar {
          background-color: #00ffff;
          box-shadow: 0 0 8px #00ffff;
        }
        .reward-toast {
          background: linear-gradient(45deg, #00ffff, #0080ff);
          color: black;
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 8px;
          font-weight: bold;
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from { box-shadow: 0 0 5px #00ffff; }
          to { box-shadow: 0 0 15px #00ffff, 0 0 20px #0080ff; }
        }
      `}</style>
      
      <div className="flex justify-between items-center mb-3">
        <p className="text-cyan-400 font-bold">
          🔮 {isDream ? 'Dream' : 'Wallet'} Level: <strong>L{level}</strong>
        </p>
        <p className="text-gray-300 text-sm font-mono">{xp}/{nextThreshold} XP</p>
      </div>
      
      <progress value={progressXP} max={progressMax} />
      
      <div className="mt-2 text-center">
        <span className="text-xs text-cyan-300">
          {progressMax - progressXP} XP to level {level + 1}
        </span>
      </div>
      
      {(rewardUnlocked || reward) && (
        <div className="reward-toast">
          🧠 Unlocked: {rewardText || reward}
        </div>
      )}
    </div>
  );
}