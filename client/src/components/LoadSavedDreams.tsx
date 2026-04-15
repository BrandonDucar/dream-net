import { useState } from 'react';
import DreamCoreViewer from './DreamCoreViewer';
import DreamReactivator from './DreamReactivator';

interface LoadedDream {
  title: string;
  tags: string[];
  score: number;
  trustLevel: string;
  agents: string[];
  componentCode: string;
  schema: string;
  evolutionLevel?: number;
}

export default function LoadSavedDreams() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loadedDream, setLoadedDream] = useState<LoadedDream | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const handleLoad = async () => {
    try {
      const res = await fetch(`/api/load-core?walletAddress=${walletAddress}`);
      const data = await res.json();

      if (data.status === 'success') {
        setLoadedDream(data.dreamCore);
        setLog(prev => [...prev, `✅ Loaded dream for wallet: ${walletAddress}`]);
      } else {
        setLog(prev => [...prev, `⚠️ ${data.message}`]);
      }
    } catch (err: any) {
      setLog(prev => [...prev, `❌ Load failed: ${err.message}`]);
    }
  };

  return (
    <div className="p-5 font-mono bg-gray-900 text-green-400 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">📂 Load Saved Dream Core</h2>
      
      <div className="mb-6">
        <input
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
          className="w-full p-3 bg-black border border-green-500 rounded text-green-400 placeholder-gray-500"
        />
        <button 
          onClick={handleLoad}
          className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-black rounded transition-colors"
        >
          🔄 Load Dream
        </button>
      </div>

      <hr className="border-green-500 mb-6" />

      {loadedDream ? (
        <>
          <DreamCoreViewer 
            dreamCore={loadedDream} 
            onDreamUpdate={(updatedDream) => setLoadedDream(updatedDream)}
          />
          <DreamReactivator 
            dreamCore={loadedDream} 
            onUpdate={(updatedCore) => setLoadedDream(updatedCore)}
          />
        </>
      ) : (
        <p style={{ color: '#aaa' }}>No dream loaded yet.</p>
      )}

      <div>
        <h4 className="text-lg font-semibold mb-3">📡 System Log</h4>
        <div className="bg-black p-4 rounded border border-green-500 min-h-[100px]">
          {log.length > 0 ? (
            log.map((l, i) => <div key={i} className="mb-1">{l}</div>)
          ) : (
            <div className="text-gray-500">Ready to load dream cores...</div>
          )}
        </div>
      </div>
    </div>
  );
}