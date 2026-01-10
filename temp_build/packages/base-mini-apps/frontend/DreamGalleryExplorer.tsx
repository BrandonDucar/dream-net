import React, { useState, useEffect } from 'react';

interface Dream {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  createdAt: string;
}

export function DreamGalleryExplorer() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dreams');
      if (!response.ok) throw new Error('Failed to fetch dreams');
      const data = await response.json();
      setDreams(Array.isArray(data) ? data : data.dreams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dreams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Gallery Explorer</h1>
      
      {loading && <p className="text-gray-400">Loading dreams...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dreams.length === 0 ? (
            <p className="text-gray-400 col-span-full">No dreams found</p>
          ) : (
            dreams.map((dream) => (
              <div
                key={dream.id}
                className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{dream.title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{dream.description}</p>
                {dream.tags && dream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {dream.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(dream.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

