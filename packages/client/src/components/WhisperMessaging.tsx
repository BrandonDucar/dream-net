import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Whisper {
  id: string;
  targetDreamId?: string;
  targetWallet?: string;
  whisperType: 'Signal' | 'Vault' | 'Direct';
  message: string;
  sender: string;
  emotionOverlay?: string;
  link?: string;
  tokenRequired?: string;
  timestamp: string;
  status: 'pending' | 'delivered' | 'read';
}

interface RemixRequest {
  originalDreamId: string;
  remixerWallet: string;
  content: string;
  emotions: string[];
}

interface DreamLineage {
  newDreamId: string;
  lineage: string[];
  status: 'published' | 'draft' | 'archived';
}

export default function WhisperMessaging() {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [remixRequests, setRemixRequests] = useState<RemixRequest[]>([]);
  const [dreamLineages, setDreamLineages] = useState<DreamLineage[]>([]);
  const [selectedTab, setSelectedTab] = useState<'whispers' | 'remixes' | 'lineages'>('whispers');

  useEffect(() => {
    // Initialize with the provided whisper data
    const initialWhispers: Whisper[] = [
      {
        id: 'whisper_001',
        targetDreamId: 'dream108',
        whisperType: 'Signal',
        message: 'Your next fork belongs to fire.',
        sender: 'dreamer.eth',
        emotionOverlay: 'Passion',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      },
      {
        id: 'whisper_002',
        targetWallet: 'echo.sol',
        whisperType: 'Vault',
        message: 'Unlock this door to access The Architect\'s Archive.',
        sender: 'system',
        link: 'https://dreamnetwork.xyz/vault/xyz',
        tokenRequired: 'Ambition',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'pending'
      }
    ];

    const initialRemixRequests: RemixRequest[] = [
      {
        originalDreamId: 'dream045',
        remixerWallet: 'you.eth',
        content: 'A remix that merges dream logic with synthetic nature',
        emotions: ['curiosity', 'awe']
      }
    ];

    const initialLineages: DreamLineage[] = [
      {
        newDreamId: 'dream066',
        lineage: ['dream001', 'dream045'],
        status: 'published'
      }
    ];

    setWhispers(initialWhispers);
    setRemixRequests(initialRemixRequests);
    setDreamLineages(initialLineages);
  }, []);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      Passion: 'from-red-500 to-orange-400',
      Curiosity: 'from-yellow-500 to-orange-400',
      Ambition: 'from-purple-500 to-pink-400',
      Hope: 'from-blue-500 to-cyan-400',
      Wonder: 'from-indigo-400 to-purple-300',
      Awe: 'from-green-400 to-teal-300'
    };
    return colors[emotion as keyof typeof colors] || 'from-gray-500 to-gray-400';
  };

  const getWhisperTypeIcon = (type: string) => {
    const icons = {
      Signal: '📡',
      Vault: '🔐',
      Direct: '💬'
    };
    return icons[type as keyof typeof icons] || '💭';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-800 text-yellow-100',
      delivered: 'bg-blue-800 text-blue-100',
      read: 'bg-green-800 text-green-100',
      published: 'bg-green-800 text-green-100',
      draft: 'bg-yellow-800 text-yellow-100',
      archived: 'bg-gray-800 text-gray-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-800 text-gray-100';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-600 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dream Network Communications</h1>
        <p className="text-purple-200">Whispers, remixes, and dream lineage tracking</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTab('whispers')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTab === 'whispers' 
              ? 'bg-cyan-600 text-white' 
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          💫 Whispers ({whispers.length})
        </button>
        <button
          onClick={() => setSelectedTab('remixes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTab === 'remixes' 
              ? 'bg-cyan-600 text-white' 
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          🎭 Remixes ({remixRequests.length})
        </button>
        <button
          onClick={() => setSelectedTab('lineages')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTab === 'lineages' 
              ? 'bg-cyan-600 text-white' 
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          🌳 Lineages ({dreamLineages.length})
        </button>
      </div>

      {/* Whispers Tab */}
      {selectedTab === 'whispers' && (
        <div className="space-y-4">
          {whispers.map((whisper) => (
            <Card key={whisper.id} className="bg-zinc-900 border-zinc-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    {getWhisperTypeIcon(whisper.whisperType)} {whisper.whisperType} Whisper
                  </CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(whisper.status)}`}>
                    {whisper.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Message */}
                  <div className={`${whisper.emotionOverlay ? `bg-gradient-to-r ${getEmotionColor(whisper.emotionOverlay)} p-4 rounded-lg` : 'bg-zinc-800 p-4 rounded-lg border border-zinc-600'}`}>
                    <p className="text-white font-medium text-lg">{whisper.message}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-400">From:</span>
                      <span className="text-cyan-300 ml-2">{whisper.sender}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Target:</span>
                      <span className="text-purple-300 ml-2">
                        {whisper.targetDreamId || whisper.targetWallet}
                      </span>
                    </div>
                    {whisper.emotionOverlay && (
                      <div>
                        <span className="text-zinc-400">Emotion:</span>
                        <span className="text-orange-300 ml-2">{whisper.emotionOverlay}</span>
                      </div>
                    )}
                    {whisper.tokenRequired && (
                      <div>
                        <span className="text-zinc-400">Token Required:</span>
                        <span className="text-yellow-300 ml-2">{whisper.tokenRequired}</span>
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  {whisper.link && (
                    <div className="bg-zinc-800 p-3 rounded border border-zinc-600">
                      <span className="text-zinc-400 text-sm">Access Link:</span>
                      <a href={whisper.link} className="text-cyan-400 hover:text-cyan-300 ml-2 underline">
                        {whisper.link}
                      </a>
                    </div>
                  )}

                  <div className="text-xs text-zinc-500">
                    {new Date(whisper.timestamp).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Remixes Tab */}
      {selectedTab === 'remixes' && (
        <div className="space-y-4">
          {remixRequests.map((remix, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">🎭 Remix Request</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
                    <p className="text-white font-medium">{remix.content}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-400">Original Dream:</span>
                      <span className="text-purple-300 ml-2">{remix.originalDreamId}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Remixer:</span>
                      <span className="text-cyan-300 ml-2">{remix.remixerWallet}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-sm">Emotions:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {remix.emotions.map((emotion) => (
                        <span 
                          key={emotion}
                          className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getEmotionColor(emotion)} text-white`}
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lineages Tab */}
      {selectedTab === 'lineages' && (
        <div className="space-y-4">
          {dreamLineages.map((lineage, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400">🌳 Dream Lineage</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lineage.status)}`}>
                    {lineage.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-zinc-400">New Dream:</span>
                    <span className="text-cyan-300 ml-2 font-medium">{lineage.newDreamId}</span>
                  </div>
                  
                  <div>
                    <span className="text-zinc-400">Lineage Path:</span>
                    <div className="flex items-center gap-2 mt-2">
                      {lineage.lineage.map((dreamId, idx) => (
                        <div key={dreamId} className="flex items-center gap-2">
                          <span className="bg-purple-800 text-purple-100 px-2 py-1 rounded text-sm">
                            {dreamId}
                          </span>
                          {idx < lineage.lineage.length - 1 && (
                            <span className="text-zinc-500">→</span>
                          )}
                        </div>
                      ))}
                      <span className="text-zinc-500">→</span>
                      <span className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-sm font-bold">
                        {lineage.newDreamId}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}