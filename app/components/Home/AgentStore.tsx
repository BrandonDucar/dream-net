"use client";

interface Agent {
  /**
   * Display name of the agent
   */
  name: string;
  /**
   * Unique identifier or tag for the agent
   */
  tag: string;
  /**
   * Path to the agent's details page
   */
  href: string;
}

/**
 * A simple static grid of agents for the Agent Store.
 * In a future iteration this could be fetched from an API.
 */
const agents: Agent[] = [
  { name: "Echo", tag: "echo", href: "/agents/echo" },
  { name: "Vision", tag: "vision", href: "/agents/vision" },
  { name: "Nexus", tag: "nexus", href: "/agents/nexus" },
  { name: "Pulse", tag: "pulse", href: "/agents/pulse" },
  { name: "Orbit", tag: "orbit", href: "/agents/orbit" },
  { name: "Atlas", tag: "atlas", href: "/agents/atlas" },
];

export default function AgentStore() {
  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Agent Store</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <a
            key={agent.tag}
            href={agent.href}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <h3 className="font-bold mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.tag}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
