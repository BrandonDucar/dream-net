import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface Dream {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  type: string;
  createdByAgent?: string;
  lineage?: {
    ancestors?: string[];
    parentA?: string;
    parentB?: string;
  };
  wallet: string;
  remix?: boolean;
}

interface EditDreamProps {
  dreamId: string;
}

export default function EditDream({ dreamId }: EditDreamProps) {
  const [, setLocation] = useLocation();
  const [dream, setDream] = useState<Dream | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dreamId) return;
    fetch(`/api/dream/${dreamId}`)
      .then(res => res.json())
      .then(data => setDream(data));
  }, [dreamId]);

  const handleSave = async () => {
    if (!dream) return;
    
    setSaving(true);
    const res = await fetch('/api/save-dream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dream)
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setLocation(`/dreams/${dreamId}`);
    } else {
      alert('❌ Save failed');
    }
  };

  if (!dream) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>📝 Edit Dream Remix</h1>
      <label>Title:</label>
      <input
        type="text"
        value={dream.title}
        onChange={e => setDream({ ...dream, title: e.target.value })}
        style={{ width: '100%', marginBottom: 20 }}
      />
      <label>Description:</label>
      <textarea
        value={dream.description || ''}
        onChange={e => setDream({ ...dream, description: e.target.value })}
        style={{ width: '100%', height: 100, marginBottom: 20 }}
      />
      <label>Tags (comma separated):</label>
      <input
        type="text"
        value={dream.tags?.join(', ') || ''}
        onChange={e => setDream({ ...dream, tags: e.target.value.split(',').map(t => t.trim()) })}
        style={{ width: '100%', marginBottom: 20 }}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: '#0f0',
          color: '#000',
          padding: '10px 20px',
          border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer'
        }}
      >
        {saving ? 'Saving...' : 'Save Dream'}
      </button>
    </div>
  );
}