import { useParams } from 'wouter';
import { useEffect, useState } from 'react';
import Head from '@/components/Head';

export default function DreamViewer() {
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dreams/${id}`)
      .then(res => res.json())
      .then(setDream)
      .catch(() => setDream(null));
  }, [id]);

  if (!dream) return <p style={{ color: 'white' }}>⏳ Loading...</p>;

  const dreamImage = `/dream-previews/${dream.id}.png`;
  const ogTitle = `🌌 Dream: ${dream.title}`;
  const ogDesc = `Tags: ${dream.tags.join(', ')} | Score: ${dream.score} | Evolution: ${dream.evolution}`;

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={dreamImage} />
        <meta property="og:url" content={`https://dreamnetwork.xyz/dream/${dream.id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="description" content={ogDesc} />
      </Head>
      <div style={{ padding: 40, background: '#000', color: '#0ff' }}>
      <div style={{ marginBottom: 20 }}>
        <img 
          src={dreamImage} 
          alt={`Preview of ${dream.title}`}
          style={{ 
            width: '100%', 
            maxWidth: 400, 
            height: 200, 
            objectFit: 'cover', 
            border: '2px solid #0ff',
            borderRadius: 8
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTExIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMGZmIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE4Ij7wn5KLIE5vIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPg==';
          }}
        />
      </div>
      <h1>{dream.title}</h1>
      <p><strong>Tags:</strong> {dream.tags.join(', ')}</p>
      <p><strong>Score:</strong> {dream.score}</p>
      <p><strong>Badge:</strong> {dream.evolution === 'Fusion' ? '⚛️ Fusion Dream' : '👑 Origin Dream'}</p>
      {dream.description && <p>{dream.description}</p>}
      {dream.evolution === 'Fusion' && !dream.claimed && (
        <button
          style={{ marginTop: 20, padding: '10px 20px', fontSize: '1rem', background: '#0f0', color: '#000' }}
          onClick={async () => {
            const res = await fetch('/api/claim-fusion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: dream.id, wallet: 'user-wallet-address' }) // Wallet auth later
            });
            const result = await res.json();
            alert(result.message);
            if (result.status === 'success') {
              setDream({ ...dream, claimed: true, owner: 'user-wallet-address' });
            }
          }}
        >
          🪄 Claim This Fusion
        </button>
      )}
      {dream.claimed && (
        <p style={{ color: '#0f0', marginTop: 20 }}>✅ Claimed by: {dream.owner}</p>
      )}
      </div>
    </>
  );
}