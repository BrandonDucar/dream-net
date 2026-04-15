import { useState } from 'react';

export default function DreamForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dreamData = {
      title,
      summary,
      tags: tags.split(',').map(t => t.trim())
    };

    if (onSubmit) {
      onSubmit(dreamData);
    } else {
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dreamData)
      });

      const result = await response.json();
      console.log('🌱 Dream submitted:', result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dream-form">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Dream title" />
      <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Dream summary" />
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
      <button type="submit">Submit Dream</button>
    </form>
  );
}