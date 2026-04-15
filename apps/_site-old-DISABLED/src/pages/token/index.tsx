import { useState, useEffect } from "react";
import { ethers } from "ethers";

const DREAM_TOKEN_ADDRESS = "0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77";
const SHEEP_TOKEN_ADDRESS = "0xDA7ec9832268606052003D7257B239C6bEDEfDf8";

const ERC20_ABI = [
  "function totalSupply() view returns (uint256)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function decimals() view returns (uint8)",
];

export default function TokenHub() {
  const [dreamStats, setDreamStats] = useState<any>(null);
  const [sheepStats, setSheepStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenStats = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
        
        // DreamToken stats
        const dreamToken = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);
        const dreamSupply = await dreamToken.totalSupply();
        const dreamSymbol = await dreamToken.symbol();
        const dreamName = await dreamToken.name();
        const dreamDecimals = await dreamToken.decimals();
        
        setDreamStats({
          address: DREAM_TOKEN_ADDRESS,
          symbol: dreamSymbol,
          name: dreamName,
          totalSupply: ethers.formatUnits(dreamSupply, dreamDecimals),
          decimals: dreamDecimals,
        });

        // SheepToken stats
        const sheepToken = new ethers.Contract(SHEEP_TOKEN_ADDRESS, ERC20_ABI, provider);
        const sheepSupply = await sheepToken.totalSupply();
        const sheepSymbol = await sheepToken.symbol();
        const sheepName = await sheepToken.name();
        const sheepDecimals = await sheepToken.decimals();
        
        setSheepStats({
          address: SHEEP_TOKEN_ADDRESS,
          symbol: sheepSymbol,
          name: sheepName,
          totalSupply: ethers.formatUnits(sheepSupply, sheepDecimals),
          decimals: sheepDecimals,
        });
      } catch (err) {
        console.error("Failed to fetch token stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            DREAM Token
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The utility token powering the DreamNet ecosystem. Earn through engagement, claim on-chain, shape the future.
          </p>
        </div>

        {/* Token Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* DREAM Token */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-2xl border border-blue-500/30 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">💎</div>
              <div>
                <h2 className="text-3xl font-bold text-blue-400">DREAM</h2>
                <p className="text-gray-400">DreamNet Token</p>
              </div>
            </div>
            
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : dreamStats ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Supply</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {parseFloat(dreamStats.totalSupply).toLocaleString()} {dreamStats.symbol}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Contract</div>
                  <a
                    href={`https://basescan.org/address/${dreamStats.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm break-all"
                  >
                    {dreamStats.address}
                  </a>
                </div>
                <div className="pt-4 border-t border-blue-500/20">
                  <p className="text-sm text-gray-300">
                    DREAM is earned through daily engagement, creative contributions, and ecosystem participation. 
                    Convert internal DREAM to on-chain tokens and use them across the DreamNet platform.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* SHEEP Token */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-2xl border border-yellow-500/30 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">🐑</div>
              <div>
                <h2 className="text-3xl font-bold text-yellow-400">SHEEP</h2>
                <p className="text-gray-400">Sheep Token</p>
              </div>
            </div>
            
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : sheepStats ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Supply</div>
                  <div className="text-2xl font-bold text-yellow-300">
                    {parseFloat(sheepStats.totalSupply).toLocaleString()} {sheepStats.symbol}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Contract</div>
                  <a
                    href={`https://basescan.org/address/${sheepStats.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 font-mono text-sm break-all"
                  >
                    {sheepStats.address}
                  </a>
                </div>
                <div className="pt-4 border-t border-yellow-500/20">
                  <p className="text-sm text-gray-300">
                    SHEEP is the soft currency of DreamNet. Earned through daily activities, used for 
                    cosmetic features, and non-tradable fun currency for the ecosystem.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* How to Get */}
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">How to Earn DREAM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Daily Claims</h3>
              <p className="text-gray-400 text-sm">
                Claim daily rewards and build streaks for bonus multipliers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Create Content</h3>
              <p className="text-gray-400 text-sm">
                Upload media, create dreams, contribute to the ecosystem
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Refer Friends</h3>
              <p className="text-gray-400 text-sm">
                Invite others and earn DREAM when they join
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="/miniapps/rewards"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
            >
              Start Earning →
            </a>
          </div>
        </div>

        {/* Tokenomics */}
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8">
          <h2 className="text-3xl font-bold mb-6">Tokenomics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">DREAM Token</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Max Supply: 1,000,000,000 DREAM</li>
                <li>• Decimals: 18</li>
                <li>• Network: Base Mainnet</li>
                <li>• Standard: ERC-20</li>
                <li>• Distribution: Rewards-based</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">SHEEP Token</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Max Supply: 1,000,000,000 SHEEP</li>
                <li>• Decimals: 18</li>
                <li>• Network: Base Mainnet</li>
                <li>• Standard: ERC-20</li>
                <li>• Type: Soft currency (non-tradable)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

