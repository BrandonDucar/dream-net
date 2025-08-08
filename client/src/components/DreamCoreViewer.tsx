import CradleTracker from './CradleTracker';
import ShareDreamButton from './ShareDreamButton';
import DreamMutator from './DreamMutator';
import DreamLineage from './DreamLineage';

function getDreamBadge(dream: any) {
  if (dream.evolution === 'Fusion') return '⚛️ Fusion Dream';
  if (!dream.lineage || !dream.lineage.ancestors) return '👑 Origin Dream';
  const depth = dream.lineage.ancestors.length;

  if (depth === 1) return '🧬 Remix';
  if (depth === 2) return '🔁 Fork of a Remix';
  if (depth >= 3) return '🧠 Generational Dream';
  return '💭 Unknown';
}

interface DreamCore {
  id?: string;
  title: string;
  tags: string[];
  score: number;
  trustLevel: string;
  agents: string[];
  componentCode: string;
  schema: string;
  evolutionLevel?: number;
  evolution?: string;
  claimed?: boolean;
  lineage?: any;
}

interface DreamCoreViewerProps {
  dreamCore: DreamCore | null;
  onDreamUpdate?: (updatedDream: DreamCore) => void;
}

export default function DreamCoreViewer({ dreamCore, onDreamUpdate }: DreamCoreViewerProps) {
  if (!dreamCore) {
    return (
      <div className="p-5 font-mono text-gray-500">
        <p>🚫 No Dream Core loaded yet.</p>
      </div>
    );
  }

  const { title, tags, score, trustLevel, agents, componentCode, schema, evolutionLevel } = dreamCore;

  return (
    <div className="p-5 font-mono bg-gray-950 text-green-400 border-2 border-green-400 rounded-xl">
      <h2 className="text-xl font-bold mb-4">🧬 Dream Core Viewer</h2>
      <p style={{ fontSize: '1.2rem', color: '#0f0' }}>
        🎖️ Badge: {getDreamBadge(dreamCore)}
      </p>
      <div className="space-y-2 mb-6">
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Tags:</strong> {tags.join(', ')}</p>
        <p><strong>Wallet Trust:</strong> {trustLevel} ({score})</p>
        <p><strong>Agents Activated:</strong> {agents.join(', ')}</p>
      </div>

      <hr className="border-green-400 mb-6" />

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">🎨 CANVAS Output</h4>
        <div 
          className="bg-black p-4 rounded border border-green-400"
          dangerouslySetInnerHTML={{ __html: componentCode }} 
        />
      </div>

      <hr className="border-green-400 mb-6" />

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">🌱 ROOT Schema</h4>
        <pre className="bg-black p-4 rounded border border-green-400 text-sm overflow-x-auto">
          {schema}
        </pre>
      </div>

      {agents.includes('CRADLE') && (
        <div>
          <hr className="border-green-400 mb-6" />
          <h4 className="text-lg font-semibold mb-3">🌀 CRADLE Evolution</h4>
          <CradleTracker evolutionLevel={evolutionLevel || 2} />
        </div>
      )}

      {dreamCore?.evolution === 'Fusion' && !dreamCore?.claimed && (
        <button
          style={{ marginTop: 20, padding: '10px 20px', fontSize: '1rem', background: '#0f0', color: '#000' }}
          onClick={async () => {
            const res = await fetch('/api/claim-fusion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: dreamCore.id, wallet: 'user-wallet-address' }) // Replace this line with wallet auth soon
            });
            const result = await res.json();
            alert(result.message);
            if (result.status === 'success' && onDreamUpdate) {
              onDreamUpdate(result.dreamCore);
            }
          }}
        >
          🪄 Claim This Fusion
        </button>
      )}

      <ShareDreamButton dreamCore={dreamCore} />
      <DreamMutator originalDream={dreamCore} onMutate={onDreamUpdate} />
      <DreamLineage lineage={dreamCore.lineage} dream={dreamCore} />
    </div>
  );
}