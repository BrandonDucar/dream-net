import { useState, useEffect } from 'react';
import type { Dream } from "@dreamnet/shared/schema";

interface UseGardenFeedReturn {
  dreams: Dream[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export function useGardenFeed(): UseGardenFeedReturn {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDreams = () => {
    setLoading(true);
    setError(false);
    
    fetch('/api/garden-feed/')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("✅ Dreams loaded:", data);
        setTimeout(() => {
          setDreams(data);
          setLoading(false);
        }, 50); // slight delay
      })
      .catch(err => {
        console.error("❌ Failed to load dreams:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  return {
    dreams,
    loading,
    error,
    refetch: fetchDreams
  };
}