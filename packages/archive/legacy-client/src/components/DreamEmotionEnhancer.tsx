import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmotionEffect {
  name: string;
  description: string;
  impact: string;
  color: string;
  icon: string;
}

interface DreamEnhancement {
  dreamId: string;
  addedEmotion: string;
  effect: string;
  previousEmotions: string[];
  enhancedCapabilities: string[];
  audienceMultiplier: number;
  toolchainAccess: string[];
}

const EMOTION_EFFECTS: Record<string, EmotionEffect> = {
  Curiosity: {
    name: "Curiosity",
    description: "Drives exploration and questioning",
    impact: "Expanded remix audience + Remix Toolchain Access",
    color: "from-yellow-500 to-orange-400",
    icon: "🔍"
  },
  Wonder: {
    name: "Wonder",
    description: "Sparks imagination and awe",
    impact: "Enhanced visualization tools + Community spotlights",
    color: "from-purple-500 to-pink-400",
    icon: "✨"
  },
  Hope: {
    name: "Hope",
    description: "Inspires optimism and growth",
    impact: "Increased vault tips + Collaboration bonuses",
    color: "from-blue-500 to-cyan-400",
    icon: "🌟"
  },
  Passion: {
    name: "Passion",
    description: "Fuels intensity and dedication",
    impact: "Remix velocity boost + Premium agent access",
    color: "from-red-500 to-pink-500",
    icon: "🔥"
  },
  Calm: {
    name: "Calm",
    description: "Promotes peace and reflection",
    impact: "Extended dream lifespan + Meditation rewards",
    color: "from-green-400 to-teal-300",
    icon: "🧘"
  }
};

export default function DreamEmotionEnhancer() {
  const [selectedDream, setSelectedDream] = useState<string>('dream108');
  const [enhancement, setEnhancement] = useState<DreamEnhancement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with Dream 108 enhancement data
    const dream108Enhancement: DreamEnhancement = {
      dreamId: "dream108",
      addedEmotion: "Curiosity",
      effect: "Expanded remix audience + Remix Toolchain Access",
      previousEmotions: ["Hope", "Wonder"],
      enhancedCapabilities: [
        "Advanced Remix Editor",
        "Collaborative Workspace",
        "AI-Assisted Generation",
        "Cross-Chain Distribution",
        "Analytics Dashboard"
      ],
      audienceMultiplier: 2.3,
      toolchainAccess: [
        "LUCID Agent",
        "CANVAS Agent", 
        "ROOT Agent",
        "ECHO Agent",
        "Fusion Chamber",
        "Dream Linker"
      ]
    };

    setEnhancement(dream108Enhancement);
    setLoading(false);
  }, [selectedDream]);

  const getEmotionGradient = (emotion: string): string => {
    return EMOTION_EFFECTS[emotion]?.color || 'from-gray-500 to-gray-400';
  };

  const getEmotionIcon = (emotion: string): string => {
    return EMOTION_EFFECTS[emotion]?.icon || '💭';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-700 rounded w-1/2"></div>
          <div className="h-64 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!enhancement) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-400">No Enhancement Data</h2>
        <p className="text-zinc-400 mt-2">Unable to load dream enhancement information</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Enhancement Header */}
      <div className={`bg-gradient-to-r ${getEmotionGradient(enhancement.addedEmotion)} border border-orange-600 rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {getEmotionIcon(enhancement.addedEmotion)} Dream Enhancement
            </h1>
            <p className="text-orange-100 text-lg">
              {enhancement.dreamId} + {enhancement.addedEmotion}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {enhancement.audienceMultiplier}x
            </div>
            <div className="text-orange-100">Audience Reach</div>
          </div>
        </div>
      </div>

      {/* Enhancement Effect */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Enhancement Effect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-white mb-4">
            {enhancement.effect}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
              <h4 className="font-semibold text-green-400 mb-2">Audience Expansion</h4>
              <p className="text-zinc-300 text-sm">
                Curiosity-driven content attracts explorers, learners, and innovators across the network
              </p>
              <div className="mt-2 text-2xl font-bold text-green-400">
                +{Math.round((enhancement.audienceMultiplier - 1) * 100)}% Reach
              </div>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
              <h4 className="font-semibold text-purple-400 mb-2">Toolchain Access</h4>
              <p className="text-zinc-300 text-sm">
                Unlocks advanced remix tools and collaborative features
              </p>
              <div className="mt-2 text-2xl font-bold text-purple-400">
                {enhancement.toolchainAccess.length} Tools
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Stack */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Emotion Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* New Emotion */}
            <div className={`bg-gradient-to-r ${getEmotionGradient(enhancement.addedEmotion)} p-4 rounded-lg border-2 border-yellow-500`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getEmotionIcon(enhancement.addedEmotion)}</span>
                  <div>
                    <div className="font-bold text-white text-lg">
                      {enhancement.addedEmotion} (NEW)
                    </div>
                    <div className="text-white/80 text-sm">
                      {EMOTION_EFFECTS[enhancement.addedEmotion]?.description}
                    </div>
                  </div>
                </div>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Previous Emotions */}
            {enhancement.previousEmotions.map((emotion) => (
              <div key={emotion} className={`bg-gradient-to-r ${getEmotionGradient(emotion)} opacity-60 p-3 rounded-lg border border-zinc-600`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getEmotionIcon(emotion)}</span>
                  <div>
                    <div className="font-semibold text-white">
                      {emotion}
                    </div>
                    <div className="text-white/70 text-sm">
                      {EMOTION_EFFECTS[emotion]?.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Capabilities */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Enhanced Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enhancement.enhancedCapabilities.map((capability) => (
              <div key={capability} className="bg-zinc-800 p-3 rounded-lg border border-zinc-600 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white font-medium">{capability}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Toolchain Access */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Remix Toolchain Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancement.toolchainAccess.map((tool) => (
              <div key={tool} className="bg-gradient-to-r from-purple-800 to-blue-800 p-4 rounded-lg border border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{tool}</div>
                    <div className="text-purple-200 text-sm">Unlocked</div>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Metrics */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Enhancement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {enhancement.audienceMultiplier}x
              </div>
              <div className="text-zinc-400 text-sm">Audience Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {enhancement.toolchainAccess.length}
              </div>
              <div className="text-zinc-400 text-sm">Tools Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {enhancement.enhancedCapabilities.length}
              </div>
              <div className="text-zinc-400 text-sm">New Capabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {enhancement.previousEmotions.length + 1}
              </div>
              <div className="text-zinc-400 text-sm">Total Emotions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}