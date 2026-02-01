import React, { useState, useEffect } from 'react';

// Try to import BaseProvider, fallback to direct ethers if not available
let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {
  // BaseProvider not available, will use direct ethers connection
}

interface Dream {
  id: string;
  name: string;
  description: string;
  tags: string[];
  primaryPorts: string[];
  creator: string;
  createdAt: string;
}

export function CreatorStudio() {
  const baseHook = useBase ? useBase() : null;
  const address = baseHook?.address || null;
  const isConnected = baseHook?.isConnected || false;
  const connect = baseHook?.connect || (async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }
  });

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    primaryPorts: [] as string[],
  });

  const AVAILABLE_PORTS = [
    'dreamnet-core',
    'shield-core',
    'mesh-core',
    'travelnet-core',
    'milnet-core',
  ];

  useEffect(() => {
    if (isConnected && address) {
      loadDreams();
    }
  }, [isConnected, address]);

  const loadDreams = async () => {
    if (!address) return;

    try {
      const res = await fetch(`/api/dreams/created-by/${address}`);
      if (res.ok) {
        const data = await res.json();
        setDreams(data.dreams || []);
      }
    } catch (err: any) {
      console.error('Failed to load dreams:', err);
    }
  };

  const handleCreateDream = async () => {
    if (!isConnected || !address) {
      await connect();
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      const res = await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tags,
          primaryPorts: formData.primaryPorts,
          creator: address,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create dream');
      }

      setFormData({ name: '', description: '', tags: '', primaryPorts: [] });
      setShowCreate(false);
      await loadDreams();
    } catch (err: any) {
      setError(err.message || 'Failed to create dream');
    } finally {
      setLoading(false);
    }
  };

  const togglePort = (portId: string) => {
    setFormData(prev => ({
      ...prev,
      primaryPorts: prev.primaryPorts.includes(portId)
        ? prev.primaryPorts.filter(id => id !== portId)
        : [...prev.primaryPorts, portId],
    }));
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Creator Studio</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your wallet to create dreams</p>
          <button
            onClick={connect}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Creator Studio</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          {showCreate ? 'Cancel' : 'Create Dream'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {showCreate && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Create New Dream</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Dream Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                placeholder="My Amazing Dream"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                rows={4}
                placeholder="Describe your dream..."
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                placeholder="art, music, technology"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Primary Ports</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AVAILABLE_PORTS.map((portId) => (
                  <div
                    key={portId}
                    onClick={() => togglePort(portId)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      formData.primaryPorts.includes(portId)
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{portId}</span>
                      {formData.primaryPorts.includes(portId) && (
                        <span className="text-cyan-400">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleCreateDream}
              disabled={loading || !formData.name.trim() || !formData.description.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {loading ? 'Creating...' : 'Create Dream'}
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Your Dreams</h2>
        {dreams.length === 0 ? (
          <p className="text-gray-400">No dreams yet. Create your first one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dreams.map((dream) => (
              <div key={dream.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
                <h3 className="text-xl font-semibold text-white mb-2">{dream.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{dream.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {dream.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-xs">
                  Created: {new Date(dream.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

