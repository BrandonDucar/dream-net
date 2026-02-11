import { useState, useEffect } from 'react';
import DreamNodeCard from '@/components/DreamNodeCard';
import DreamFilterBar from '@/components/DreamFilterBar';
import DreamAgentSpawner from '@/components/DreamAgentSpawner';
import DreamConstellation from '@/components/DreamConstellation';
import DreamConstellationFilter from '@/components/DreamConstellationFilter';
import { getAllDreams, saveDream } from '@/lib/db';
import { Dream } from '@/components/DreamNodeCard';

export default function DreamNodeTest() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filters, setFilters] = useState({ emotion: '', trend: '' });
  const [constellationFilters, setConstellationFilters] = useState({ emotion: '', trend: '' });
  const [sortKey, setSortKey] = useState<string>('none');
  const [viewMode, setViewMode] = useState<'grid' | 'constellation'>('grid');

  useEffect(() => {
    const fetchDreams = async () => {
      const stored = await getAllDreams();
      if (stored.length > 0) {
        setDreams(stored);
      }
    };
    fetchDreams();
  }, []);

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleConstellationFilterChange = (type: string, value: string) => {
    setConstellationFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleSortChange = (key: string) => {
    setSortKey(key);
  };

  const handleSpawn = async (newDream: Dream) => {
    setDreams((prev) => [...prev, newDream]);
    await saveDream(newDream);
  };

  let filtered = dreams.filter((d) => {
    const emotionMatch = filters.emotion ? d.emotionalProfile.primaryEmotion === filters.emotion : true;
    const trendMatch = filters.trend ? d.viralityMetrics.currentTrend === filters.trend : true;
    return emotionMatch && trendMatch;
  });

  if (sortKey === 'health') {
    filtered.sort((a, b) => b.healthScore - a.healthScore);
  } else if (sortKey === 'engagement') {
    filtered.sort((a, b) => b.engagementScore - a.engagementScore);
  } else if (sortKey === 'remixes') {
    filtered.sort((a, b) => b.metrics.remixes - a.metrics.remixes);
  }

  const filteredConstellationDreams = dreams.filter((d) => {
    const eMatch = constellationFilters.emotion ? d.emotionalProfile.primaryEmotion === constellationFilters.emotion : true;
    const tMatch = constellationFilters.trend ? d.viralityMetrics.currentTrend === constellationFilters.trend : true;
    return eMatch && tMatch;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white text-3xl font-bold">🌌 Dream Gallery</h1>
        
        {/* View Mode Toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'grid' 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Grid View
          </button>
          <button
            onClick={() => setViewMode('constellation')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'constellation' 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ✨ Constellation
          </button>
        </div>
      </div>

      <DreamFilterBar onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
      <DreamAgentSpawner onSpawn={handleSpawn} current={dreams} />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((dream) => (
            <DreamNodeCard key={dream.dreamId} dream={dream} />
          ))}
        </div>
      ) : (
        <>
          <DreamConstellationFilter 
            filters={constellationFilters} 
            onChange={handleConstellationFilterChange}
          />
          <div className="h-[600px] w-full">
            <DreamConstellation 
              dreams={filteredConstellationDreams} 
              onDreamSelect={(dream) => {
                window.location.href = `/dreams/${dream.dreamId}`;
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}