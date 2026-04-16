import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface UserProgression {
  userId: string;
  xp: number;
  tier: string;
  emotionTrail: string[];
  remixCount: number;
  vaultEarnings: number;
  visualConfig: {
    coreGlow: string;
    trailOverlay: string;
    shape: string;
    emotionTint: string[];
  };
}

interface TierInfo {
  name: string;
  minXp: number;
  maxXp: number;
  benefits: string[];
  visualUnlocks: string[];
}

export default function UserProgressionSystem() {
  const [currentUser, setCurrentUser] = useState<UserProgression>({
    userId: "dreamer_1072",
    xp: 2893,
    tier: "Weaver",
    emotionTrail: ["hope", "curiosity"],
    remixCount: 9,
    vaultEarnings: 143,
    visualConfig: {
      coreGlow: "blue",
      trailOverlay: "animated dust",
      shape: "soft mandala",
      emotionTint: ["#7ecfff", "#ffd97e"]
    }
  });

  const tiers: TierInfo[] = [
    {
      name: "Dreamer",
      minXp: 0,
      maxXp: 999,
      benefits: ["Basic dream creation", "Standard emotions"],
      visualUnlocks: ["Basic glow", "Simple shapes"]
    },
    {
      name: "Weaver",
      minXp: 1000,
      maxXp: 2999,
      benefits: ["Enhanced remixing", "Emotion trails", "Vault access"],
      visualUnlocks: ["Core glow customization", "Trail overlays", "Mandala shapes"]
    },
    {
      name: "Architect",
      minXp: 3000,
      maxXp: 4999,
      benefits: ["Advanced AI agents", "Cross-chain features", "Premium tools"],
      visualUnlocks: ["Complex geometries", "Multi-layer effects", "Custom animations"]
    },
    {
      name: "Visionary",
      minXp: 5000,
      maxXp: 9999,
      benefits: ["DAO governance", "Token multipliers", "Feature access"],
      visualUnlocks: ["Particle systems", "Dynamic gradients", "Reality distortion"]
    },
    {
      name: "Transcendent",
      minXp: 10000,
      maxXp: 99999,
      benefits: ["Network ownership", "Agent creation", "Ecosystem control"],
      visualUnlocks: ["Quantum effects", "Dimensional shifts", "Consciousness flows"]
    }
  ];

  const getCurrentTierInfo = (): TierInfo => {
    return tiers.find(tier => 
      currentUser.xp >= tier.minXp && currentUser.xp <= tier.maxXp
    ) || tiers[0];
  };

  const getNextTierInfo = (): TierInfo | null => {
    const currentTierIndex = tiers.findIndex(tier => tier.name === currentUser.tier);
    return currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  };

  const getProgressToNextTier = (): number => {
    const nextTier = getNextTierInfo();
    if (!nextTier) return 100;
    
    const currentTier = getCurrentTierInfo();
    const progress = ((currentUser.xp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100;
    return Math.min(progress, 100);
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      hope: '#7ecfff',
      curiosity: '#ffd97e',
      passion: '#ff7e7e',
      wonder: '#d97eff',
      ambition: '#7eff7e',
      calm: '#7effff'
    };
    return colors[emotion as keyof typeof colors] || '#ffffff';
  };

  const getTierColor = (tier: string) => {
    const colors = {
      Dreamer: 'from-gray-600 to-gray-400',
      Weaver: 'from-blue-600 to-cyan-400',
      Architect: 'from-purple-600 to-pink-400',
      Visionary: 'from-yellow-600 to-orange-400',
      Transcendent: 'from-emerald-600 to-teal-400'
    };
    return colors[tier as keyof typeof colors] || 'from-gray-600 to-gray-400';
  };

  const nextTier = getNextTierInfo();
  const currentTierInfo = getCurrentTierInfo();
  const progressPercent = getProgressToNextTier();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getTierColor(currentUser.tier)} border border-cyan-600 rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentUser.userId}</h1>
            <p className="text-white/80">{currentUser.tier} Tier • {currentUser.xp.toLocaleString()} XP</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{currentUser.vaultEarnings} $SHEEP</div>
            <div className="text-white/80">{currentUser.remixCount} Remixes</div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Tier Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextTier ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Progress to {nextTier.name}</span>
                  <span className="text-cyan-300">{currentUser.xp}/{nextTier.minXp} XP</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <div className="text-xs text-zinc-500">
                  {nextTier.minXp - currentUser.xp} XP remaining
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gold-400 mb-2">🏆 MAX TIER ACHIEVED</div>
                <p className="text-zinc-400">You have reached the highest tier in the Dream Network</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visual Configuration */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Visual Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Config */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Active Setup</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Core Glow:</span>
                  <span className="text-blue-400 font-medium">{currentUser.visualConfig.coreGlow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Trail Overlay:</span>
                  <span className="text-purple-400 font-medium">{currentUser.visualConfig.trailOverlay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shape:</span>
                  <span className="text-green-400 font-medium">{currentUser.visualConfig.shape}</span>
                </div>
              </div>
            </div>

            {/* Emotion Trail */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Emotion Trail</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.emotionTrail.map((emotion, index) => (
                  <div
                    key={emotion}
                    className="px-3 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: getEmotionColor(emotion) + '33',
                      color: getEmotionColor(emotion),
                      border: `1px solid ${getEmotionColor(emotion)}66`
                    }}
                  >
                    {emotion}
                  </div>
                ))}
              </div>
              
              {/* Color Tints */}
              <div className="mt-4">
                <span className="text-zinc-400 text-sm">Emotion Tints:</span>
                <div className="flex gap-2 mt-2">
                  {currentUser.visualConfig.emotionTint.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border border-zinc-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Tier Benefits */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">{currentUser.tier} Tier Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Abilities</h3>
              <ul className="space-y-2">
                {currentTierInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-zinc-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Visual Unlocks</h3>
              <ul className="space-y-2">
                {currentTierInfo.visualUnlocks.map((unlock, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-cyan-400">◆</span>
                    <span className="text-zinc-300">{unlock}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Tier Preview */}
      {nextTier && (
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Next: {nextTier.name} Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Upcoming Abilities</h3>
                <ul className="space-y-2">
                  {nextTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-yellow-400">⏳</span>
                      <span className="text-zinc-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Visual Unlocks</h3>
                <ul className="space-y-2">
                  {nextTier.visualUnlocks.map((unlock, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-yellow-400">◇</span>
                      <span className="text-zinc-400">{unlock}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tiers Overview */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Tier System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`p-4 rounded-lg border ${
                  tier.name === currentUser.tier
                    ? 'border-cyan-500 bg-cyan-900/20'
                    : 'border-zinc-700 bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${tier.name === currentUser.tier ? 'text-cyan-400' : 'text-zinc-500'}`}>
                      {tier.name === currentUser.tier ? '👑' : '🎯'}
                    </span>
                    <h3 className={`text-lg font-semibold ${
                      tier.name === currentUser.tier ? 'text-cyan-400' : 'text-white'
                    }`}>
                      {tier.name}
                    </h3>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {tier.minXp.toLocaleString()}-{tier.maxXp.toLocaleString()} XP
                  </span>
                </div>
                <div className="text-sm text-zinc-400">
                  {tier.benefits.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}