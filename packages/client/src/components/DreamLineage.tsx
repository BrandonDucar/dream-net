function getDreamBadge(dream) {
  if (!dream.lineage || !dream.lineage.ancestors) return '👑 Origin Dream';
  const depth = dream.lineage.ancestors.length;

  if (depth === 1) return '🧬 Remix';
  if (depth === 2) return '🔁 Fork of a Remix';
  if (depth >= 3) return '🧠 Generational Dream';
  return '💭 Unknown';
}

export default function DreamLineage({ lineage, dream }) {
  if (!lineage) return null;

  const badge = getDreamBadge({ lineage });
  const nodes = lineage.ancestors.map((id, idx) => (
    <div key={id} style={{ marginLeft: idx * 20 }}>
      🌱 <code>{id}</code>
    </div>
  ));

  return (
    <div style={{ background: '#111', color: '#0ff', padding: 12, marginTop: 20 }}>
      <h3>🌿 Dream Lineage {badge}</h3>
      {nodes}
      <div style={{ marginLeft: lineage.ancestors.length * 20 }}>
        🔄 Current Dream (ID: <code>{lineage.parent}</code>)
      </div>
    </div>
  );
}