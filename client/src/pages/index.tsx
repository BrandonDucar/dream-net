import { useState, useEffect } from "react";

/**
 * This component represents the hybrid home page for DreamNet. It blends a
 * hero section, live system status, narrative carousel, agent grid, console
 * preview, a waitlist form, and a changelog feed. The page fetches data
 * from the local API endpoints as configured in the project. If those
 * endpoints are unavailable the sections gracefully degrade to static
 * placeholders. Feel free to enhance the styling or components further.
 */
export default function HomePage() {
  // State holders for the dynamic sections
  const [agents, setAgents] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [changelog, setChangelog] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<string | null>(null);

  // Fetch data from the API routes once on mount
  useEffect(() => {
    fetch("/api/agents")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .catch(() => {
        // ignore failures; leave default state
      });
    fetch("/api/runs/recent")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setRuns(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetch("/api/changelog")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setChangelog(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Handle waitlist form submission
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoining(true);
    setJoinStatus(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setJoinStatus("Thanks for joining the waitlist!");
        setEmail("");
      } else {
        setJoinStatus("Failed to join waitlist. Please try again later.");
      }
    } catch (err) {
      setJoinStatus("Error connecting to server.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="px-6 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">DreamNet</h1>
        <p className="text-lg text-gray-700">
          Build, deploy, and evolve your AI dreams. Welcome to the next frontier
          of autonomous networks.
        </p>
      </section>

      {/* Status Strip: Display basic runtime metrics */}
      <section className="mb-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <h3 className="font-semibold text-xl">Agents</h3>
          <p className="text-lg">{agents.length}</p>
        </div>
        <div>
          <h3 className="font-semibold text-xl">Recent Runs</h3>
          <p className="text-lg">{runs.length}</p>
        </div>
        <div>
          <h3 className="font-semibold text-xl">Changelog Entries</h3>
          <p className="text-lg">{changelog.length}</p>
        </div>
      </section>

      {/* Narrative Carousel: Show recent run descriptions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Latest Narratives</h2>
        <div className="space-y-2">
          {runs.slice(0, 5).map((run: any, idx: number) => (
            <div key={idx} className="border p-2 rounded">
              <h4 className="font-semibold">
                {run?.title ?? `Run ${idx + 1}`}
              </h4>
              <p className="text-sm text-gray-600">
                {run?.description ?? JSON.stringify(run)}
              </p>
            </div>
          ))}
          {runs.length === 0 && (
            <p className="text-gray-500">No recent runs available.</p>
          )}
        </div>
      </section>

      {/* Agent Grid: Display a simple grid of agent names */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Active Agents</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agents.slice(0, 8).map((agent: any, idx: number) => (
            <div
              key={idx}
              className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <h4 className="font-semibold">
                {agent?.name ?? `Agent ${idx + 1}`}
              </h4>
              <p className="text-xs text-gray-600">
                {agent?.description ?? "No description."}
              </p>
            </div>
          ))}
          {agents.length === 0 && (
            <p className="text-gray-500 col-span-full">No agents found.</p>
          )}
        </div>
      </section>

      {/* Console Preview: Minimal interactive console placeholder */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Console Preview</h2>
        <div className="border rounded bg-black text-green-400 font-mono p-4 h-48 overflow-y-auto">
          <p>$ yarn run start</p>
          <p>&gt; Starting DreamNet services…</p>
          <p>&gt; All systems nominal.</p>
          <p>&gt; Awaiting your command…</p>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
        <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 flex-1"
            required
          />
          <button
            type="submit"
            disabled={joining}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            {joining ? "Joining…" : "Join"}
          </button>
        </form>
        {joinStatus && (
          <p className="mt-2 text-sm text-green-600">{joinStatus}</p>
        )}
      </section>

      {/* Changelog */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Changelog</h2>
        <ul className="list-disc pl-4 space-y-1">
          {changelog.slice(0, 10).map((entry: any, idx: number) => (
            <li key={idx}>
              <span className="font-semibold">
                {entry?.version ?? `Entry ${idx + 1}`}:
              </span>{" "}
              {entry?.message ?? JSON.stringify(entry)}
            </li>
          ))}
          {changelog.length === 0 && (
            <li className="text-gray-500">No changelog entries available.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
