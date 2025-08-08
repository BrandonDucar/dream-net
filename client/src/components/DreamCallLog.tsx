import { useEffect, useState } from 'react';

export default function DreamCallLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/dream-call-log')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(err => console.error('Failed to load dream call log:', err));
  }, []);

  const handleReplay = async (dreamId: string) => {
    try {
      await fetch('/api/trigger-agent', {
        method: 'POST',
        body: JSON.stringify({ dreamId }),
        headers: { 'Content-Type': 'application/json' },
      });
      alert(`Agent spawned for ${dreamId}`);
    } catch (error) {
      alert('Failed to trigger agent');
    }
  };

  const handleRemind = async (dreamId: string) => {
    try {
      await fetch('/api/remind-later', {
        method: 'POST',
        body: JSON.stringify({ dreamId }),
        headers: { 'Content-Type': 'application/json' },
      });
      alert(`Reminder set for ${dreamId}`);
    } catch (error) {
      alert('Failed to set reminder');
    }
  };

  return (
    <div className="bg-zinc-900 border border-purple-700 p-6 rounded-xl text-white">
      <h3 className="text-xl font-bold mb-4">📞 Dream Call Log</h3>
      <ul className="space-y-4 max-h-[400px] overflow-y-auto">
        {logs.map((log: any, idx: number) => (
          <li key={idx} className="p-3 border border-purple-600 rounded-md bg-black">
            <div className="text-sm text-purple-300">Dream ID: {log.dreamId}</div>
            <div className="text-white font-semibold mt-1">📢 "{log.prompt}"</div>
            <div className="text-xs text-zinc-400 mt-2">Sent: {new Date(log.timestamp).toLocaleString()}</div>
            <div className="text-xs mt-1">
              Status:{" "}
              <span className={log.response === 'yes' ? 'text-green-400' : log.response === 'later' ? 'text-yellow-400' : 'text-zinc-500'}>
                {log.response ? log.response.toUpperCase() : 'No Response'}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleReplay(log.dreamId)}
                className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded"
              >
                🔁 Replay Agent
              </button>
              <button
                onClick={() => handleRemind(log.dreamId)}
                className="text-sm bg-zinc-800 border border-zinc-600 text-purple-300 px-3 py-1 rounded"
              >
                ⏰ Remind Me
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}