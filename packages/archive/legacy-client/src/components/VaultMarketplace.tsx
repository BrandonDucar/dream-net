import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Vault {
  vaultId: string;
  title: string;
  creator: string;
  emotion: string;
  views: number;
  remixes: number;
  available: boolean;
  price: string;
  status: string;
  description?: string;
  createdAt?: string;
  tags?: string[];
}

export default function VaultMarketplace() {
  const [featuredVault, setFeaturedVault] = useState<Vault>({
    vaultId: "vault_483",
    title: "Moonwave: The Remix Archive",
    creator: "0xDREAMER005",
    emotion: "wonder",
    views: 8432,
    remixes: 132,
    available: true,
    price: "3.1 $SHEEP",
    status: "trending",
    description: "A celestial collection of moon-inspired dreams and their evolutionary remixes, capturing the wonder of lunar cycles and ethereal transformations.",
    createdAt: "2025-01-03",
    tags: ["lunar", "ethereal", "transformative", "celestial"]
  });

  const [allVaults, setAllVaults] = useState<Vault[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const vaults: Vault[] = [
      {
        vaultId: "vault_483",
        title: "Moonwave: The Remix Archive",
        creator: "0xDREAMER005",
        emotion: "wonder",
        views: 8432,
        remixes: 132,
        available: true,
        price: "3.1 $SHEEP",
        status: "trending",
        tags: ["lunar", "ethereal", "transformative"]
      },
      {
        vaultId: "vault_301",
        title: "Digital Fragments",
        creator: "0xDREAMER001",
        emotion: "curiosity",
        views: 5672,
        remixes: 89,
        available: true,
        price: "2.8 $SHEEP",
        status: "popular",
        tags: ["digital", "fragments", "exploration"]
      },
      {
        vaultId: "vault_198",
        title: "Neon Dreams Collection",
        creator: "0xDREAMER092",
        emotion: "excitement",
        views: 12104,
        remixes: 245,
        available: false,
        price: "5.2 $SHEEP",
        status: "sold out",
        tags: ["neon", "cyberpunk", "electric"]
      },
      {
        vaultId: "vault_067",
        title: "Organic Synthesis",
        creator: "0xDREAMER003",
        emotion: "hope",
        views: 3241,
        remixes: 67,
        available: true,
        price: "1.9 $SHEEP",
        status: "new",
        tags: ["organic", "nature", "synthesis"]
      },
      {
        vaultId: "vault_522",
        title: "Quantum Echoes",
        creator: "0xDREAMER007",
        emotion: "ambition",
        views: 7890,
        remixes: 156,
        available: true,
        price: "4.3 $SHEEP",
        status: "rising",
        tags: ["quantum", "physics", "echoes"]
      }
    ];

    setAllVaults(vaults);
  }, []);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      wonder: 'from-purple-500 to-indigo-400',
      curiosity: 'from-yellow-500 to-orange-400',
      excitement: 'from-pink-500 to-red-400',
      hope: 'from-green-500 to-teal-400',
      ambition: 'from-blue-500 to-cyan-400',
      passion: 'from-red-500 to-orange-400',
      calm: 'from-teal-500 to-blue-400'
    };
    return colors[emotion as keyof typeof colors] || 'from-gray-500 to-gray-400';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      trending: 'bg-orange-600 text-orange-100',
      popular: 'bg-blue-600 text-blue-100',
      'sold out': 'bg-red-600 text-red-100',
      new: 'bg-green-600 text-green-100',
      rising: 'bg-purple-600 text-purple-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-600 text-gray-100';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      trending: '🔥',
      popular: '⭐',
      'sold out': '🚫',
      new: '✨',
      rising: '📈'
    };
    return icons[status as keyof typeof icons] || '📦';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const filteredVaults = allVaults.filter(vault => {
    const emotionMatch = selectedEmotion === 'all' || vault.emotion === selectedEmotion;
    const statusMatch = selectedStatus === 'all' || vault.status === selectedStatus;
    return emotionMatch && statusMatch;
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-600 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dream Vault Marketplace</h1>
        <p className="text-indigo-200">Discover and collect exclusive dream archives from creators across the network</p>
      </div>

      {/* Featured Vault */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              🌟 Featured Vault
            </CardTitle>
            <Badge className={getStatusColor(featuredVault.status)}>
              {getStatusIcon(featuredVault.status)} {featuredVault.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vault Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{featuredVault.title}</h2>
                <p className="text-zinc-300">{featuredVault.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-zinc-400 text-sm">Creator:</span>
                  <div className="text-cyan-300 font-medium">{formatAddress(featuredVault.creator)}</div>
                </div>
                <div>
                  <span className="text-zinc-400 text-sm">Vault ID:</span>
                  <div className="text-purple-300 font-medium">{featuredVault.vaultId}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getEmotionColor(featuredVault.emotion)} text-white text-sm font-medium`}>
                  {featuredVault.emotion}
                </div>
                {featuredVault.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats & Purchase */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                  <div className="text-cyan-400 text-2xl font-bold">{formatNumber(featuredVault.views)}</div>
                  <div className="text-zinc-400 text-sm">Views</div>
                </div>
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                  <div className="text-purple-400 text-2xl font-bold">{featuredVault.remixes}</div>
                  <div className="text-zinc-400 text-sm">Remixes</div>
                </div>
              </div>

              <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-2">{featuredVault.price}</div>
                <Button 
                  className={`w-full ${featuredVault.available ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-600 cursor-not-allowed'}`}
                  disabled={!featuredVault.available}
                >
                  {featuredVault.available ? 'Purchase Vault' : 'Sold Out'}
                </Button>
              </div>

              <div className="text-xs text-zinc-500">
                Purchasing this vault grants full access to all {featuredVault.remixes} remixes and future additions to this collection.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Filter Vaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Emotion Filter */}
            <div className="space-y-2">
              <label className="text-zinc-400 text-sm">Emotion:</label>
              <select 
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-white"
              >
                <option value="all">All Emotions</option>
                <option value="wonder">Wonder</option>
                <option value="curiosity">Curiosity</option>
                <option value="excitement">Excitement</option>
                <option value="hope">Hope</option>
                <option value="ambition">Ambition</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-zinc-400 text-sm">Status:</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="trending">Trending</option>
                <option value="popular">Popular</option>
                <option value="new">New</option>
                <option value="rising">Rising</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVaults.map((vault) => (
          <Card key={vault.vaultId} className="bg-zinc-900 border-zinc-700 hover:border-cyan-500 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getEmotionColor(vault.emotion)}`}></div>
                  <span className="text-cyan-400 text-sm">{vault.vaultId}</span>
                </div>
                <Badge className={getStatusColor(vault.status)}>
                  {getStatusIcon(vault.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{vault.title}</h3>
                <p className="text-zinc-400 text-sm">{formatAddress(vault.creator)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-400">Views:</span>
                  <div className="text-cyan-300 font-medium">{formatNumber(vault.views)}</div>
                </div>
                <div>
                  <span className="text-zinc-400">Remixes:</span>
                  <div className="text-purple-300 font-medium">{vault.remixes}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded bg-gradient-to-r ${getEmotionColor(vault.emotion)} text-white text-xs`}>
                  {vault.emotion}
                </div>
                {vault.tags?.slice(0, 2).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-white">{vault.price}</span>
                  <span className={`text-sm ${vault.available ? 'text-green-400' : 'text-red-400'}`}>
                    {vault.available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
                <Button 
                  size="sm"
                  className={`w-full ${vault.available ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-600 cursor-not-allowed'}`}
                  disabled={!vault.available}
                >
                  {vault.available ? 'View Details' : 'Sold Out'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketplace Stats */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Marketplace Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{allVaults.length}</div>
              <div className="text-zinc-400 text-sm">Total Vaults</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{allVaults.filter(v => v.available).length}</div>
              <div className="text-zinc-400 text-sm">Available</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-400">
                {allVaults.reduce((sum, vault) => sum + vault.views, 0).toLocaleString()}
              </div>
              <div className="text-zinc-400 text-sm">Total Views</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">
                {allVaults.reduce((sum, vault) => sum + vault.remixes, 0)}
              </div>
              <div className="text-zinc-400 text-sm">Total Remixes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}