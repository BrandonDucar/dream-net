import React, { useState, useEffect } from 'react';

interface Dream {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  createdAt: string;
}

export function CreatorStudioMini() {
  const [dreams, setDreams] = useState<Dream[]>(() => {
    const saved = localStorage.getItem('creatorStudioDreams');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    category: 'general',
  });

  useEffect(() => {
    localStorage.setItem('creatorStudioDreams', JSON.stringify(dreams));
  }, [dreams]);

  const categories = ['general', 'defi', 'nft', 'gaming', 'social', 'utility'];

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const newDream: Dream = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      category: formData.category,
      createdAt: new Date().toISOString(),
    };

    setDreams(prev => [newDream, ...prev]);
    setFormData({ name: '', description: '', tags: '', category: 'general' });
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🎨 Creator Studio Mini
              </h1>
              <p className="text-gray-400">Create and manage your Dreams</p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {showCreate ? 'Cancel' : '+ Create Dream'}
            </button>
          </div>

          {showCreate && (
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h2 className="text-xl font-bold mb-4">Create New Dream</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter dream name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    rows={3}
                    placeholder="Describe your dream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleCreate}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Create Dream
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {dreams.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No dreams created yet. Create your first dream!</p>
              </div>
            ) : (
              dreams.map(dream => (
                <div
                  key={dream.id}
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{dream.name}</h3>
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                        {dream.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(dream.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-300 mb-2">{dream.description}</p>
                  {dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {dream.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(dream.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to /api/dreams/create for on-chain dream creation
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Integrate with Dream Vault for persistent storage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

