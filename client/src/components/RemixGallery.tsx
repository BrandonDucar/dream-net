import React, { useEffect, useState } from 'react';
import DreamCard from './DreamCard';
import { RemixFilterBar } from './RemixFilterBar';

async function getRemixedDreams() {
  const response = await fetch('/api/remixes');
  if (!response.ok) throw new Error('Failed to fetch remixed dreams');
  const data = await response.json();
  return data.remixes || [];
}

interface Dream {
  id: string;
  title: string;
  type: string;
  originator: string;
  tags: string[];
  createdAt: number;
  description: string;
  originalDream: string;
  status: string;
  likes: number;
  remixCount: number;
  bonusMultiplier: number;
  healthScore?: number;
  emotionTone?: "joy" | "hope" | "ambition" | "curiosity" | "sadness" | "fear" | "chaos" | "love";
}

export default function RemixGallery() {
  const [remixedDreams, setRemixedDreams] = useState<Dream[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    emotion: "",
    category: "",
    health: "",
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getRemixedDreams();
      setRemixedDreams(data);
    }
    fetchData();
  }, []);

  // Filter dreams based on current filters
  const filteredDreams = remixedDreams.filter((dream) => {
    const matchesSearch =
      filters.search === "" ||
      dream.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      dream.tags?.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesEmotion =
      filters.emotion === "" || dream.emotionTone === filters.emotion;

    const matchesCategory =
      filters.category === "" || dream.type === filters.category;

    const matchesHealth = (() => {
      if (filters.health === "") return true;
      
      const healthLevel = parseInt(filters.health);
      const dreamHealth = dream.healthScore || 0;
      
      switch (healthLevel) {
        case 1: return dreamHealth <= 25; // Low (0-25)
        case 2: return dreamHealth > 25 && dreamHealth <= 50; // Fair (26-50)
        case 3: return dreamHealth > 50 && dreamHealth <= 75; // Moderate (51-75)
        case 4: return dreamHealth > 75 && dreamHealth < 90; // Healthy (76-89)
        case 5: return dreamHealth >= 90; // Vibrant (90+)
        default: return true;
      }
    })();

    return (
      matchesSearch && matchesEmotion && matchesCategory && matchesHealth
    );
  });

  return (
    <div className="p-4 space-y-6">
      <RemixFilterBar filters={filters} setFilters={setFilters} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDreams.map((dream) => (
          <DreamCard key={dream.id} dream={dream} />
        ))}
      </div>
      
      {filteredDreams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No dreams match your current filters. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}