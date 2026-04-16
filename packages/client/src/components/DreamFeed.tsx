import { useState, useEffect } from 'react';
import { ErrorBoundary, DatabaseErrorFallback } from "@/components/ErrorBoundary";

export default function DreamFeed() {
  const [dreams, setDreams] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 Add loading state

  useEffect(() => {
    fetch('/api/garden-feed/')
      .then(res => res.json())
      .then(data => {
        console.log("✅ Dreams loaded:", data);
        setDreams(data);
        setLoading(false); // ✅ Mark load complete
      })
      .catch(err => {
        console.error("❌ Failed to load dreams:", err);
        setError(true);
        setLoading(false); // 🔁 Always stop loading
      });
  }, []);

  if (loading) return <div>🌱 Loading dreams...</div>;
  if (error) return <div>🚫 Failed to load dreams. Try again.</div>;
  if (!dreams.length) return <div>🫧 No dreams yet. Be the first.</div>;

  return (
    <ErrorBoundary fallback={DatabaseErrorFallback}>
      <div className="dream-feed">
        {dreams.map((dream, idx) => (
          <div key={idx} className="dream-card">
            <h3>{dream.name || dream.title}</h3>
            <p>{dream.description || dream.summary}</p>
            <div className="tags">{dream.tags?.join(', ')}</div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
}