import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function FeedPanel() {
  const [feed, setFeed] = useState([]);
  const { walletAddress, token } = useAuth();
  
  useEffect(() => {
    // Development mode check
    const DEV_MODE = import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH === 'true';
    
    if (!token && !DEV_MODE) return;
    
    const headers: Record<string, string> = {};
    if (token && token !== 'dev-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const endpoint = DEV_MODE ? '/api/garden-feed?wallet=0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e' : '/api/garden-feed';
    
    fetch(endpoint, { headers })
      .then(res => res.json())
      .then(data => setFeed(data))
      .catch(error => {
        console.error('Failed to fetch garden feed:', error);
        setFeed([]);
      });
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌱 Garden Feed</h2>
      <div className="grid gap-4">
        {feed.map((item) => (
          <div key={item.id} className="p-4 bg-zinc-700 rounded-xl">
            <h3 className="text-xl">{item.name}</h3>
            <p className="text-sm text-zinc-300">Stage: {item.stage} | Score: {item.score}</p>
            <p className="text-sm mt-1">Tags: {item.tags.join(', ')}</p>
            {item.contributors.length > 0 && (
              <p className="text-sm mt-1 text-green-300">Contributors: {item.contributors.map(c => c.wallet).join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}