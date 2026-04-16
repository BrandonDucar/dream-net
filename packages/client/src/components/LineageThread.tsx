import { Link } from 'wouter';

interface Dream {
  id: string;
  title: string;
  lineage?: {
    ancestors?: string[];
    children?: string[];
  };
}

interface LineageThreadProps {
  dream: Dream;
}

export default function LineageThread({ dream }: LineageThreadProps) {
  const { lineage = {} } = dream;
  const { ancestors = [], children = [] } = lineage;

  return (
    <div style={{ marginTop: 40, padding: 20, background: '#111', borderRadius: 12 }}>
      <h3>🌱 Lineage</h3>

      {ancestors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <strong>🌿 Ancestors:</strong>
          <ul>
            {ancestors.map(id => (
              <li key={id}>
                <Link href={`/dreams/${id}`}>
                  <a style={{ color: '#0ff', textDecoration: 'none' }}>🔗 {id}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children.length > 0 && (
        <div>
          <strong>🌿 Descendants:</strong>
          <ul>
            {children.map(id => (
              <li key={id}>
                <Link href={`/dreams/${id}`}>
                  <a style={{ color: '#0ff', textDecoration: 'none' }}>🔗 {id}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ancestors.length === 0 && children.length === 0 && (
        <p>🔗 This dream has no known lineage yet.</p>
      )}
    </div>
  );
}