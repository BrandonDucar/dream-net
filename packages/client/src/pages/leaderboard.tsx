import DreamLeaderboard from '../components/DreamLeaderboard';
import DreamCard from '../components/DreamCard';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Dream Network Analytics</h1>
          <p className="text-xl text-zinc-400">
            Track top performers, trending dreams, and network revenue
          </p>
        </div>
        
        <DreamLeaderboard />
        
        {/* Featured Dream Spotlight */}
        <div className="mt-12 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">✨ Featured Dream Spotlight</h2>
            <p className="text-zinc-400">Discover the latest trending dream in the network</p>
          </div>
          <div className="max-w-md mx-auto">
            <DreamCard
              dream="Whispers in Orbit"
              author="starborn.sol"
              emotion="Hope"
              remixes={22}
              vaultTips="127 $SHEEP"
              agent="Petal"
              actions={["Remix", "Vault Peek", "Whisper"]}
            />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-zinc-900 border border-cyan-700 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">How Rankings Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-cyan-300 mb-2">💎 Dream Score</h4>
                <p className="text-sm text-zinc-400">
                  Based on dream creation, remix activity, vault revenue, and community engagement
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">🔥 Heat Rating</h4>
                <p className="text-sm text-zinc-400">
                  Real-time trending indicator based on remix velocity and social signals
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-2">💰 Vault Revenue</h4>
                <p className="text-sm text-zinc-400">
                  $SHEEP tokens earned through dream monetization and remix royalties
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}