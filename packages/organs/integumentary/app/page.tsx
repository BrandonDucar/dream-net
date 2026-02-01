'use client';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [health, setHealth] = useState(null);
  const [agents, setAgents] = useState([]);
  const [runs, setRuns] = useState([]);
  const [changelog, setChangelog] = useState([]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(console.error);
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch(console.error);
    fetch('/api/runs/recent')
      .then((res) => res.json())
      .then((data) => setRuns(data))
      .catch(console.error);
    fetch('/api/changelog')
      .then((res) => res.json())
      .then((data) => setChangelog(data))
      .catch(console.error);
  }, []);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-4xl font-bold">DreamNet Hybrid Homepage</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2">System Health</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Agents</h2>
        <pre>{JSON.stringify(agents, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Recent Runs</h2>
        <pre>{JSON.stringify(runs, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Changelog</h2>
        <pre>{JSON.stringify(changelog, null, 2)}</pre>
      </section>
    </main>
  );
}
