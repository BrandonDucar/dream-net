import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';

function getDreamBadge(dream: any) {
  if (dream.evolution === 'Fusion') return '⚛️ Fusion Dream';
  if (!dream.lineage || !dream.lineage.ancestors) return '👑 Origin Dream';
  const depth = dream.lineage.ancestors.length;

  if (depth === 1) return '🧬 Remix';
  if (depth === 2) return '🔁 Fork of a Remix';
  if (depth >= 3) return '🧠 Generational Dream';
  return '💭 Unknown';
}

export default function DreamExplorerMap({ dreams }: { dreams: any[] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !dreams) return;

    const nodes = dreams.map((d: any) => ({
      id: d.id,
      label: `${d.title || d.id.slice(0, 6)}\n${getDreamBadge(d)}\nScore: ${d.score || 0}`,
      title: d.tags?.join(', ') || '',
      color: d.evolution === 'Fusion' ? '#ff6b6b' : 
             d.lineage?.ancestors?.length ? '#4ecdc4' : '#95e1d3',
      font: { color: '#fff', size: 10 }
    }));

    const edges = dreams.flatMap((d: any) => 
      d.lineage?.ancestors?.map((a: any) => ({ from: a, to: d.id })) || []
    );

    new Network(containerRef.current, { nodes, edges }, {
      physics: { stabilization: false },
      nodes: { shape: 'dot', size: 12 },
      edges: { arrows: 'to', color: '#888' }
    });
  }, [dreams]);

  return (
    <div style={{ height: '600px', background: '#111', border: '1px solid #0ff' }} ref={containerRef} />
  );
}