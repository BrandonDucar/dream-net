interface CloudFilterProps {
  selected: string;
  setFilter: (cloud: string) => void;
}

export default function CloudFilter({ selected, setFilter }: CloudFilterProps) {
  const clouds = ['all', 'defi', 'gaming', 'zksync', 'desci', 'memes', 'ai', 'tools', 'art', 'social'];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
      {clouds.map((cloud) => (
        <button
          key={cloud}
          onClick={() => setFilter(cloud)}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            background: selected === cloud ? '#0ff' : '#111',
            color: '#fff',
            border: '1px solid #555'
          }}
        >
          {cloud.toUpperCase()}
        </button>
      ))}
    </div>
  );
}